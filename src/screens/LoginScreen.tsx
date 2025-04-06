import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAuthStatus } from '../services/auth';

const LoginScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const isAuthenticated = await checkAuthStatus();
      if (isAuthenticated) {
        navigation.replace('Trades');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handlePhoneLogin = async () => {
    try {
      setIsLoading(true);
      // Aqui você implementaria a lógica de autenticação por telefone
      // Por enquanto, vamos simular um login bem-sucedido
      await AsyncStorage.setItem('@user_token', 'dummy_token');
      await AsyncStorage.setItem('@login_type', 'phone');
      navigation.replace('Trades');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Aqui você implementaria a lógica de autenticação com Google
      // Por enquanto, vamos simular um login bem-sucedido
      await AsyncStorage.setItem('@user_token', 'dummy_token');
      await AsyncStorage.setItem('@login_type', 'google');
      navigation.replace('Trades');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login com o Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Círculo animado com imagens */}
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.centerImage}
            />
          </View>
        </View>

        {/* Texto principal */}
        <Text style={styles.title}>Lorem ipsum</Text>
        <Text style={styles.subtitle}>dolor sit amet.</Text>

        {/* Botões de login */}
        <TouchableOpacity
          style={[styles.button, styles.phoneButton]}
          onPress={handlePhoneLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Image
                source={require('../assets/phone-icon.png')}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Login pelo número</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.black} />
          ) : (
            <>
              <Image
                source={require('../assets/google-icon.png')}
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, styles.googleButtonText]}>
                Login pelo Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Link para cadastro */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Cadastre-se agora!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.extraLarge,
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.extraLarge * 2,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  phoneButton: {
    backgroundColor: COLORS.primary,
  },
  googleButton: {
    backgroundColor: COLORS.lightGreen,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: SIZES.base,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.medium,
  },
  googleButtonText: {
    color: COLORS.black,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: SIZES.large,
  },
  signupText: {
    color: COLORS.gray,
    fontSize: SIZES.font,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen; 