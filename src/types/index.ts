export interface Product {
  id?: string;
  description: string;
  categories: string[];
  images: string[];
  createdAt?: Date;
  userEmail?: string;
  userName?: string;
  location: {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

export interface Match {
  id: string;
  productId: string;
  matchedProductId: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Like {
  id: string;
  productId: string;
  userId: string;
  likedProductId: string;
  createdAt: string;
} 