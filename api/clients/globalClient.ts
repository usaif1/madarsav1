import axios from 'axios';
import { API_URLS } from '../config/apiConfig';

// Create a map of base URLs to Axios instances
const apiClients = {
  ISLAMIC_DEVELOPERS: axios.create({
    baseURL: API_URLS.ISLAMIC_DEVELOPERS,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  ALADHAN: axios.create({
    baseURL: API_URLS.ALADHAN,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  SUNNAH: axios.create({
    baseURL: API_URLS.SUNNAH,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  QURAN: axios.create({
    baseURL: API_URLS.QURAN,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
};

// Add request/response interceptors if needed
// Add API key to all requests to Sunnah.com API
apiClients.SUNNAH.interceptors.request.use(
  (config) => {
    // Replace with your actual API key from Sunnah.com
    config.headers['X-API-Key'] = 'SomeTemporaryKeyForDevelopment123';
    return config;
  },
  (error) => Promise.reject(error)
);

// Named exports for specific clients
export const aladhanClient = apiClients.ALADHAN;
export const sunnahClient = apiClients.SUNNAH;
export const quranClient = apiClients.QURAN;
export const islamicDevelopersClient = apiClients.ISLAMIC_DEVELOPERS;

export default apiClients;
