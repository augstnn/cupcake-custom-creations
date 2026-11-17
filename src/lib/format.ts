export const brl = (v: number | string) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const STATUS_LABEL: Record<string, string> = {
  pendente: "Recebido",
  em_preparo: "Em preparo",
  pronto: "Pronto para retirada",
  retirado: "Retirado",
  cancelado: "Cancelado",
};
export const STATUS_FLOW = ["pendente", "em_preparo", "pronto", "retirado"] as const;
