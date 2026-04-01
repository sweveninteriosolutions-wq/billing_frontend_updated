// src/mutations/user.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
} from '@/api/user.api';
import { USERS_QUERY_KEY } from '@/queries/users.queries';
import { extractErrorMessage } from '@/lib/apiRequest';
import {
  UserCreatePayload,
  UserUpdatePayload,
  VersionOnlyPayload,
} from '@/types/users';

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreatePayload) => createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; payload: UserUpdatePayload }) =>
      updateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User updated successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; payload: VersionOnlyPayload }) =>
      deactivateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User deactivated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; payload: VersionOnlyPayload }) =>
      reactivateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('User reactivated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
