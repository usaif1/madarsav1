// modules/hadith/navigation/hadith.navigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

// Import your new screens
import HadithsListScreen from '../screens/HadithsListScreen';
import HadithInfoScreen from '../screens/HadithInfoScreen';
import HadithDetailScreen from '../screens/HadithDetailScreen';
import HadithChaptersScreen from '../screens/HadithChaptersScreen';

import { BackButton, Header } from '@/components';

const HadithNavigator = createNativeStackNavigator({
  screenOptions: {
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    headerLeft: () => <BackButton />,
    headerShadowVisible: false,
  },
  screens: {
    hadithsList: {
      screen: HadithsListScreen,
      options: {
        title: 'Hadiths',
        headerShown: true,
        headerTitleAlign: 'center',
        header: () => <Header title="Hadith" />,
      },
    },
    hadithInfo: {
      screen: HadithInfoScreen,
      options: {
        header: () => <Header title="Hadith details" />,
        headerTitleAlign: 'center',
      },
    },
    hadithDetail: {
      screen: HadithDetailScreen,
      options: {
        header: () => <Header title="Hadith Info" />,
        headerTitleAlign: 'center',
      },
    },
    hadithChapters: {
      screen: HadithChaptersScreen,
      options: {
        header: () => <Header title="Chapters" />,
        headerTitleAlign: 'center',
      },
    },
  },
});

export default HadithNavigator;