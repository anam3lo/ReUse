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
    await AsyncStorage.multiRemove(['@user_token', '@login_type']);
    return true;
  } catch (error) {
    return false;
  }
}; 