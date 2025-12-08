import axios from 'axios';

export interface PropertyFilters {
  city?: string;
  neighborhood?: string;
  types?: string[];
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  bedrooms?: number;
  garageSpots?: number;
  search?: string;
  ids?: string;
  stage?: string; // Adicionado stage
  negotiation?: string[]; // Adicionado negotiation
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://98.93.10.61.nip.io",
});

// Interceptor Atualizado: Lê o token simples que vamos salvar no login
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('db_token'); // <--- MUDANÇA AQUI
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Funções de busca (mantidas)
export const getProperties = async (filters?: PropertyFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  const { data } = await api.get(`/properties?${params.toString()}`);
  return data;
};

export const getPropertyById = async (id: string | number) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};