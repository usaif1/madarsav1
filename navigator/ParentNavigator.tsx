// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

// components
import HomeHeader from '@/modules/home/components/HomeHeader';

// navigators
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

const ParentNavigator = createNativeStackNavigator<ParentStackParamList>({
  initialRouteName: 'home',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    home: {
      screen: HomeNavigator,
      options: {
        headerShown: true,
        header: () => <HomeHeader userName="Mohammad Arbaaz" locationText="Get accurate namaz time" notificationCount={1} />
      },
    },
    names: NamesNavigator,
    user: {
      // Use protected navigator for user profile (requires full authentication)
      screen: ProtectedUserNavigator,
      options: {
        title: 'Profile',
        headerTitleAlign: 'center',
      },
    },
    compass: CompassNavigator,
    dua: DuaNavigator,
    calendar: CalendarNavigator,
    tasbih: TasbihNavigator,
    hadith: HadithNavigator,
  },
});

export default ParentNavigator;
