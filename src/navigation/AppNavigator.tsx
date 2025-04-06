import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TradesScreen from '../screens/TradesScreen';
import ProductRegistrationScreen from '../screens/ProductRegistrationScreen';

export type RootStackParamList = {
  Login: undefined;
  Trades: undefined;
  ProductRegistration: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Trades" component={TradesScreen} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 