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
// Example for adding an API key to all requests to a specific API
// apiClients.SUNNAH.interceptors.request.use(
//   (config) => {
//     config.headers['X-API-Key'] = 'your-api-key-here';
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default apiClients;
