import { useState, useEffect, useCallback } from 'react';
import { fetchHadithsFromBook, Hadith } from '../services/hadithService';

export const useHadithChaptersWithPagination = (
  collectionName: string,
  bookNumber: string,
  initialLimit = 10
) => {
  const [data, setData] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(initialLimit);

  const fetchChapters = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchHadithsFromBook(collectionName, bookNumber, limit, currentPage);
      
      // If it's the first page, replace data, otherwise append
      if (currentPage === 1) {
        setData(response.data);
      } else {
        setData(prevData => [...prevData, ...response.data]);
      }
      
      // Check if there are more pages
      setHasMore(response.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hadith chapters'));
    } finally {
      setIsLoading(false);
    }
  }, [collectionName, bookNumber, limit]);

  // Initial fetch
  useEffect(() => {
    fetchChapters(1);
  }, [fetchChapters]);

  // Function to load more chapters
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChapters(nextPage);
    }
  }, [isLoading, hasMore, page, fetchChapters]);

  return {
    data,
    isLoading,
    error,
    loadMore,
    hasMore,
    refetch: () => {
      setPage(1);
      fetchChapters(1);
    }
  };
};