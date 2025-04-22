// dependencies
import * as React from 'react';
import 'react-native-url-polyfill/auto';

// navigators
import SplashNavigation from './modules/splash/navigation/splash.navigation';
import ParentNavigation from '@/navigator/ParentNavigation';

// store
import {useGlobalStore} from './globalStore';
import {StatusBar} from 'react-native';

export default function App() {
  const {onboarded} = useGlobalStore();

  if (!onboarded) {
    return (
      <>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent
        />
        <SplashNavigation />
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <ParentNavigation />
    </>
  );
}
