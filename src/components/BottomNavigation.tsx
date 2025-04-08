import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type BottomNavigationProps = {
  currentScreen: 'trades' | 'profile' | 'product' | 'messages';
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: keyof RootStackParamList) => {
    if (currentScreen === screen.toLowerCase()) return;
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
            { tintColor: currentScreen === 'trades' ? COLORS.primary : COLORS.gray }
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Image
          source={require('../assets/recycling.png')}
          style={[
            styles.navIcon,
            { tintColor: currentScreen === 'product' ? COLORS.primary : COLORS.gray }
          ]}
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
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => handleNavigate('Messages')}
      >
        <Image
          source={require('../assets/chat-icon.png')}
          style={[
            styles.navIcon,
            { tintColor: currentScreen === 'messages' ? COLORS.primary : COLORS.gray }
          ]}
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
            { tintColor: currentScreen === 'profile' ? COLORS.primary : COLORS.gray }
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