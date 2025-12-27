// src/errors/AppErrorCode.ts

export type AppErrorCode =
  // =========================
  // AUTH
  // =========================
  | 'AUTH_INVALID'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_EXPIRED'

  // =========================
  // CUSTOMER
  // =========================
  | 'CUSTOMER_NOT_FOUND'
  | 'CUSTOMER_EMAIL_EXISTS'
  | 'CUSTOMER_CODE_EXISTS'
  | 'CUSTOMER_VERSION_CONFLICT'

  // =========================
  // DISCOUNT
  // =========================
  | 'DISCOUNT_NOT_FOUND'
  | 'DISCOUNT_ALREADY_ACTIVE'
  | 'DISCOUNT_EXPIRED'
  | 'DISCOUNT_USAGE_LIMIT_REACHED'
  | 'DISCOUNT_INVALID_RANGE'
  | 'DISCOUNT_INVALID_VALUE'
  | 'DISCOUNT_CODE_EXISTS'
  | 'DISCOUNT_DATE_OVERLAP'
  | 'DISCOUNT_VERSION_CONFLICT'

  // =========================
  // STOCK TRANSFER
  // =========================
  | 'STOCK_TRANSFER_INVALID_LOCATION'
  | 'STOCK_TRANSFER_INVALID_PRODUCT'
  | 'STOCK_TRANSFER_INSUFFICIENT_STOCK'
  | 'STOCK_TRANSFER_DUPLICATE'
  | 'STOCK_TRANSFER_INVALID_STATUS'

  // =========================
  // GRN
  // =========================
  | 'GRN_NOT_FOUND'
  | 'GRN_INVALID_STATUS'
  | 'GRN_BILL_EXISTS'
  | 'GRN_VERSION_CONFLICT'
  | 'GRN_EMPTY_ITEMS'
  | 'GRN_INVALID_SUPPLIER'
  | 'GRN_INVALID_LOCATION'
  | 'GRN_INVALID_PRODUCT'
  | 'GRN_DUPLICATE_ITEMS'
  | 'NO_CHANGES_DETECTED'

  // =========================
  // QUOTATION
  // =========================
  | 'QUOTATION_NOT_FOUND'
  | 'QUOTATION_DUPLICATE_DRAFT'
  | 'QUOTATION_INVALID_STATE'
  | 'QUOTATION_VERSION_CONFLICT'
  | 'QUOTATION_CANNOT_APPROVE'
  | 'QUOTATION_CANNOT_DELETE'

  // =========================
  // GENERIC
  // =========================
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNSAVED_CHANGES';
