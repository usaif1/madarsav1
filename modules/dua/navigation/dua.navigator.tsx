// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Duas} from '../screens';

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
          <Header title="Duas" RightButton={() => <ShareButton />} />
        ),
      },
    },
  },
});

export default DuaNavigator;
