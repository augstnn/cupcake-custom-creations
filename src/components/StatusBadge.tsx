import { STATUS_LABEL } from "@/lib/format";

const tone: Record<string, string> = {
  pendente: "bg-muted text-foreground",
  em_preparo: "bg-warning/25 text-foreground",
  pronto: "bg-success/20 text-foreground",
  retirado: "bg-secondary text-secondary-foreground",
  cancelado: "bg-destructive/15 text-destructive",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone[status] ?? ""}`}>{STATUS_LABEL[status] ?? status}</span>;
}
