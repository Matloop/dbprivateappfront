import { useInfiniteQuery } from '@tanstack/react-query';
import { getProperties, PropertyFilters } from '@/lib/api';

export function useProperties(filters?: PropertyFilters) {
  return useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: async ({ pageParam = 1 }) => {
      // Passa a página atual para a API
      return getProperties({ ...filters, page: pageParam as number });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Verifica se existe próxima página baseado no meta do backend
      if (lastPage.meta.page < lastPage.meta.lastPage) {
        return lastPage.meta.page + 1;
      }
      return undefined; // Não tem mais páginas
    },
    // Mantém os dados antigos enquanto busca novos filtros (opcional, melhora UX)
    placeholderData: (previousData) => previousData, 
  });
}