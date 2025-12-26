import { api } from "./client";
import {
  Product,
  ProductListData,
  ProductCreateInput,
  ProductUpdateInput,
} from "@/types/product";

/* =========================
   QUERY STRING BUILDER
========================= */
function buildQuery(params?: Record<string, any>) {
  if (!params) return "";

  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      qs.append(key, String(value));
    }
  });

  return qs.toString();
}

export const productApi = {
  /* =========================
     LIST PRODUCTS (FIXED)
  ========================= */
  list: (params?: Record<string, any>) => {
    const query = buildQuery(params);
    const url = query ? `/products?${query}` : "/products";

    return api.get<{ data: ProductListData }>(url);
  },

  /* =========================
     GET
  ========================= */
  get: (id: number) =>
    api.get<{ data: Product }>(`/products/${id}`),

  /* =========================
     CREATE
  ========================= */
  create: (payload: ProductCreateInput) =>
    api.post<{ data: Product }>("/products", payload),

  /* =========================
     UPDATE
  ========================= */
  update: (id: number, payload: ProductUpdateInput) =>
    api.patch<{ data: Product }>(`/products/${id}`, payload),

  /* =========================
     DEACTIVATE
  ========================= */
  deactivate: (id: number, version: number) =>
    api.patch<{ data: Product }>(
      `/products/${id}/deactivate`,
      { version }
    ),

  /* =========================
     ACTIVATE
  ========================= */
  activate: (id: number) =>
    api.patch<{ data: Product }>(
      `/products/${id}/activate`
    ),
};
