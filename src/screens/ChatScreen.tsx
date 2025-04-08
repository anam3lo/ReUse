import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Product, getProducts } from '../services/storage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: number;
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { productId, title, image } = route.params as { 
    productId: string;
    title?: string;
    image?: any;
  };

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

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Math.random().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {title || product?.description || "Chat"}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {product?.userName || "Usuário"}
          </Text>
        </View>
        {image && (
          <Image
            source={image}
            style={styles.productImage}
          />
        )}
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={COLORS.gray}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Image
            source={require('../assets/send-icon.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  headerInfo: {
    marginLeft: SIZES.medium,
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  messagesList: {
    padding: SIZES.medium,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGreen + '40',
  },
  messageText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
  },
  userMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.black,
  },
  messageTime: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray + '20',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.gray + '10',
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    marginRight: SIZES.base,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: SIZES.medium,
  },
});

export default ChatScreen; 