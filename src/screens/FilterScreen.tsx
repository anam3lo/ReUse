import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Slider from '@react-native-community/slider';

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

const FilterScreen = () => {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [distance, setDistance] = useState(10);

  const toggleCategory = (value: string) => {
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(cat => cat !== value)
        : [...prev, value]
    );
  };

  const handleApplyFilter = () => {
   
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filtros</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Pressable style={styles.locationButton}>
            <Text style={styles.locationText}>Pessoas próximas</Text>
            <Image
              source={require('../assets/back-icon.png')}
              style={[styles.arrowIcon, { transform: [{ rotate: '180deg' }] }]}
            />
          </Pressable>
        </View>

        {/* Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferência de categorias</Text>
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
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategories.includes(category.value) && styles.categoryButtonTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Distância */}
        <View style={styles.section}>
          <View style={styles.distanceHeader}>
            <Text style={styles.sectionTitle}>Distância</Text>
            <Text style={styles.distanceValue}>{Math.round(distance)}km</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray + '40'}
            thumbTintColor={COLORS.primary}
            step={1}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyFilter}
      >
        <Text style={styles.applyButtonText}>Aplicar o filtro</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    marginBottom: SIZES.base,
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  locationText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  categoryButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray + '40',
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
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  distanceValue: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyButton: {
    margin: SIZES.medium,
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
  },
});

export default FilterScreen; 