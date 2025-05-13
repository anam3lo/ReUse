import React, { createContext, useState, useContext, useEffect } from 'react';
import { FavoriteItem, addToFavorites as addToStorage, removeFromFavorites as removeFromStorage, getFavorites as getStorageFavorites } from '../services/storage';

interface FavoritesContextData {
  favorites: FavoriteItem[];
  loading: boolean;
  addToFavorites: (item: Omit<FavoriteItem, 'addedAt'>) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await getStorageFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    try {
      await addToStorage(item);
      await loadFavorites(); // Reload favorites from storage
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await removeFromStorage(productId);
      await loadFavorites(); // Reload favorites from storage
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(item => item.productId === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites(): FavoritesContextData {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
} 