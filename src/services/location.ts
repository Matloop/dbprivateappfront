import axios from 'axios';

interface CepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface GeoResponse {
  lat: string;
  lon: string;
}

export const locationService = {
  // 1. Busca endereço pelo CEP (ViaCEP)
  getAddressByCep: async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) throw new Error('CEP inválido');

    const { data } = await axios.get<CepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (data.erro) throw new Error('CEP não encontrado');
    
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  },

  // 2. Busca coordenadas pelo endereço (OpenStreetMap / Nominatim)
  getCoordinates: async (fullAddress: string) => {
    // Nominatim requer um User-Agent válido ou email para não bloquear
    const { data } = await axios.get<GeoResponse[]>('https://nominatim.openstreetmap.org/search', {
      params: {
        q: fullAddress,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        // É boa prática identificar sua app
        'User-Agent': 'DBPrivateApp/1.0' 
      }
    });

    if (!data || data.length === 0) throw new Error('Endereço não localizado no mapa');

    return {
      lat: data[0].lat,
      lng: data[0].lon
    };
  }
};