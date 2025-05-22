// dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

// screens
import {Home} from '../screens';
import MaktabScreen from '@/modules/maktab/screens/MaktabScreen';
import {AllNames} from '@/modules/names/screens';
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
        component={MaktabScreen} 
        options={{
          tabBarLabel: 'Maktab',
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the maktab module
            navigation.navigate('maktab');
          },
        })}
      />
      <Tab.Screen 
        name="al-quran" 
        component={AllNames} 
        options={{
          tabBarLabel: 'Al-Quran',
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the 99 names module for now
            navigation.navigate('names');
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigator;
