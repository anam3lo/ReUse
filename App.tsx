import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { Routes } from './src/navigation/Routes';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Routes />
      </FavoritesProvider>
    </AuthProvider>
  );
} 