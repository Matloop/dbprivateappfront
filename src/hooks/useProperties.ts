import { useQuery } from '@tanstack/react-query';
import { getProperties, PropertyFilters } from '../lib/api';

// Hook para buscar lista de imóveis
export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    // A queryKey define quando o React Query deve refazer a busca.
    // Se "filters" mudar, ele busca automaticamente.
    queryKey: ['properties', filters],
    
    queryFn: () => getProperties(filters),
    
    // Mantém os dados no cache por 5 minutos antes de considerar "velho"
    staleTime: 1000 * 60 * 5, 
  });
};