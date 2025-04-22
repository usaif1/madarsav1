// dependencies
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// screens
import {Home} from '../screens';
// import {Platform} from 'react-native';

const HomeNavigator = createBottomTabNavigator({
  initialRouteName: 'home',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    home: {
      screen: Home,
    },
  },
});

export default HomeNavigator;
