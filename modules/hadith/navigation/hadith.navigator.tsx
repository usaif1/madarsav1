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
      options: ({ route }: { route: any }) => ({
        header: () => <Header title={route.params?.hadithTitle || 'Hadith Info'} />,
        headerTitleAlign: 'center',
      }),
    },
    hadithDetail: {
      screen: HadithDetailScreen,
      options: ({ route }: { route: any }) => ({
        header: () => <Header title={route.params?.hadithTitle || 'Hadith Detail'} />,
        headerTitleAlign: 'center',
      }),
    },
    hadithChapters: {
      screen: HadithChaptersScreen,
      options: ({ route }: { route: any }) => ({
        header: () => <Header title={route.params?.chapterTitle || route.params?.hadithTitle || 'Chapters'} />,
        headerTitleAlign: 'center',
      }),
    },
  },
});

export default HadithNavigator;