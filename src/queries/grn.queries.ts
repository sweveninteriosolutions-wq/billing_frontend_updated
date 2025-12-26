// src/queries/grn.queries.ts

import { useQuery } from "@tanstack/react-query";
import { getGRNs, getGRN, GRNListQuery } from "@/api/grn.api";
import { GRNDetail, GRNListResponse } from "@/types/grn";

export const GRN_KEYS = {
  all: ["grns"] as const,
  list: (params: unknown) => ["grns", "list", params] as const,
  detail: (id: number) => ["grns", id] as const,
};


export const useGRNs = (params: GRNListQuery) => {
  return useQuery<GRNListResponse>({
    queryKey: GRN_KEYS.list(params),
    queryFn: () => getGRNs(params),
  });
};

export const useGRN = (id: number, enabled = true) => {
  return useQuery<GRNDetail>({
    queryKey: GRN_KEYS.detail(id),
    queryFn: () => getGRN(id),
    enabled,
  });
};
