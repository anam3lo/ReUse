export interface Product {
  id?: string;
  description: string;
  categories: string[];
  images: string[];
  createdAt?: Date;
  userEmail?: string;
  location: {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
} 