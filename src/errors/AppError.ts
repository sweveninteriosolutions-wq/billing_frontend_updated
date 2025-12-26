// src/errors/AppError.ts

import { AppErrorCode } from "./AppErrorCode";

export class AppError extends Error {
  errorCode: AppErrorCode;
  status?: number;

  constructor(
    message: string,
    errorCode: AppErrorCode,
    status?: number
  ) {
    super(message);
    this.name = "AppError";
    this.errorCode = errorCode;
    this.status = status;
  }

  static fromAxiosError(err: any): AppError {
    const response = err?.response;
    const data = response?.data;

    // 1️⃣ Known app error
    if (typeof data?.error_code === "string") {
      return new AppError(
        data.message ?? "Request failed",
        data.error_code as AppErrorCode,
        response.status
      );
    }

    // 2️⃣ FastAPI validation error
    if (Array.isArray(data?.detail)) {
      return new AppError(
        data.detail[0]?.msg ?? "Validation error",
        "VALIDATION_ERROR",
        response.status
      );
    }

    // 3️⃣ Axios/network error
    return new AppError(
      err?.message ?? "Network error",
      "NETWORK_ERROR",
      response?.status
    );
  }
}
