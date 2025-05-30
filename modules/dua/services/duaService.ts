// src/modules/dua/services/duaService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';

// Define interfaces for the duas data structure
export interface DuaItem {
  duaArabic: string;
  duaCategory: string;
  duaEnglish: string;
  duaIconLink: string;
  duaName: string;
  duaSubCategory: string;
  duaSubCategoryDesc: string;
  englishTranslation: string;
  fileExtension: string;
  id: number;
  reference: string;
  referenceVerse: string;
}

// Transformed data for UI
export interface DuaData {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: string;
  subCategory: string;
  subCategoryDesc: string;
  iconLink: string;
  bookmarked?: boolean;
}

export interface DuaCategory {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: string;
}

export interface DuaSubCategory {
  id: string;
  title: string;
  description: string;
  count: number;
  parentCategory: string;
}

// Tasbih interfaces
export interface TasbihItem {
  duaArabic: string;
  duaCategory: string;
  duaEnglish: string;
  duaIconLink: string;
  duaName: string;
  duaSubCategory: string;
  duaSubCategoryDesc: string;
  englishTranslation: string;
  fileExtension: string;
  id: number;
  reference: string;
  referenceVerse: string;
}

export interface TasbihData {
  id: number;
  title: string;
  verses: {
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
  category: string;
  reference?: string;
  referenceVerse?: string;
  count?: number;
}

// API response types
export interface DuasResponse {
  [category: string]: {
    [subCategory: string]: {
      [collection: string]: DuaItem[];
    };
  };
}

export interface TasbihResponse {
  [category: string]: TasbihItem[];
}

/**
 * Parses the nested dua API response into a more usable format
 * @param response The raw API response
 * @returns Structured dua data
 */
export const parseDuaResponse = (response: DuasResponse) => {
  console.log('🤲 Parsing dua response');
  
  const categories: Record<string, Record<string, DuaData[]>> = {};
  const subCategories: Record<string, DuaData[]> = {};
  const allDuas: DuaData[] = [];
  
  // Iterate through categories
  Object.keys(response).forEach(categoryKey => {
    const category = response[categoryKey];
    categories[categoryKey] = {};
    
    // Iterate through sub-categories
    Object.keys(category).forEach(subCategoryKey => {
      const subCategory = category[subCategoryKey];
      
      // Initialize the array for this subcategory if it doesn't exist
      if (!categories[categoryKey][subCategoryKey]) {
        categories[categoryKey][subCategoryKey] = [];
      }
      
      // Iterate through collections
      Object.keys(subCategory).forEach(collectionKey => {
        const duaCollection = subCategory[collectionKey];
        
        // Transform each dua item
        const transformedDuas = duaCollection.map(dua => ({
          id: dua.id,
          title: dua.duaName,
          arabic: dua.duaArabic,
          transliteration: dua.duaEnglish,
          translation: dua.englishTranslation,
          reference: `${dua.reference}`.trim(),
          referenceVerse: `${dua.referenceVerse}`.trim(),
          category: dua.duaCategory,
          subCategory: dua.duaSubCategory,
          subCategoryDesc: dua.duaSubCategoryDesc,
          iconLink: dua.duaIconLink,
        }));
        
        // Append to categories instead of overwriting
        categories[categoryKey][subCategoryKey].push(...transformedDuas);
        
        // Add to sub-categories
        if (!subCategories[subCategoryKey]) {
          subCategories[subCategoryKey] = [];
        }
        subCategories[subCategoryKey].push(...transformedDuas);
        
        // Add to all duas
        allDuas.push(...transformedDuas);
      });
    });
  });
  
  console.log(`🤲 Parsed ${allDuas.length} total duas across ${Object.keys(categories).length} categories`);
  
  return { categories, subCategories, allDuas };
};

/**
 * Parses the tasbih API response
 * @param response The raw API response
 * @returns Structured tasbih data
 */
export const parseTasbihResponse = (response: TasbihResponse) => {
  console.log('📿 Parsing tasbih response');
  
  const categories: Record<string, TasbihData[]> = {};
  const allTasbihs: TasbihData[] = [];
  
  // Iterate through categories
  Object.keys(response).forEach(categoryKey => {
    const tasbihItems = response[categoryKey];
    
    // Transform each tasbih item
    const transformedTasbihs = tasbihItems.map(item => {
      // Create a verses array from the single tasbih item
      const tasbih: TasbihData = {
        id: item.id,
        title: item.duaName,
        verses: [
          {
            arabic: item.duaArabic,
            transliteration: item.duaEnglish,
            translation: item.englishTranslation
          }
        ],
        category: item.duaCategory,
        reference: `${item.reference} ${item.referenceVerse}`.trim()
      };
      
      return tasbih;
    });
    
    // Add to categories
    categories[categoryKey] = transformedTasbihs;
    
    // Add to all tasbihs
    allTasbihs.push(...transformedTasbihs);
  });
  
  return { categories, allTasbihs };
};

/**
 * Fetches all duas from the API
 * @returns Promise with the duas data
 */
export const fetchAllDuas = async (): Promise<{ 
  categories: Record<string, Record<string, DuaData[]>>;
  subCategories: Record<string, DuaData[]>;
  allDuas: DuaData[];
}> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log('🤲 Fetching all duas');
    console.log('🤲 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS, { headers });
    
    console.log('🤲 Successfully fetched all duas');
    console.log('🤲 Response status:', response.status);
    console.log('🤲 Response data:', JSON.stringify(response.data));
    
    return parseDuaResponse(response.data);
  } catch (error) {
    console.error('Error fetching duas:', error);
    throw error;
  }
};

