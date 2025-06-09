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
  ARROW_LEFT: '/assets/duas/arrow-left.svg',
  ARROW_RIGHT: '/assets/duas/arrow-right.svg',
  HAMBURGER_ICON: '/assets/duas/hamburger-icon.svg',
  
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
  
  // Prayer time icons
  FAJR: '/assets/home/fajr.svg',
  ISHA: '/assets/calendar/isha.svg',
  BOOKMARK: '/assets/hadith/bookmark.svg',

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
  
  // Compass assets
  COMPASS_BACKGROUND: '/assets/compass/compass.svg',
  COMPASS_CENTER: '/assets/compass/compass_center.svg',
  COMPASS_KAABA: '/assets/compass/Kaaba.png',
  COMPASS_3D: '/assets/compass/compass_3d.png',
  COMPASS_MOSQUE: '/assets/compass/mosque.svg',
  COMPASS_NEXT_SALAH: '/assets/compass/next_salah_icon.svg',
  COMPASS_SHARE: '/assets/compass/share-light.svg',
};
