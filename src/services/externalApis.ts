import axios from 'axios';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

const OPENWEATHER_API_KEY = 'YOUR_API_KEY'; // Substitua pela sua chave de API

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

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}&lang=pt_br`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
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