import { api } from "./client";
import { StockTransferListResponse, StockTransferWrite } from "@/types/stockTransfer";

export type StockTransferQuery = {
  status?: "pending" | "completed" | "cancelled";
  page?: number;
  page_size?: number;
};

/* READ (VIEW) */
export const getStockTransfers = async (
  params: StockTransferQuery
): Promise<StockTransferListResponse> => {
  return api.get<StockTransferListResponse>(
    "/stock-transfers/",
    params
  );
};

/* WRITE */
export const createStockTransfer = async (
  payload: {
    product_id: number;
    quantity: number;
    from_location_id: number;
    to_location_id: number;
  }
): Promise<StockTransferWrite> => {
  const res = await api.post<{ data: StockTransferWrite }>(
    "/stock-transfers",
    payload
  );

  return res.data;
};


export const completeStockTransfer = async (id: number) => {
  return api.post(`/stock-transfers/${id}/complete`);
};

export const cancelStockTransfer = async (id: number) => {
  return api.post(`/stock-transfers/${id}/cancel`);
};
