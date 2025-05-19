import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaktabScreen from '../screens/MaktabScreen';

const Stack = createNativeStackNavigator();

const MaktabNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MaktabScreen"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="MaktabScreen" 
        component={MaktabScreen} 
        options={{
          title: 'Maktab',
        }}
      />
    </Stack.Navigator>
  );
};

export default MaktabNavigator;
