export type TransferStatus = "pending" | "completed" | "cancelled";

export type StockTransferWrite = {
  id: number;
  product_id: number;
  quantity: number;
  from_location_id: number;
  to_location_id: number;
  status: TransferStatus;

  transferred_by_id: number;
  completed_by_id?: number;

  created_at: string;
  updated_at?: string;
};

export type ProductMini = {
  id: number;
  name: string;
  sku: string;
};

export type LocationMini = {
  id: number;
  code: string;
  name: string;
};

export type StockTransferView = {
  id: number;
  product: ProductMini;
  quantity: number;

  from_location: LocationMini;
  to_location: LocationMini;

  status: TransferStatus;

  transferred_by: string;
  completed_by?: string | null;

  transfer_date: string;
};

export type StockTransferSummary = {
  godown: number;
  showroom: number;
};

export type StockTransferListResponse = {
  message: string;
  total: number;
  summary: StockTransferSummary;
  data: StockTransferView[];
};
