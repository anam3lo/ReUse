import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { getUserMatches } from '../services/matchService';
import { getProducts } from '../services/storage';
import { Match, Product } from '../types';
import BottomNavigation from '../components/BottomNavigation';

interface MatchWithProducts extends Match {
  product: Product;
  matchedProduct: Product;
}

export const MatchesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      if (!user) return;

      const userMatches = await getUserMatches(user.id);
      const allProducts = await getProducts();

      const matchesWithProducts = userMatches.map((match) => {
        const product = allProducts.find((p) => p.id === match.productId);
        const matchedProduct = allProducts.find(
          (p) => p.id === match.matchedProductId
        );

        return {
          ...match,
          product: product!,
          matchedProduct: matchedProduct!,
        };
      });

      setMatches(matchesWithProducts);
    } catch (error) {
      console.error('Erro ao carregar matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (match: MatchWithProducts) => {
    // Será implementado no próximo prompt
    console.log('Iniciar chat com:', match.matchedProduct.userName);
  };

  const renderMatchItem = ({ item }: { item: MatchWithProducts }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => handleStartChat(item)}
    >
      <View style={styles.matchContent}>
        <View style={styles.productsContainer}>
          <Image
            source={{ uri: item.product.images[0] }}
            style={styles.productImage}
          />
          <View style={styles.matchIconContainer}>
            <Ionicons name="heart" size={24} color={COLORS.primary} />
          </View>
          <Image
            source={{ uri: item.matchedProduct.images[0] }}
            style={styles.productImage}
          />
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.matchTitle}>
            Match com {item.matchedProduct.userName}
          </Text>
          <Text style={styles.matchDescription}>
            Você e {item.matchedProduct.userName} demonstraram interesse em trocar
            itens
          </Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => handleStartChat(item)}
          >
            <Text style={styles.chatButtonText}>Iniciar Conversa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Seus Matches</Text>
      </View>

      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>
            Você ainda não tem matches. Continue deslizando para encontrar
            trocas!
          </Text>
        </View>
      )}

      <BottomNavigation currentScreen="matches" />
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  listContainer: {
    padding: 16,
  },
  matchItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchContent: {
    padding: 16,
  },
  productsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  matchIconContainer: {
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchInfo: {
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  matchDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default MatchesScreen; 