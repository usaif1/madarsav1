// src/modules/dua/store/duaStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DuaData, TasbihData } from '../services/duaService';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Define the shape of our store
interface DuaStore {
  // Dua data
  duaCategories: Record<string, Record<string, DuaData[]>>;
  duaSubCategories: Record<string, DuaData[]>;
  allDuas: DuaData[];
  savedDuas: Record<number, boolean>;
  bookmarkedCategories: Record<string, boolean>;
  bookmarkedSubCategories: Record<string, boolean>; // Track which categories have bookmarked duas
  
  // Tasbih data
  tasbihCategories: Record<string, TasbihData[]>;
  allTasbihs: TasbihData[];
  
  // Actions
  setDuaCategories: (categories: Record<string, Record<string, DuaData[]>>) => void;
  setDuaSubCategories: (subCategories: Record<string, DuaData[]>) => void;
  setAllDuas: (duas: DuaData[]) => void;
  setTasbihCategories: (categories: Record<string, TasbihData[]>) => void;
  setAllTasbihs: (tasbihs: TasbihData[]) => void;
  toggleSavedDua: (duaId: number, category: string, subCategory?: string) => void;
  isDuaSaved: (duaId: number) => boolean;
  isCategoryBookmarked: (category: string) => boolean;
  isSubCategoryBookmarked: (subCategory: string) => boolean;
  getSavedDuas: () => DuaData[];
  getSavedCategories: () => string[];
  getBookmarkedDuasByCategory: (category: string) => DuaData[];
  getBookmarkedSubCategoriesByCategory: (category: string) => string[];
  getBookmarkedDuasBySubCategory: (category: string, subCategory: string) => DuaData[];
}

// Create the store
export const useDuaStore = create<DuaStore>()(
  persist(
    (set, get) => ({
      // Initial state
      duaCategories: {},
      duaSubCategories: {},
      allDuas: [],
      savedDuas: {},
      bookmarkedCategories: {},
      bookmarkedSubCategories: {},
      tasbihCategories: {},
      allTasbihs: [],
      
      // Actions
      setDuaCategories: (categories) => set({ duaCategories: categories }),
      setDuaSubCategories: (subCategories) => set({ duaSubCategories: subCategories }),
      setAllDuas: (duas) => set({ allDuas: duas }),
      setTasbihCategories: (categories) => set({ tasbihCategories: categories }),
      setAllTasbihs: (tasbihs) => set({ allTasbihs: tasbihs }),
      
      // Toggle a dua's saved status and update category and subcategory bookmark status
      toggleSavedDua: (duaId: number, category: string, subCategory?: string) => set((state) => {
        const savedDuas = { ...state.savedDuas };
        const bookmarkedCategories = { ...state.bookmarkedCategories };
        const bookmarkedSubCategories = { ...state.bookmarkedSubCategories };
        
        // Toggle the dua's saved status
        savedDuas[duaId] = !savedDuas[duaId];
        
        if (!savedDuas[duaId]) {
          // If we're unsaving a dua
          delete savedDuas[duaId];
          
          // Check if the category still has any bookmarked duas
          const categoryStillHasBookmarks = get().allDuas
            .filter(dua => dua.category === category && dua.id !== duaId)
            .some(dua => savedDuas[dua.id]);
          
          if (!categoryStillHasBookmarks) {
            delete bookmarkedCategories[category];
          }
          
          // If a subcategory is provided, check if it still has bookmarks
          if (subCategory) {
            const subCategoryStillHasBookmarks = get().allDuas
              .filter(dua => dua.category === category && dua.subCategory === subCategory && dua.id !== duaId)
              .some(dua => savedDuas[dua.id]);
            
            if (!subCategoryStillHasBookmarks) {
              delete bookmarkedSubCategories[subCategory];
            }
          }
        } else {
          // If we're saving a dua
          bookmarkedCategories[category] = true;
          if (subCategory) {
            bookmarkedSubCategories[subCategory] = true;
          }
        }
        
        return { savedDuas, bookmarkedCategories, bookmarkedSubCategories };
      }),
      
      // Check if a dua is saved
      isDuaSaved: (duaId: number) => {
        return !!get().savedDuas[duaId];
      },
      
      // Check if a category has any bookmarked duas
      isCategoryBookmarked: (category: string) => {
        return !!get().bookmarkedCategories[category];
      },
      
      // Check if a subcategory has any bookmarked duas
      isSubCategoryBookmarked: (subCategory: string) => {
        return !!get().bookmarkedSubCategories[subCategory];
      },
      
      // Get all saved duas
      getSavedDuas: () => {
        const { allDuas, savedDuas } = get();
        return allDuas.filter(dua => savedDuas[dua.id]);
      },
      
      // Get all categories that have bookmarked duas
      getSavedCategories: () => {
        return Object.keys(get().bookmarkedCategories);
      },
      
      // Get all bookmarked duas for a specific category
      getBookmarkedDuasByCategory: (category: string) => {
        const { savedDuas, allDuas } = get();
        return allDuas.filter(dua => 
          dua.category === category && savedDuas[dua.id]
        );
      },
      
      // Get all bookmarked subcategories for a specific category
      getBookmarkedSubCategoriesByCategory: (category: string) => {
        const { bookmarkedSubCategories, allDuas } = get();
        // Get unique subcategories that have bookmarked duas
        const subcategories = allDuas
          .filter(dua => dua.category === category)
          .filter(dua => dua.subCategory && bookmarkedSubCategories[dua.subCategory])
          .map(dua => dua.subCategory)
          .filter((subCategory, index, self) => 
            subCategory && self.indexOf(subCategory) === index
          );
        return subcategories;
      },
      
      // Get all bookmarked duas for a specific subcategory
      getBookmarkedDuasBySubCategory: (category: string, subCategory: string) => {
        const { savedDuas, allDuas } = get();
        return allDuas.filter(dua => 
          dua.category === category && 
          dua.subCategory === subCategory && 
          savedDuas[dua.id]
        );
      },
    }),
    {
      name: 'dua-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Include user ID in the state to separate storage by user
      onRehydrateStorage: () => (state) => {
        // Update the state with the current user ID
        const user = useAuthStore.getState().user;
        console.log('Rehydrating dua store for user:', user?.email || user?.id || 'guest');
      }
    }
  )
);
