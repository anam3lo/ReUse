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
  Alert,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getProducts, Product, deleteProduct } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../components/BottomNavigation';

const TradesScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('your'); // 'your' | 'new'
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const { email } = JSON.parse(userData);
        setCurrentUserEmail(email);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    loadUserData();
    loadProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Excluir item",
      "Tem certeza que deseja excluir este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              await loadProducts();
            } catch (error) {
              console.error('Erro ao deletar produto:', error);
              Alert.alert("Erro", "Não foi possível excluir o item.");
            }
          }
        }
      ]
    );
  };

  const filterProducts = () => {
    if (!currentUserEmail) return [];
    
    return products.filter(product => {
      const isUserProduct = product.userEmail === currentUserEmail;
      if (activeTab === 'your') {
        return isUserProduct;
      } else {
        return !isUserProduct;
      }
    });
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
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Filter')}
        >
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
        <Text style={styles.cardTitle}>{product.description}</Text>
        <Text style={styles.userName}>{product.userName || "Usuário"}</Text>
        <Text style={styles.distance}>1.5km de distância</Text>
        <View style={styles.cardCategories}>
          {product.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.cardActions}>
        {activeTab === 'new' ? (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
              <Image
                source={require('../assets/close-icon.png')}
                style={[styles.actionIcon, { tintColor: COLORS.red }]}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.infoButton]}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
            >
              <Image
                source={require('../assets/info-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.recycleButton]}
              onPress={() => {
                // Recupera o produto do usuário atual que melhor combina com este
                const userProduct = products.find(p => 
                  p.userEmail === currentUserEmail && 
                  p.categories.some(cat => product.categories.includes(cat))
                );

                if (userProduct) {
                  navigation.navigate('Match', {
                    product1: {
                      id: userProduct.id,
                      image: userProduct.images[0],
                      title: userProduct.description,
                      userName: userProduct.userName || 'Você',
                    },
                    product2: {
                      id: product.id,
                      image: product.images[0],
                      title: product.description,
                      userName: product.userName || 'Usuário',
                    },
                  });
                } else {
                  Alert.alert(
                    'Nenhum match encontrado',
                    'Você ainda não tem produtos cadastrados que combinem com este item.'
                  );
                }
              }}
            >
              <Image
                source={require('../assets/recycling.png')}
                style={[styles.actionIcon, { tintColor: COLORS.primary }]}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}>
              <Image
                source={require('../assets/info-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { productId: product.id })}>
              <Image
                source={require('../assets/chat-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
              <Image
                source={require('../assets/trash-icon.png')}
                style={[styles.actionIcon, { tintColor: COLORS.red }]}
              />
            </TouchableOpacity>
          </>
        )}
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
        {filterProducts().map(renderProductCard)}
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
  cardTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  userName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  distance: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  cardCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base / 2,
  },
  categoryTag: {
    backgroundColor: COLORS.lightGreen + '30',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base / 2,
  },
  categoryTagText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.medium,
    gap: SIZES.extraLarge * 2,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  rejectButton: {
    backgroundColor: COLORS.white,
  },
  infoButton: {
    backgroundColor: COLORS.white,
  },
  recycleButton: {
    backgroundColor: COLORS.white,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
});

export default TradesScreen; 