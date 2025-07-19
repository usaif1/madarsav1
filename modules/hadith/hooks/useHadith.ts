import { useQuery } from '@tanstack/react-query';
import {
  // Types are used in function return type annotations
  Collection,
  Book,
  Chapter,
  Hadith,
  PaginatedResponse,
  // Service functions
  fetchCollections,
  fetchCollectionByName,
  fetchBooks,
  fetchBookByNumber,
  fetchChapters,
  fetchChapterById,
  fetchHadithsFromBook,
  fetchHadithByNumber,
  fetchRandomHadith
} from '../services/hadithService';

// Query keys for React Query
export const QUERY_KEYS = {
  COLLECTIONS: 'hadithCollections',
  COLLECTION: 'hadithCollection',
  BOOKS: 'hadithBooks',
  BOOK: 'hadithBook',
  CHAPTERS: 'hadithChapters',
  CHAPTER: 'hadithChapter',
  HADITHS: 'hadiths',
  HADITH: 'hadith',
  RANDOM_HADITH: 'randomHadith'
};

/**
 * Hook to fetch all hadith collections
 */
export const useCollections = (
  limit = 50,
  page = 1
) => {
  console.log(`🪝 useCollections hook called with params: limit=${limit}, page=${page}`);
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTIONS, { limit, page }],
    queryFn: () => {
      console.log(`🪝 useCollections hook executing query function`);
      return fetchCollections(limit, page);
    }
  });
};

/**
 * Hook to fetch a specific collection by name
 */
export const useCollection = (
  collectionName: string
) => {
  console.log(`🪝 useCollection hook called with collection: ${collectionName}`);
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTION, collectionName],
    queryFn: () => {
      console.log(`🪝 useCollection hook executing query function for ${collectionName}`);
      return fetchCollectionByName(collectionName);
    },
    enabled: !!collectionName
  });
};

/**
 * Hook to fetch books of a specific collection
 */
export const useBooks = (
  collectionName: string,
  limit = 50,
  page = 1
) => {
  console.log(`🪝 useBooks hook called with collection: ${collectionName}, limit=${limit}, page=${page}`);
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS, collectionName, { limit, page }],
    queryFn: () => {
      console.log(`🪝 useBooks hook executing query function for ${collectionName}`);
      return fetchBooks(collectionName, limit, page);
    },
    enabled: !!collectionName
  });
};

/**
 * Hook to fetch a specific book by number
 */
export const useBook = (
  collectionName: string,
  bookNumber: string
) => {
  console.log(`🪝 useBook hook called with collection: ${collectionName}, book: ${bookNumber}`);
  return useQuery({
    queryKey: [QUERY_KEYS.BOOK, collectionName, bookNumber],
    queryFn: () => {
      console.log(`🪝 useBook hook executing query function for ${collectionName}, book ${bookNumber}`);
      return fetchBookByNumber(collectionName, bookNumber);
    },
    enabled: !!collectionName && !!bookNumber
  });
};

/**
 * Hook to fetch chapters of a specific book
 */
export const useChapters = (
  collectionName: string,
  bookNumber: string,
  limit = 50,
  page = 1
) => {
  console.log(`🪝 useChapters hook called with collection: ${collectionName}, book: ${bookNumber}, limit=${limit}, page=${page}`);
  return useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS, collectionName, bookNumber, { limit, page }],
    queryFn: () => {
      console.log(`🪝 useChapters hook executing query function for ${collectionName}, book ${bookNumber}`);
      return fetchChapters(collectionName, bookNumber, limit, page);
    },
    enabled: !!collectionName && !!bookNumber
  });
};

/**
 * Hook to fetch a specific chapter by ID
 */
export const useChapter = (
  collectionName: string,
  bookNumber: string,
  chapterId: string
) => {
  console.log(`🪝 useChapter hook called with collection: ${collectionName}, book: ${bookNumber}, chapter: ${chapterId}`);
  return useQuery({
    queryKey: [QUERY_KEYS.CHAPTER, collectionName, bookNumber, chapterId],
    queryFn: () => {
      console.log(`🪝 useChapter hook executing query function for ${collectionName}, book ${bookNumber}, chapter ${chapterId}`);
      return fetchChapterById(collectionName, bookNumber, chapterId);
    },
    enabled: !!collectionName && !!bookNumber && !!chapterId
  });
};

/**
 * Hook to fetch hadiths from a specific book
 */
export const useHadiths = (
  collectionName: string,
  bookNumber: string,
  limit = 50,
  page = 1
) => {
  console.log(`🪝 useHadiths hook called with collection: ${collectionName}, book: ${bookNumber}, limit=${limit}, page=${page}`);
  return useQuery({
    queryKey: [QUERY_KEYS.HADITHS, collectionName, bookNumber, { limit, page }],
    queryFn: () => {
      console.log(`🪝 useHadiths hook executing query function for ${collectionName}, book ${bookNumber}`);
      return fetchHadithsFromBook(collectionName, bookNumber, limit, page);
    },
    enabled: !!collectionName && !!bookNumber
  });
};

/**
 * Hook to fetch a specific hadith by number
 */
export const useHadith = (
  collectionName: string,
  hadithNumber: string
) => {
  console.log(`🪝 useHadith hook called with collection: ${collectionName}, hadith: ${hadithNumber}`);
  return useQuery({
    queryKey: [QUERY_KEYS.HADITH, collectionName, hadithNumber],
    queryFn: () => {
      console.log(`🪝 useHadith hook executing query function for ${collectionName}, hadith ${hadithNumber}`);
      return fetchHadithByNumber(collectionName, hadithNumber);
    },
    enabled: !!collectionName && !!hadithNumber
  });
};

/**
 * Hook to fetch a random hadith
 */
export const useRandomHadith = () => {
  console.log(`🪝 useRandomHadith hook called`);
  return useQuery({
    queryKey: [QUERY_KEYS.RANDOM_HADITH],
    queryFn: () => {
      console.log(`🪝 useRandomHadith hook executing query function`);
      return fetchRandomHadith();
    }
  });
};
