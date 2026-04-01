// src/types/reports.ts

export interface SalesSummary {
  from_date: string;
  to_date: string;
  invoice_count: number;
  total_revenue: string;
  total_collected: string;
  outstanding: string;
  total_tax: string;
  total_discounts: string;
}

export interface DailySalesItem {
  day: string;
  count: number;
  revenue: string;
}

export interface TopProductItem {
  product_id: number;
  product_name: string;
  sku: string;
  total_qty: number;
  total_revenue: string;
}

export interface TopCustomerItem {
  customer_id: number;
  customer_name: string;
  invoice_count: number;
  total_spend: string;
}

export interface LowStockItem {
  product_id: number;
  sku: string;
  name: string;
  min_stock_threshold: number;
  total_stock: number;
}
