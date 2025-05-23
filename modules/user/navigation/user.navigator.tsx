// dependencies
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Profile, ProfileDetails, ProfileNotLoggedIn} from '../screens';

// components
import {BackButton, Header, LogoutButton} from '@/components';

// Define the user stack param list for type safety
export type UserStackParamList = {
  profileNotLoggedIn: undefined;
  profile: undefined;
  profileDetails: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<UserStackParamList>();

// Define the navigator component
const UserNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="profileNotLoggedIn"
      screenOptions={{
        presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
        headerLeft: () => <BackButton />,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="profileNotLoggedIn" 
        component={ProfileNotLoggedIn}
        options={{
          title: 'Profile',
          headerShown: true,
          headerTitleAlign: 'center',
          header: () => (
            <Header title="Profile" RightButton={() => <LogoutButton />} />
          ),
        }}
      />
      <Stack.Screen 
        name="profile" 
        component={Profile}
        options={{
          header: () => (
            <Header title="Profile" RightButton={() => <LogoutButton />} />
          ),
        }}
      />
      <Stack.Screen 
        name="profileDetails" 
        component={ProfileDetails}
        options={{
          title: 'Profile details',
          header: () => <Header title="Profile details" />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
