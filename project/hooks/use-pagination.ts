// src/hooks/use-pagination.ts
"use client";

import { useState, useMemo } from "react";

export interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  paginatedData: T[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Simple client‑side pagination hook.
 *   data – full array of items.
 *   initialPageSize – default items per page.
 */
export function usePagination<T>(data: T[], initialPageSize = 10): PaginationResult<T> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Clamp page number when data changes
  const safePage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    totalCount,
    paginatedData,
    setPage,
    setPageSize,
  };
}
