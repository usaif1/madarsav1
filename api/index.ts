// src/api/index.ts
// Export clients
export { default as madrasaClient } from './clients/madrasaClient';
export { default as apiClients } from './clients/globalClient';
export * from './clients/globalClient';

// Export configs
export * from './config/apiConfig';
export * from './config/madrasaApiConfig';

// Export utils
export * from './utils/pagination';
export * from './utils/caching';
export * from './utils/errorHandling';