// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {AllNames} from '../screens';

// components
import {Header} from '@/components';

const SplashStack = createNativeStackNavigator({
  screenOptions: {
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    // headerShadowVisible: false,
  },
  screens: {
    allnames: {
      screen: AllNames,
      options: {
        title: '99 Names of Allah',
        header: () => <Header title="99 Names of Allah" />,
      },
    },
  },
});

export default SplashStack;
