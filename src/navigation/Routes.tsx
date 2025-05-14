import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductRegistrationScreen from '../screens/ProductRegistrationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TradesScreen from '../screens/TradesScreen';
import ChatScreen from '../screens/ChatScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MatchScreen from '../screens/MatchScreen';
import FilterScreen from '../screens/FilterScreen';
import SwipeScreen from '../screens/SwipeScreen';
import MatchesScreen from '../screens/MatchesScreen';

const Stack = createNativeStackNavigator();

export function Routes() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {signed ? (
          // Rotas autenticadas
          <>
            <Stack.Screen name="Trades" component={TradesScreen} />
            <Stack.Screen name="Swipe" component={SwipeScreen} />
            <Stack.Screen name="Matches" component={MatchesScreen} />
            <Stack.Screen name="ProductRegistration" component={ProductRegistrationScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Match" component={MatchScreen} />
            <Stack.Screen name="Filter" component={FilterScreen} />
          </>
        ) : (
          // Rotas não autenticadas
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 