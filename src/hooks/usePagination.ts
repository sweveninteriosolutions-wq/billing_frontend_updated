import { useState } from "react";

type PaginationOptions = {
  initialPage?: number;
  initialPageSize?: number;
};

export function usePagination(options?: PaginationOptions) {
  const [page, setPage] = useState(options?.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(options?.initialPageSize ?? 20);

  const reset = () => setPage(1);

  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
    reset,
  };
}
