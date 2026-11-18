import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Sparkles, CakeSlice } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/queries";
import { storeInfo } from "@/lib/store-info";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [
    { title: "Sobre Nós — Cupcake Custom Creations" },
    { name: "description", content: "Conheça nossa proposta de cupcakes personalizados para tornar seus momentos especiais ainda mais doces." },
    { property: "og:title", content: "Sobre Nós — Cupcake Custom Creations" },
    { property: "og:description", content: "Sabores, coberturas e confeitos escolhidos por você, preparados com carinho." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: About,
});

function About() {
  const { data: products } = useSuspenseQuery(productsQuery);
  return <div>
    <section className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
      <p className="text-sm text-muted-foreground">Sobre Nós</p>
      <h1 className="mt-4 text-4xl font-semibold text-primary md:text-5xl">{storeInfo.institutionalName}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">A Cupcake Custom Creations nasceu com a proposta de transformar momentos especiais em experiências ainda mais doces. Trabalhamos com cupcakes personalizados, oferecendo diferentes opções de sabores, coberturas, confeitos e decorações.</p>
    </section>
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
      {products.slice(0, 4).map((p) => <Link key={p.id} to="/produto/$id" params={{ id: p.id }} className="group overflow-hidden rounded-3xl bg-secondary shadow-soft"><img src={p.image_url} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></Link>)}
    </div>
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div><Heart className="mb-4 size-6 text-accent" /><h2 className="text-2xl font-semibold text-primary">Nosso compromisso</h2><p className="mt-3 leading-relaxed text-muted-foreground">Proporcionar produtos especiais, preparados de acordo com a preferência de cada cliente, com cuidado em cada detalhe.</p></div>
        <div><Sparkles className="mb-4 size-6 text-accent" /><h2 className="text-2xl font-semibold text-primary">Do seu jeito</h2><p className="mt-3 leading-relaxed text-muted-foreground">Combine seu sabor favorito com coberturas e confeitos. Uma mensagem no topper dá o toque pessoal à sua comemoração.</p></div>
        <div><CakeSlice className="mb-4 size-6 text-accent" /><h2 className="text-2xl font-semibold text-primary">Momentos mais doces</h2><p className="mt-3 leading-relaxed text-muted-foreground">Uma celebração, um presente ou um carinho no dia a dia: nossos cupcakes acompanham momentos que merecem ser especiais.</p></div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3"><Button asChild className="rounded-full"><Link to="/">Escolher cupcakes</Link></Button><Button asChild variant="outline" className="rounded-full"><Link to="/contato">Fale Conosco</Link></Button></div>
    </section>
  </div>;
}