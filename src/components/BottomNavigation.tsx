import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type BottomNavigationProps = {
  currentScreen: 'trades' | 'profile';
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: keyof RootStackParamList) => {
    if (screen.toLowerCase() === currentScreen) return;
    navigation.navigate(screen);
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigate('Trades')}
      >
        <Image
          source={require('../assets/home-icon.png')}
          style={[
            styles.navIcon,
            currentScreen === 'trades' && styles.activeIcon
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Image
          source={require('../assets/recycle-icon.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navItem, styles.addButton]}
        onPress={() => navigation.navigate('ProductRegistration')}
      >
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
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigate('Profile')}
      >
        <Image
          source={require('../assets/profile-icon.png')}
          style={[
            styles.navIcon,
            currentScreen === 'profile' && styles.activeIcon
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    tintColor: COLORS.gray,
  },
  activeIcon: {
    tintColor: COLORS.primary,
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
});

export default BottomNavigation; 