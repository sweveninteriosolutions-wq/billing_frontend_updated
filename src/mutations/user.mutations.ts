import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  updateUser,
  deactivateUser,
  reactivateUser,
} from '@/api/user.api';
import { USERS_QUERY_KEY } from '@/queries/users.queries';
import {
  UserCreatePayload,
  UserUpdatePayload,
  VersionOnlyPayload,
} from '@/types/users';

/**
 * =========================
 * CREATE USER
 * =========================
 */
export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserCreatePayload) => createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

/**
 * =========================
 * UPDATE USER
 * =========================
 */
export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; payload: UserUpdatePayload }) =>
      updateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

/**
 * =========================
 * DEACTIVATE USER
 * =========================
 */
export function useDeactivateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; payload: VersionOnlyPayload }) =>
      deactivateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

/**
 * =========================
 * REACTIVATE USER
 * =========================
 */
export function useActivateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; payload: VersionOnlyPayload }) =>
      reactivateUser(vars.id, vars.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
