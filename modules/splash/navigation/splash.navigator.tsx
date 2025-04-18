// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import {SplashScreen1, SplashScreen2, SplashScreen3} from '../screens';
import {Platform} from 'react-native';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
  },
  screens: {
    screen1: SplashScreen1,
    screen2: SplashScreen2,
    screen3: SplashScreen3
  },
});

export default SplashStack;
