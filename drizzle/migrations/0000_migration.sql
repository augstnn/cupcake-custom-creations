create type public.app_role as enum ('admin','user');
create type public.order_status as enum ('pendente','em_preparo','pronto','retirado','cancelado');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), coalesce(new.raw_user_meta_data->>'phone',''));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  image_url text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read active" on public.products for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.products for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.customization_options (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('cobertura','confeito')),
  name text not null,
  price numeric(10,2) not null default 0 check (price >= 0),
  active boolean not null default true
);
grant select on public.customization_options to anon;
grant select, insert, update, delete on public.customization_options to authenticated;
grant all on public.customization_options to service_role;
alter table public.customization_options enable row level security;
create policy "public read opts" on public.customization_options for select to anon, authenticated using (true);
create policy "admin write opts" on public.customization_options for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code serial,
  user_id uuid not null,
  status order_status not null default 'pendente',
  total numeric(10,2) not null default 0,
  payment_method text not null default 'retirada',
  pickup_note text not null default '',
  created_at timestamptz not null default now()
);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders read" on public.orders for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "orders admin update" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  customization jsonb not null default '{}'::jsonb
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "items read" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))));

-- items: [{product_id, quantity, cobertura_id, confeito_id, message}]
create or replace function public.place_order(_items jsonb, _payment text, _note text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _order uuid;
  _it jsonb;
  _p public.products;
  _cob public.customization_options;
  _conf public.customization_options;
  _qty int;
  _unit numeric(10,2);
  _total numeric(10,2) := 0;
  _msg text;
begin
  if _uid is null then raise exception 'not authenticated'; end if;
  if jsonb_array_length(_items) = 0 then raise exception 'empty cart'; end if;
  if _payment not in ('retirada','simulado') then raise exception 'invalid payment'; end if;
  insert into public.orders (user_id, payment_method, pickup_note) values (_uid, _payment, left(coalesce(_note,''), 300)) returning id into _order;
  for _it in select * from jsonb_array_elements(_items) loop
    select * into _p from public.products where id = (_it->>'product_id')::uuid and active;
    if not found then raise exception 'product unavailable'; end if;
    _qty := greatest(1, least(50, coalesce((_it->>'quantity')::int, 1)));
    _cob := null; _conf := null;
    if coalesce(_it->>'cobertura_id','') <> '' then select * into _cob from public.customization_options where id = (_it->>'cobertura_id')::uuid and active and kind='cobertura'; end if;
    if coalesce(_it->>'confeito_id','') <> '' then select * into _conf from public.customization_options where id = (_it->>'confeito_id')::uuid and active and kind='confeito'; end if;
    _msg := left(coalesce(_it->>'message',''), 40);
    _unit := _p.price + coalesce(_cob.price,0) + coalesce(_conf.price,0);
    _total := _total + _unit * _qty;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price, customization)
    values (_order, _p.id, _p.name, _qty, _unit, jsonb_build_object('cobertura', _cob.name, 'confeito', _conf.name, 'mensagem', _msg));
  end loop;
  update public.orders set total = _total where id = _order;
  return _order;
end; $$;
revoke all on function public.place_order(jsonb,text,text) from public, anon;
grant execute on function public.place_order(jsonb,text,text) to authenticated;

insert into public.products (name, description, price, image_url) values
('Red Velvet', 'Massa aveludada de cacau com cobertura de cream cheese.', 12.00, '/images/red-velvet.jpg'),
('Chocolate Belga', 'Massa intensa de chocolate com ganache cremosa.', 11.00, '/images/chocolate.jpg'),
('Baunilha com Frutas Vermelhas', 'Massa de baunilha com buttercream e frutas frescas.', 12.50, '/images/frutas.jpg'),
('Limão Siciliano', 'Massa cítrica com merengue tostado.', 11.50, '/images/limao.jpg');

insert into public.customization_options (kind, name, price) values
('cobertura','Padrão da receita',0),('cobertura','Buttercream de baunilha',2),('cobertura','Ganache de chocolate',2.5),('cobertura','Cream cheese',2.5),
('confeito','Sem confeito',0),('confeito','Granulado colorido',1),('confeito','Raspas de chocolate',1.5),('confeito','Morango fresco',2);