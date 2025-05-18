// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {SplashScreen1, SplashScreen2} from '../screens';

// Define the splash stack param list for type safety
export type SplashStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
};

const SplashStack = createNativeStackNavigator<SplashStackParamList>({
  screenOptions: {
    headerShown: false,
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
  },
  screens: {
    SplashScreen1: SplashScreen1,
    SplashScreen2: SplashScreen2,
  },
});

export default SplashStack;
