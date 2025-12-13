import axios from 'axios';
import { supabase } from './supabaseClient'; // Certifique-se que o caminho está correto

export interface PropertyFilters {
  city?: string;
  neighborhood?: string;
  types?: string[];
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  bedrooms?: number;
  suites?: number;
  garageSpots?: number;
  search?: string;
  ids?: string;
  stage?: string; 
  negotiation?: string[]; 
  page?: number;
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

// --- INTERCEPTOR DE REQUISIÇÃO (FIX 401) ---
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    // 1. Tenta pegar a sessão atual do Supabase (Isso faz o refresh do token se necessário)
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    // 2. Se tiver token, anexa ao cabeçalho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback: Tenta pegar do localStorage manual (caso raro)
      const localToken = localStorage.getItem('db_token');
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR DE RESPOSTA (TRATAMENTO DE ERRO) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se der 401, significa que o token é inválido mesmo após tentar
    if (error.response?.status === 401) {
      console.error("Sessão expirada ou inválida.");
      // Opcional: Redirecionar para login automaticamente
      // if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      //    window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

// Funções de busca
export const getProperties = async (filters?: PropertyFilters): Promise<PaginatedResponse<any>> => {
  const params = new URLSearchParams();
  console.log("🔍 FILTROS RECEBIDOS NO API.TS:", filters);
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
  
  const { data } = await api.get<PaginatedResponse<any>>(`/properties?${params.toString()}`);
  return data;
};

export const getPropertyById = async (id: string | number) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};