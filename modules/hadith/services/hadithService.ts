import apiClients from '@/api/clients/globalClient';
import { API_ENDPOINTS } from '@/api/config/apiConfig';

// Types for API responses
export interface Collection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection: {
    lang: string;
    title: string;
    shortIntro: string;
  }[];
  totalHadith: number;
  totalAvailableHadith: number;
}

export interface Book {
  bookNumber: string;
  book: {
    lang: string;
    name: string;
  }[];
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

export interface Chapter {
  bookNumber: string;
  chapterId: string;
  chapter: {
    lang: string;
    chapterNumber: string;
    chapterTitle: string;
    intro: string | null;
    ending: string | null;
  }[];
}

export interface Hadith {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: {
    lang: string;
    chapterNumber: string;
    chapterTitle: string;
    urn: number;
    body: string;
    grades: {
      graded_by: string;
      grade: string;
    }[];
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  previous: number | null;
  next: number | null;
}

// API functions

/**
 * Fetch all available hadith collections
 * @param limit Maximum number of items to return (default: 50, max: 100)
 * @param page Page number for pagination (default: 1)
 */
export const fetchCollections = async (limit = 50, page = 1): Promise<PaginatedResponse<Collection>> => {
  try {
    console.log('Fetching hadith collections...');
    const response = await apiClients.SUNNAH.get(`${API_ENDPOINTS.COLLECTIONS}`, {
      params: { limit, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hadith collections:', error);
    throw error;
  }
};

/**
 * Fetch details of a specific collection
 * @param collectionName Name of the collection (e.g., 'bukhari')
 */
export const fetchCollectionByName = async (collectionName: string): Promise<Collection> => {
  try {
    console.log(`Fetching collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(`${API_ENDPOINTS.COLLECTIONS}/${collectionName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch books of a specific collection
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param limit Maximum number of items to return (default: 50, max: 100)
 * @param page Page number for pagination (default: 1)
 */
export const fetchBooks = async (
  collectionName: string,
  limit = 50,
  page = 1
): Promise<PaginatedResponse<Book>> => {
  try {
    console.log(`Fetching books for collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.BOOKS}`,
      { params: { limit, page } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching books for collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch a specific book from a collection
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param bookNumber Number of the book
 */
export const fetchBookByNumber = async (
  collectionName: string,
  bookNumber: string
): Promise<Book> => {
  try {
    console.log(`Fetching book ${bookNumber} from collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.BOOKS}/${bookNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${bookNumber} from collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch chapters of a specific book
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param bookNumber Number of the book
 * @param limit Maximum number of items to return (default: 50, max: 100)
 * @param page Page number for pagination (default: 1)
 */
export const fetchChapters = async (
  collectionName: string,
  bookNumber: string,
  limit = 50,
  page = 1
): Promise<PaginatedResponse<Chapter>> => {
  try {
    console.log(`Fetching chapters for book ${bookNumber} from collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.BOOKS}/${bookNumber}${API_ENDPOINTS.CHAPTERS}`,
      { params: { limit, page } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookNumber} from collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch a specific chapter from a book
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param bookNumber Number of the book
 * @param chapterId ID of the chapter
 */
export const fetchChapterById = async (
  collectionName: string,
  bookNumber: string,
  chapterId: string
): Promise<Chapter> => {
  try {
    console.log(`Fetching chapter ${chapterId} from book ${bookNumber} in collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.BOOKS}/${bookNumber}${API_ENDPOINTS.CHAPTERS}/${chapterId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapter ${chapterId} from book ${bookNumber} in collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch hadiths from a specific book
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param bookNumber Number of the book
 * @param limit Maximum number of items to return (default: 50, max: 100)
 * @param page Page number for pagination (default: 1)
 */
export const fetchHadithsFromBook = async (
  collectionName: string,
  bookNumber: string,
  limit = 50,
  page = 1
): Promise<PaginatedResponse<Hadith>> => {
  try {
    console.log(`Fetching hadiths from book ${bookNumber} in collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.BOOKS}/${bookNumber}${API_ENDPOINTS.HADITHS}`,
      { params: { limit, page } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching hadiths from book ${bookNumber} in collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch a specific hadith from a collection
 * @param collectionName Name of the collection (e.g., 'bukhari')
 * @param hadithNumber Number of the hadith
 */
export const fetchHadithByNumber = async (
  collectionName: string,
  hadithNumber: string
): Promise<Hadith> => {
  try {
    console.log(`Fetching hadith ${hadithNumber} from collection: ${collectionName}`);
    const response = await apiClients.SUNNAH.get(
      `${API_ENDPOINTS.COLLECTIONS}/${collectionName}${API_ENDPOINTS.HADITHS}/${hadithNumber}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching hadith ${hadithNumber} from collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch a random hadith
 */
export const fetchRandomHadith = async (): Promise<Hadith> => {
  try {
    console.log('Fetching a random hadith...');
    const response = await apiClients.SUNNAH.get(`${API_ENDPOINTS.HADITHS}/random`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random hadith:', error);
    throw error;
  }
};
