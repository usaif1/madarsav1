// Import services from each module
import { fetchQiblaDirection } from '../../modules/compass/services/qiblaService';
import { fetchAllNames, fetchNameByNumber } from '../../modules/names/services/namesService';
import { fetchCalendarData } from '../../modules/calendar/services/calendarService';
import {
  fetchCollections,
  fetchCollectionByName,
  fetchBooks,
  fetchBookByNumber,
  fetchChapters,
  fetchChapterById,
  fetchHadithsFromBook,
  fetchHadithByNumber,
  fetchRandomHadith
} from '../../modules/hadith/services/hadithService';

// Re-export all services
export const qiblaService = {
  fetchQiblaDirection,
};

export const namesService = {
  fetchAllNames,
  fetchNameByNumber,
};

export const calendarService = {
  fetchCalendarData,
};

export const hadithService = {
  fetchCollections,
  fetchCollectionByName,
  fetchBooks,
  fetchBookByNumber,
  fetchChapters,
  fetchChapterById,
  fetchHadithsFromBook,
  fetchHadithByNumber,
  fetchRandomHadith
};

// Add other services as needed
