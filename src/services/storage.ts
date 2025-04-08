import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  description: string;
  categories: string[];
  images: string[];
  createdAt: number;
  userName?: string;
  userEmail: string;
}

const PRODUCTS_KEY = '@reuse_products';

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
      createdAt: Date.now(),
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