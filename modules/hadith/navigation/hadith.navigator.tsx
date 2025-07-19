// modules/hadith/navigation/hadith.navigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

// Import your new screens
import HadithsListScreen from '../screens/HadithsListScreen';
import HadithInfoScreen from '../screens/HadithInfoScreen';
import HadithDetailScreen from '../screens/HadithDetailScreen';
import HadithChaptersScreen from '../screens/HadithChaptersScreen';
import SavedHadiths from '../screens/SavedHadiths';

import { BackButton, Header } from '@/components';

/**
 * Utility function to truncate title based on word count or character limit
 * @param title - The original title string
 * @param maxWords - Maximum number of words (default: 3)
 * @param maxChars - Maximum number of characters (default: 12)
 * @returns Truncated title with ellipsis if needed
 */
const truncateTitle = (title: string, maxWords: number = 3, maxChars: number = 20): string => {
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Remove extra whitespace and trim
  const cleanTitle = title.trim();
  
  if (cleanTitle.length === 0) {
    return '';
  }

  // Check character limit first
  if (cleanTitle.length <= maxChars) {
    return cleanTitle;
  }

  // Split into words and check word limit
  const words = cleanTitle.split(/\s+/);
  
  if (words.length <= maxWords) {
    // If word count is within limit but character count exceeds, truncate by characters
    if (cleanTitle.length > maxChars) {
      return cleanTitle.substring(0, maxChars).trim() + '...';
    }
    return cleanTitle;
  }

  // Truncate by words first
  const truncatedByWords = words.slice(0, maxWords).join(' ');
  
  // Check if word-truncated title still exceeds character limit
  if (truncatedByWords.length > maxChars) {
    return truncatedByWords.substring(0, maxChars).trim() + '...';
  }
  
  return truncatedByWords + '...';
};

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
      options: ({ route }: { route: any }) => {
        const originalTitle = route.params?.hadithTitle || 'Hadith Info';
        const truncatedTitle = truncateTitle(originalTitle, 3, 24);
        
        return {
          header: () => <Header title={truncatedTitle} />,
          headerTitleAlign: 'center',
        };
      },
    },
    hadithDetail: {
      screen: HadithDetailScreen,
      options: ({ route }: { route: any }) => {
        const originalTitle = route.params?.hadithTitle || 'Hadith Detail';
        const truncatedTitle = truncateTitle(originalTitle, 3, 24);
        
        return {
          header: () => <Header title={truncatedTitle} />,
          headerTitleAlign: 'center',
        };
      },
    },
    hadithChapters: {
      screen: HadithChaptersScreen,
      options: ({ route }: { route: any }) => {
        const originalTitle = route.params?.chapterTitle || route.params?.hadithTitle || 'Chapters';
        const truncatedTitle = truncateTitle(originalTitle, 3, 24);
        
        return {
          header: () => <Header title={truncatedTitle} />,
          headerTitleAlign: 'center',
        };
      },
    },
    savedHadiths: {
      screen: SavedHadiths,
      options: {
        title: 'Saved Hadiths',
        headerShown: true,
        headerTitleAlign: 'center',
        header: () => <Header title="Saved Hadiths" />,
      },
    },
  },
});

export default HadithNavigator;