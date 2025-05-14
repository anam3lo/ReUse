import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { getProducts } from '../services/storage';
import { saveLike } from '../services/matchService';
import { Product } from '../types';
import BottomNavigation from '../components/BottomNavigation';

const { width } = Dimensions.get('window');

export const SwipeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts();
      // Filtrar produtos do usuário atual
      const filteredProducts = allProducts.filter(
        (product) => product.userId !== user?.id
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeRight = async (index: number) => {
    try {
      const likedProduct = products[index];
      if (!user || !likedProduct) return;

      await saveLike(user.id, likedProduct.id, likedProduct.id);
      // A verificação de match é feita dentro do saveLike
    } catch (error) {
      console.error('Erro ao salvar like:', error);
    }
  };

  const handleSwipeLeft = (index: number) => {
    // Apenas registra o dislike
    console.log('Dislike:', products[index]?.title);
  };

  const renderCard = (product: Product) => {
    if (!product) return null;

    return (
      <View style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {product.description}
          </Text>
          <View style={styles.userInfo}>
            <Ionicons name="person" size={16} color={COLORS.gray} />
            <Text style={styles.userName}>{product.userName}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Descubra Itens</Text>
        <TouchableOpacity
          style={styles.matchesButton}
          onPress={() => navigation.navigate('Matches')}
        >
          <Ionicons name="heart" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <Swiper
          cards={products}
          renderCard={renderCard}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          cardIndex={0}
          backgroundColor={COLORS.white}
          stackSize={3}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          overlayLabels={{
            left: {
              title: 'NÃO',
              style: {
                label: {
                  backgroundColor: COLORS.error,
                  color: COLORS.white,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'SIM',
              style: {
                label: {
                  backgroundColor: COLORS.primary,
                  color: COLORS.white,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Não há mais itens para descobrir
          </Text>
        </View>
      )}

      <BottomNavigation currentScreen="swipe" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  matchesButton: {
    padding: 8,
  },
  card: {
    width: width * 0.9,
    height: width * 1.3,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default SwipeScreen; 