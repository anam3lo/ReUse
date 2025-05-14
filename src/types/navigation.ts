import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Trades: undefined;
  Swipe: undefined;
  Matches: undefined;
  ProductRegistration: undefined;
  ProductDetails: { productId: string };
  Profile: undefined;
  Chat: { productId: string };
  Messages: undefined;
  Match: { productId: string };
  Filter: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 