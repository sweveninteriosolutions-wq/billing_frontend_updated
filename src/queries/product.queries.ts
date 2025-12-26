import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/api/product.api";
import { ProductListData } from "@/types/product";

/* =========================
   PARAM TYPES
========================= */
export type ProductListParams = {
  search?: string;
  category?: string;
  supplier_id?: number;
  min_price?: number;
  max_price?: number;
  is_deleted?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: "asc" | "desc";
};

/* =========================
   NORMALIZE PARAMS
   (CRITICAL)
========================= */
function normalizeParams(params: ProductListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== ""
    )
  );
}

/* =========================
   QUERY KEYS
========================= */
export const PRODUCT_KEYS = {
  all: ["products"] as const,

  list: (params: ProductListParams) =>
    ["products", JSON.stringify(normalizeParams(params))] as const,
};

/* =========================
   QUERY
========================= */
export function useProducts(params: ProductListParams) {
  const normalized = normalizeParams(params);

  return useQuery<ProductListData>({
    queryKey: PRODUCT_KEYS.list(normalized),

    queryFn: async () => {
      const res = await productApi.list(normalized);
      return res.data;
    },

    // React Query v5 replacement for keepPreviousData
    placeholderData: prev => prev,

    staleTime: 0,
  });
}
