// dependencies
import * as React from 'react';
import 'react-native-url-polyfill/auto';

// navigators
import SplashNavigation from './modules/splash/navigation/splash.navigation';
import ParentNavigation from '@/navigator/ParentNavigation';

// store
import {useGlobalStore} from './globalStore';

export default function App() {
  const {onboarded} = useGlobalStore();

  if (!onboarded) {
    return <SplashNavigation />;
  }

  return <ParentNavigation />;
}
