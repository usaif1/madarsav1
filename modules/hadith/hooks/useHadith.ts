import { useQuery } from '@tanstack/react-query';
import {
  Collection,
  Book,
  Chapter,
  Hadith,
  PaginatedResponse,
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
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTIONS, { limit, page }],
    queryFn: () => fetchCollections(limit, page)
  });
};

/**
 * Hook to fetch a specific collection by name
 */
export const useCollection = (
  collectionName: string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTION, collectionName],
    queryFn: () => fetchCollectionByName(collectionName),
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
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS, collectionName, { limit, page }],
    queryFn: () => fetchBooks(collectionName, limit, page),
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
  return useQuery({
    queryKey: [QUERY_KEYS.BOOK, collectionName, bookNumber],
    queryFn: () => fetchBookByNumber(collectionName, bookNumber),
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
  return useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS, collectionName, bookNumber, { limit, page }],
    queryFn: () => fetchChapters(collectionName, bookNumber, limit, page),
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
  return useQuery({
    queryKey: [QUERY_KEYS.CHAPTER, collectionName, bookNumber, chapterId],
    queryFn: () => fetchChapterById(collectionName, bookNumber, chapterId),
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
  return useQuery({
    queryKey: [QUERY_KEYS.HADITHS, collectionName, bookNumber, { limit, page }],
    queryFn: () => fetchHadithsFromBook(collectionName, bookNumber, limit, page),
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
  return useQuery({
    queryKey: [QUERY_KEYS.HADITH, collectionName, hadithNumber],
    queryFn: () => fetchHadithByNumber(collectionName, hadithNumber),
    enabled: !!collectionName && !!hadithNumber
  });
};

/**
 * Hook to fetch a random hadith
 */
export const useRandomHadith = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RANDOM_HADITH],
    queryFn: () => fetchRandomHadith()
  });
};
