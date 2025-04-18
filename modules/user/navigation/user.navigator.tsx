// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Profile} from '../screens';

// components
import {BackButton, LogoutButton} from '@/components';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
    // headerShown: false,
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
  },
  screens: {
    profile: {
      screen: Profile,
      options: {
        title: 'Profile',
        headerTitleStyle: {
          color: '#FFFFFF',
        },
        headerRight: LogoutButton,
        headerLeft: BackButton,
        headerShadowVisible: false,
        // statusBarStyle: 'light',
        headerStyle: {
          backgroundColor: '#411B7F',
        },
      },
    },
  },
});

export default SplashStack;
