import { api } from "./client";
import {
  Supplier,
  SupplierListData,
  SupplierCreateInput,
  SupplierUpdateInput,
} from "@/types/supplier";

/* =========================
   QUERY SERIALIZER
========================= */
function buildQuery(params?: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      qs.append(k, String(v));
    }
  });
  return qs.toString();
}

export const supplierApi = {
  list: (params?: Record<string, any>) => {
    const q = buildQuery(params);
    return api.get<{
      success: boolean;
      message: string;
      data: SupplierListData;
    }>(q ? `/suppliers?${q}` : "/suppliers");
  },

  get: (id: number) =>
    api.get<{ data: Supplier }>(`/suppliers/${id}`),

  create: (payload: SupplierCreateInput) =>
    api.post<{ data: Supplier }>("/suppliers", payload),

  update: (id: number, payload: SupplierUpdateInput) =>
    api.patch<{ data: Supplier }>(`/suppliers/${id}`, payload),

  deactivate: (id: number, version: number) =>
    api.patch<{ data: Supplier }>(
      `/suppliers/${id}/deactivate`,
      { version }
    ),
};
