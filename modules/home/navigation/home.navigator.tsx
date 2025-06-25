// dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

// screens
import {Home} from '../screens';
import MaktabScreen from '@/modules/maktab/screens/MaktabScreen';
import QuranNavigator from '@/modules/quran/navigation/quran.navigator';
// components
import CustomTabBar from '../components/CustomTabBar';
import HomeHeader from '../components/HomeHeader';
import QuranHeader from '@/modules/quran/components/QuranHeader';

const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
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
          headerShown: true,
          header: () => <QuranHeader />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
