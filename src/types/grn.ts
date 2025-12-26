// src/types/grn.ts

export type GRNStatus = "draft" | "verified" | "cancelled";

/* =========================
   ITEM
========================= */
export type GRNItem = {
  product_id: number;
  quantity: number;
  unit_cost: number;
};

/* =========================
   CREATE / UPDATE
========================= */
export type GRNCreatePayload = {
  supplier_id: number;
  location_id: number;
  purchase_order?: string;
  bill_number?: string;
  notes?: string;
  items: GRNItem[];
};



export type GRNUpdatePayload = Partial<Omit<GRNCreatePayload, "items">> & {
  items?: GRNItem[];
  version: number;
};

/* =========================
   DETAIL (GET / CREATE / UPDATE)
========================= */
export type GRNDetail = {
  id: number;
  supplier_id: number | null;
  location_id: number;

  purchase_order?: string | null;
  bill_number?: string | null;
  notes?: string | null;

  status: GRNStatus;
  version: number;

  created_at: string;
  created_by?: number | null;
  updated_by?: number | null;
  created_by_name?: string | null;
  updated_by_name?: string | null;

  items: GRNItem[];
};




/* =========================
   VIEW (FROM LIST API)
========================= */
export type GRNView = {
  id: number;
  code: string;
  status: "draft" | "verified" | "cancelled";
  version: number;
  purchase_order: string;
  bill_number: string;

  supplier: {
    id: number;
    name: string;
  };

  location: {
    id: number;
    name: string;
  };

  items: {
    product: {
      id: number;
      name: string;
      sku: string;
    };
    quantity: number;
    unit_cost: number | string;
    total: number | string;
  }[];

  summary: {
    no_of_items: number;
    total_value: number | string;
  };

  audit: {
    created_at: string;
    created_by: string;
    updated_at?: string | null;
    updated_by?: string | null;
  };
};

export type GRNListResponse = {
  total: number;
  items: GRNView[];
};
