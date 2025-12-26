import { useQuery } from "@tanstack/react-query";
import { supplierApi } from "@/api/supplier.api";
import { Supplier, SupplierListData } from "@/types/supplier";

export type SupplierListParams = {
  search?: string;
  is_deleted?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};


export const SUPPLIER_KEYS = {
  all: ["suppliers"] as const,

  list: (params: SupplierListParams) =>
    [
      ...SUPPLIER_KEYS.all,
      {
        search: params.search ?? null,
        is_deleted:
          typeof params.is_deleted === 'boolean'
            ? params.is_deleted
            : null,
        page: params.page ?? 20,
        page_size: params.page_size ?? 0,
        sort_by: params.sort_by ?? 'created_at',
        sort_order: params.sort_order ?? 'desc',
      },
    ] as const,

  detail: (id: number) =>
    [...SUPPLIER_KEYS.all, "detail", id] as const,
};

export function useSuppliers(params: SupplierListParams) {
  return useQuery({
    queryKey: SUPPLIER_KEYS.list(params),
    queryFn: async () => {
      const res = await supplierApi.list(params);
      return res.data;
    },
  });
}


export function useSupplier(id: number, enabled = true) {
  return useQuery<Supplier>({
    queryKey: SUPPLIER_KEYS.detail(id),
    queryFn: async () => {
      const res = await supplierApi.get(id);
      return res.data;
    },
    enabled,
  });
}
