import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import JuzzListScreen from '../screens/juzz/JuzzListScreen';
import JuzzDetailScreen from '../screens/juzz/JuzzDetailScreen';
import TafseerScreen from '../screens/juzz/TafseerScreen';
import ChangeJuzzScreen from '../screens/juzz/ChangeJuzzScreen';

// Define the param list for type safety
export type JuzzStackParamList = {
  juzzList: undefined;
  juzzDetail: { juzzId: number; juzzName: string };
  tafseer: { juzzId: number; ayahId: number; verse: string };
  changeJuzz: { currentJuzzId: number };
};

// Create the navigator
const Stack = createNativeStackNavigator<JuzzStackParamList>();

const JuzzNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="juzzList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="juzzList" component={JuzzListScreen} />
      <Stack.Screen name="juzzDetail" component={JuzzDetailScreen} />
      <Stack.Screen 
        name="tafseer" 
        component={TafseerScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="changeJuzz" 
        component={ChangeJuzzScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default JuzzNavigator;
