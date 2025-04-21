// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {AllNames} from '../screens';

// components
import {BackButton} from '@/components';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
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
    allnames: {
      screen: AllNames,
      options: {
        title: '99 Names of Allah',
      },
    },
  },
});

export default SplashStack;
