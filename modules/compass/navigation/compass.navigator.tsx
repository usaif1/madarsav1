// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Compass} from '../screens';

// components
import {BackButton, Header, ShareButton} from '@/components';

const CompassNavigator = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: '#411B7F',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    headerLeft: () => <BackButton />,
    headerShadowVisible: false,
  },
  screens: {
    allnames: {
      screen: Compass,
      options: {
        header: () => (
          <Header title="Qiblah Finder" RightButton={() => <ShareButton />} />
        ),
      },
    },
  },
});

export default CompassNavigator;
