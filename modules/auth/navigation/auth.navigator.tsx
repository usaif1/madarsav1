// dependencies
import React, { useEffect, useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';
import { mmkvStorage } from '../storage/mmkvStorage';

// screens
import {SplashScreen1, SplashScreen2} from '@/modules/splash/screens';

// Define the auth stack param list for type safety
export type AuthStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Define the navigator component
const AuthNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof AuthStackParamList>('SplashScreen1');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkLogoutState = async () => {
      try {
        const isLogout = await mmkvStorage.getItem('is_logout');
        console.log('isLogout', isLogout);
        if (isLogout === 'true') {
          // Clear the logout flag
          await mmkvStorage.removeItem('is_logout');
          setInitialRoute('SplashScreen2');
        }else{
          setInitialRoute('SplashScreen1');
        }
        setIsReady(true);
      } catch (error) {
        console.error('Error checking logout state:', error);
        setIsReady(true); // Still set ready even if there's an error
      }
    };

    checkLogoutState();
  }, []);

  if (!isReady) {
    return null; // or a loading indicator if needed
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
      }}
    >
      <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
      <Stack.Screen name="SplashScreen2" component={SplashScreen2} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
