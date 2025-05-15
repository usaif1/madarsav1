// dependencies
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// auth store
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useGlobalStore } from '@/globalStore';

// Define the root stack param list for type safety
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Import these dynamically to avoid circular dependencies
const ParentNavigation = React.lazy(() => import('./ParentNavigation'));
const AuthNavigation = React.lazy(() => import('@/modules/auth/navigation/auth.navigation'));

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isSkippedLogin } = useAuthStore();
  const { onboarded } = useGlobalStore();
  
  // User is authenticated if they're logged in or have skipped login
  const userHasAccess = isAuthenticated || isSkippedLogin;

  // Show auth screens if not authenticated, otherwise show main app
  // Note: Auth screens include splash screens for onboarding
  
  return (
    <React.Suspense fallback={null}>
      {!userHasAccess ? <AuthNavigation /> : <ParentNavigation />}
    </React.Suspense>
  );
};

export default RootNavigator;
