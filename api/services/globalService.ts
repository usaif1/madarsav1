// Import services from each module
import { fetchQiblaDirection } from '../../modules/compass/services/qiblaService';
import { fetchAllNames, fetchNameByNumber } from '../../modules/names/services/namesService';

// Re-export all services
export const qiblaService = {
  fetchQiblaDirection,
};

export const namesService = {
  fetchAllNames,
  fetchNameByNumber,
};

// Add other services as needed
