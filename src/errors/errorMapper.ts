// src/errors/errorMapper.ts

import { AppError } from "./AppError";

export type ErrorAction =
  | { type: "TOAST"; variant: "error" | "warning" }
  | { type: "REDIRECT"; to: string }
  | { type: "LOGOUT" }
  | { type: "SILENT" };

const ERROR_TOAST = { type: "TOAST", variant: "error" } as const;
const WARNING_TOAST = { type: "TOAST", variant: "warning" } as const;

export function mapErrorToAction(error: AppError): ErrorAction {
  switch (error.errorCode) {
    // ======================
    // AUTH
    // ======================
    case "AUTH_INVALID":
    case "AUTH_FORBIDDEN":
      return ERROR_TOAST;

    case "AUTH_EXPIRED":
      return { type: "LOGOUT" };

    // ======================
    // CUSTOMER
    // ======================
    case "CUSTOMER_NOT_FOUND":
    case "CUSTOMER_EMAIL_EXISTS":
    case "CUSTOMER_CODE_EXISTS":
      return ERROR_TOAST;

    case "CUSTOMER_VERSION_CONFLICT":
      return WARNING_TOAST;

    // ======================
    // DISCOUNT
    // ======================
    case "DISCOUNT_NOT_FOUND":
      return ERROR_TOAST;

    case "DISCOUNT_ALREADY_ACTIVE":
    case "DISCOUNT_EXPIRED":
    case "DISCOUNT_USAGE_LIMIT_REACHED":
      return WARNING_TOAST;

    case "DISCOUNT_INVALID_RANGE":
    case "DISCOUNT_INVALID_VALUE":
    case "DISCOUNT_CODE_EXISTS":
    case "DISCOUNT_DATE_OVERLAP":
      return ERROR_TOAST;

    case "DISCOUNT_VERSION_CONFLICT":
      return WARNING_TOAST;

    // ======================
    // GRN
    // ======================
    case "GRN_NOT_FOUND":
    case "GRN_INVALID_SUPPLIER":
    case "GRN_INVALID_LOCATION":
    case "GRN_INVALID_PRODUCT":
    case "GRN_DUPLICATE_ITEMS":
    case "GRN_EMPTY_ITEMS":
    case "GRN_BILL_EXISTS":
      return ERROR_TOAST;

    case "GRN_INVALID_STATUS":
    case "GRN_VERSION_CONFLICT":
    case "NO_CHANGES_DETECTED":
      return WARNING_TOAST;

    // ======================
    // GENERIC
    // ======================
    case "VALIDATION_ERROR":
    case "NETWORK_ERROR":
      return ERROR_TOAST;

    default:
      return ERROR_TOAST;
  }
}
