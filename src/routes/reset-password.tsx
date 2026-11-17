import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Doce Forno" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { property: "og:title", content: "Nova senha — Doce Forno" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast.error("Use 6 caracteres ou mais."); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error("Link inválido ou expirado."); return; }
    toast.success("Senha atualizada!");
    navigate({ to: "/" });
  };
  return (
    <form onSubmit={save} className="mx-auto max-w-md space-y-4 px-4 py-16">
      <h1 className="text-4xl font-semibold text-primary">Nova senha</h1>
      <div className="space-y-1.5"><Label htmlFor="pw">Senha</Label><Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} maxLength={72} /></div>
      <Button type="submit" className="w-full rounded-full">Salvar</Button>
    </form>
  );
}
