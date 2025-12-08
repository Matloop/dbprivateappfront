import axios from 'axios';

// Interfaces de Filtro (Tipagem é crucial para o TypeScript ajudar)
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
  ids?: string; // Para favoritos
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://98.93.10.61.nip.io",
});

// Interceptor (Mantido seu código original para Auth)
api.interceptors.request.use((config) => {
  const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  if (storageKey) {
    const sessionStr = localStorage.getItem(storageKey);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  }
  return config;
});

// --- NOVAS FUNÇÕES DE BUSCA ---

// Busca lista com filtros
export const getProperties = async (filters?: PropertyFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        // Trata arrays (ex: types=['CASA', 'APTO'])
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

// Busca imóvel único
export const getPropertyById = async (id: string | number) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};