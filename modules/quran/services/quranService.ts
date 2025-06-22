import { quranClient } from '@/api/globalClient';
import { API_ENDPOINTS } from '@/api/config/apiConfig';

// Define types for API responses
export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
  };
}

export interface Juz {
  number: number;
  ayahs: Ayah[];
}

// Service functions
const quranService = {
  // Get all surahs
  getAllSurahs: async (): Promise<Surah[]> => {
    try {
      const response = await quranClient.get('/surah');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  },

  // Get a specific surah by ID
  getSurahById: async (surahId: number): Promise<Surah> => {
    try {
      const response = await quranClient.get(`/surah/${surahId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching surah ${surahId}:`, error);
      throw error;
    }
  },

  // Get ayahs for a specific surah
  getAyahsForSurah: async (surahId: number): Promise<Ayah[]> => {
    try {
      const response = await quranClient.get(`/surah/${surahId}/ayahs`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ayahs for surah ${surahId}:`, error);
      throw error;
    }
  },

  // Get a specific juz by ID
  getJuzById: async (juzId: number): Promise<Juz> => {
    try {
      const response = await quranClient.get(`/juz/${juzId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching juz ${juzId}:`, error);
      throw error;
    }
  },

  // Get tafseer for a specific ayah
  getTafseerForAyah: async (surahId: number, ayahId: number): Promise<string> => {
    try {
      const response = await quranClient.get(`/tafseer/${surahId}/${ayahId}`);
      return response.data.data.text;
    } catch (error) {
      console.error(`Error fetching tafseer for surah ${surahId}, ayah ${ayahId}:`, error);
      throw error;
    }
  },

  // Search the Quran
  searchQuran: async (query: string): Promise<Ayah[]> => {
    try {
      const response = await quranClient.get('/search', {
        params: { q: query }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error searching Quran for "${query}":`, error);
      throw error;
    }
  }
};

export default quranService;
