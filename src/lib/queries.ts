import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("active", true).order("created_at");
    if (error) throw error;
    return data;
  },
});

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const optionsQuery = queryOptions({
  queryKey: ["options"],
  queryFn: async () => {
    const { data, error } = await supabase.from("customization_options").select("*").eq("active", true).order("price");
    if (error) throw error;
    return data;
  },
});
