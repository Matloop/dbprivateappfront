import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // <--- A MÁGICA
import { Loader2 } from "lucide-react";

import { api } from '@/lib/api';
import { SidebarFilter } from '../components/SidebarFilter';
import { PropertyCard } from '../components/PropertyCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { Skeleton } from "@/components/ui/skeleton";

export const SalesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estado local apenas para guardar os filtros atuais vindos do Sidebar
  const [activeFilters, setActiveFilters] = useState<any>(null);

  // 1. Converte URL para Objeto de Filtros (Inicialização)
  const initialFilters = useMemo(() => {
    const filters: any = {};
    const city = searchParams.get('city');
    const neigh = searchParams.get('neighborhood');
    const type = searchParams.get('types');

    if (city) filters.city = city;
    if (neigh) filters.neighborhood = neigh;
    if (type) filters.types = [type];
    
    // Se não tiver nada na URL, retorna null para o Sidebar usar os defaults
    return Object.keys(filters).length > 0 ? filters : null;
  }, [searchParams]);

  // 2. Função que busca os dados (O React Query vai chamar isso)
  const fetchProperties = async (filters: any) => {
    // Monta a QueryString
    const params = new URLSearchParams();
    // Se filters for null (primeira carga sem filtro), usa vazio
    const currentFilters = filters || initialFilters || {};

    Object.keys(currentFilters).forEach(key => {
      const val = currentFilters[key];
      if (val) {
          if (Array.isArray(val)) val.forEach(v => params.append(key, v));
          else params.append(key, String(val));
      }
    });
    
    const res = await api.get(`/properties?${params.toString()}`);
    return res.data;
  };

  // 3. O HOOK DE CACHE (Substitui o useEffect antigo)
  const { 
    data: properties = [], // Se não tiver dados, usa array vazio
    isLoading,
    isFetching 
  } = useQuery({
    // A "Chave do Cache": Se activeFilters mudar, ele busca de novo. 
    // Se for igual, ele usa o cache.
    queryKey: ['properties', activeFilters || initialFilters], 
    
    // A função de busca
    queryFn: () => fetchProperties(activeFilters),
    
    // Configuração de Cache
    staleTime: 1000 * 60 * 5, // 5 Minutos sem precisar revalidar (Instantâneo)
    refetchOnWindowFocus: false, // Não recarregar só de trocar de aba
  });

  // Função chamada pelo Sidebar quando o usuário mexe nos filtros
  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    
    // Opcional: Atualizar a URL para ficar bonitinho (ex: ?city=BC)
    // Isso ajuda se o usuário der F5, o filtro continua lá
    const params = new URLSearchParams();
    if(newFilters.city) params.set('city', newFilters.city);
    if(newFilters.neighborhood) params.set('neighborhood', newFilters.neighborhood);
    if(newFilters.types?.length === 1) params.set('types', newFilters.types[0]);
    setSearchParams(params);
  };

  // Breadcrumb Dinâmico
  const getBreadcrumbItems = () => {
    const items = [{ label: 'Vendas', path: '/vendas' }];
    const currentType = searchParams.get('types');
    const currentCity = searchParams.get('city');

    if (currentType) items.push({ label: currentType.toLowerCase(), path: '' });
    if (currentCity) items.push({ label: currentCity, path: '' });
    
    return items;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Passamos o initialFilters e a função que atualiza o estado */}
        <SidebarFilter 
          // key={searchParams.toString()} // Removido para evitar reset visual desnecessário
          initialFilters={initialFilters} 
          onFilterChange={handleFilterChange} 
        />

        <main className="flex-1 w-full min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-light text-foreground flex items-center gap-2">
              Imóveis à Venda 
              {/* Mostra loading sutil se estiver atualizando em background */}
              {!isLoading && isFetching && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {!isLoading && <span className="ml-2 text-sm font-bold text-primary">({properties.length})</span>}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-lg">
              <p className="text-xl text-muted-foreground">Nenhum imóvel encontrado.</p>
              <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};