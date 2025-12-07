import axios from 'axios';

// Cria a instância do Axios com a URL base
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://98.93.10.61.nip.io",
});

// Interceptor: Roda antes de TODA requisição
api.interceptors.request.use((config) => {
  // Procura o token do Supabase no LocalStorage
  const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  
  if (storageKey) {
    const sessionStr = localStorage.getItem(storageKey);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      // Se achou o token, injeta no cabeçalho
      if (session.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  }
  
  return config;
});