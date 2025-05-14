import AsyncStorage from '@react-native-async-storage/async-storage';
import { Like, Match, Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

const LIKES_KEY = '@reuse_likes';
const MATCHES_KEY = '@reuse_matches';

export const saveLike = async (userId: string, productId: string, likedProductId: string): Promise<Like> => {
  try {
    const likes = await getLikes();
    const newLike: Like = {
      id: uuidv4(),
      userId,
      productId,
      likedProductId,
      createdAt: new Date().toISOString(),
    };

    likes.push(newLike);
    await AsyncStorage.setItem(LIKES_KEY, JSON.stringify(likes));

    // Verificar se há match
    const hasMatch = await checkForMatch(userId, productId, likedProductId);
    if (hasMatch) {
      await createMatch(userId, productId, likedProductId);
    }

    return newLike;
  } catch (error) {
    console.error('Erro ao salvar like:', error);
    throw error;
  }
};

export const getLikes = async (): Promise<Like[]> => {
  try {
    const likes = await AsyncStorage.getItem(LIKES_KEY);
    return likes ? JSON.parse(likes) : [];
  } catch (error) {
    console.error('Erro ao buscar likes:', error);
    return [];
  }
};

export const checkForMatch = async (
  userId: string,
  productId: string,
  likedProductId: string
): Promise<boolean> => {
  try {
    const likes = await getLikes();
    return likes.some(
      (like) =>
        like.userId !== userId &&
        like.productId === likedProductId &&
        like.likedProductId === productId
    );
  } catch (error) {
    console.error('Erro ao verificar match:', error);
    return false;
  }
};

export const createMatch = async (
  userId: string,
  productId: string,
  matchedProductId: string
): Promise<Match> => {
  try {
    const matches = await getMatches();
    const newMatch: Match = {
      id: uuidv4(),
      userId,
      productId,
      matchedProductId,
      matchedUserId: '', // Será preenchido quando buscarmos os dados do produto
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    matches.push(newMatch);
    await AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    return newMatch;
  } catch (error) {
    console.error('Erro ao criar match:', error);
    throw error;
  }
};

export const getMatches = async (): Promise<Match[]> => {
  try {
    const matches = await AsyncStorage.getItem(MATCHES_KEY);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Erro ao buscar matches:', error);
    return [];
  }
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  try {
    const matches = await getMatches();
    return matches.filter(
      (match) => match.userId === userId || match.matchedUserId === userId
    );
  } catch (error) {
    console.error('Erro ao buscar matches do usuário:', error);
    return [];
  }
}; 