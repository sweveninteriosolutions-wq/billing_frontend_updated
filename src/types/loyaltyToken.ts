// src/types/loyaltyToken.ts
export interface LoyaltyTokenOut {
  id: number;
  customer_id: number;
  invoice_id: number;
  tokens: number;
  created_at: string;
  updated_at?: string;
}

export interface LoyaltyTokenListData {
  total: number;
  items: LoyaltyTokenOut[];
}
