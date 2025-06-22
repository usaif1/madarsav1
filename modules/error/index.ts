// modules/error/index.ts
// Export store
export { useErrorStore, useError } from './store/errorStore';

// Export hooks
export { useErrorHandler } from './hooks/useErrorHandler';
export { useRetry } from './hooks/useRetry';

// Export components
export { default as ErrorBoundary } from './components/ErrorBoundary';
export { default as ErrorToast } from './components/ErrorToast';
export { default as OfflineDetector } from './components/OfflineDetector';