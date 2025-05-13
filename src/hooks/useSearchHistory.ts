import { useState, useEffect, useCallback } from 'react';
import {
  SearchFilter,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
  saveLastUsedFilter,
  getLastUsedFilter
} from '../services/storage';

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchFilter[]>([]);
  const [lastUsedFilter, setLastUsedFilter] = useState<SearchFilter | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSearchHistory = useCallback(async () => {
    try {
      const [history, filter] = await Promise.all([
        getSearchHistory(),
        getLastUsedFilter()
      ]);
      setSearchHistory(history);
      setLastUsedFilter(filter);
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  const addSearch = async (filter: Omit<SearchFilter, 'createdAt'>) => {
    try {
      await addToSearchHistory(filter);
      await saveLastUsedFilter(filter);
      await loadSearchHistory();
    } catch (error) {
      console.error('Error adding search:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  };

  return {
    searchHistory,
    lastUsedFilter,
    loading,
    addSearch,
    clearHistory
  };
} 