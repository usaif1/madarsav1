// dependencies
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// auth store
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useGlobalStore } from '@/globalStore';

// Direct imports instead of lazy loading
import ParentNavigator from './ParentNavigator';
import AuthNavigator from '@/modules/auth/navigation/auth.navigator';

// Define the root stack param list for type safety
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// No lazy loading - direct component references
// const ParentNavigation = ParentNavigator;
// const AuthNavigation = AuthNavigator;

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isSkippedLogin } = useAuthStore();
  const { onboarded } = useGlobalStore();
  
  // User is authenticated if they're logged in or have skipped login
  const userHasAccess = isAuthenticated || isSkippedLogin;

  // Show auth screens if not authenticated, otherwise show main app
  // Note: Auth screens include splash screens for onboarding
  
  return (
    // No need for Suspense since we're not using lazy loading
    !userHasAccess ? <AuthNavigator /> : <ParentNavigator />
  );
};

export default RootNavigator;
