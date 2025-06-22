// src/api/utils/caching.ts
import { AxiosRequestConfig } from 'axios';

// Cache control constants
export const CACHE_CONTROL = {
  NO_CACHE: 'no-cache, no-store, must-revalidate',
  PUBLIC: 'public, max-age=',
  PRIVATE: 'private, max-age=',
};

// Time constants in seconds
export const TIME = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
};

// Add cache control headers to request
export const addCacheControl = (
  config: AxiosRequestConfig,
  maxAge: number = TIME.HOUR,
  isPublic: boolean = false
): AxiosRequestConfig => {
  const cacheType = isPublic ? CACHE_CONTROL.PUBLIC : CACHE_CONTROL.PRIVATE;
  
  if (!config.headers) {
    config.headers = {};
  }
  
  config.headers['Cache-Control'] = `${cacheType}${maxAge}`;
  
  return config;
};

// Add no-cache headers to request
export const addNoCache = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config.headers) {
    config.headers = {};
  }
  
  config.headers['Cache-Control'] = CACHE_CONTROL.NO_CACHE;
  config.headers['Pragma'] = 'no-cache';
  
  return config;
};