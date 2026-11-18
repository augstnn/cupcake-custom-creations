import { createFileRoute } from "@tanstack/react-router";
import { ContactDetails, SocialLinks, StoreLocation } from "@/components/StoreContact";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [
    { title: "Fale Conosco — Cupcake Custom Creations" },
    { name: "description", content: "Canais de atendimento, redes sociais e localização da Cupcake Custom Creations para retirada de cupcakes." },
    { property: "og:title", content: "Fale Conosco — Cupcake Custom Creations" },
    { property: "og:description", content: "Entre em contato com a loja e encontre nossa localização." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Contact,
});

function Contact() {
  return <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
    <h1 className="text-4xl font-semibold text-primary md:text-5xl">Fale Conosco</h1>
    <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">Um cupcake para cada ocasião. Será um prazer fazer parte da sua.</p>
    <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
      <section><h2 className="mb-5 text-2xl font-semibold text-primary">Atendimento</h2><ContactDetails /></section>
      <section><h2 className="mb-5 text-2xl font-semibold text-primary">Nossa Localização</h2><StoreLocation /><p className="mt-5 text-sm text-muted-foreground">Pedidos com retirada na loja.</p></section>
      <section><h2 className="mb-5 text-2xl font-semibold text-primary">Redes sociais</h2><SocialLinks /></section>
    </div>
  </div>;
}