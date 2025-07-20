// Chapter (Surah) type
export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: {
    language_name: string;
    name: string;
  };
}

// Word type
export interface Word {
  id: number;
  position: number;
  verse_id: number;
  verse_key: string;
  chapter_id: number;
  page_number: number;
  line_number: number;
  text: string;
  text_uthmani: string;
  text_indopak: string;
  code_v1?: string;
  code_v2?: string;
  char_type_name: string;
  audio_url?: string;
  location?: string;
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
}

// Verse (Ayah) type
export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  chapter_id: number;
  text_uthmani: string;
  text_indopak: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  sajdah_type: string | null;
  sajdah_number: number | null;
  page_number: number;
  words?: Word[];
  translations?: VerseTranslation[];
  audio?: {
    url: string;
    segments: number[][];
  };
  tafsirs?: VerseTafsir[];
}

// Verse Translation type
export interface VerseTranslation {
  id?: number;
  language_name?: string;
  text: string;
  resource_name?: string;
  resource_id: number;
}

// Verse Tafsir type
export interface VerseTafsir {
  id: number;
  language_name: string;
  name: string;
  text: string;
}

// Recitation type
export interface Recitation {
  id: number;
  reciter_name: string;
  style: string;
  audio_url_template: string;
}

// Translation type
export interface Translation {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  translated_name?: {
    name: string;
    language_name: string;
  };
}

// Token response type
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Error response type
export interface ErrorResponse {
  code: string;
  message: string;
  status: number;
}

// Pagination metadata
export interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  per_page: number;
}

// Chapters response
export interface ChaptersResponse {
  chapters: Chapter[];
  meta?: PaginationMeta;
}

// Chapter response
export interface ChapterResponse {
  chapter: Chapter;
}

// Verses response
export interface VersesResponse {
  verses: Verse[];
  meta: PaginationMeta;
}

// Verse response
export interface VerseResponse {
  verse: Verse;
}

// Recitations response
export interface RecitationsResponse {
  recitations: Recitation[];
  meta?: PaginationMeta;
}

// Translations response
export interface TranslationsResponse {
  translations: Translation[];
  meta?: PaginationMeta;
}

// Search response
export interface SearchResponse {
  verses: Verse[];
  meta: PaginationMeta;
  total: number;
}

// Juz type
export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

// Juzs response
export interface JuzsResponse {
  juzs: Juz[];
  meta?: PaginationMeta;
}

// Juz response
export interface JuzResponse {
  juz: Juz;
}

// Add this to your types file:
export interface ChapterReciter {
  id: number;
  name: string;
  arabic_name: string;
  relative_path: string;
  format: string;
  files_size: number;
}

export interface ChapterRecitersResponse {
  reciters: ChapterReciter[];
}