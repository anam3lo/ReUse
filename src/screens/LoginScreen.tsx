import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>ReUse</Text>
          <Text style={styles.subtitle}>
            Faça login para continuar trocando seus itens
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpButtonText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: SIZES.extraLarge * 1.5,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    fontFamily: FONTS.regular,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
  },
  signUpButton: {
    alignItems: 'center',
  },
  signUpButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
}); 