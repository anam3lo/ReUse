import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const PRODUCTS_KEY = '@products';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  FAVORITES: '@favorites',
  SEARCH_HISTORY: '@search_history',
  FILTERS: '@filters'
} as const;

// Types
export interface SearchFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  createdAt: number;
}

export interface FavoriteItem {
  productId: string;
  title: string;
  imageUrl: string;
  addedAt: number;
}

export const saveProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'userEmail'>) => {
  try {
    // Recupera dados do usuário
    const userData = await AsyncStorage.getItem('@user_data');
    if (!userData) {
      throw new Error('Usuário não encontrado');
    }
    const { email, name } = JSON.parse(userData);

    // Recupera produtos existentes
    const existingProducts = await getProducts();
    
    // Cria novo produto com ID, data e dados do usuário
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      userEmail: email,
      userName: name,
    };

    // Adiciona o novo produto à lista
    const updatedProducts = [...existingProducts, newProduct];
    
    // Salva a lista atualizada
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    
    return newProduct;
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await AsyncStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Erro ao recuperar produtos:', error);
    return [];
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const products = await getProducts();
    const updatedProducts = products.filter(product => product.id !== productId);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

// Favorites management
export const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt'>): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.some(fav => fav.productId === item.productId)) {
      favorites.push({ ...item, addedAt: Date.now() });
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (productId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(item => item.productId !== productId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Search history management
export const addToSearchHistory = async (filter: Omit<SearchFilter, 'createdAt'>): Promise<void> => {
  try {
    const history = await getSearchHistory();
    const newFilter = { ...filter, createdAt: Date.now() };
    
    // Keep only the last 10 searches
    history.unshift(newFilter);
    if (history.length > 10) {
      history.pop();
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding to search history:', error);
    throw error;
  }
};

export const getSearchHistory = async (): Promise<SearchFilter[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
};

// Last used filter management
export const saveLastUsedFilter = async (filter: Omit<SearchFilter, 'createdAt'>): Promise<void> => {
  try {
    const filterWithTimestamp = { ...filter, createdAt: Date.now() };
    await AsyncStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filterWithTimestamp));
  } catch (error) {
    console.error('Error saving last used filter:', error);
    throw error;
  }
};

export const getLastUsedFilter = async (): Promise<SearchFilter | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FILTERS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting last used filter:', error);
    return null;
  }
}; 