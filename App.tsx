// dependencies
import * as React from 'react';
import 'react-native-url-polyfill/auto';

// navigators
import SplashNavigation from './modules/splash/navigation/splash.navigation';
import UserNavigation from '@/modules/user/navigation/user.navigation';

export default function App() {
  return (
    <>
      {/* <SplashNavigation /> */}
      <UserNavigation />
    </>
  );
}
