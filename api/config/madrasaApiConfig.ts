// src/api/config/madrasaApiConfig.ts
export const MADRASA_API_URL = 'https://api.madrasaapp.com/madrasaapp';

export const MADRASA_API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/users/login',
  REGISTER: '/api/v1/users/register',
  LOGOUT: '/api/v1/users/logout',
  REFRESH_TOKEN: '/api/v1/refreshToken',
  USER_PROFILE: '/api/v1/users/me',
  
  // OAuth endpoints
  GOOGLE_AUTH: '/api/v1/users/oauth/google',
  FACEBOOK_AUTH: '/api/v1/users/oauth/facebook',
  AUTHENTICATE: '/api/v1/authenticate',
  
  // Skip login
  SKIPPED_LOGIN: '/api/v1/skipped-login',
  
  // Islamic tools endpoints
  NAMES_99: '/api/v1/99names',
  DUAS: '/api/v1/duas',
  DUAS_TASBIH: '/api/v1/duas/tasbih',
  TASBIH_USER_COUNTER: '/api/v1/tasbih-user-counter',
  
  // Other endpoints will be added as needed
};

// HTTP status codes for error handling
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};