// dependencies
import React, { useState, useEffect } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {View, Text} from 'react-native';

// screens
import {Home} from '../screens';
import MaktabScreen from '@/modules/maktab/screens/MaktabScreen';
import QuranNavigator from '@/modules/quran/navigation/quran.navigator';
// components
import ConditionalTabBar from '../components/ConditionalTabBar';
import HomeHeader from '../components/HomeHeader';
import QuranHeader from '@/modules/quran/components/QuranHeader';
import { useQuranNavigation } from '../../quran/context/QuranNavigationContext';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  const { showTopTabs } = useQuranNavigation();

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <ConditionalTabBar {...props} />}
    >
      <Tab.Screen 
        name="home" 
        component={Home} 
        options={{
          tabBarLabel: 'Home',
          headerShown: true,
          header: () => <HomeHeader locationText="Get accurate namaz time" notificationCount={1} />,
        }}
      />
      <Tab.Screen 
        name="maktab" 
        component={MaktabScreen} 
        options={{
          tabBarLabel: 'Maktab',
          headerShown: true,
          header: () => <HomeHeader locationText="Get accurate namaz time" notificationCount={1} />,
        }}
      />
      <Tab.Screen 
        name="al-quran" 
        component={QuranNavigator} 
        options={{
          tabBarLabel: 'Al-Quran',
          headerShown: showTopTabs, // Conditionally show QuranHeader
          header: () => <QuranHeader />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
