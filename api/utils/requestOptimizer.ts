// api/utils/requestOptimizer.ts
import { AxiosRequestConfig } from 'axios';

/**
 * Optimizes the request payload by removing unnecessary fields
 * @param data The data to optimize
 * @param fieldsToRemove Fields to remove from the payload
 * @returns Optimized data
 */
export const optimizePayload = (data: any, fieldsToRemove: string[] = []): any => {
  if (!data || typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    return data.map(item => optimizePayload(item, fieldsToRemove));
  }
  
  const result = { ...data };
  fieldsToRemove.forEach(field => {
    delete result[field];
  });
  
  return result;
};

/**
 * Prepares data for compression using built-in methods
 * @param data The data to prepare
 * @returns Prepared data
 */
export const prepareDataForCompression = (data: any): any => {
  // Let the browser/axios handle compression automatically
  // Just return the optimized data
  return data;
};

/**
 * Adds compression headers to a request config
 * @param config The Axios request config
 * @returns Updated config with compression headers
 */
export const addCompressionHeaders = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const headers = config.headers || {};
  
  // Don't modify headers if this is a FormData request
  if (config.data instanceof FormData) {
    console.warn('⚠️ Attempted to add compression headers to FormData request - skipping');
    return config;
  }
  
  return {
    ...config,
    headers: {
      ...headers,
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json'
    },
    // Let the browser/axios handle compression automatically
    decompress: true
  };
};

/**
 * Batches multiple requests into a single request
 * @param requests Array of request objects
 * @returns A single batched request
 */
export interface BatchRequestItem {
  method: string;
  url: string;
  data?: any;
  params?: any;
}

export const batchRequests = (requests: Array<BatchRequestItem>): AxiosRequestConfig => {
  return {
    method: 'POST',
    url: '/batch',
    data: {
      requests: requests.map(req => ({
        method: req.method,
        url: req.url,
        body: req.data,
        params: req.params
      }))
    }
  };
};

/**
 * Extracts responses from a batched response
 * @param batchedResponse The response from a batched request
 * @returns Array of individual responses
 */
export const extractBatchedResponses = (batchedResponse: any): any[] => {
  if (!batchedResponse || !batchedResponse.responses) {
    return [];
  }
  
  return batchedResponse.responses;
};
