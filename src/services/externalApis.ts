import axios from 'axios';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const getAddressByCEP = async (cep: string): Promise<ViaCEPResponse> => {
  try {
    const formattedCEP = cep.replace(/\D/g, '');
    const response = await axios.get(`https://viacep.com.br/ws/${formattedCEP}/json/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

// API simulada de categorias
export const getCategories = async (): Promise<string[]> => {
  // Simulando uma chamada de API com categorias predefinidas
  return [
    'Roupas',
    'Eletrônicos',
    'Livros',
    'Móveis',
    'Decoração',
    'Esportes',
    'Brinquedos',
    'Acessórios',
    'Calçados',
    'Outros'
  ];
}; 