import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../components/BottomNavigation';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const StarRating = () => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.ratingContainer}>
      {stars.map((_, index) => (
        <Ionicons
          name={index < 4 ? "star" : "star-outline"}
          size={20}
          color="#4CAF50"
        />
      ))}
    </View>
  );
};

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

     
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert(
                'Erro',
                'Ocorreu um erro ao sair da conta. Tente novamente.'
              );
            }
          },
        },
      ],
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Perfil</Text>
      <TouchableOpacity onPress={() => setShowSettings(true)}>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfo}>
      <View style={styles.profileImageWrapper}>
        <Pressable onPress={pickImage} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
          )}
        </Pressable>
        <TouchableOpacity onPress={pickImage} style={styles.editIconContainer}>
          <Ionicons name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>Ana Clara</Text>
      <Text style={styles.userEmail}>ana.clara@email.com</Text>
      <StarRating />
    </View>
  );

  const renderWeather = () => {
    if (loadingWeather) {
      return (
        <View style={styles.weatherContainer}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      );
    }

    if (!weather) {
      return null;
    }

    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherTitle}>Clima na sua região</Text>
        <View style={styles.weatherContent}>
          <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.weatherDescription}>
            {weather.weather[0].description}
          </Text>
          <Text style={styles.humidity}>
            Umidade: {weather.main.humidity}%
          </Text>
        </View>
      </View>
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>12</Text>
        <Text style={styles.statLabel}>Itens</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>5</Text>
        <Text style={styles.statLabel}>Trocas</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>8</Text>
        <Text style={styles.statLabel}>Avaliações</Text>
      </View>
    </View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.settingsOption}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF0000" />
            <Text style={[styles.optionText, { color: '#FF0000' }]}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView>
        {renderProfileInfo()}
        {renderWeather()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu perfil</Text>
          {renderStats()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu impacto</Text>
          <View style={styles.impactContainer}>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>14%</Text>
              <Text style={styles.impactLabel}>de lixo evitado no consumo</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>48%</Text>
              <Text style={styles.impactLabel}>a menos de emissão de CO₂</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.achievementContainer}>
            <Text style={styles.achievementText}>
              Próxima Marco: Ao atingir 20 trocas, você desbloqueará o selo "Eco-Herói"!
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
          </View>
        </View>
      </ScrollView>
      {renderSettingsModal()}
      <BottomNavigation currentScreen="profile" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    marginBottom: 16,
    position: 'relative',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  impactItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
  },
  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 14,
    color: '#666',
  },
  achievementContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
  },
  achievementText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  weatherContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    margin: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  weatherContent: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: SIZES.extraLarge * 1.5,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  weatherDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textTransform: 'capitalize',
    marginBottom: SIZES.base,
  },
  humidity: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
});

export default ProfileScreen; 