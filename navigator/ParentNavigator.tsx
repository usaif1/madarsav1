// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

// components
import HomeHeader from '@/modules/home/components/HomeHeader';

// Import navigators
import UserNavigator from '@/modules/user/navigation/user.navigator';
import HomeNavigator from '@/modules/home/navigation/home.navigator';
import NamesNavigator from '@/modules/names/navigation/names.navigator';
import CompassNavigator from '@/modules/compass/navigation/compass.navigator';
import DuaNavigator from '@/modules/dua/navigation/dua.navigator';
import CalendarNavigator from '@/modules/calendar/navigation/calendar.navigator';
import TasbihNavigator from '@/modules/tasbih/navigation/tasbih.navigator';
import HadithNavigator from '@/modules/hadith/navigation/hadith.navigator';

// auth guards
import { createProtectedScreen, createFullyProtectedScreen } from '@/modules/auth/utils/routeGuards';
import { createComponentForStaticNavigation } from '@react-navigation/native';

// Protected navigators
const ProtectedUserNavigator = createFullyProtectedScreen(UserNavigator);

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
const NamesNavigatorComponent = createComponentForStaticNavigation(NamesNavigator,"NamesNavigator");
const CompassNavigatorComponent = createComponentForStaticNavigation(CompassNavigator,"CompassNavigator");
const DuaNavigatorComponent = createComponentForStaticNavigation(DuaNavigator,"DuaNavigator");
const CalendarNavigatorComponent = createComponentForStaticNavigation(CalendarNavigator,"CalendarNavigator");
const TasbihNavigatorComponent = createComponentForStaticNavigation(TasbihNavigator,"TasbihNavigator");
const HadithNavigatorComponent = createComponentForStaticNavigation(HadithNavigator,"HadithNavigator");


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
        component={HomeNavigator}
        options={{
          headerShown: true,
          header: () => <HomeHeader userName="Mohammad Arbaaz" locationText="Get accurate namaz time" notificationCount={1} />
        }}
      />
      <Stack.Screen 
        name="names" 
        component={NamesNavigatorComponent} 
      />
      <Stack.Screen 
        name="user" 
        component={ProtectedUserNavigator}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="compass" 
        component={CompassNavigatorComponent} 
      />
      <Stack.Screen 
        name="dua" 
        component={DuaNavigatorComponent} 
      />
      <Stack.Screen 
        name="calendar" 
        component={CalendarNavigatorComponent} 
      />
      <Stack.Screen 
        name="tasbih" 
        component={TasbihNavigatorComponent} 
      />
      <Stack.Screen 
        name="hadith" 
        component={HadithNavigatorComponent} 
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
