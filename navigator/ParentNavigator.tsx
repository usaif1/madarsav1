// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// navigators
import UserNavigator from '@/modules/user/navigation/user.navigator';
import HomeNavigator from '@/modules/home/navigation/home.navigator';
import NamesNavigator from '@/modules/names/navigation/names.navigator';
import CompassNavigator from '@/modules/compass/navigation/compass.navigator';

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
    user: {
      screen: UserNavigator,
      options: {
        title: 'Profile',
        headerTitleAlign: 'center',
      },
    },
    compass: CompassNavigator,
  },
});

export default ParentNavigator;
