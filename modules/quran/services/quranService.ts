import quranFoundationClient from '@/api/clients/quranFoundationClient';
import { API_ENDPOINTS } from '@/api/config/apiConfig';
import { 
  Chapter, 
  Verse, 
  Recitation, 
  Translation,
  ChaptersResponse,
  ChapterResponse,
  VersesResponse,
  VerseResponse,
  Juz as JuzFoundation,
  JuzsResponse,
  JuzResponse,
  ChapterReciter,
ChapterRecitersResponse
} from '../types/quranFoundationTypes';

// Legacy types for backward compatibility
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

// Helper function to convert Chapter to Surah for backward compatibility
const chapterToSurah = (chapter: Chapter): Surah => {
  return {
    id: chapter.id,
    name: chapter.name_simple,
    englishName: chapter.name_complex,
    englishNameTranslation: chapter.translated_name.name,
    numberOfAyahs: chapter.verses_count,
    revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
  };
};

// Helper function to convert Verse to Ayah for backward compatibility
const verseToAyah = (verse: Verse, chapter: Chapter): Ayah => {
  return {
    number: verse.id,
    text: verse.text_uthmani,
    numberInSurah: verse.verse_number,
    juz: verse.juz_number,
    page: verse.page_number,
    surah: {
      number: chapter.id,
      name: chapter.name_simple,
      englishName: chapter.name_complex,
      englishNameTranslation: chapter.translated_name.name,
      revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
    },
  };
};

