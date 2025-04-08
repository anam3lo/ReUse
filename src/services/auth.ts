import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuthStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('@user_token');
    return !!token;
  } catch (error) {
    return false;
  }
};

export const logout = async () => {
  try {
    // Limpa todos os dados do usuário
    await AsyncStorage.multiRemove([
      '@user_token', 
      '@login_type', 
      '@user_data',
      '@user_profile',
      '@user_preferences'
    ]);
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
}; 