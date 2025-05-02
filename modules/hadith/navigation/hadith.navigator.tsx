// dependencies
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

// screens
import {HadithsList,HadithChaptersList,HadithInfo,HadithComplete} from '../screens';

// components
import {BackButton, Header} from '@/components';

const HadithNavigator = createNativeStackNavigator({
  screenOptions: {
    presentation: Platform.OS === 'android' ? 'transparentModal' : 'card',
    headerLeft: () => <BackButton />,
    headerShadowVisible: false,
  },
  screens: {
    hadithsList: {
      screen: HadithsList,
      options: {
        title: 'Hadiths',
        headerShown: true,
        headerTitleAlign: 'center',
        header: () => (
          <Header title="Hadith"/>
        ),
      },
    },
    hadithChaptersList: {
      screen: HadithChaptersList,
      options: {
        header: () => (
          <Header title="Chapters" />
        ),
      },
    },
    hadithInfo: {
      screen: HadithInfo,
      options: {
        title: 'Hadith details',
        header: () => <Header title="Hadith details" />,
        headerTitleAlign: 'center',
      },
    },
    hadithComplete: {
      screen: HadithComplete,
      options: {
        title: 'Hadith details',
        header: () => <Header title="Hadith details" />,
        headerTitleAlign: 'center',
      },
    },
  },
});

export default HadithNavigator;
