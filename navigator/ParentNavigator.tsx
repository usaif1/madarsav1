// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// navigators
import IslamicToolsNavigator from '@/modules/islamictools/navigation/islamictools.navigator';
import SplashNavigator from '@/modules/splash/navigation/splash.navigator';
import UserNavigator from '@/modules/user/navigation/user.navigator';
import HomeNavigator from '@/modules/home/navigation/home.navigator';
import NamesNavigator from '@/modules/names/navigation/names.navigator';

const ParentNavigator = createNativeStackNavigator({
  initialRouteName: 'home',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    home: {
      screen: HomeNavigator,
      options: {
        headerShown: true,
      },
    },
    names: NamesNavigator,
  },
});

export default ParentNavigator;
