import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/pedidos/")({
  head: () => ({ meta: [{ title: "Meus pedidos — Doce Forno" }, { name: "description", content: "Acompanhe seus pedidos." }] }),
  component: Orders,
});

function Orders() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    refetchInterval: 20000,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-semibold text-primary">Meus pedidos</h1>
      {isLoading ? <p className="mt-8 text-muted-foreground">Carregando...</p> : !data?.length ? (
        <p className="mt-8 text-muted-foreground">Você ainda não fez pedidos. <Link to="/" className="text-accent underline">Ver cardápio</Link></p>
      ) : (
        <ul className="mt-8 space-y-3">
          {data.map((o) => (
            <li key={o.id}>
              <Link to="/pedidos/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-soft hover:bg-muted">
                <div>
                  <p className="font-semibold">Pedido #{o.code}</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString("pt-BR")}</p>
                </div>
                <div className="flex items-center gap-4"><StatusBadge status={o.status} /><span className="font-medium">{brl(o.total)}</span></div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
