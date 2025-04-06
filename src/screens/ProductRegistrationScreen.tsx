import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { saveProduct } from '../services/storage';

const categories = [
  { id: 1, label: 'Produto novo', value: 'novo' },
  { id: 2, label: 'Produto usado', value: 'usado' },
  { id: 3, label: 'Móveis', value: 'moveis' },
  { id: 4, label: 'Produto semi-novo', value: 'semi-novo' },
  { id: 5, label: 'Eletrônicos', value: 'eletronicos' },
  { id: 6, label: 'Roupas', value: 'roupas' },
  { id: 7, label: 'Eletrodoméstico', value: 'eletrodomestico' },
  { id: 8, label: 'Esportes', value: 'esportes' },
  { id: 9, label: 'Instrumentos', value: 'instrumentos' },
  { id: 10, label: 'Hobbies', value: 'hobbies' },
  { id: 11, label: 'Peças e automóveis', value: 'auto' },
  { id: 12, label: 'Ferramentas', value: 'ferramentas' },
  { id: 13, label: 'Infantil', value: 'infantil' },
  { id: 14, label: 'Colecionáveis', value: 'colecao' },
  { id: 15, label: 'Entretenimento', value: 'entretenimento' },
];

const MAX_IMAGES = 7; // 1 principal + 6 miniaturas

const ProductRegistrationScreen = ({ navigation }: any) => {
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à sua galeria para adicionar fotos.'
      );
      return false;
    }
    return true;
  };

  const handleAddImage = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert('Limite atingido', 'Você já adicionou o número máximo de fotos.');
        return;
      }

      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a imagem. Tente novamente.');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderImage = (uri: string, index: number) => (
    <View key={index} style={index === 0 ? styles.mainImageContainer : styles.thumbnailButton}>
      <Image source={{ uri }} style={styles.productImage} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeImageText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev => 
      prev.includes(value)
        ? prev.filter(cat => cat !== value)
        : [...prev, value]
    );
  };

  const validateForm = () => {
    if (images.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma foto do produto.');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Adicione uma descrição para o produto.');
      return false;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma categoria.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setIsLoading(true);

      await saveProduct({
        description: description.trim(),
        categories: selectedCategories,
        images,
      });

      Alert.alert(
        'Sucesso',
        'Produto cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Trades'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require('../assets/back-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Produto</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Fotos do produto */}
        <Text style={styles.sectionTitle}>Fotos do produto</Text>
        <View style={styles.imageGrid}>
          {images.length > 0 ? (
            <>
              {renderImage(images[0], 0)}
              <View style={styles.thumbnailsContainer}>
                {images.slice(1).map((uri, index) => renderImage(uri, index + 1))}
                {images.length < MAX_IMAGES && (
                  <TouchableOpacity
                    style={styles.thumbnailButton}
                    onPress={handleAddImage}
                  >
                    <Image
                      source={require('../assets/camera-icon.png')}
                      style={styles.cameraIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.mainImageContainer, styles.emptyMainImage]}
              onPress={handleAddImage}
            >
              <Image
                source={require('../assets/camera-icon.png')}
                style={styles.cameraIcon}
              />
              <Text style={styles.addPhotoText}>Adicionar foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Descrição do produto */}
        <Text style={styles.sectionTitle}>Descrição do produto</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Descreva seu produto aqui..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias do produto</Text>
        <View style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category.value) && styles.categoryButtonSelected,
              ]}
              onPress={() => toggleCategory(category.value)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategories.includes(category.value) && styles.categoryButtonTextSelected,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de cadastro */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Cadastre o produto agora!</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/home-icon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/recycle-icon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.addButton]}>
          <Image
            source={require('../assets/plus-icon.png')}
            style={styles.addIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/share-icon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../assets/profile-icon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: SIZES.base,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginLeft: SIZES.base,
  },
  content: {
    flex: 1,
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  imageGrid: {
    marginBottom: SIZES.large,
  },
  mainImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray + '20',
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  thumbnailButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    minHeight: 100,
    marginBottom: SIZES.large,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.large,
  },
  categoryButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  categoryButtonTextSelected: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray + '20',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.base,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  emptyMainImage: {
    backgroundColor: COLORS.gray + '20',
  },
  addPhotoText: {
    marginTop: SIZES.base,
    color: COLORS.gray,
    fontSize: SIZES.font,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default ProductRegistrationScreen; 