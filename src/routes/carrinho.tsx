import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { brl } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Doce Forno" },
      { name: "description", content: "Revise seus cupcakes e finalize o pedido para retirada." },
      { property: "og:title", content: "Carrinho — Doce Forno" },
      { property: "og:description", content: "Revise seus cupcakes e finalize o pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("retirada");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("place_order", {
      _items: cart.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, cobertura_id: i.cobertura_id ?? "", confeito_id: i.confeito_id ?? "", message: i.message ?? "" })),
      _payment: payment,
      _note: note.slice(0, 300),
    });
    setBusy(false);
    if (error || !data) { toast.error("Não foi possível criar o pedido. Tente novamente."); return; }
    cart.clear();
    toast.success(payment === "simulado" ? "Pagamento simulado aprovado! Pedido criado." : "Pedido criado!");
    navigate({ to: "/pedidos/$id", params: { id: data } });
  };

  if (cart.items.length === 0)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold text-primary">Seu carrinho está vazio</h1>
        <Button asChild className="mt-8 rounded-full" size="lg"><Link to="/">Ver cardápio</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-4xl font-semibold text-primary">Carrinho</h1>
        <ul className="mt-8 divide-y divide-border">
          {cart.items.map((i) => (
            <li key={i.key} className="flex gap-4 py-5">
              <img src={i.image_url} alt={i.name} className="h-24 w-24 rounded-2xl object-cover" width={96} height={96} />
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <h2 className="text-lg font-semibold">{i.name}</h2>
                  <span className="font-medium">{brl(i.unit_price * i.quantity)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {[i.cobertura, i.confeito, i.message && `“${i.message}”`].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Input type="number" min={1} max={50} value={i.quantity} onChange={(e) => cart.setQty(i.key, Number(e.target.value) || 1)} className="w-20" aria-label="Quantidade" />
                  <span className="text-sm text-muted-foreground">{brl(i.unit_price)} cada</span>
                  <Button variant="ghost" size="icon" onClick={() => cart.remove(i.key)} aria-label="Remover"><Trash2 /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit space-y-6 rounded-3xl bg-card p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Resumo</h2>
        <div className="rounded-2xl bg-muted p-4 text-sm">
          <p className="font-medium">Retirada na loja</p>
          <p className="text-muted-foreground">Avisamos aqui quando o pedido estiver pronto.</p>
        </div>
        <div className="space-y-3">
          <Label>Pagamento</Label>
          <RadioGroup value={payment} onValueChange={setPayment}>
            <label className="flex items-center gap-3 text-sm"><RadioGroupItem value="retirada" /> Pagar na retirada</label>
            <label className="flex items-center gap-3 text-sm"><RadioGroupItem value="simulado" /> Pagamento online (simulado)</label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Observação (opcional)</Label>
          <Input id="note" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: retiro às 17h" />
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
          <span>Total</span><span>{brl(cart.total)}</span>
        </div>
        {user ? (
          <Button size="lg" className="w-full rounded-full" disabled={busy} onClick={checkout}>
            {busy ? "Enviando..." : "Finalizar pedido"}
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full rounded-full"><Link to="/auth">Entre para finalizar</Link></Button>
        )}
      </aside>
    </div>
  );
}
