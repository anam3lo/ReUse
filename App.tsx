import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import PhoneLoginScreen from './src/screens/PhoneLoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TradesScreen from './src/screens/TradesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProductRegistrationScreen from './src/screens/ProductRegistrationScreen';
import FilterScreen from './src/screens/FilterScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ChatScreen from './src/screens/ChatScreen';
import MatchScreen from './src/screens/MatchScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Trades" component={TradesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistrationScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Match" component={MatchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 