// src/mutations/grn.mutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGRN,
  updateGRN,
  verifyGRN,
  deleteGRN,
} from "@/api/grn.api";
import { GRN_KEYS } from "@/queries/grn.queries";

export const useCreateGRN = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createGRN,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
    },
  });
};

export const useUpdateGRN = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: any;
    }) => updateGRN(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      qc.invalidateQueries({ queryKey: GRN_KEYS.detail(id) });
    },
  });
};

export const useVerifyGRN = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyGRN,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      qc.invalidateQueries({ queryKey: GRN_KEYS.detail(id) });
    },
  });
};

export const useDeleteGRN = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteGRN,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
    },
  });
};
