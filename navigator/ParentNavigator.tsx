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
import MaktabNavigator from '@/modules/maktab/navigation/maktab.navigator';
import QuranNavigator from '@/modules/quran/navigation/quran.navigator';

// Import global context
import { QuranNavigationProvider } from '@/modules/quran/context/QuranNavigationContext';

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
  quran: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<ParentStackParamList>();
const NamesNavigatorComponent = createComponentForStaticNavigation(NamesNavigator,"NamesNavigator");
const CompassNavigatorComponent = createComponentForStaticNavigation(CompassNavigator,"CompassNavigator");
const DuaNavigatorComponent = createComponentForStaticNavigation(DuaNavigator,"DuaNavigator");
const CalendarNavigatorComponent = createComponentForStaticNavigation(CalendarNavigator,"CalendarNavigator");
const TasbihNavigatorComponent = createComponentForStaticNavigation(TasbihNavigator,"TasbihNavigator");
const HadithNavigatorComponent = createComponentForStaticNavigation(HadithNavigator,"HadithNavigator");
// QuranNavigator is a function component, so we don't need to use createComponentForStaticNavigation


// Define the navigator component
const ParentNavigator = () => {
  return (
    <QuranNavigationProvider>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="home" 
          component={HomeNavigator}
        />
        <Stack.Screen 
          name="names" 
          component={NamesNavigatorComponent} 
        />
        <Stack.Screen 
          name="user" 
          component={UserNavigator}
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
        <Stack.Screen 
          name="quran" 
          component={QuranNavigator} 
        />
      </Stack.Navigator>
    </QuranNavigationProvider>
  );
};

export default ParentNavigator;
