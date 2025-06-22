import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

/**
 * Function to create a protected screen component that requires authentication
 * @param ScreenComponent The screen component to protect
 * @param redirectTo The route to redirect to if not authenticated
 */
export const createProtectedScreen = (
  ScreenComponent: any,
  redirectTo: string = 'SplashScreen2'
) => {
  // Return a new component that wraps the original screen
  const ProtectedScreen = (props: any) => {
    const { isAuthenticated, isSkippedLogin } = useAuthStore();
    const navigation = useNavigation();
    
    // User has access if they're authenticated or have skipped login
    const userHasAccess = isAuthenticated || isSkippedLogin;

    useEffect(() => {
      if (!userHasAccess) {
        // Redirect to the specified route if not authenticated
        navigation.navigate(redirectTo as never);
      }
    }, [userHasAccess, navigation]);

    // Only render the component if the user has access
    return userHasAccess ? <ScreenComponent {...props} /> : null;
  };

  // Copy static properties from the original component
  if (ScreenComponent.Navigator) {
    ProtectedScreen.Navigator = ScreenComponent.Navigator;
  }
  if (ScreenComponent.Screen) {
    ProtectedScreen.Screen = ScreenComponent.Screen;
  }
  if (ScreenComponent.Group) {
    ProtectedScreen.Group = ScreenComponent.Group;
  }

  return ProtectedScreen;
};

/**
 * Function to create a protected screen component that requires full authentication (not skipped login)
 * @param ScreenComponent The screen component to protect
 * @param redirectTo The route to redirect to if not fully authenticated
 */
export const createFullyProtectedScreen = (
  ScreenComponent: any,
  redirectTo: string = 'SplashScreen2'
) => {
  // Return a new component that wraps the original screen
  const FullyProtectedScreen = (props: any) => {
    const { isAuthenticated } = useAuthStore();
    const navigation = useNavigation();

    useEffect(() => {
      if (!isAuthenticated) {
        // Redirect to the specified route if not fully authenticated
        navigation.navigate(redirectTo as never);
      }
    }, [isAuthenticated, navigation]);

    // Only render the component if the user is fully authenticated
    return isAuthenticated ? <ScreenComponent {...props} /> : null;
  };

  // Copy static properties from the original component
  if (ScreenComponent.Navigator) {
    FullyProtectedScreen.Navigator = ScreenComponent.Navigator;
  }
  if (ScreenComponent.Screen) {
    FullyProtectedScreen.Screen = ScreenComponent.Screen;
  }
  if (ScreenComponent.Group) {
    FullyProtectedScreen.Group = ScreenComponent.Group;
  }

  return FullyProtectedScreen;
};

/**
 * Hook to check if a route is protected and redirect if necessary
 * @param requiresAuth Whether the route requires authentication
 * @param requiresFullAuth Whether the route requires full authentication (not skipped login)
 * @param redirectTo The route to redirect to if not authenticated
 */
export const useRouteGuard = (
  requiresAuth: boolean = false,
  requiresFullAuth: boolean = false,
  redirectTo: string = 'SplashScreen2'
) => {
  const { isAuthenticated, isSkippedLogin } = useAuthStore();
  const navigation = useNavigation();
  
  // User has access if they're authenticated or have skipped login (if full auth not required)
  const userHasAccess = requiresFullAuth 
    ? isAuthenticated 
    : (isAuthenticated || isSkippedLogin);

  useEffect(() => {
    if (requiresAuth && !userHasAccess) {
      // Redirect to the specified route if not authenticated
      navigation.navigate(redirectTo as never);
    }
  }, [requiresAuth, userHasAccess, navigation, redirectTo]);

  return { userHasAccess };
};
