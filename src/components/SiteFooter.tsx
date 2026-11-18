import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ContactDetails, SocialLinks, StoreLocation } from "@/components/StoreContact";
import { storeInfo } from "@/lib/store-info";

export function SiteFooter() {
  return <footer className="border-t border-border bg-secondary/40">
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-8 font-display text-2xl font-semibold text-primary">{storeInfo.institutionalName}</p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <section aria-labelledby="footer-institutional"><h2 id="footer-institutional" className="mb-4 text-lg font-semibold">Institucional</h2><nav aria-label="Institucional" className="flex flex-col items-start gap-1">
          <Button asChild variant="link" className="h-auto min-h-9 px-0"><Link to="/sobre">Sobre Nós</Link></Button>
          <Button asChild variant="link" className="h-auto min-h-9 px-0"><Link to="/">Catálogo de produtos</Link></Button>
          <Button asChild variant="link" className="h-auto min-h-9 px-0"><Link to="/contato">Fale Conosco</Link></Button>
        </nav></section>
        <section aria-labelledby="footer-service"><h2 id="footer-service" className="mb-4 text-lg font-semibold">Atendimento</h2><ContactDetails /></section>
        <section aria-labelledby="footer-location"><h2 id="footer-location" className="mb-4 text-lg font-semibold">Nossa Localização</h2><StoreLocation /></section>
        <section aria-labelledby="footer-social"><h2 id="footer-social" className="mb-4 text-lg font-semibold">Redes sociais</h2><SocialLinks /></section>
      </div>
      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">© {new Date().getUTCFullYear()} {storeInfo.institutionalName}. Todos os direitos reservados.</p>
    </div>
  </footer>;
}