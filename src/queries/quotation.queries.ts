import { useQuery } from "@tanstack/react-query";
import {
  getQuotations,
  getQuotation,
  QuotationListQuery,
} from "@/api/quotation.api";
import {
  QuotationDetail,
  QuotationListResponse,
} from "@/types/quotation";

export const QUOTATION_KEYS = {
  all: ["quotations"] as const,
  list: (params: unknown) =>
    ["quotations", "list", params] as const,
  detail: (id: number) =>
    ["quotations", id] as const,
};

export const useQuotations = (params: QuotationListQuery) =>
  useQuery<QuotationListResponse>({
    queryKey: QUOTATION_KEYS.list(params),
    queryFn: () => getQuotations(params),
  });

export const useQuotation = (id: number, enabled = true) =>
  useQuery<QuotationDetail>({
    queryKey: QUOTATION_KEYS.detail(id),
    queryFn: () => getQuotation(id),
    enabled,
  });

