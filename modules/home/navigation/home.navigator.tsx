// dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';

// screens
import {Home} from '../screens';

// Placeholder screens
const PlaceholderScreen = () => <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Placeholder</Text></View>;

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
        component={PlaceholderScreen} 
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
        component={PlaceholderScreen} 
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
