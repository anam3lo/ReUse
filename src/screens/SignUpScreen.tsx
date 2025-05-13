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

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await signUp(name, email, password);
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao criar conta'
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/back-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha seus dados para começar a trocar
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.signUpButtonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginButtonText}>
              Já tem uma conta? Faça login
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
    padding: SIZES.padding,
  },
  backButton: {
    marginBottom: SIZES.padding,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerContainer: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
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
  signUpButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
}); 