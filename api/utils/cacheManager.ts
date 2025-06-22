// api/utils/cacheManager.ts
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Initialize MMKV storage for caching
const cacheStorage = new MMKV({
  id: 'madrasa-api-cache',
  encryptionKey: 'madrasa-cache-key'
});

// Cache configuration types
export enum CacheStrategy {
  NETWORK_ONLY = 'network-only',      // Always fetch from network
  CACHE_FIRST = 'cache-first',        // Try cache first, then network
  NETWORK_FIRST = 'network-first',    // Try network first, then cache
  CACHE_ONLY = 'cache-only',          // Only use cache
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate' // Use cache, then update from network
}

export interface CacheConfig {
  strategy: CacheStrategy;
  maxAge?: number;                    // Max age in milliseconds
  key?: string;                       // Custom cache key
  invalidationKeys?: string[];        // Keys to invalidate on mutation
}

/**
 * Generates a cache key from a request config
 * @param config Axios request config
 * @returns Cache key string
 */
export const generateCacheKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  const paramsString = params ? JSON.stringify(params) : '';
  const dataString = data ? JSON.stringify(data) : '';
  
  return `${method}-${url}-${paramsString}-${dataString}`;
};

/**
 * Saves a response to the cache
 * @param key Cache key
 * @param response Axios response to cache
 * @param maxAge Maximum age of the cache entry in milliseconds
 */
export const saveToCache = (key: string, response: AxiosResponse, maxAge?: number): void => {
  const timestamp = Date.now();
  const cacheEntry = {
    data: response.data,
    status: response.status,
    headers: response.headers,
    timestamp,
    maxAge
  };
  
  cacheStorage.set(key, JSON.stringify(cacheEntry));
};

/**
 * Gets a response from the cache
 * @param key Cache key
 * @returns Cached response or null if not found or expired
 */
export const getFromCache = (key: string): AxiosResponse | null => {
  const cachedData = cacheStorage.getString(key);
  
  if (!cachedData) return null;
  
  try {
    const cacheEntry = JSON.parse(cachedData);
    const { timestamp, maxAge, data, status, headers } = cacheEntry;
    
    // Check if cache is expired
    if (maxAge && Date.now() - timestamp > maxAge) {
      // Remove expired cache
      cacheStorage.delete(key);
      return null;
    }
    
    // Construct a response-like object
    return {
      data,
      status,
      headers,
      config: {},
      statusText: ''
    } as AxiosResponse;
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return null;
  }
};

/**
 * Invalidates cache entries by keys or patterns
 * @param keys Array of cache keys or patterns to invalidate
 */
export const invalidateCache = (keys: string[]): void => {
  // Get all cache keys
  const allKeys = cacheStorage.getAllKeys();
  
  // Filter keys to invalidate
  const keysToInvalidate = allKeys.filter(cacheKey => 
    keys.some(invalidationKey => cacheKey.includes(invalidationKey))
  );
  
  // Delete matched keys
  keysToInvalidate.forEach(key => cacheStorage.delete(key));
};

/**
 * Checks if the device is online
 * @returns Promise resolving to boolean indicating online status
 */
export const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true && netInfo.isInternetReachable === true;
};

/**
 * Implements an offline-first strategy for data fetching
 * @param fetchFn Function to fetch data from network
 * @param cacheKey Cache key for the data
 * @param cacheConfig Cache configuration
 * @returns Promise resolving to the data
 */
export const offlineFirst = async <T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  cacheConfig: CacheConfig
): Promise<T> => {
  const { strategy, maxAge } = cacheConfig;
  const cachedResponse = getFromCache(cacheKey) as unknown as T;
  const online = await isOnline();
  
  switch (strategy) {
    case CacheStrategy.CACHE_ONLY:
      if (cachedResponse) return cachedResponse;
      throw new Error('No cached data available and cache-only strategy specified');
      
    case CacheStrategy.NETWORK_ONLY:
      if (!online) throw new Error('No network connection available and network-only strategy specified');
      const networkData = await fetchFn();
      saveToCache(cacheKey, networkData as unknown as AxiosResponse, maxAge);
      return networkData;
      
    case CacheStrategy.CACHE_FIRST:
      if (cachedResponse) return cachedResponse;
      if (!online) throw new Error('No cached data or network connection available');
      const cacheFirstData = await fetchFn();
      saveToCache(cacheKey, cacheFirstData as unknown as AxiosResponse, maxAge);
      return cacheFirstData;
      
    case CacheStrategy.NETWORK_FIRST:
      if (online) {
        try {
          const networkFirstData = await fetchFn();
          saveToCache(cacheKey, networkFirstData as unknown as AxiosResponse, maxAge);
          return networkFirstData;
        } catch (error) {
          if (cachedResponse) return cachedResponse;
          throw error;
        }
      } else if (cachedResponse) {
        return cachedResponse;
      }
      throw new Error('No network connection or cached data available');
      
    case CacheStrategy.STALE_WHILE_REVALIDATE:
      // Return cached data immediately if available
      if (cachedResponse) {
        // Revalidate in background if online
        if (online) {
          fetchFn().then(freshData => {
            saveToCache(cacheKey, freshData as unknown as AxiosResponse, maxAge);
          }).catch(error => {
            console.error('Background revalidation failed:', error);
          });
        }
        return cachedResponse;
      }
      
      // If no cache, fetch from network
      if (!online) throw new Error('No cached data or network connection available');
      const freshData = await fetchFn();
      saveToCache(cacheKey, freshData as unknown as AxiosResponse, maxAge);
      return freshData;
      
    default:
      return fetchFn();
  }
};
