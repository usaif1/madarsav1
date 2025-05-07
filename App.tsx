// dependencies
import * as React from 'react';
import 'react-native-url-polyfill/auto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// navigators
import SplashNavigation from './modules/splash/navigation/splash.navigation';
import ParentNavigation from '@/navigator/ParentNavigation';

// store
import {useGlobalStore} from './globalStore';
import {StatusBar} from 'react-native';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false, // Less relevant for mobile
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default function App() {
  const {onboarded} = useGlobalStore();

  if (!onboarded) {
    return (
      <QueryClientProvider client={queryClient}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={'transparent'}
            translucent
          />
          <SplashNavigation />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent
        />
        <ParentNavigation />
    </QueryClientProvider>
  );
}
