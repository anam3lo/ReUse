import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import BottomNavigation from '../components/BottomNavigation';

interface MatchScreenParams {
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
}

const MatchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product1, product2 } = route.params as MatchScreenParams;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Título do Match */}
        <View style={styles.matchTitleContainer}>
          <Text style={styles.matchTitle}>Troca Perfeita Encontrada!</Text>
        </View>

        {/* Cards dos Produtos */}
        <View style={styles.productsContainer}>
          {/* Produto 1 */}
          <View style={styles.productCard}>
            <Image source={{ uri: product1.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{product1.title}</Text>
            <Text style={styles.userName}>{product1.userName}</Text>
          </View>

          {/* Ícone de Troca */}
          <View style={styles.exchangeIconContainer}>
            <Image
              source={require('../assets/recycling.png')}
              style={styles.exchangeIcon}
            />
          </View>

          {/* Produto 2 */}
          <View style={styles.productCard}>
            <Image source={{ uri: product2.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{product2.title}</Text>
            <Text style={styles.userName}>{product2.userName}</Text>
          </View>
        </View>

        {/* Avatares dos Usuários */}
        <View style={styles.usersContainer}>
          <Image
            source={product1.userImage ? { uri: product1.userImage } : require('../assets/profile-icon.png')}
            style={styles.userAvatar}
          />
          <Image
            source={require('../assets/recycling.png')}
            style={[styles.exchangeIconSmall, { tintColor: COLORS.primary }]}
          />
          <Image
            source={product2.userImage ? { uri: product2.userImage } : require('../assets/profile-icon.png')}
            style={styles.userAvatar}
          />
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { productId: product2.id })}
          >
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('ProductDetails', { productId: product2.id })}
          >
            <Text style={styles.buttonText}>Ver Detalhes da Troca</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructions}>
          Agora é só combinar a entrega e finalizar a troca!
        </Text>
      </View>
      <BottomNavigation currentScreen="trades" />
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
    padding: SIZES.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchTitleContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.large,
    borderRadius: 25,
    marginBottom: SIZES.large,
  },
  matchTitle: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SIZES.large,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    alignItems: 'center',
    width: '40%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
  },
  productTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SIZES.base / 2,
  },
  userName: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  exchangeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exchangeIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGreen,
  },
  exchangeIconSmall: {
    width: 20,
    height: 20,
    marginHorizontal: SIZES.medium,
  },
  buttonsContainer: {
    width: '100%',
    gap: SIZES.medium,
    marginBottom: SIZES.large,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: 25,
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
  },
  instructions: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default MatchScreen; 