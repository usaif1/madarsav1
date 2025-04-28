// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// navigators
import UserNavigator from '@/modules/user/navigation/user.navigator';
import HomeNavigator from '@/modules/home/navigation/home.navigator';
import NamesNavigator from '@/modules/names/navigation/names.navigator';
import CompassNavigator from '@/modules/compass/navigation/compass.navigator';
import DuaNavigator from '@/modules/dua/navigation/dua.navigator';
import CalendarNavigator from '@/modules/calendar/navigation/calendar.navigator';
import TasbihNavigator from '@/modules/tasbih/navigation/tasbih.navigator';

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
    dua: DuaNavigator,
    calendar: CalendarNavigator,
    tasbih: TasbihNavigator,
  },
});

export default ParentNavigator;
