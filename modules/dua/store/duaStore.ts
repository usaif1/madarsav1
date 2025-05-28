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
  bookmarkedCategories: Record<string, boolean>; // Track which categories have bookmarked duas
  
  // Tasbih data
  tasbihCategories: Record<string, TasbihData[]>;
  allTasbihs: TasbihData[];
  
  // Actions
  setDuaCategories: (categories: Record<string, Record<string, DuaData[]>>) => void;
  setDuaSubCategories: (subCategories: Record<string, DuaData[]>) => void;
  setAllDuas: (duas: DuaData[]) => void;
  setTasbihCategories: (categories: Record<string, TasbihData[]>) => void;
  setAllTasbihs: (tasbihs: TasbihData[]) => void;
  toggleSavedDua: (duaId: number, category: string) => void;
  isDuaSaved: (duaId: number) => boolean;
  isCategoryBookmarked: (category: string) => boolean;
  getSavedDuas: () => DuaData[];
  getSavedCategories: () => string[];
  getBookmarkedDuasByCategory: (category: string) => DuaData[];
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
      tasbihCategories: {},
      allTasbihs: [],
      
      // Actions
      setDuaCategories: (categories) => set({ duaCategories: categories }),
      setDuaSubCategories: (subCategories) => set({ duaSubCategories: subCategories }),
      setAllDuas: (duas) => set({ allDuas: duas }),
      setTasbihCategories: (categories) => set({ tasbihCategories: categories }),
      setAllTasbihs: (tasbihs) => set({ allTasbihs: tasbihs }),
      
      // Toggle a dua's saved status and update category bookmark status
      toggleSavedDua: (duaId, category) => set((state) => {
        const savedDuas = { ...state.savedDuas };
        const bookmarkedCategories = { ...state.bookmarkedCategories };
        
        // Toggle the saved status
        savedDuas[duaId] = !savedDuas[duaId];
        
        // If it's false, remove it from the object to keep it clean
        if (!savedDuas[duaId]) {
          delete savedDuas[duaId];
          
          // Check if any other duas in this category are still bookmarked
          const categoryStillHasBookmarks = get().allDuas
            .filter(dua => dua.category === category && dua.id !== duaId)
            .some(dua => savedDuas[dua.id]);
          
          if (!categoryStillHasBookmarks) {
            delete bookmarkedCategories[category];
          }
        } else {
          // Mark the category as having bookmarks
          bookmarkedCategories[category] = true;
        }
        
        return { savedDuas, bookmarkedCategories };
      }),
      
      // Check if a dua is saved
      isDuaSaved: (duaId) => !!get().savedDuas[duaId],
      
      // Check if a category has any bookmarked duas
      isCategoryBookmarked: (category) => !!get().bookmarkedCategories[category],
      
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
      getBookmarkedDuasByCategory: (category) => {
        const { allDuas, savedDuas } = get();
        return allDuas.filter(dua => 
          dua.category === category && savedDuas[dua.id]
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
