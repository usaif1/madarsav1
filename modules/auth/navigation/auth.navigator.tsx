// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {SplashScreen1, SplashScreen2} from '@/modules/splash/screens';

// Define the auth stack param list for type safety
export type AuthStackParamList = {
  SplashScreen1: undefined;
  SplashScreen2: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>({
  initialRouteName: 'SplashScreen1',
  screenOptions: {
    headerShown: false,
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
  },
  screens: {
    SplashScreen1: SplashScreen1,
    SplashScreen2: SplashScreen2,
  },
});

export default AuthStack;
