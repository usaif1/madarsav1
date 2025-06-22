// dependencies
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {SplashScreen1, SplashScreen2} from '../screens';

// Define the splash stack param list for type safety
export type SplashStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<SplashStackParamList>();

// Define the navigator component
const SplashNavigator = () => {
  return (
    <Stack.Navigator
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

export default SplashNavigator;
