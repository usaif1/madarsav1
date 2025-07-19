// Chapter (Surah) type
export interface Chapter {
  id: number;
  revelation_place: 'makka' | 'madinah';
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

// Verse (Ayah) type
export interface Verse {
  id: number;
  verse_number: number;
  chapter_id: number;
  text_uthmani: string;
  text_indopak: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  sajdah_type: string | null;
  sajdah_number: number | null;
  page_number: number;
  translations?: VerseTranslation[];
  audio?: {
    url: string;
    segments: number[][];
  };
}

// Verse Translation type
export interface VerseTranslation {
  id: number;
  language_name: string;
  text: string;
  resource_name: string;
  resource_id: number;
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