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
  stage?: string;
  negotiation?: string[];
  page?: number; // Adicionado page
}

// Interface de Resposta Paginada
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://98.93.10.61.nip.io",
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('db_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Atualizado para suportar paginação
export const getProperties = async (filters?: PropertyFilters): Promise<PaginatedResponse<any>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0 && value !== '0') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }
  
  // O backend espera o query param "page"
  const { data } = await api.get<PaginatedResponse<any>>(`/properties?${params.toString()}`);
  return data;
};

export const getPropertyById = async (id: string | number) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};