import quranFoundationClient from '@/api/clients/quranFoundationClient';
import { API_ENDPOINTS, DEFAULT_QURAN_SETTINGS } from '@/api/config/apiConfig';
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

// New types for verse by key response
export interface VerseByKeyResponse {
  verse: {
    id: number;
    verse_number: number;
    page_number: number;
    verse_key: string;
    juz_number: number;
    hizb_number: number;
    rub_el_hizb_number: number;
    sajdah_type: string | null;
    sajdah_number: number | null;
    text_uthmani: string;
    words?: Array<{
      id: number;
      position: number;
      audio_url: string;
      char_type_name: string;
      line_number: number;
      page_number: number;
      code_v1: string;
      text: string;
      text_uthmani: string;
      translation?: {
        text: string;
        language_name: string;
      };
      transliteration?: {
        text: string;
        language_name: string;
      };
    }>;
    translations?: Array<{
      resource_id: number;
      text: string;
      resource_name?: string;
      language_name?: string;
    }>;
    tafsirs?: Array<{
      id: number;
      language_name: string;
      name: string;
      text: string;
      resource_id?: number;
    }>;
  };
}
export interface TafsirByAyahResponse {
  tafsir: {
    verses: Record<string, { id: number }>;
    resource_id: number;
    resource_name: string;
    language_id: number;
    slug: string;
    translated_name: {
      name: string;
      language_name: string;
    };
    text: string;
  };
}

