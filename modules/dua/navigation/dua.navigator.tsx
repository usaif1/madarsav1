// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Duas} from '../screens';
import DuaDetail from '../screens/DuaDetail';
import DuaContent from '../screens/DuaContent';
import SavedDuas from '../screens/SavedDuas';

// components
import {Header, ShareButton} from '@/components';

const DuaNavigator = createNativeStackNavigator({
  screenOptions: {
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',

    headerShadowVisible: false,
  },
  screens: {
    dua: {
      screen: Duas,
      options: {
        header: () => (
          <Header title="Duas"/>
        ),
      },
    },
    DuaDetail: {
      screen: DuaDetail,
      options: {
        headerShown: false,
      },
    },
    DuaContent: {
      screen: DuaContent,
      options: {
        headerShown: false,
      },
    },
    SavedDuas: {
      screen: SavedDuas,
      options: {
        headerShown: false,
      },
    },
  },
});

export default DuaNavigator;
