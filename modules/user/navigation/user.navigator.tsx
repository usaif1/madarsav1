// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {Profile, ProfileDetails} from '../screens';

// components
import {BackButton, Header, LogoutButton} from '@/components';

const UserNavigator = createNativeStackNavigator({
  screenOptions: {
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    headerLeft: () => <BackButton />,
    headerShadowVisible: false,
  },
  screens: {
    profile: {
      screen: Profile,
      options: {
        header: () => (
          <Header title="Profile" RightButton={() => <LogoutButton />} />
        ),
      },
    },
    profileDetails: {
      screen: ProfileDetails,
      options: {
        title: 'Profile details',
        header: () => <Header title="Profile details" />,
        headerTitleAlign: 'center',
      },
    },
  },
});

export default UserNavigator;