export interface TranslationByAyahResponse {
  translations: Array<{
    resource_id: number;
    resource_name: string;
    id: number;
    text: string;
    verse_id: number;
    language_id: number;
    language_name: string;
    verse_key: string;
    chapter_id: number;
    verse_number: number;
    juz_number: number;
    hizb_number: number;
    rub_number: number;
    page_number: number;
  }>;
}

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

  // Get verses for a specific chapter with complete data
  getVersesForChapter: async (
    chapterId: number,
    page: number = 1,
    perPage: number = 10,
    language: string = DEFAULT_QURAN_SETTINGS.LANGUAGE
  ): Promise<Verse[]> => {
    console.log(`📘 Fetching verses for chapter ID: ${chapterId} with complete data`);
    console.log(`📊 Pagination: page ${page}, per_page ${perPage}, language: ${language}`);
    
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.VERSES_BY_CHAPTERS(chapterId);
      
      // Complete parameters for maximum data
      const params = {
        page,
        per_page: perPage,
        language,
        words: 'true',
        translations: DEFAULT_QURAN_SETTINGS.TRANSLATION_ID.toString(),
        tafsirs: DEFAULT_QURAN_SETTINGS.TAFSIR_ID.toString(),
        word_fields: 'text_uthmani,transliteration,translation',
        translation_fields: 'text,resource_name,language_name',
        fields: 'text_uthmani,translations,words,tafsirs,audio_url',
        audio: 1 // Include audio for verses
      };
      
      console.log(`🔍 Request to: ${endpoint} with params:`, params);
      
      const response = await quranFoundationClient.get<VersesResponse>(
        endpoint,
        { params }
      );
      
      const verses = response.data.verses;
      console.log(`✅ Received ${verses.length} verses for chapter ${chapterId} with complete data`);
      
      if (verses.length > 0) {
        console.log(`📊 First verse: ${verses[0].verse_number}, Last verse: ${verses[verses.length - 1].verse_number}`);
        console.log(`📊 Sample verse data: translations=${verses[0].translations?.length || 0}, tafsirs=${verses[0].tafsirs?.length || 0}, words=${verses[0].words?.length || 0}`);
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

  // Get available chapter reciters
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
      const ayahs: Ayah[] = [];
      return {
        number: juzFoundation.juz_number,
        ayahs: ayahs
      };
    } catch (error) {
      console.error(`Error converting juz ${juzFoundation.juz_number}:`, error);
      throw error;
    }
  },

  // Get verses for a specific juz with complete data and pagination
  getVersesByJuz: async (
    juzNumber: number,
    page: number = 1,
    perPage: number = 10,
    language: string = DEFAULT_QURAN_SETTINGS.LANGUAGE
  ): Promise<{ verses: Verse[], pagination: { total_records: number, total_pages: number, current_page: number, next_page: number | null } }> => {
    console.log(`📘 Fetching verses for juz number: ${juzNumber} with complete data`);
    console.log(`📊 Pagination: page ${page}, per_page ${perPage}, language: ${language}`);
    
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.VERSES_BY_JUZ(juzNumber);
      
      // Complete parameters for maximum data
      const params = {
        page,
        per_page: perPage,
        language,
        words: 'true',
        translations: DEFAULT_QURAN_SETTINGS.TRANSLATION_ID.toString(),
        tafsirs: DEFAULT_QURAN_SETTINGS.TAFSIR_ID.toString(),
        word_fields: 'text_uthmani,transliteration,translation',
        translation_fields: 'text,resource_name,language_name',
        fields: 'text_uthmani,translations,words,tafsirs,audio_url',
        audio: 1 // Include audio for verses
      };
      
      console.log(`🔍 Request to: ${endpoint} with params:`, params);
      
      const response = await quranFoundationClient.get(
        endpoint,
        { params }
      );
      
      const verses = response.data.verses;
      const pagination = response.data.pagination;
      
      console.log(`✅ Received ${verses.length} verses for juz ${juzNumber} with complete data`);
      console.log(`📊 Pagination info: page ${pagination.current_page} of ${pagination.total_pages}, total records: ${pagination.total_records}`);
      
      if (verses.length > 0) {
        console.log(`📊 First verse: ${verses[0].verse_key}, Last verse: ${verses[verses.length - 1].verse_key}`);
        console.log(`📊 Sample verse data: translations=${verses[0].translations?.length || 0}, tafsirs=${verses[0].tafsirs?.length || 0}, words=${verses[0].words?.length || 0}`);
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

  // Get tafsir for specific ayah - NEW API
  getTafsirByAyah: async (
    resourceId: number = DEFAULT_QURAN_SETTINGS.TAFSIR_ID,
    ayahKey: string
  ): Promise<TafsirByAyahResponse> => {
    console.log(`📘 Fetching tafsir for ayah: ${ayahKey} with resource ID: ${resourceId}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.TAFSIR_BY_AYAH(resourceId, ayahKey);
      console.log(`🔍 Request to: ${endpoint}`);
      
      const response = await quranFoundationClient.get<TafsirByAyahResponse>(endpoint);
      
      console.log(`✅ Received tafsir: ${response.data.tafsir.resource_name}`);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching tafsir for ayah ${ayahKey}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  },

  // Get translation for specific ayah - NEW API
  getTranslationByAyah: async (
    resourceId: number = DEFAULT_QURAN_SETTINGS.TRANSLATION_ID,
    ayahKey: string
  ): Promise<TranslationByAyahResponse> => {
    console.log(`📘 Fetching translation for ayah: ${ayahKey} with resource ID: ${resourceId}`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.TRANSLATION_BY_AYAH(resourceId, ayahKey);
      console.log(`🔍 Request to: ${endpoint}`);
      
      const response = await quranFoundationClient.get<TranslationByAyahResponse>(endpoint);
      
      console.log(`✅ Received translation: ${response.data.translations[0]?.resource_name || 'N/A'}`);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching translation for ayah ${ayahKey}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error message: ${error.message}`);
      }
      throw error;
    }
  },

  // Get verse by key with complete data - NEW API
  getVerseByKey: async (
    verseKey: string,
    language: string = DEFAULT_QURAN_SETTINGS.LANGUAGE
  ): Promise<VerseByKeyResponse> => {
    console.log(`📘 Fetching verse by key: ${verseKey} with complete data`);
    try {
      const endpoint = API_ENDPOINTS.QURAN_FOUNDATION.VERSE_BY_KEY(verseKey);
      
      // Complete parameters for maximum data
      const params = {
        language,
        words: 'true',
        translations: DEFAULT_QURAN_SETTINGS.TRANSLATION_ID.toString(),
        tafsirs: DEFAULT_QURAN_SETTINGS.TAFSIR_ID.toString(),
        word_fields: 'text_uthmani,transliteration,translation',
        translation_fields: 'text,resource_name,language_name',
        fields: 'text_uthmani,translations,words,tafsirs',
        audio: 1 // Include audio for verse
      };
      
      console.log(`🔍 Request to: ${endpoint} with params:`, params);
      
      const response = await quranFoundationClient.get<VerseByKeyResponse>(
        endpoint,
        { params }
      );
      
      console.log(`✅ Received verse: ${response.data.verse.verse_key} with complete data`);
      console.log(`📊 Verse data: translations=${response.data.verse.translations?.length || 0}, tafsirs=${response.data.verse.tafsirs?.length || 0}, words=${response.data.verse.words?.length || 0}`);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching verse by key ${verseKey}:`, error);
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