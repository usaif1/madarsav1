// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import {SplashScreen1, SplashScreen2} from '../screens';
import {Platform} from 'react-native';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
  },
  screens: {
    screen1: SplashScreen1,
    screen2: SplashScreen2,
  },
});

export default SplashStack;
