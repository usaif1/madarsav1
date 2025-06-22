// src/api/utils/pagination.ts
// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
    [key: string]: any; // Allow additional query parameters
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  
  // Default pagination parameters
  export const DEFAULT_PAGE = 1;
  export const DEFAULT_LIMIT = 20;
  
  // Helper function to create pagination query params
  export const createPaginationParams = (params: PaginationParams = {}): PaginationParams => {
    return {
      page: params.page || DEFAULT_PAGE,
      limit: params.limit || DEFAULT_LIMIT,
      ...params,
    };
  };
  
  // Helper function to check if there's a next page
  export const hasNextPage = <T>(response: PaginatedResponse<T>): boolean => {
    return response.pagination.hasNextPage;
  };
  
  // Helper function to get the next page number
  export const getNextPageParam = <T>(response: PaginatedResponse<T>): number | undefined => {
    if (hasNextPage(response)) {
      return response.pagination.currentPage + 1;
    }
    return undefined;
  };
  
  // Helper function to check if there's a previous page
  export const hasPreviousPage = <T>(response: PaginatedResponse<T>): boolean => {
    return response.pagination.hasPreviousPage;
  };
  
  // Helper function to get the previous page number
  export const getPreviousPageParam = <T>(response: PaginatedResponse<T>): number | undefined => {
    if (hasPreviousPage(response)) {
      return response.pagination.currentPage - 1;
    }
    return undefined;
  };