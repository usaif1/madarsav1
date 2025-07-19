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
  GREGORIAN_TO_HIJRI: '/v1/gToH',              // Convert Gregorian date to Hijri
  HIJRI_TO_GREGORIAN: '/v1/hToG',              // Convert Hijri date to Gregorian
  HIJRI_CALENDAR: '/v1/gToHCalendar',          // Get Hijri calendar for a Gregorian month
  GREGORIAN_CALENDAR: '/v1/hToGCalendar',      // Get Gregorian calendar for a Hijri month
  NEXT_HIJRI_HOLIDAY: '/v1/nextHijriHoliday',  // Get next Hijri holiday
  CURRENT_ISLAMIC_YEAR: '/v1/currentIslamicYear', // Get current Islamic year
  CURRENT_ISLAMIC_MONTH: '/v1/currentIslamicMonth', // Get current Islamic month
  ISLAMIC_YEAR_FROM_GREGORIAN: '/v1/islamicYearFromGregorianForRamadan', // Islamic year from Gregorian
  HIJRI_HOLIDAYS: '/v1/hijriHolidays',         // Holiday for specific Hijri day
  SPECIAL_DAYS: '/v1/specialDays',             // List of special days
  ISLAMIC_MONTHS: '/v1/islamicMonths',         // Islamic months
  HIJRI_HOLIDAYS_BY_YEAR: '/v1/islamicHolidaysByHijriYear', // Hijri holidays by year
  RAMADAN_CALENDAR: '/v1/hijriCalendar/9', // Ramadan calendar (month 9)
  
  // Other endpoints will be added as needed
  
  // Quran.Foundation API endpoints
  QURAN_FOUNDATION: {
    CHAPTERS: '/chapters',
    CHAPTER: (id: number) => `/chapters/${id}`,
    VERSES: (chapterId: number) => `/chapters/${chapterId}/verses`,
    VERSE: (chapterId: number, verseId: number) => `/chapters/${chapterId}/verses/${verseId}`,
    RECITATIONS: '/recitations',
    TRANSLATIONS: '/translations',
  }
};

// Quran.Foundation API credentials
export const QURAN_FOUNDATION_CREDENTIALS = {
  PRE_PRODUCTION: {
    CLIENT_ID: 'b876018d-438d-4ba9-bff1-e832300622ad',
    CLIENT_SECRET: 'eYgetdho~4m81bd2nu7vEBRJ9Y',
  },
  PRODUCTION: {
    CLIENT_ID: 'e13619a8-9cf8-47f0-8ba1-3b68117e0fad',
    CLIENT_SECRET: 'DqY.zCCq7kb~-XtjdjOO-ANZLE',
  }
};

// Get the appropriate credentials based on environment
export const getQuranFoundationCredentials = () => {
  return __DEV__
    ? QURAN_FOUNDATION_CREDENTIALS.PRE_PRODUCTION
    : QURAN_FOUNDATION_CREDENTIALS.PRODUCTION;
};
