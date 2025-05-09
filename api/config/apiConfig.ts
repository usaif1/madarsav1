export const API_URLS = {
  ISLAMIC_DEVELOPERS: 'https://api.islamicdevelopers.com',
  ALADHAN: 'https://api.aladhan.com',
  SUNNAH: 'https://api.sunnah.com/v1',
  QURAN: 'https://api.quran.com',
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
  
  // Other endpoints will be added as needed
};
