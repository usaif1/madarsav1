import Config from "react-native-config";

// Get environment variables for Quran Foundation credentials
const QURAN_PRE_PRODUCTION_CLIENT_ID = Config.QURAN_PRE_PRODUCTION_CLIENT_ID;
const QURAN_PRE_PRODUCTION_CLIENT_SECRET = Config.QURAN_PRE_PRODUCTION_CLIENT_SECRET;
const QURAN_PRODUCTION_CLIENT_ID = Config.QURAN_PRODUCTION_CLIENT_ID;
const QURAN_PRODUCTION_CLIENT_SECRET = Config.QURAN_PRODUCTION_CLIENT_SECRET;

export const API_URLS = {
  ISLAMIC_DEVELOPERS: 'https://api.islamicdevelopers.com',
  ALADHAN: 'https://api.aladhan.com',
  SUNNAH: 'https://api.sunnah.com/v1',
  QURAN: 'https://api.quran.com',
  // Add Quran.Foundation URLs
  QURAN_FOUNDATION: {
    PRE_PRODUCTION: 'https://apis-prelive.quran.foundation/content/api/v4',
    PRODUCTION: 'https://apis.quran.foundation/content/api/v4',
    AUTH: {
      PRE_PRODUCTION: 'https://prelive-oauth2.quran.foundation/oauth2/token',
      PRODUCTION: 'https://oauth2.quran.foundation/oauth2/token',
    }
  }
};

// Get the appropriate Quran.Foundation URL based on environment
export const getQuranFoundationUrl = () => {
  return __DEV__
    ? API_URLS.QURAN_FOUNDATION.PRE_PRODUCTION
    : API_URLS.QURAN_FOUNDATION.PRODUCTION;
};

// Get the appropriate Quran.Foundation Auth URL based on environment
export const getQuranFoundationAuthUrl = () => {
  return __DEV__
    ? API_URLS.QURAN_FOUNDATION.AUTH.PRE_PRODUCTION
    : API_URLS.QURAN_FOUNDATION.AUTH.PRODUCTION;
};

export const API_ENDPOINTS = {
  // Islamic Developers API endpoints
  NAMES_OF_ALLAH: '/v1/al-asma-ul-husna',
  QIBLA: '/v1/qibla',
  ISLAMIC_CALENDAR: '/v1/calendar',
  
  // Sunnah.com API endpoints
  COLLECTIONS: '/collections',
  BOOKS: '/books',
  CHAPTERS: '/chapters',
  HADITHS: '/hadiths',
  
  // AlAdhan Prayer Times API endpoints
  PRAYER_TIMES: '/v1/timings',
  NEXT_PRAYER: '/v1/nextPrayer',
  PRAYER_METHODS: '/v1/methods',
  
  // AlAdhan Hijri Calendar API endpoints
  GREGORIAN_TO_HIJRI: '/v1/gToH',
  HIJRI_TO_GREGORIAN: '/v1/hToG',
  HIJRI_CALENDAR: '/v1/gToHCalendar',
  GREGORIAN_CALENDAR: '/v1/hToGCalendar',
  NEXT_HIJRI_HOLIDAY: '/v1/nextHijriHoliday',
  CURRENT_ISLAMIC_YEAR: '/v1/currentIslamicYear',
  CURRENT_ISLAMIC_MONTH: '/v1/currentIslamicMonth',
  ISLAMIC_YEAR_FROM_GREGORIAN: '/v1/islamicYearFromGregorianForRamadan',
  HIJRI_HOLIDAYS: '/v1/hijriHolidays',
  SPECIAL_DAYS: '/v1/specialDays',
  ISLAMIC_MONTHS: '/v1/islamicMonths',
  HIJRI_HOLIDAYS_BY_YEAR: '/v1/islamicHolidaysByHijriYear',
  RAMADAN_CALENDAR: '/v1/hijriCalendar/9',
  
  // Quran.Foundation API endpoints
  QURAN_FOUNDATION: {
    CHAPTERS: '/chapters',
    CHAPTER: (id: number) => `/chapters/${id}`,
    VERSES_BY_CHAPTERS: (chapterId: number) => `/verses/by_chapter/${chapterId}`,
    VERSE: (chapterId: number, verseId: number) => `/chapters/${chapterId}/verses/${verseId}`,
    VERSES_BY_JUZ: (juzNumber: number) => `/verses/by_juz/${juzNumber}`,
    JUZS: '/juzs',
    JUZ: (id: number) => `/juzs/${id}`,
    TRANSLATIONS: '/resources/translations',
    CHAPTER_RECITERS: '/resources/chapter_reciters',
    // Updated endpoints for tafsir and translation by ayah
    TAFSIR_BY_AYAH: (resourceId: number, ayahKey: string) => `/tafsirs/${resourceId}/by_ayah/${ayahKey}`,
    TRANSLATION_BY_AYAH: (resourceId: number, ayahKey: string) => `/translations/${resourceId}/by_ayah/${ayahKey}`,
    // New endpoint for getting verse by key with complete data
    VERSE_BY_KEY: (verseKey: string) => `/verses/by_key/${verseKey}`,
    // New endpoint for getting ayah recitations
    AYAH_RECITATION: (recitationId: number, ayahKey: string) => `/recitations/${recitationId}/by_ayah/${ayahKey}`,
    AUDIO_BASE_URL: 'https://verses.quran.foundation/'
  }
};

// Quran.Foundation API credentials from environment variables
export const QURAN_FOUNDATION_CREDENTIALS = {
  PRE_PRODUCTION: {
    CLIENT_ID: QURAN_PRE_PRODUCTION_CLIENT_ID,
    CLIENT_SECRET: QURAN_PRE_PRODUCTION_CLIENT_SECRET,
  },
  PRODUCTION: {
    CLIENT_ID: QURAN_PRODUCTION_CLIENT_ID,
    CLIENT_SECRET: QURAN_PRODUCTION_CLIENT_SECRET,
  }
};

// Get the appropriate credentials based on environment
export const getQuranFoundationCredentials = () => {
  const credentials = __DEV__
    ? QURAN_FOUNDATION_CREDENTIALS.PRE_PRODUCTION
    : QURAN_FOUNDATION_CREDENTIALS.PRODUCTION;

  // Validate that credentials are available
  if (!credentials.CLIENT_ID || !credentials.CLIENT_SECRET) {
    console.error('❌ Quran Foundation credentials not found in environment variables');
    console.error('Required environment variables:');
    if (__DEV__) {
      console.error('- QURAN_PRE_PRODUCTION_CLIENT_ID');
      console.error('- QURAN_PRE_PRODUCTION_CLIENT_SECRET');
    } else {
      console.error('- QURAN_PRODUCTION_CLIENT_ID');
      console.error('- QURAN_PRODUCTION_CLIENT_SECRET');
    }
    throw new Error('Missing Quran Foundation API credentials in environment variables');
  }

  return credentials;
};

// Default IDs for translations and tafsirs
export const DEFAULT_QURAN_SETTINGS = {
  TRANSLATION_ID: 131, // Dr. Mustafa Khattab, the Clear Quran
  TAFSIR_ID: 169, // Tafsir Ibn Kathir
  RECITATION_ID: 7, // Mishary Rashid Alafasy (commonly used default)
  LANGUAGE: 'en',
};