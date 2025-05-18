// modules/auth/index.ts
// Export store
export { useAuthStore, useAuth } from './store/authStore';
export type { User } from './store/authStore';

// Export services
export { default as tokenService } from './services/tokenService';
export type { Tokens } from './services/tokenService';
export { default as authService } from './services/authService';
export type { 
  LoginCredentials, 
  AuthResponse, 
  SkippedLoginRequest 
} from './services/authService';

// Export storage
export { storage } from './storage/mmkvStorage';

// Export navigation
export { default as AuthNavigation } from './navigation/auth.navigation';
export { default as AuthNavigator } from './navigation/auth.navigator';
export type { AuthStackParamList } from './navigation/auth.navigator';

// Export route guards
export { 
  createProtectedScreen,
  createFullyProtectedScreen,
  useRouteGuard 
} from './utils/routeGuards';
