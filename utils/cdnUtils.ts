export const CDN_BASE_URL = 'https://cdn.madrasaapp.com';

export const getCdnUrl = (path: string): string => {
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_BASE_URL}${normalizedPath}`;
};

// Common Dua asset paths
export const DUA_ASSETS = {
  // Icons
  BOOKMARK_WHITE: '/assets/duas/bookmark-white.svg',
  BOOKMARK_PRIMARY: '/assets/duas/bookmark-primary.svg',
  MANDALA_DUA: '/assets/duas/mandala_dua.svg',
  DUA_AYAH: '/assets/duas/dua-ayah.png',
  
  // Dua category icons
  DAILY_ZIKR: '/assets/duas/daily_zikr.svg',
  FOOD_DRINK: '/assets/duas/food_&_drink.svg',
  GOOD_ETIQUETTE: '/assets/duas/good_etiquette.svg',
  PRAISING_ALLAH: '/assets/duas/praising_allah.svg',
  WASHROOM: '/assets/duas/washroom.svg',
  HOUSE: '/assets/duas/house.svg',
  
  // Common UI icons
  SEARCH: '/assets/search.svg',
  CLOSE: '/assets/close.svg',
  ARROW_LEFT: '/assets/arrow-left.svg',
  ARROW_LEFT_DUA_CARD: '/assets/profile/arrowleft.svg',
  ARROW_RIGHT_DUA_CARD: '/assets/profile/arrowright.svg',
  HAMBURGER_ICON: '/assets/profile/hamburger.svg',
  QURAN_SURAH_INDEX_STAR: '/assets/quran/quran_surah_star.svg',
  
  // Tasbih assets
  TASBIH_PENCIL: '/assets/tasbih/pencil.svg',
  TASBIH_PENCIL_VIOLET: '/assets/tasbih/pencilViolet.svg',
  TASBIH_RESET: '/assets/tasbih/reset.svg',
  TASBIH_RESET_VIOLET: '/assets/tasbih/resetViolet.svg',
  TASBIH_BEAD: '/assets/tasbih/rosaryBead.png',
  TASBIH_BEAD_WHITE: '/assets/tasbih/rosaryBeadWhite.png',
  TASBIH_BUBBLE: '/assets/tasbih/bubble.svg',
  TASBIH_LEFT_FLOWER: '/assets/tasbih/leftFlowerChangeDua.svg',
  TASBIH_RIGHT_FLOWER: '/assets/tasbih/rightFlowerChangeDua.svg',
  CLOSE_ICON: '/assets/close.svg',
  SHARE_ALT: '/assets/hadith/share_alt.svg',
  BUBBLE: '/assets/tasbih/bubble.svg',
  AL_HUSNA_BACKGROUND: '/assets/home/al-husna-background.png',
  AL_HUSNA_TRACK_BACKGROUND: '/assets/home/al-husna-track-background.png',
  AL_HUSNA_ICON: '/assets/home/al-husna.svg',
  
  // Prayer time icons
  FAJR: '/assets/home/fajr.svg',
  ISHA: '/assets/calendar/isha.svg',
  BOOKMARK: '/assets/hadith/bookmark.svg',
  SUNRISE: '/assets/calendar/sunrise.svg',
  DHUHR: '/assets/calendar/dhuhr_asr.svg',

  // Maktab assets
  MAKTAB_HEADER: '/assets/maktab/maktab-header-image.png',
  MAKTAB_HEADER_SHADOW: '/assets/maktab/maktab-header-image-shadow.png',
  MAKTAB_TOP_DESIGN: '/assets/maktab/maktab-top-design.svg',
  MAKTAB_CALENDAR: '/assets/maktab/maktab-calendar.png',
  MAKTAB_SALAM: '/assets/maktab/maktab-salam.png',

  // Lottie animations
  TASBIH_ANIMATION_BLACK: '/assets/tasbih/animations/tasbih-black.json',
  TASBIH_ANIMATION_WHITE: '/assets/tasbih/animations/tasbih-white.json',
  
  // Names module assets
  NAMES_SEARCH: '/assets/search.svg',
  NAMES_SHARE: '/assets/share-light.svg',
  NAMES_RIGHT_TRIANGLE: '/assets/right-triangle.svg',
  NAMES_CLOSE: '/assets/close.svg',
  NAMES_PAUSE: '/assets/home/pause.svg',
  NAMES_PAUSE_WHITE: '/assets/home/pause_white.svg',
  
  // Calendar module assets
  CALENDAR_DOWN_ARROW: '/assets/calendar/down-arrow.svg',
  CALENDAR_FAZR: '/assets/calendar/fazr.svg',
  CALENDAR_FAZR_WHITE: '/assets/calendar/fazr_white.svg',
  CALENDAR_MAGHRIB: '/assets/calendar/maghrib.svg',
  CALENDAR_MAGHRIB_WHITE: '/assets/calendar/maghrib_white.svg',
  CALENDAR_DOT: '/assets/calendar/dot.svg',
  CALENDAR_SEHRI_DUA: '/assets/calendar/sehri_dua.svg',
  CALENDAR_IFTAR_DUA: '/assets/calendar/iftar_dua.svg',
  
  // Compass assets
  COMPASS_BACKGROUND: '/assets/compass/compass.svg',
  COMPASS_CENTER: '/assets/compass/compass_center.png',
  COMPASS_FRAME: '/assets/compass/compass_frame.png',
  COMPASS_KAABA: '/assets/compass/Kaaba.png',
  COMPASS_3D: '/assets/compass/compass_3d.png',
  COMPASS_MOSQUE: '/assets/compass/mosque.svg',
  COMPASS_NEXT_SALAH: '/assets/compass/next_salah_icon.svg',
  COMPASS_SHARE: '/assets/share-light.svg',
  
  // Hadith assets
  HADITH_MORE_LEFT: '/assets/hadith/more-hadiths-left.svg',
  HADITH_MORE_RIGHT: '/assets/hadith/more-hadiths-right.svg',
  HADITH_CHAPTER_LEFT: '/assets/hadith/hadith-chapters-left-heading.svg',
  HADITH_CHAPTER_RIGHT: '/assets/hadith/hadith-chapters-right-heading.svg',
  HADITH_BISMILLAH: '/assets/hadith/bismillah-calligraphy.svg',
  HADITH_BOOKMARK: '/assets/hadith/bookmark.svg',
  HADITH_SHARE: '/assets/hadith/share_alt.svg',
  HADITH_DASHED_LINE: '/assets/hadith/dashed-line.svg',
  HADITH_PLAY: '/assets/hadith/Play.svg',
  PLAY: '/assets/home/play.svg',
  HADITH_TOP_ILLUSTRATION: '/assets/hadith/hadith-info-top-illustration.svg',
  HADITH_BOOK_IMAGE: '/assets/hadith/BookImageBig.png',
  CALENDAR_ICON: '/assets/profile/calendar_icon.svg',
  NAV_PROFILE_MENU: '/assets/home/nav-profile-menu.svg',
  MARBLE_ICON: '/assets/splash/marble.png',
  
  // Tab Bar Icons
  TAB_HOME: '/assets/home/home.svg',
  TAB_HOME_SELECTED: '/assets/home/home-selected.svg',
  TAB_MAKTAB: '/assets/home/maktab.svg',
  TAB_MAKTAB_SELECTED: '/assets/home/maktab-selected.svg',
  TAB_QURAN: '/assets/home/al-quran.svg',
  TAB_QURAN_SELECTED: '/assets/home/al-quran-selected.svg',
  
  // Common Icons
  SEARCH_ICON: '/assets/search.svg',
  
  // Default Images
  DEFAULT_PROFILE_IMAGE: '/assets/profile/blank-profile-picture.png',
  
  // Quran Icons
  QURAN_CLOSE_ICON: '/assets/close.svg',
  QURAN_SETTINGS_ICON: '/assets/quran/settings.svg',
  QURAN_SETTINGS_FILL_ICON: '/assets/quran/settings-fill.svg',
  QURAN_PLAY_ICON: '/assets/hadith/Play.svg',
  QURAN_PLAY_WHITE_ICON: '/assets/quran/play_white.svg',
  QURAN_BOOKMARK_ICON: '/assets/hadith/bookmark.svg',
  QURAN_BOOKMARK_FILL_ICON: '/assets/hadith/bookmarked.svg',
  QURAN_SHARE_ICON: '/assets/hadith/Share.svg',
  QURAN_OPEN_BOOK_ICON: '/assets/quran/open_book.svg',
  QURAN_SURAH_DETAIL_GRAPHIC: '/assets/quran/SurahDetailGraphic.png',
  QURAN_SURAH_ICON: '/assets/quran/surah-icon.svg',
  QURAN_JUZZ_ICON: '/assets/quran/juzz-icon.svg',
  QURAN_AYAHS_ICON: '/assets/quran/ayahs-icon.svg',
  SURAH_PLAY_ICON: '/assets/quran/surah_play.svg',
  QURAN_PLAY_PREVIOUS_ICON: '/assets/quran/play_previous.svg',
  QURAN_PLAY_NEXT_ICON: '/assets/quran/play_next.svg',
};
