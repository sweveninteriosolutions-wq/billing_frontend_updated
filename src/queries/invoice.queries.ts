// src/queries/invoice.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getInvoices, getInvoice, InvoiceListQuery } from "@/api/invoice.api";
import { InvoiceListResponse, InvoiceOut } from "@/types/invoice";

export const INVOICE_KEYS = {
  all: ["invoices"] as const,
  list: (params: unknown) => ["invoices", "list", params] as const,
  detail: (id: number) => ["invoices", id] as const,
};

export const useInvoices = (params: InvoiceListQuery) =>
  useQuery<InvoiceListResponse>({
    queryKey: INVOICE_KEYS.list(params),
    queryFn: () => getInvoices(params),
  });

export const useInvoice = (id: number, enabled = true) =>
  useQuery<InvoiceOut>({
    queryKey: INVOICE_KEYS.detail(id),
    queryFn: () => getInvoice(id),
    enabled,
  });
