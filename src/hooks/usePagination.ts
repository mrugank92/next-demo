import { useState, useMemo, useCallback } from "react";

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

export interface PaginationActions {
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export interface PaginationInfo {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems: number;
}

export function usePagination({
  initialPage = 1,
  pageSize = 15,
  totalItems,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPageState] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );

  const setCurrentPage = useCallback((page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPageState(clampedPage);
  }, [totalPages]);

  const actions: PaginationActions = useMemo(() => ({
    setCurrentPage,
    nextPage: () => setCurrentPage(currentPage + 1),
    previousPage: () => setCurrentPage(currentPage - 1),
    goToFirstPage: () => setCurrentPage(1),
    goToLastPage: () => setCurrentPage(totalPages),
  }), [currentPage, setCurrentPage, totalPages]);

  const info: PaginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return {
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex,
      totalItems,
    };
  }, [currentPage, pageSize, totalItems, totalPages]);

  const state: PaginationState = {
    currentPage,
    pageSize,
  };

  return {
    state,
    actions,
    info,
  };
}