// src/modules/dua/store/duaStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DuaData, TasbihData } from '../services/duaService';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';

// Define the shape of our store
interface DuaStore {
  // Dua data
  duaCategories: Record<string, Record<string, DuaData[]>>;
  duaSubCategories: Record<string, DuaData[]>;
  allDuas: DuaData[];
  savedDuas: Record<number, boolean>;
  
  // Tasbih data
  tasbihCategories: Record<string, TasbihData[]>;
  allTasbihs: TasbihData[];
  
  // Actions
  setDuaCategories: (categories: Record<string, Record<string, DuaData[]>>) => void;
  setDuaSubCategories: (subCategories: Record<string, DuaData[]>) => void;
  setAllDuas: (duas: DuaData[]) => void;
  setTasbihCategories: (categories: Record<string, TasbihData[]>) => void;
  setAllTasbihs: (tasbihs: TasbihData[]) => void;
  toggleSavedDua: (duaId: number) => void;
  isDuaSaved: (duaId: number) => boolean;
  getSavedDuas: () => DuaData[];
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
      tasbihCategories: {},
      allTasbihs: [],
      
      // Actions
      setDuaCategories: (categories) => set({ duaCategories: categories }),
      setDuaSubCategories: (subCategories) => set({ duaSubCategories: subCategories }),
      setAllDuas: (duas) => set({ allDuas: duas }),
      setTasbihCategories: (categories) => set({ tasbihCategories: categories }),
      setAllTasbihs: (tasbihs) => set({ allTasbihs: tasbihs }),
      
      // Toggle a dua's saved status
      toggleSavedDua: (duaId) => set((state) => {
        const savedDuas = { ...state.savedDuas };
        savedDuas[duaId] = !savedDuas[duaId];
        
        // If it's false, remove it from the object to keep it clean
        if (!savedDuas[duaId]) {
          delete savedDuas[duaId];
        }
        
        return { savedDuas };
      }),
      
      // Check if a dua is saved
      isDuaSaved: (duaId) => !!get().savedDuas[duaId],
      
      // Get all saved duas
      getSavedDuas: () => {
        const { allDuas, savedDuas } = get();
        return allDuas.filter(dua => savedDuas[dua.id]);
      },
    }),
    {
      name: 'dua-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
