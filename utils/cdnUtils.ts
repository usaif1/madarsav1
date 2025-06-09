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
  ARROW_RIGHT: '/assets/duas/arrow-right.svg',
  SHARE_ALT: '/assets/hadith/share_alt.svg',
  BUBBLE: '/assets/tasbih/bubble.svg',
  
  // Prayer time icons
  FAJR: '/assets/home/fajr.svg',
  ISHA: '/assets/calendar/isha.svg',
  BOOKMARK: '/assets/hadith/bookmark.svg',
};
