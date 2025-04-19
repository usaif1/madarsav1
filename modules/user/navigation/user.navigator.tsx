// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Profile, ProfileDetails} from '../screens';

// components
import {BackButton, LogoutButton} from '@/components';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
    // headerShown: false,
    headerStyle: {
      backgroundColor: '#411B7F',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    headerLeft: BackButton,
    headerShadowVisible: false,
  },
  screens: {
    profile: {
      screen: Profile,
      options: {
        title: 'Profile',
        headerRight: LogoutButton,
      },
    },
    profileDetails: {
      screen: ProfileDetails,
      options: {
        title: 'Profile details',
      },
    },
  },
});

export default SplashStack;
