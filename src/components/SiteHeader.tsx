import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-display text-2xl font-semibold text-primary">
          Doce Forno
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button asChild variant="ghost" size="sm"><Link to="/">Cardápio</Link></Button>
          {user && <Button asChild variant="ghost" size="sm"><Link to="/pedidos">Meus pedidos</Link></Button>}
          {isAdmin && <Button asChild variant="ghost" size="sm"><Link to="/admin">Painel</Link></Button>}
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/perfil">Perfil</Link></Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sair"><LogOut /></Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Entrar</Link></Button>
          )}
          <Button asChild size="sm" className="ml-1 rounded-full">
            <Link to="/carrinho"><ShoppingBag /> {count}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
