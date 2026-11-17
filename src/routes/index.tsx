import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/queries";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Doce Forno — Cupcakes artesanais para retirar" },
      { name: "description", content: "Escolha, personalize e encomende cupcakes artesanais para retirar na loja." },
      { property: "og:title", content: "Doce Forno — Cupcakes artesanais" },
      { property: "og:description", content: "Escolha, personalize e encomende cupcakes para retirar na loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <section className="py-16 md:py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Feitos todos os dias</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl md:text-7xl font-semibold text-primary">
          Cupcakes do seu jeito, prontos para retirar.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Escolha o sabor, a cobertura e o confeito. Você paga na retirada.
        </p>
      </section>
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link key={p.id} to="/produto/$id" params={{ id: p.id }} className="group">
            <div className="overflow-hidden rounded-3xl bg-secondary shadow-soft">
              <img src={p.image_url} alt={p.name} width={816} height={816} loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <span className="font-medium text-accent">{brl(p.price)}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
