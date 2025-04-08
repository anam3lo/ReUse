import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import BottomNavigation from '../components/BottomNavigation';

interface MessageItem {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  image: any;
  hasUnread: boolean;
  productId: string;
}

// Dados mockados para as possíveis trocas
const possibleTrades = [
  { id: '1', image: require('../assets/ps4.png') },
  { id: '2', image: require('../assets/instax.png') },
  { id: '3', image: require('../assets/sofa.png') },
  { id: '4', image: require('../assets/casio.png') },
  { id: '5', image: require('../assets/instax-mini.png') },
  { id: '6', image: require('../assets/cadeira.png') },
];

// Dados mockados para as mensagens
const messages = [
  {
    id: '1',
    title: 'Controle de PS4',
    lastMessage: 'Claro, qual é a sua dúvida?',
    time: '15:17',
    image: require('../assets/ps4.png'),
    hasUnread: true,
    productId: 'ps4-001',
  },
  {
    id: '2',
    title: 'Instax Mini 12',
    lastMessage: 'O produto está em ótimo estado e...',
    time: '12:34',
    image: require('../assets/instax.png'),
    hasUnread: false,
    productId: 'instax-001',
  },
  {
    id: '3',
    title: 'Sofá dois lugares',
    lastMessage: 'Estou fazendo a troca pq vou...',
    time: '12:10',
    image: require('../assets/sofa.png'),
    hasUnread: false,
    productId: 'sofa-001',
  },
  {
    id: '4',
    title: 'Casio CTK-3500',
    lastMessage: 'O teclado funciona perfeitamente..',
    time: '10:56',
    image: require('../assets/casio.png'),
    hasUnread: true,
    productId: 'casio-001',
  },
  {
    id: '5',
    title: 'Instax Mini',
    lastMessage: 'A camera tem um pequeno risco na lente...',
    time: '09:18',
    image: require('../assets/instax-mini.png'),
    hasUnread: true,
    productId: 'instax-002',
  },
];

const MessagesScreen = () => {
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/back-icon.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mensagens</Text>
    </View>
  );

  const renderPossibleTrades = () => (
    <View style={styles.possibleTradesSection}>
      <Text style={styles.sectionTitle}>Possíveis trocas</Text>
      <FlatList
        horizontal
        data={possibleTrades}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.tradeItem}>
            <Image source={item.image} style={styles.tradeImage} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.tradesList}
      />
    </View>
  );

  const handleMessagePress = (item: MessageItem) => {
    navigation.navigate('Chat', { 
      productId: item.productId,
      title: item.title,
      image: item.image,
    });
  };

  const renderMessage = ({ item }: { item: MessageItem }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => handleMessagePress(item)}
    >
      <Image source={item.image} style={styles.messageImage} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageTitle}>{item.title}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.hasUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        {renderPossibleTrades()}
        <View style={styles.messagesContainer}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      <BottomNavigation currentScreen="messages" />
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
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    marginLeft: SIZES.base,
  },
  content: {
    flex: 1,
  },
  possibleTradesSection: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    marginBottom: SIZES.base,
  },
  tradesList: {
    paddingVertical: SIZES.base,
  },
  tradeItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tradeImage: {
    width: '100%',
    height: '100%',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '10',
  },
  messageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.medium,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  messageTime: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  messageText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.base,
  },
});

export default MessagesScreen; 