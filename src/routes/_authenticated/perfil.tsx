import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — Doce Forno" }, { name: "description", content: "Seus dados de contato." }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["profile", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => { if (data) { setName(data.full_name); setPhone(data.phone); } }, [data]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error("Informe seu nome."); return; }
    const { error } = await supabase.from("profiles").update({ full_name: name.trim().slice(0, 100), phone: phone.trim().slice(0, 20) }).eq("id", user!.id);
    error ? toast.error("Não foi possível salvar.") : toast.success("Dados salvos!");
  };
  return (
    <form onSubmit={save} className="mx-auto max-w-md space-y-4 px-4 py-12">
      <h1 className="text-4xl font-semibold text-primary">Meu perfil</h1>
      <p className="text-sm text-muted-foreground">{user?.email}</p>
      <div className="space-y-1.5"><Label htmlFor="n">Nome</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
      <div className="space-y-1.5"><Label htmlFor="t">Telefone</Label><Input id="t" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} /></div>
      <Button type="submit" className="w-full rounded-full">Salvar</Button>
    </form>
  );
}
