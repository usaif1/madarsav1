// src/api/utils/errorHandling.ts
import { AxiosError } from 'axios';
import { HTTP_STATUS } from '../config/madrasaApiConfig';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

// Custom error interface
export interface AppError {
  type: ErrorType;
  message: string;
  status?: number;
  details?: any;
}

// Map Axios error to AppError
export const mapAxiosError = (error: AxiosError): AppError => {
  // Network error
  if (error.code === 'ECONNABORTED' || !error.response) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network error. Please check your connection.',
      details: error.message,
    };
  }
  
  // Get status code and response data
  const status = error.response.status;
  const data = error.response.data as any;
  
  // Authentication error
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return {
      type: ErrorType.AUTH,
      message: data?.message || 'Authentication failed. Please log in again.',
      status,
      details: data,
    };
  }
  
  // Forbidden error
  if (status === HTTP_STATUS.FORBIDDEN) {
    return {
      type: ErrorType.AUTH,
      message: data?.message || 'You do not have permission to access this resource.',
      status,
      details: data,
    };
  }
  
  // Validation error
  if (status === HTTP_STATUS.BAD_REQUEST) {
    return {
      type: ErrorType.VALIDATION,
      message: data?.message || 'Invalid input. Please check your data.',
      status,
      details: data,
    };
  }
  
  // Server error
  if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return {
      type: ErrorType.SERVER,
      message: 'Server error. Please try again later.',
      status,
      details: data,
    };
  }
  
  // Unknown error
  return {
    type: ErrorType.UNKNOWN,
    message: data?.message || 'An unexpected error occurred.',
    status,
    details: data,
  };
};

// Function to get user-friendly error message
export const getUserFriendlyErrorMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Network error. Please check your connection and try again.';
    case ErrorType.AUTH:
      return error.message || 'Authentication error. Please log in again.';
    case ErrorType.VALIDATION:
      return error.message || 'Please check your input and try again.';
    case ErrorType.SERVER:
      return 'Server error. Our team has been notified. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};  