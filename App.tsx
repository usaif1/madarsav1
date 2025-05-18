// App.tsx
import * as React from 'react';
import 'react-native-url-polyfill/auto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

// navigators
import RootNavigation from '@/navigator/RootNavigation';

// store
import { useGlobalStore } from './globalStore';
import { StatusBar } from 'react-native';

// error handling
import { ErrorBoundary, ErrorToast, OfflineDetector } from '@/modules/error';

if (__DEV__) {
  require("./ReactotronConfig");
}

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      // // Handle errors globally
      // onError: (error) => {
      //   console.error('Query error:', error);
      // },
    },
    mutations: {
      // Handle errors globally
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <OfflineDetector>
            <StatusBar
              barStyle={'light-content'}
              backgroundColor={'transparent'}
              translucent
            />
            <ErrorToast />
            <RootNavigation />
          </OfflineDetector>
        </NavigationContainer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}