import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';

// Types for saved items
export interface SavedSurah {
  id: number;
  name: string;
  arabicName: string;
  translation: string;
  type: 'meccan' | 'medinan';
  ayahCount: number;
  progress?: number;
  savedAt: string;
}

export interface SavedJuzz {
  id: number;
  name: string;
  surahRange: string;
  ayahCount: number;
  progress?: number;
  savedAt: string;
}

export interface SavedAyah {
  id: string; // unique identifier combining surah and ayah
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  transliteration: string;
  savedAt: string;
}

// Reciter information
export interface Reciter {
  id: number;
  name: string;
  arabicName: string;
  style: string;
}

// Settings type
export interface QuranSettings {
  selectedFont: number;
  selectedReciterId: number;
  reciterName: string;
  reciterArabicName: string;
  transliterationEnabled: boolean;
  autoPlayNext: boolean;
  audioQuality: 'high' | 'medium' | 'low';
}

interface QuranStore {
  // Saved items
  savedSurahs: SavedSurah[];
  savedJuzz: SavedJuzz[];
  savedAyahs: SavedAyah[];
  
  // Available reciters
  availableReciters: Reciter[];
  
  // Settings
  settings: QuranSettings;
  
  // Actions for Surahs
  saveSurah: (surah: Omit<SavedSurah, 'savedAt'>) => void;
  removeSurah: (surahId: number) => void;
  isSurahSaved: (surahId: number) => boolean;
  
  // Actions for Juzz
  saveJuzz: (juzz: Omit<SavedJuzz, 'savedAt'>) => void;
  removeJuzz: (juzzId: number) => void;
  isJuzzSaved: (juzzId: number) => boolean;
  
  // Actions for Ayahs
  saveAyah: (ayah: Omit<SavedAyah, 'savedAt'>) => void;
  removeAyah: (ayahId: string) => void;
  isAyahSaved: (ayahId: string) => boolean;
  
  // Reciter actions
  setAvailableReciters: (reciters: Reciter[]) => void;
  setSelectedReciter: (reciterId: number) => void;
  getCurrentReciter: () => Reciter | null;
  
  // Settings actions
  updateSettings: (settings: Partial<QuranSettings>) => void;
  getSettings: () => QuranSettings;
  
  // Getters
  getSavedSurahsCount: () => number;
  getSavedJuzzCount: () => number;
  getSavedAyahsCount: () => number;
  
  // Clear all
  clearAllSaved: () => void;
}

// Default reciters list (can be updated from API)
const defaultReciters: Reciter[] = [
  {
    id: 7,
    name: 'Mishari Rashid al-`Afasy',
    arabicName: 'مشاري بن راشد العفاسي',
    style: 'Warsh'
  },
  {
    id: 1,
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'Hafs'
  },
  {
    id: 2,
    name: 'Saad Al-Ghamidi',
    arabicName: 'سعد الغامدي',
    style: 'Hafs'
  },
  {
    id: 3,
    name: 'Abu Bakr al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    style: 'Hafs'
  },
  {
    id: 4,
    name: 'Hani ar-Rifai',
    arabicName: 'هاني الرفاعي',
    style: 'Hafs'
  }
];

// Default settings
const defaultSettings: QuranSettings = {
  selectedFont: 1,
  selectedReciterId: 7, // Default to Mishari Rashid al-`Afasy
  reciterName: 'Mishari Rashid al-`Afasy',
  reciterArabicName: 'مشاري بن راشد العفاسي',
  transliterationEnabled: true,
  autoPlayNext: true,
  audioQuality: 'high',
};

export const useQuranStore = create<QuranStore>()(
  persist(
    (set, get) => ({
      // Initial state with some sample data for testing
      savedSurahs: [
        {
          id: 1,
          name: 'Al-Fatiah',
          arabicName: 'الفاتحة',
          translation: 'The Opening',
          type: 'meccan',
          ayahCount: 7,
          progress: 100,
          savedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Al-Baqarah',
          arabicName: 'البقرة',
          translation: 'The Cow',
          type: 'medinan',
          ayahCount: 286,
          progress: 45,
          savedAt: new Date().toISOString(),
        },
      ],
      savedJuzz: [
        {
          id: 1,
          name: 'Juzz 1',
          surahRange: 'Al-Fatiah - Al-Baqarah',
          ayahCount: 293,
          progress: 30,
          savedAt: new Date().toISOString(),
        },
      ],
      savedAyahs: [
        {
          id: '1-1',
          surahId: 1,
          surahName: 'Al-Fatiah',
          ayahNumber: 1,
          arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
          translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          transliteration: 'Bismillaahir Rahmaanir Raheem',
          savedAt: new Date().toISOString(),
        },
      ],
      
      // Initial reciters
      availableReciters: defaultReciters,
      
      // Initial settings
      settings: defaultSettings,
      
      // Surah actions
      saveSurah: (surah) => {
        const newSurah: SavedSurah = {
          ...surah,
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          savedSurahs: [...state.savedSurahs.filter(s => s.id !== surah.id), newSurah],
        }));
      },
      
      removeSurah: (surahId) => {
        set((state) => ({
          savedSurahs: state.savedSurahs.filter(s => s.id !== surahId),
        }));
      },
      
      isSurahSaved: (surahId) => {
        return get().savedSurahs.some(s => s.id === surahId);
      },
      
      // Juzz actions
      saveJuzz: (juzz) => {
        const newJuzz: SavedJuzz = {
          ...juzz,
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          savedJuzz: [...state.savedJuzz.filter(j => j.id !== juzz.id), newJuzz],
        }));
      },
      
      removeJuzz: (juzzId) => {
        set((state) => ({
          savedJuzz: state.savedJuzz.filter(j => j.id !== juzzId),
        }));
      },
      
      isJuzzSaved: (juzzId) => {
        return get().savedJuzz.some(j => j.id === juzzId);
      },
      
      // Ayah actions
      saveAyah: (ayah) => {
        const newAyah: SavedAyah = {
          ...ayah,
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          savedAyahs: [...state.savedAyahs.filter(a => a.id !== ayah.id), newAyah],
        }));
      },
      
      removeAyah: (ayahId) => {
        set((state) => ({
          savedAyahs: state.savedAyahs.filter(a => a.id !== ayahId),
        }));
      },
      
      isAyahSaved: (ayahId) => {
        return get().savedAyahs.some(a => a.id === ayahId);
      },
      
      // Reciter actions
      setAvailableReciters: (reciters) => {
        set({ availableReciters: reciters });
      },
      
      setSelectedReciter: (reciterId) => {
        const reciter = get().availableReciters.find(r => r.id === reciterId);
        if (reciter) {
          set((state) => ({
            settings: {
              ...state.settings,
              selectedReciterId: reciterId,
              reciterName: reciter.name,
              reciterArabicName: reciter.arabicName,
            },
          }));
        }
      },
      
      getCurrentReciter: () => {
        const { settings, availableReciters } = get();
        return availableReciters.find(r => r.id === settings.selectedReciterId) || null;
      },
      
      // Getters
      getSavedSurahsCount: () => get().savedSurahs.length,
      getSavedJuzzCount: () => get().savedJuzz.length,
      getSavedAyahsCount: () => get().savedAyahs.length,
      
      // Clear all
      clearAllSaved: () => {
        set({
          savedSurahs: [],
          savedJuzz: [],
          savedAyahs: [],
        });
      },
      
      // Settings actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },
      
      getSettings: () => get().settings,
    }),
    {
      name: 'quran-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);