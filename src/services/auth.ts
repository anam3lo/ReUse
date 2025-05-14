import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Simulando um banco de dados de usuários
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Clara',
    email: 'ana.clara@email.com',
    password: '123456'
  }
];

// Chaves para armazenamento local
const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

// Função auxiliar para gerar token (simulado)
const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Verifica se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  } catch {
    return false;
  }
};

// Login com email e senha
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  const token = generateToken();
  const authData: AuthResponse = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };

  // Salva os dados localmente
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));

  return authData;
};

// Registro de novo usuário
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verifica se o email já está em uso
  if (MOCK_USERS.some(u => u.email === email)) {
    throw new Error('Email já cadastrado');
  }

  // Cria novo usuário
  const newUser: User = {
    id: (MOCK_USERS.length + 1).toString(),
    name,
    email,
    password
  };

  // Adiciona ao "banco de dados"
  MOCK_USERS.push(newUser);

  const token = generateToken();
  const authData: AuthResponse = {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    },
    token
  };

  // Salva os dados localmente
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));

  return authData;
};

// Logout
export const logout = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    return true;
  } catch {
    return false;
  }
};

// Recupera dados do usuário atual
export const getCurrentUser = async (): Promise<Omit<User, 'password'> | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}; 