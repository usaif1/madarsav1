// Import services from each module
import { fetchQiblaDirection } from '../../modules/compass/services/qiblaService';
import { fetchAllNames, fetchNameByNumber } from '../../modules/names/services/namesService';
import { fetchCalendarData } from '../../modules/calendar/services/calendarService';

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

// Add other services as needed
