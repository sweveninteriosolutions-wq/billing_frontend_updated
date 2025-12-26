import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/product.api";
import { PRODUCT_KEYS } from "@/queries/product.queries";
import {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/types/product";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductCreateInput) =>
      productApi.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ProductUpdateInput;
    }) => productApi.update(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useDeactivateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      version,
    }: {
      id: number;
      version: number;
    }) => productApi.deactivate(id, version),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}

export function useActivateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.activate(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
}
