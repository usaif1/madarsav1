// modules/hadith/store/hadithStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Define interfaces for hadith data
export interface HadithContent {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  urn: number;
  body: string;
  grades: {
    graded_by: string | null;
    grade: string;
  }[];
}

export interface HadithChapter {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: HadithContent[];
}

// Define the shape of our store
interface HadithStore {
  // Hadith data
  savedHadiths: Record<string, boolean>; // Using hadithNumber as key
  bookmarkedCollections: Record<string, boolean>; // Track which collections have bookmarked hadiths
  hadithData: Record<string, HadithChapter>; // Store the full hadith objects
  
  // Actions
  toggleSavedHadith: (hadith: HadithChapter) => void;
  isHadithSaved: (hadithNumber: string, collection: string) => boolean;
  isCollectionBookmarked: (collection: string) => boolean;
  getSavedHadiths: () => string[]; // Returns hadithNumbers
  getSavedCollections: () => string[];
  getBookmarkedHadithsByCollection: (collection: string) => string[]; // Returns hadithNumbers
  getAllSavedHadiths: () => HadithChapter[]; // Returns full hadith objects
}

// Create the store
export const useHadithStore = create<HadithStore>()(
  persist(
    (set, get) => ({
      // Initial state
      savedHadiths: {},
      bookmarkedCollections: {},
      hadithData: {},
      
      // Actions
      toggleSavedHadith: (hadith: HadithChapter) => set((state) => {
        const savedHadiths = { ...state.savedHadiths };
        const bookmarkedCollections = { ...state.bookmarkedCollections };
        const hadithData = { ...state.hadithData };
        
        // Create a unique key for the hadith
        const hadithKey = `${hadith.collection}_${hadith.hadithNumber}`;
        
        // Toggle the hadith's saved status
        savedHadiths[hadithKey] = !savedHadiths[hadithKey];
        
        if (!savedHadiths[hadithKey]) {
          // If we're unsaving a hadith
          delete savedHadiths[hadithKey];
          delete hadithData[hadithKey];
          
          // Check if the collection still has any bookmarked hadiths
          const collectionStillHasBookmarks = Object.keys(savedHadiths).some(key =>
            key.startsWith(`${hadith.collection}_`)
          );
          
          if (!collectionStillHasBookmarks) {
            delete bookmarkedCollections[hadith.collection];
          }
        } else {
          // If we're saving a hadith
          bookmarkedCollections[hadith.collection] = true;
          hadithData[hadithKey] = hadith;
        }
        
        return { savedHadiths, bookmarkedCollections, hadithData };
      }),
      
      // Check if a hadith is saved
      isHadithSaved: (hadithNumber: string, collection: string) => {
        const hadithKey = `${collection}_${hadithNumber}`;
        return !!get().savedHadiths[hadithKey];
      },
      
      // Check if a collection has any bookmarked hadiths
      isCollectionBookmarked: (collection: string) => {
        return !!get().bookmarkedCollections[collection];
      },
      
      // Get all saved hadiths
      getSavedHadiths: () => {
        return Object.keys(get().savedHadiths);
      },
      
      // Get all collections that have bookmarked hadiths
      getSavedCollections: () => {
        return Object.keys(get().bookmarkedCollections);
      },
      
      // Get all bookmarked hadiths for a specific collection
      getBookmarkedHadithsByCollection: (collection: string) => {
        const { savedHadiths } = get();
        return Object.keys(savedHadiths)
          .filter(key => key.startsWith(`${collection}_`))
          .map(key => key.split('_')[1]); // Extract hadithNumber
      },
      
      // Get all saved hadiths as full objects
      getAllSavedHadiths: () => {
        const { hadithData } = get();
        return Object.values(hadithData);
      },
    }),
    {
      name: 'hadith-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Include user ID in the state to separate storage by user
      onRehydrateStorage: () => (_state) => {
        // Update the state with the current user ID
        const user = useAuthStore.getState().user;
        console.log('Rehydrating hadith store for user:', user?.email || user?.id || 'guest');
      }
    }
  )
);