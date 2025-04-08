import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Product, getProducts } from '../services/storage';

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = route.params as { productId: string };

  useEffect(() => {
    const loadProduct = async () => {
      const products = await getProducts();
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    };
    loadProduct();
  }, [productId]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back-icon.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.loading}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat', { productId: product.id })}
        >
          <Image
            source={require('../assets/chat-icon.png')}
            style={styles.chatIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.description}</Text>
          <Text style={styles.userName}>Publicado por {product.userName || "Usuário"}</Text>
          
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesContainer}>
            {product.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Data de publicação</Text>
          <Text style={styles.date}>
            {new Date(product.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </ScrollView>
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
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  chatButton: {
    padding: SIZES.base,
  },
  chatIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  infoContainer: {
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  userName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginTop: SIZES.medium,
    marginBottom: SIZES.base,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },
  categoryTag: {
    backgroundColor: COLORS.lightGreen + '40',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  categoryText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  date: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  loading: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.extraLarge,
  },
});

export default ProductDetailsScreen; 