// Service functions
const quranService = {
  // Get all chapters (surahs)
  getAllChapters: async (language: string = 'en'): Promise<Chapter[]> => {
    console.log(`📘 Fetching all Quran chapters with language: ${language}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.CHAPTERS;
      console.log(`🔍 Request to: ${endpoint} with params:`, { language });
      
      const response = await quranFoundationClient.get<ChaptersResponse>(
        endpoint,
        { params: { language } }
      );
      
      console.log(`✅ Received ${response.data.chapters.length} chapters`);
      return response.data.chapters;
    } catch (error) {
      console.error('❌ Error fetching chapters:', error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
        console.error(`❌ Error stack: ${error.stack}`);
      }
      throw error;
    }
  },

  // Get all surahs (legacy method)
  getAllSurahs: async (language: string = 'en'): Promise<Surah[]> => {
    console.log(`📘 Fetching all surahs (legacy method) with language: ${language}`);
    try {
      const chapters = await quranService.getAllChapters(language);
      console.log(`🔄 Converting ${chapters.length} chapters to legacy Surah format`);
      const surahs = chapters.map(chapterToSurah);
      console.log(`✅ Converted ${surahs.length} chapters to surahs`);
      return surahs;
    } catch (error) {
      console.error('❌ Error fetching surahs:', error);
      throw error;
    }
  },

  // Get a specific chapter by ID
  getChapterById: async (chapterId: number, language: string = 'en'): Promise<Chapter> => {
    console.log(`📘 Fetching chapter ID: ${chapterId} with language: ${language}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.CHAPTER(chapterId);
      console.log(`🔍 Request to: ${endpoint} with params:`, { language });
      
      const response = await quranFoundationClient.get<ChapterResponse>(
        endpoint,
        { params: { language } }
      );

      console.log("response of getchapterbyid", response);
      
      const chapter = response.data.chapter;
      console.log(`✅ Received chapter: ${chapter.id} - ${chapter.name_simple} (${chapter.name_arabic})`);
      console.log(`📊 Chapter details: ${chapter.verses_count} verses, revelation place: ${chapter.revelation_place}`);
      
      return chapter;
    } catch (error) {
      console.error(`❌ Error fetching chapter ${chapterId}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  },

  // Get a specific surah by ID (legacy method)
  getSurahById: async (surahId: number, language: string = 'en'): Promise<Surah> => {
    try {
      const chapter = await quranService.getChapterById(surahId, language);
      return chapterToSurah(chapter);
    } catch (error) {
      console.error(`Error fetching surah ${surahId}:`, error);
      throw error;
    }
  },

  // Get verses for a specific chapter
  getVersesForChapter: async (
    chapterId: number,
    page: number = 1,
    perPage: number = 10,
    language: string = 'en'
  ): Promise<Verse[]> => {
    console.log(`📘 Fetching verses for chapter ID: ${chapterId}`);
    console.log(`📊 Pagination: page ${page}, per_page ${perPage}, language: ${language}`);
    
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.VERSES_BY_CHAPTERS(chapterId);
      console.log(`🔍 Request to: ${endpoint} with params:`, { page, per_page: perPage, language });
      
      const response = await quranFoundationClient.get<VersesResponse>(
        endpoint,
        {
          params: {
            page,
            per_page: perPage,
            language
          }
        }
      );
      
      const verses = response.data.verses;
      console.log(`✅ Received ${verses.length} verses for chapter ${chapterId}`);
      
      if (verses.length > 0) {
        console.log(`📊 First verse: ${verses[0].verse_number}, Last verse: ${verses[verses.length - 1].verse_number}`);
      }
      
      return verses;
    } catch (error) {
      console.error(`❌ Error fetching verses for chapter ${chapterId}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  },

  // Get ayahs for a specific surah (legacy method)
  getAyahsForSurah: async (surahId: number): Promise<Ayah[]> => {
    console.log(`📘 Fetching ayahs for surah ID: ${surahId} (legacy method)`);
    try {
      console.log(`🔍 First getting chapter details for surah ${surahId}`);
      const chapter = await quranService.getChapterById(surahId);
      
      console.log(`🔍 Fetching all ${chapter.verses_count} verses for chapter ${surahId}`);
      const verses = await quranService.getVersesForChapter(surahId, 1, chapter.verses_count);
      
      console.log(`🔄 Converting ${verses.length} verses to legacy Ayah format`);
      const ayahs = verses.map(verse => verseToAyah(verse, chapter));
      
      console.log(`✅ Successfully converted ${ayahs.length} verses to ayahs`);
      return ayahs;
    } catch (error) {
      console.error(`❌ Error fetching ayahs for surah ${surahId}:`, error);
      throw error;
    }
  },

  // Get a specific verse
  getVerse: async (
    chapterId: number, 
    verseId: number,
    language: string = 'en'
  ): Promise<Verse> => {
    try {
      const response = await quranFoundationClient.get<VerseResponse>(
        API_ENDPOINTS.QURAN_FOUNDATION.VERSE(chapterId, verseId),
        { params: { language } }
      );
      return response.data.verse;
    } catch (error) {
      console.error(`Error fetching verse ${verseId} from chapter ${chapterId}:`, error);
      throw error;
    }
  },

  // Get available recitations
  // Get available chapter reciters (fixed method)
  getReciters: async (language: string = 'en'): Promise<ChapterReciter[]> => {
    console.log(`📘 Fetching available chapter reciters with language: ${language}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.CHAPTER_RECITERS;
      console.log(`🔍 Request to: ${endpoint} with params:`, { language });
      
      const response = await quranFoundationClient.get<ChapterRecitersResponse>(
        endpoint,
        { params: { language } }
      );
      
      console.log(`✅ Received ${response.data.reciters.length} chapter reciters`);
      if (response.data.reciters.length > 0) {
        console.log(`📊 First reciter: ${response.data.reciters[0].name} (${response.data.reciters[0].arabic_name})`);
      }
      
      return response.data.reciters;
    } catch (error) {
      console.error('❌ Error fetching chapter reciters:', error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
        console.error(`❌ Error stack: ${error.stack}`);
      }
      throw error;
    }
  },

  // Get available translations
  getTranslations: async (): Promise<Translation[]> => {
    try {
      const response = await quranFoundationClient.get(API_ENDPOINTS.QURAN_FOUNDATION.TRANSLATIONS);
      return response.data.translations;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  },

  // Get all juzs
  getAllJuzs: async (language: string = 'en'): Promise<JuzFoundation[]> => {
    console.log(`📘 Fetching all Quran juzs with language: ${language}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.JUZS;
      console.log(`🔍 Request to: ${endpoint} with params:`, { language });
      
      const response = await quranFoundationClient.get<JuzsResponse>(
        endpoint,
        { params: { language } }
      );
      
      console.log(`✅ Received ${response.data.juzs.length} juzs`);
      return response.data.juzs;
    } catch (error) {
      console.error('❌ Error fetching juzs:', error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
        console.error(`❌ Error stack: ${error.stack}`);
      }
      throw error;
    }
  },
  
  // Helper function to convert JuzFoundation to legacy Juz format
  juzFoundationToJuz: async (juzFoundation: JuzFoundation): Promise<Juz> => {
    try {
      // We need to fetch all verses for this juz to convert to the legacy format
      // This is a simplified implementation
      const ayahs: Ayah[] = [];
      
      // For now, return a basic structure
      return {
        number: juzFoundation.juz_number,
        ayahs: ayahs
      };
    } catch (error) {
      console.error(`Error converting juz ${juzFoundation.juz_number}:`, error);
      throw error;
    }
  },

  // Get tafseer for a specific ayah
  getTafseerForAyah: async (surahId: number, ayahId: number): Promise<string> => {
    try {
      // This is a placeholder as we need to implement Tafseer fetching with the new API
      // For now, we'll throw an error
      throw new Error('Tafseer fetching not yet implemented with Quran.Foundation API');
    } catch (error) {
      console.error(`Error fetching tafseer for surah ${surahId}, ayah ${ayahId}:`, error);
      throw error;
    }
  },

  // Search the Quran
  // Get verses for a specific juz with pagination
  getVersesByJuz: async (
    juzNumber: number,
    page: number = 1,
    perPage: number = 10,
    language: string = 'en',
    includeWords: boolean = true,
    translationIds?: string,
    audioId?: number,
    tafsirIds?: string
  ): Promise<{ verses: Verse[], pagination: { total_records: number, total_pages: number, current_page: number, next_page: number | null } }> => {
    console.log(`📘 Fetching verses for juz number: ${juzNumber}`);
    console.log(`📊 Pagination: page ${page}, per_page ${perPage}, language: ${language}`);
    
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.VERSES_BY_JUZ(juzNumber);
      console.log(`🔍 Request to: ${endpoint} with params:`, {
        page,
        per_page: perPage,
        language,
        words: includeWords ? 'true' : 'false',
        translations: translationIds,
        audio: audioId,
        tafsirs: tafsirIds
      });
      
      const response = await quranFoundationClient.get(
        endpoint,
        {
          params: {
            page,
            per_page: perPage,
            language,
            words: includeWords ? 'true' : 'false',
            translations: translationIds,
            audio: audioId,
            tafsirs: tafsirIds
          }
        }
      );
      
      const verses = response.data.verses;
      const pagination = response.data.pagination;
      
      console.log(`✅ Received ${verses.length} verses for juz ${juzNumber}`);
      console.log(`📊 Pagination info: page ${pagination.current_page} of ${pagination.total_pages}, total records: ${pagination.total_records}`);
      
      if (verses.length > 0) {
        console.log(`📊 First verse: ${verses[0].verse_key}, Last verse: ${verses[verses.length - 1].verse_key}`);
      }
      
      return {
        verses,
        pagination
      };
    } catch (error) {
      console.error(`❌ Error fetching verses for juz ${juzNumber}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  },
  
  searchQuran: async (
    query: string,
    page: number = 1,
    perPage: number = 20,
    language: string = 'en'
  ): Promise<{ verses: Verse[], total: number }> => {
    console.log(`🔍 Searching Quran for: "${query}"`);
    console.log(`📊 Search parameters: page ${page}, per_page ${perPage}, language: ${language}`);
    
    try {
      const endpoint = '/search';
      console.log(`🔍 Request to: ${endpoint} with params:`, { q: query, page, per_page: perPage, language });
      
      const response = await quranFoundationClient.get(endpoint, {
        params: {
          q: query,
          page,
          per_page: perPage,
          language
        }
      });
      
      console.log(`✅ Search results: ${response.data.verses.length} verses found (total: ${response.data.total})`);
      
      if (response.data.verses.length > 0) {
        console.log(`📊 Results from chapters: ${[...new Set(response.data.verses.map((v: Verse) => v.chapter_id))].join(', ')}`);
      }
      
      return {
        verses: response.data.verses,
        total: response.data.total
      };
    } catch (error) {
      console.error(`❌ Error searching Quran for "${query}":`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  }
};

export default quranService;