/**
 * Fetches a specific dua by ID
 * @param id The ID of the dua to fetch
 * @returns Promise with the specific dua data
 */
export const fetchDuaById = async (id: number): Promise<DuaData> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`🤲 Fetching dua #${id}`);
    console.log('🤲 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS}/${id}`, { headers });
    
    console.log(`🤲 Successfully fetched dua #${id}`);
    console.log('🤲 Response status:', response.status);
    console.log('🤲 Response data:', JSON.stringify(response.data));
    
    // Transform the dua item
    const dua = response.data;
    return {
      id: dua.id,
      title: dua.duaName,
      arabic: dua.duaArabic,
      transliteration: dua.duaEnglish,
      translation: dua.englishTranslation,
      reference: `${dua.reference} ${dua.referenceVerse}`.trim(),
      category: dua.duaCategory,
      subCategory: dua.duaSubCategory,
      subCategoryDesc: dua.duaSubCategoryDesc,
      iconLink: dua.duaIconLink,
    };
  } catch (error) {
    console.error(`Error fetching dua #${id}:`, error);
    throw error;
  }
};

/**
 * Fetches duas by category
 * @param category The category to filter duas by
 * @returns Promise with the filtered duas data
 */
export const fetchDuasByCategory = async (category: string): Promise<DuaData[]> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`🤲 Fetching duas for category: ${category}`);
    console.log('🤲 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS, {
      params: { category },
      headers
    });
    
    console.log(`🤲 Successfully fetched duas for category: ${category}`);
    console.log('🤲 Response status:', response.status);
    console.log('🤲 Response data:', JSON.stringify(response.data));
    
    // Parse the response and extract duas for the specific category
    const { allDuas } = parseDuaResponse(response.data);
    return allDuas.filter(dua => dua.category === category);
  } catch (error) {
    console.error(`Error fetching duas for category ${category}:`, error);
    throw error;
  }
};

/**
 * Fetches all tasbih duas from the API
 * @returns Promise with the tasbih data
 */
export const fetchAllTasbihs = async (): Promise<{
  categories: Record<string, TasbihData[]>;
  allTasbihs: TasbihData[];
}> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log('📿 Fetching all tasbih duas');
    console.log('📿 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS_TASBIH, { headers });
    
    console.log('📿 Successfully fetched all tasbih duas');
    console.log('📿 Response status:', response.status);
    console.log('📿 Response data:', JSON.stringify(response.data));
    
    return parseTasbihResponse(response.data);
  } catch (error) {
    console.error('Error fetching tasbih duas:', error);
    throw error;
  }
};

/**
 * Fetches a specific tasbih by ID
 * @param id The ID of the tasbih to fetch
 * @returns Promise with the specific tasbih data
 */
export const fetchTasbihById = async (id: number): Promise<TasbihData> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`📿 Fetching tasbih #${id}`);
    console.log('📿 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS_TASBIH}/${id}`, { headers });
    
    console.log(`📿 Successfully fetched tasbih #${id}`);
    console.log('📿 Response status:', response.status);
    console.log('📿 Response data:', JSON.stringify(response.data));
    
    // Transform the tasbih item
    const tasbih = response.data;
    return {
      id: tasbih.id,
      title: tasbih.duaName,
      verses: [
        {
          arabic: tasbih.duaArabic,
          transliteration: tasbih.duaEnglish,
          translation: tasbih.englishTranslation
        }
      ],
      category: tasbih.duaCategory,
      reference: `${tasbih.reference} ${tasbih.referenceVerse}`.trim()
    };
  } catch (error) {
    console.error(`Error fetching tasbih #${id}:`, error);
    throw error;
  }
};
