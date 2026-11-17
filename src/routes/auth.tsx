import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Doce Forno" },
      { name: "description", content: "Acesse sua conta para fazer e acompanhar pedidos." },
      { property: "og:title", content: "Entrar — Doce Forno" },
      { property: "og:description", content: "Acesse sua conta para fazer e acompanhar pedidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(100),
  phone: z.string().trim().min(8, "Telefone inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "A senha precisa de 6 caracteres ou mais").max(72),
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [f, setF] = useState({ full_name: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const r = signupSchema.safeParse(f);
        if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Dados inválidos"); return; }
        const { error } = await supabase.auth.signUp({
          email: r.data.email, password: r.data.password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: r.data.full_name, phone: r.data.phone } },
        });
        if (error) { toast.error(error.message); return; }
        toast.success("Conta criada! Confira seu e-mail para confirmar.");
        setMode("in");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email.trim(), password: f.password });
        if (error) { toast.error("E-mail ou senha incorretos."); return; }
        navigate({ to: "/" });
      }
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!f.email) { toast.error("Digite seu e-mail primeiro."); return; }
    await supabase.auth.resetPasswordForEmail(f.email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    toast.success("Se o e-mail existir, enviamos um link para redefinir a senha.");
  };

  const social = async (p: "google" | "lovable") => {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) { toast.error("Não foi possível entrar."); return; }
    if (r.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center text-4xl font-semibold text-primary">{mode === "in" ? "Entrar" : "Criar conta"}</h1>
      <div className="mt-8 space-y-3">
        <Button type="button" variant="outline" className="w-full" onClick={() => social("google")}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
          Continue with Google
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => social("lovable")}>
          <LovableMark className="size-[18px]" /> Continue with Lovable
        </Button>
      </div>
      <div className="my-6 text-center text-xs uppercase tracking-widest text-muted-foreground">ou com e-mail</div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "up" && (
          <>
            <div className="space-y-1.5"><Label htmlFor="n">Nome</Label><Input id="n" value={f.full_name} onChange={set("full_name")} maxLength={100} /></div>
            <div className="space-y-1.5"><Label htmlFor="t">Telefone</Label><Input id="t" value={f.phone} onChange={set("phone")} maxLength={20} placeholder="(11) 99999-9999" /></div>
          </>
        )}
        <div className="space-y-1.5"><Label htmlFor="e">E-mail</Label><Input id="e" type="email" value={f.email} onChange={set("email")} maxLength={255} /></div>
        <div className="space-y-1.5"><Label htmlFor="p">Senha</Label><Input id="p" type="password" value={f.password} onChange={set("password")} maxLength={72} /></div>
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
      </form>
      <div className="mt-6 flex justify-between text-sm">
        <button className="text-accent hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Criar uma conta" : "Já tenho conta"}
        </button>
        {mode === "in" && <button className="text-muted-foreground hover:underline" onClick={forgot}>Esqueci a senha</button>}
      </div>
    </div>
  );
}
