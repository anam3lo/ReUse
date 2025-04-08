import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  PhoneLogin: undefined;
  SignUp: undefined;
  Trades: undefined;
  Profile: undefined;
  Messages: undefined;
  ProductRegistration: undefined;
  Filter: undefined;
  ProductDetails: { productId: string };
  Chat: { 
    productId: string;
    title?: string;
    image?: string;
  };
  Match: {
    product1: {
      id: string;
      image: string;
      title: string;
      userName: string;
      userImage?: string;
    };
    product2: {
      id: string;
      image: string;
      title: string;
      userName: string;
      userImage?: string;
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 