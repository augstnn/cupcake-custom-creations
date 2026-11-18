import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl, STATUS_FLOW, STATUS_LABEL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/pedidos/$id")({
  head: () => ({ meta: [{ title: "Acompanhar pedido — Doce Forno" }, { name: "description", content: "Status do seu pedido." }, { property: "og:title", content: "Acompanhar pedido — Doce Forno" }, { property: "og:description", content: "Confira os cupcakes e o status do seu pedido." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  if (isLoading) return <p className="p-12 text-center text-muted-foreground">Carregando...</p>;
  if (!data) return <p className="p-12 text-center">Pedido não encontrado.</p>;
  const idx = STATUS_FLOW.indexOf(data.status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/pedidos" className="text-sm text-muted-foreground hover:text-foreground">← Meus pedidos</Link>
      <h1 className="mt-3 text-4xl font-semibold text-primary">Pedido #{data.code}</h1>
      <p className="text-muted-foreground">Retirada na loja · {data.payment_method === "simulado" ? "Pago online (simulado)" : "Pagamento na retirada"}</p>

      {data.status === "cancelado" ? (
        <p className="mt-8 rounded-2xl bg-destructive/10 p-4 text-destructive">Este pedido foi cancelado.</p>
      ) : (
        <ol className="mt-10 grid grid-cols-4 gap-2">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} className="flex flex-col items-center text-center">
              <span className={`flex size-10 items-center justify-center rounded-full ${i <= idx ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {i <= idx ? <Check className="size-5" /> : i + 1}
              </span>
              <span className={`mt-2 text-xs ${i === idx ? "font-semibold" : "text-muted-foreground"}`}>{STATUS_LABEL[s]}</span>
            </li>
          ))}
        </ol>
      )}

      <ul className="mt-10 divide-y divide-border rounded-3xl bg-card p-6 shadow-soft">
        {data.order_items.map((it) => {
          const c = it.customization as { cobertura?: string | null; confeito?: string | null; mensagem?: string | null };
          return (
            <li key={it.id} className="flex justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{it.quantity}× {it.product_name}</p>
                <p className="text-sm text-muted-foreground">{[c.cobertura, c.confeito, c.mensagem && `“${c.mensagem}”`].filter(Boolean).join(" · ")}</p>
              </div>
              <span>{brl(Number(it.unit_price) * it.quantity)}</span>
            </li>
          );
        })}
        <li className="flex justify-between pt-4 text-lg font-semibold"><span>Total</span><span>{brl(data.total)}</span></li>
      </ul>
      {data.pickup_note && <p className="mt-4 text-sm text-muted-foreground">Observação: {data.pickup_note}</p>}
    </div>
  );
}
