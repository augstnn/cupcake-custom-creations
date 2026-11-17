import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { optionsQuery, productQuery } from "@/lib/queries";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produto/$id")({
  loader: async ({ context, params }) => {
    const [p] = await Promise.all([
      context.queryClient.ensureQueryData(productQuery(params.id)),
      context.queryClient.ensureQueryData(optionsQuery),
    ]);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Doce Forno` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Doce Forno` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Cupcake indisponível" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function Choice({ title, opts, value, onChange }: { title: string; opts: { id: string; name: string; price: number }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <button key={o.id} type="button" onClick={() => onChange(o.id)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${value === o.id ? "border-accent bg-secondary" : "border-border bg-card hover:bg-muted"}`}>
            <span className="font-medium">{o.name}</span>
            <span className="block text-muted-foreground">{Number(o.price) > 0 ? `+ ${brl(o.price)}` : "incluso"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(id));
  const { data: opts } = useSuspenseQuery(optionsQuery);
  const cob = opts.filter((o) => o.kind === "cobertura");
  const conf = opts.filter((o) => o.kind === "confeito");
  const [cobId, setCob] = useState(cob[0]?.id ?? "");
  const [confId, setConf] = useState(conf[0]?.id ?? "");
  const [msg, setMsg] = useState("");
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const navigate = useNavigate();
  if (!p) return null;

  const c1 = cob.find((o) => o.id === cobId);
  const c2 = conf.find((o) => o.id === confId);
  const unit = Number(p.price) + Number(c1?.price ?? 0) + Number(c2?.price ?? 0);

  const add = () => {
    cart.add({
      product_id: p.id, name: p.name, image_url: p.image_url, quantity: qty, unit_price: unit,
      cobertura_id: c1?.id, cobertura: c1?.name, confeito_id: c2?.id, confeito: c2?.name, message: msg.trim().slice(0, 40),
    });
    toast.success(`${qty}× ${p.name} no carrinho`, { action: { label: "Ver carrinho", onClick: () => navigate({ to: "/carrinho" }) } });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2">
      <div className="overflow-hidden rounded-3xl bg-secondary shadow-soft">
        <img src={p.image_url} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover" />
      </div>
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Cardápio</Link>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-primary">{p.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{p.description}</p>
          <p className="mt-3 text-2xl font-medium text-accent">{brl(p.price)}</p>
        </div>
        <Choice title="Cobertura" opts={cob} value={cobId} onChange={setCob} />
        <Choice title="Confeito" opts={conf} value={confId} onChange={setConf} />
        <div className="space-y-2">
          <Label htmlFor="msg">Mensagem no topper (opcional)</Label>
          <Input id="msg" maxLength={40} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ex.: Feliz aniversário!" />
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-2 rounded-full border border-border p-1">
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos"><Minus /></Button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setQty(Math.min(50, qty + 1))} aria-label="Mais"><Plus /></Button>
          </div>
          <Button size="lg" className="flex-1 rounded-full" onClick={add}>Adicionar · {brl(unit * qty)}</Button>
        </div>
      </div>
    </div>
  );
}
