// dependencies
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';
import { useAuthStore } from '@/modules/auth/store/authStore';

// screens
import {Profile, ProfileDetails, ProfileNotLoggedIn, PrivacyPolicy, TermsAndConditions} from '../screens';

// components
import {BackButton, Header, LogoutButton} from '@/components';

// Define the user stack param list for type safety
export type UserStackParamList = {
  profileNotLoggedIn: undefined;
  profile: undefined;
  profileDetails: undefined;
  privacyPolicy: undefined;
  termsAndConditions: undefined;
};

// Create the navigator
const Stack = createNativeStackNavigator<UserStackParamList>();

// Define the navigator component
const UserNavigator = () => {
  const {user} = useAuthStore();
  
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
              
            <Header title="Profile" RightButton={() => {
              if(user){
                return <LogoutButton />
              }
              return null}} />
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
      <Stack.Screen 
        name="privacyPolicy" 
        component={PrivacyPolicy}
        options={{
          title: 'Privacy Policy',
          header: () => <Header title="Privacy Policy" />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen 
        name="termsAndConditions" 
        component={TermsAndConditions}
        options={{
          title: 'Terms and Conditions',
          header: () => <Header title="Terms and Conditions" />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
