// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {NinetyNineNames, Duas} from '../screens';

// components
import {BackButton} from '@/components';

const IslamicToolsStack = createNativeStackNavigator({
  initialRouteName: 'dua',
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
    ninetyninenames: {
      screen: NinetyNineNames,
      options: {
        title: '99 Names of Allah',
      },
    },
    dua: {
      screen: Duas,
      options: {
        title: 'Duas',
      },
    },
  },
});

export default IslamicToolsStack;
