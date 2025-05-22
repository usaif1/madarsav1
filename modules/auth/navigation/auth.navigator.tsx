// dependencies
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {SplashScreen1, SplashScreen2} from '@/modules/splash/screens';

// Define the auth stack param list for type safety
export type AuthStackParamList = {
  SplashScreen1: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Define the navigator component
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen1"
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
