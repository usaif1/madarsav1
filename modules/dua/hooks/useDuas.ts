// src/modules/dua/hooks/useDuas.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchAllDuas, 
  fetchDuaById, 
  fetchDuasByCategory,
  fetchAllTasbihs,
  fetchTasbihById,
  DuaData,
  TasbihData,
  DuaCategory,
  DuaSubCategory
} from '../services/duaService';
import { useDuaStore } from '../store/duaStore';
import { useMemo, useEffect } from 'react';

/**
 * Hook to fetch all duas and organize them into categories
 * @returns Query result with all duas data
 */
export const useAllDuas = () => {
  const { setDuaCategories, setDuaSubCategories, setAllDuas } = useDuaStore();
  
  const result = useQuery({
    queryKey: ['duas'],
    queryFn: fetchAllDuas,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - duas don't change frequently
  });
  
  // Update the store when data is available
  useEffect(() => {
    if (result.data) {
      setDuaCategories(result.data.categories);
      setDuaSubCategories(result.data.subCategories);
      setAllDuas(result.data.allDuas);
    }
  }, [result.data, setDuaCategories, setDuaSubCategories, setAllDuas]);
  
  return result;
};

/**
 * Hook to get dua categories for the UI
 * @returns Array of dua categories with counts
 */
export const useDuaCategories = () => {
  const { duaCategories, allDuas } = useDuaStore();
  
  return useMemo(() => {
    const categories: DuaCategory[] = [];
    
    Object.keys(duaCategories).forEach((categoryKey, index) => {
      // Count total duas in this category
      let totalCount = 0;
      const subCategories = duaCategories[categoryKey];
      
      Object.keys(subCategories).forEach(subCategoryKey => {
        totalCount += subCategories[subCategoryKey].length;
      });
      
      // Find a sample dua to get the category details
      const sampleDua = allDuas.find(dua => dua.category === categoryKey);
      
      if (sampleDua) {
        categories.push({
          id: index.toString(),
          title: categoryKey,
          description: `Duas for ${categoryKey}`,
          count: totalCount,
          icon: sampleDua.iconLink || ''
        });
      }
    });
    
    return categories;
  }, [duaCategories, allDuas]);
};

/**
 * Hook to get dua sub-categories for a specific category
 * @param category The category to get sub-categories for
 * @returns Array of dua sub-categories with counts
 */
export const useDuaSubCategories = (category: string) => {
  const { duaCategories } = useDuaStore();
  
  return useMemo(() => {
    const subCategories: DuaSubCategory[] = [];
    
    if (duaCategories[category]) {
      Object.keys(duaCategories[category]).forEach((subCategoryKey, index) => {
        const count = duaCategories[category][subCategoryKey].length;
        
        subCategories.push({
          id: index.toString(),
          title: subCategoryKey,
          description: `${subCategoryKey} duas`,
          count,
          parentCategory: category
        });
      });
    }
    
    return subCategories;
  }, [duaCategories, category]);
};

/**
 * Hook to get duas for a specific sub-category
 * @param category The main category
 * @param subCategory The sub-category
 * @returns Array of duas in the sub-category
 */
export const useDuasBySubCategory = (category: string, subCategory: string) => {
  const { duaCategories, isDuaSaved } = useDuaStore();
  
  return useMemo(() => {
    if (duaCategories[category] && duaCategories[category][subCategory]) {
      // Add bookmarked status to each dua
      return duaCategories[category][subCategory].map(dua => ({
        ...dua,
        bookmarked: isDuaSaved(dua.id)
      }));
    }
    return [];
  }, [duaCategories, category, subCategory, isDuaSaved]);
};

/**
 * Hook to fetch a specific dua by ID
 * @param id The ID of the dua to fetch
 * @returns Query result with the specific dua data
 */
export const useDuaById = (id: number) => {
  const { isDuaSaved } = useDuaStore();
  
  const query = useQuery<DuaData, Error>({
    queryKey: ['dua', id],
    queryFn: () => fetchDuaById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  
  // Add bookmarked status to the dua
  const duaWithBookmark = useMemo(() => {
    if (query.data) {
      return {
        ...query.data,
        bookmarked: isDuaSaved(query.data.id)
      };
    }
    return undefined;
  }, [query.data, isDuaSaved]);
  
  return { ...query, data: duaWithBookmark };
};

/**
 * Hook to fetch duas by category
 * @param category The category to filter duas by
 * @returns Query result with the filtered duas data
 */
export const useDuasByCategory = (category: string) => {
  const { isDuaSaved } = useDuaStore();
  
  const query = useQuery<DuaData[], Error>({
    queryKey: ['duas', 'category', category],
    queryFn: () => fetchDuasByCategory(category),
    enabled: !!category, // Only run if category is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  
  // Add bookmarked status to each dua
  const duasWithBookmarks = useMemo(() => {
    if (query.data) {
      return query.data.map(dua => ({
        ...dua,
        bookmarked: isDuaSaved(dua.id)
      }));
    }
    return undefined;
  }, [query.data, isDuaSaved]);
  
  return { ...query, data: duasWithBookmarks };
};

/**
 * Hook to get saved duas
 * @returns Array of saved duas
 */
export const useSavedDuas = () => {
  const { getSavedDuas } = useDuaStore();
  return getSavedDuas();
};

/**
 * Hook to fetch all tasbih duas
 * @returns Query result with all tasbih data
 */
export const useAllTasbihs = () => {
  const { setTasbihCategories, setAllTasbihs } = useDuaStore();
  
  const result = useQuery({
    queryKey: ['tasbihs'],
    queryFn: fetchAllTasbihs,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - tasbihs don't change
  });
  
  // Update the store when data is available
  useEffect(() => {
    if (result.data) {
      setTasbihCategories(result.data.categories);
      setAllTasbihs(result.data.allTasbihs);
    }
  }, [result.data, setTasbihCategories, setAllTasbihs]);
  
  return result;
};

/**
 * Hook to get tasbih categories for the UI
 * @returns Array of tasbih categories
 */
export const useTasbihCategories = () => {
  const { tasbihCategories } = useDuaStore();
  
  return useMemo(() => {
    return Object.keys(tasbihCategories).map(categoryKey => ({
      id: categoryKey,
      title: categoryKey,
      tasbihs: tasbihCategories[categoryKey]
    }));
  }, [tasbihCategories]);
};

/**
 * Hook to fetch a specific tasbih by ID
 * @param id The ID of the tasbih to fetch
 * @returns Query result with the specific tasbih data
 */
export const useTasbihById = (id: number) => {
  return useQuery<TasbihData, Error>({
    queryKey: ['tasbih', id],
    queryFn: () => fetchTasbihById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to get all tasbihs
 * @returns Array of all tasbihs
 */
export const useAllTasbihsList = () => {
  const { allTasbihs } = useDuaStore();
  return allTasbihs;
};
