// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text, View} from 'react-native';

// components
import HomeHeader from '@/modules/home/components/HomeHeader';

// Import only the screens we know exist
import HadithsListScreen from '@/modules/hadith/screens/HadithsListScreen';

// auth guards
import { createProtectedScreen, createFullyProtectedScreen } from '@/modules/auth/utils/routeGuards';

// Create placeholder screens for modules that we don't have direct access to
const HomeScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Home Screen</Text>
  </View>
);

const UserScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>User Profile Screen</Text>
  </View>
);

const NamesOfAllahScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>99 Names of Allah Screen</Text>
  </View>
);

const CompassScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Qibla Compass Screen</Text>
  </View>
);

const DuaScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Dua Screen</Text>
  </View>
);

const CalendarScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Islamic Calendar Screen</Text>
  </View>
);

const TasbihScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Tasbih Counter Screen</Text>
  </View>
);

// Protected screens
const ProtectedUserScreen = createFullyProtectedScreen(UserScreen);

// Define the parent stack param list for type safety
export type ParentStackParamList = {
  home: undefined;
  names: undefined;
  user: undefined;
  compass: undefined;
  dua: undefined;
  calendar: undefined;
  tasbih: undefined;
  hadith: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<ParentStackParamList>();

// Define the navigator component
const ParentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="home" 
        component={HomeScreen}
        options={{
          headerShown: true,
          header: () => <HomeHeader userName="Mohammad Arbaaz" locationText="Get accurate namaz time" notificationCount={1} />
        }}
      />
      <Stack.Screen 
        name="names" 
        component={NamesOfAllahScreen} 
      />
      <Stack.Screen 
        name="user" 
        component={ProtectedUserScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="compass" 
        component={CompassScreen} 
      />
      <Stack.Screen 
        name="dua" 
        component={DuaScreen} 
      />
      <Stack.Screen 
        name="calendar" 
        component={CalendarScreen} 
      />
      <Stack.Screen 
        name="tasbih" 
        component={TasbihScreen} 
      />
      <Stack.Screen 
        name="hadith" 
        component={HadithsListScreen} 
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
