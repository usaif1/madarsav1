// api/utils/paginationUtils.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import madrasaClient from '../clients/madrasaClient';

// Import from existing pagination utils
import {
  PaginationParams,
  PaginatedResponse,
  createPaginationParams as createBasicPaginationParams,
  getNextPageParam,
  DEFAULT_PAGE,
  DEFAULT_LIMIT
} from './pagination';

// Extended pagination params for additional features
export interface ExtendedPaginationParams extends PaginationParams {
  offset?: number;
  cursor?: string;
}

/**
 * Creates pagination parameters for API requests with offset calculation
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @returns Extended pagination parameters object
 */
export const createPaginationParams = (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT): ExtendedPaginationParams => {
  const baseParams = createBasicPaginationParams({ page, limit });
  
  return {
    ...baseParams,
    offset: (page - 1) * limit
  };
};

/**
 * Fetches a paginated API endpoint
 * @param url API endpoint URL
 * @param params Additional query parameters
 * @param config Axios request config
 * @returns Promise resolving to paginated response
 */
export const fetchPaginated = async <T>(
  url: string,
  params: PaginationParams = { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT },
  config: AxiosRequestConfig = {}
): Promise<PaginatedResponse<T>> => {
  const response = await madrasaClient.get(url, {
    ...config,
    params: {
      ...params,
      ...config.params
    }
  });
  
  return response.data;
};

/**
 * Hook for infinite scrolling with TanStack Query
 * @param queryKey Query key for caching
 * @param url API endpoint URL
 * @param pageParam Parameter name for pagination (default: 'page')
 * @param limit Items per page
 * @param additionalParams Additional query parameters
 * @returns TanStack Query infinite query result
 */
export const useInfiniteScroll = <T>(
  queryKey: readonly unknown[],
  url: string,
  pageParam: string = 'page',
  limit: number = DEFAULT_LIMIT,
  additionalParams: Record<string, any> = {}
) => {
  return useInfiniteQuery<PaginatedResponse<T>, Error>({
    queryKey,
    queryFn: ({ pageParam: page = DEFAULT_PAGE }) => {
      const params: Record<string, any> = {
        ...additionalParams,
        limit
      };
      params[pageParam] = page;
      
      return fetchPaginated<T>(url, params, {});
    },
    getNextPageParam: (lastPage) => {
      return getNextPageParam(lastPage);
    },
    initialPageParam: DEFAULT_PAGE
  });
};

/**
 * Hook for cursor-based pagination with TanStack Query
 * @param queryKey Query key for caching
 * @param url API endpoint URL
 * @param limit Items per page
 * @param additionalParams Additional query parameters
 * @returns TanStack Query infinite query result
 */
export const useCursorPagination = <T>(
  queryKey: readonly unknown[],
  url: string,
  limit: number = DEFAULT_LIMIT,
  additionalParams: Record<string, any> = {}
) => {
  return useInfiniteQuery<PaginatedResponse<T>, Error>({
    queryKey,
    queryFn: ({ pageParam: cursor = null }) => {
      return fetchPaginated<T>(url, {
        cursor: cursor as string | null,
        limit,
        ...additionalParams
      }, {});
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : null;
    },
    initialPageParam: null as null
  });
};

/**
 * Prefetches the next page of data for better UX
 * @param url API endpoint URL
 * @param params Current pagination parameters
 * @param config Axios request config
 */
export const prefetchNextPage = async <T>(
  url: string,
  params: PaginationParams,
  config: AxiosRequestConfig = {}
): Promise<void> => {
  if (!params.page) return;
  
  const nextPage = params.page + 1;
  
  try {
    await fetchPaginated<T>(url, {
      ...params,
      page: nextPage
    }, config);
  } catch (error) {
    console.error('Failed to prefetch next page:', error);
  }
};
