// src/mutations/grn.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createGRN, updateGRN, verifyGRN, deleteGRN } from '@/api/grn.api';
import { GRN_KEYS } from '@/queries/grn.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export const useCreateGRN = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGRN,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      toast.success('GRN created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useUpdateGRN = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateGRN(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      qc.invalidateQueries({ queryKey: GRN_KEYS.detail(id) });
      toast.success('GRN updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useVerifyGRN = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: verifyGRN,
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      qc.invalidateQueries({ queryKey: GRN_KEYS.detail(id) });
      toast.success('GRN verified');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useDeleteGRN = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGRN,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GRN_KEYS.all });
      toast.success('GRN deleted');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};
