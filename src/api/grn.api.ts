// src/api/grn.api.ts

import { api } from "./client";
import {
  GRNCreatePayload,
  GRNUpdatePayload,
  GRNDetail,
  GRNListResponse,
} from "@/types/grn";

/* =========================
   QUERY PARAMS
========================= */
export type GRNListQuery = {
  supplier_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: "asc" | "desc";
};

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* =========================
   API CALLS
========================= */
export const getGRNs = async (
  params: GRNListQuery
): Promise<GRNListResponse> => {
  const res = await api.get<APIResponse<GRNListResponse>>(
    "/grns",
    params 
  );

  return res.data; // ✅ fully typed
};

export const getGRN = async (id: number): Promise<GRNDetail> => {
  const res = await api.get<{ data: GRNDetail }>(`/grns/${id}`);
  return res.data;
};

export const createGRN = async (
  payload: GRNCreatePayload
): Promise<GRNDetail> => {
  const res = await api.post<{ data: GRNDetail }>(
    "/grns",
    payload
  );
  return res.data;
};

export const updateGRN = async (
  id: number,
  payload: GRNUpdatePayload
): Promise<GRNDetail> => {
  const res = await api.patch<{ data: GRNDetail }>(
    `/grns/${id}`,
    payload
  );
  return res.data;
};

export const verifyGRN = async (id: number): Promise<GRNDetail> => {
  const res = await api.post<{ data: GRNDetail }>(
    `/grns/${id}/verify`
  );
  return res.data;
};

export const deleteGRN = async (id: number): Promise<GRNDetail> => {
  const res = await api.delete<{ data: GRNDetail }>(
    `/grns/${id}`
  );
  return res.data;
};
