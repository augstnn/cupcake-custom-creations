import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { brl, STATUS_LABEL } from "@/lib/format";
import type { Database } from "@/integrations/supabase/types";

type Status = Database["public"]["Enums"]["order_status"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel — Doce Forno" }, { name: "description", content: "Administração de cupcakes e pedidos da Doce Forno." }, { property: "og:title", content: "Painel — Doce Forno" }, { property: "og:description", content: "Administração de cupcakes e pedidos da loja." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <p className="p-12 text-center text-muted-foreground">Carregando...</p>;
  if (!isAdmin) return <p className="p-12 text-center">Acesso restrito à equipe da loja.</p>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-primary">Painel administrativo</h1>
      <Tabs defaultValue="pedidos" className="mt-8">
        <TabsList><TabsTrigger value="pedidos">Pedidos</TabsTrigger><TabsTrigger value="produtos">Cupcakes</TabsTrigger></TabsList>
        <TabsContent value="pedidos"><AdminOrders /></TabsContent>
        <TabsContent value="produtos"><AdminProducts /></TabsContent>
      </Tabs>
    </div>
  );
}

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("ativos");
  const { data } = useQuery({
    queryKey: ["admin-orders"],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data: orders, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      const ids = [...new Set(orders.map((o) => o.user_id))];
      const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, full_name, phone").in("id", ids) : { data: [] };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return orders.map((o) => ({ ...o, profile: map.get(o.user_id) }));
    },
  });
  const setStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("Não foi possível atualizar."); return; }
    toast.success(`Pedido marcado como “${STATUS_LABEL[status]}”`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };
  const list = (data ?? []).filter((o) => filter === "todos" || !["retirado", "cancelado"].includes(o.status));

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant={filter === "ativos" ? "default" : "outline"} onClick={() => setFilter("ativos")}>Em andamento</Button>
        <Button size="sm" variant={filter === "todos" ? "default" : "outline"} onClick={() => setFilter("todos")}>Todos</Button>
      </div>
      {!list.length && <p className="text-muted-foreground">Nenhum pedido por aqui.</p>}
      {list.map((o) => (
        <div key={o.id} className="rounded-3xl bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">#{o.code} · {o.profile?.full_name || "Cliente"}</p>
              <p className="text-sm text-muted-foreground">
                {o.profile?.phone || "sem telefone"} · {new Date(o.created_at).toLocaleString("pt-BR")} · {o.payment_method === "simulado" ? "Pago (simulado)" : "Paga na retirada"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{brl(o.total)}</span>
              <Select value={o.status} onValueChange={(v) => setStatus(o.id, v as Status)}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {o.order_items.map((it) => {
              const c = it.customization as { cobertura?: string | null; confeito?: string | null; mensagem?: string | null };
              return <li key={it.id}><b>{it.quantity}×</b> {it.product_name} <span className="text-muted-foreground">— {[c.cobertura, c.confeito, c.mensagem && `“${c.mensagem}”`].filter(Boolean).join(" · ")}</span></li>;
            })}
          </ul>
          {o.pickup_note && <p className="mt-2 text-sm text-muted-foreground">Obs.: {o.pickup_note}</p>}
        </div>
      ))}
    </div>
  );
}

function AdminProducts() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await supabase.from("products").select("*").order("created_at")).data ?? [],
  });
  const [n, setN] = useState({ name: "", description: "", price: "", image_url: "" });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["products"] }); };

  const update = async (id: string, patch: Database["public"]["Tables"]["products"]["Update"]) => {
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    error ? toast.error("Erro ao salvar.") : (toast.success("Salvo"), refresh());
  };
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(n.price.replace(",", "."));
    if (n.name.trim().length < 2 || !(price >= 0)) { toast.error("Preencha nome e preço."); return; }
    const { error } = await supabase.from("products").insert({ name: n.name.trim().slice(0, 80), description: n.description.trim().slice(0, 300), price, image_url: n.image_url.trim() || "/images/frutas.jpg" });
    if (error) { toast.error("Erro ao criar."); return; }
    setN({ name: "", description: "", price: "", image_url: "" });
    toast.success("Cupcake adicionado");
    refresh();
  };

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={create} className="grid gap-3 rounded-3xl bg-card p-5 shadow-soft md:grid-cols-[1fr_2fr_120px_1fr_auto]">
        <Input placeholder="Nome" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <Input placeholder="Descrição" value={n.description} onChange={(e) => setN({ ...n, description: e.target.value })} />
        <Input placeholder="Preço" value={n.price} onChange={(e) => setN({ ...n, price: e.target.value })} />
        <Input placeholder="Link da foto (opcional)" value={n.image_url} onChange={(e) => setN({ ...n, image_url: e.target.value })} />
        <Button type="submit">Adicionar</Button>
      </form>
      {(data ?? []).map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-3xl bg-card p-4 shadow-soft">
          <img src={p.image_url} alt="" className="size-16 rounded-2xl object-cover" width={64} height={64} />
          <div className="min-w-48 flex-1"><p className="font-semibold">{p.name}</p><p className="text-sm text-muted-foreground line-clamp-1">{p.description}</p></div>
          <Input className="w-28" defaultValue={String(p.price)} onBlur={(e) => { const v = Number(e.target.value.replace(",", ".")); if (v >= 0 && v !== Number(p.price)) update(p.id, { price: v }); }} aria-label="Preço" />
          <label className="flex items-center gap-2 text-sm"><Switch checked={p.active} onCheckedChange={(v) => update(p.id, { active: v })} /> {p.active ? "À venda" : "Oculto"}</label>
        </div>
      ))}
    </div>
  );
}
