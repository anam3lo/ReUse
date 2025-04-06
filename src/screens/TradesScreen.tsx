import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getProducts, Product } from '../services/storage';
import BottomNavigation from '../components/BottomNavigation';

const TradesScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('your'); // 'your' | 'new'
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Trocas</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require('../assets/search-icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require('../assets/filter-icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'your' && styles.activeTab]}
        onPress={() => setActiveTab('your')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'your' && styles.activeTabText,
          ]}
        >
          Suas trocas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'new' && styles.activeTab]}
        onPress={() => setActiveTab('new')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'new' && styles.activeTabText,
          ]}
        >
          Novas trocas
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = (product: Product) => (
    <TouchableOpacity key={product.id} style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.cardCategories}>
          {product.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity>
          <Image
            source={require('../assets/share-icon.png')}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../assets/like-icon.png')}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {products.map(renderProductCard)}
      </ScrollView>
      <BottomNavigation currentScreen="trades" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: SIZES.base,
    padding: SIZES.base,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: SIZES.base,
    backgroundColor: COLORS.lightGreen + '20',
    margin: SIZES.medium,
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SIZES.medium,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: SIZES.base,
    borderTopRightRadius: SIZES.base,
  },
  cardContent: {
    padding: SIZES.medium,
  },
  cardDescription: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  cardCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: COLORS.lightGreen + '40',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  categoryTagText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray + '20',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginLeft: SIZES.medium,
  },
});

export default TradesScreen; 