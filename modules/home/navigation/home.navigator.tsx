// dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// screens
import {Home} from '../screens';

// components
import CustomTabBar from '../components/CustomTabBar';

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
        }}
      />
      <Tab.Screen 
        name="maktab" 
        component={Home} 
        options={{
          tabBarLabel: 'Maktab',
        }}
      />
      <Tab.Screen 
        name="al-quran" 
        component={Home} 
        options={{
          tabBarLabel: 'Al-Quran',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
