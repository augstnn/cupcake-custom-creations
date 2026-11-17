import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  key: string;
  product_id: string;
  name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  cobertura_id?: string | undefined;
  cobertura?: string | undefined;
  confeito_id?: string | undefined;
  confeito?: string | undefined;
  message?: string | undefined;
};

type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "key">) => void;
  setQty: (key: string, q: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "doce-forno-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value: Ctx = {
    items,
    add: (i) =>
      setItems((prev) => {
        const key = [i.product_id, i.cobertura_id, i.confeito_id, i.message].join("|");
        const ex = prev.find((p) => p.key === key);
        if (ex) return prev.map((p) => (p.key === key ? { ...p, quantity: p.quantity + i.quantity } : p));
        return [...prev, { ...i, key }];
      }),
    setQty: (key, q) =>
      setItems((prev) => prev.map((p) => (p.key === key ? { ...p, quantity: Math.max(1, Math.min(50, q)) } : p))),
    remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
    clear: () => setItems([]),
    total: items.reduce((s, i) => s + i.unit_price * i.quantity, 0),
    count: items.reduce((s, i) => s + i.quantity, 0),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
