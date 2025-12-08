'use client';

import { useSearchParams } from 'next/navigation';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { SidebarFilter } from '@/components/SidebarFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb } from '@/components/Breadcrumb';

export function SalesPageClient() {
  const searchParams = useSearchParams();

  // Converte SearchParams do Next para o Objeto de Filtros que nossa API espera
  const filters = {
    city: searchParams.get('city') || undefined,
    neighborhood: searchParams.get('neighborhood') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    garageSpots: searchParams.get('garageSpots') ? Number(searchParams.get('garageSpots')) : undefined,
    stage: searchParams.get('stage') || undefined,
    types: searchParams.getAll('types'), // getAll para arrays
    negotiation: searchParams.getAll('negotiation')
  };

  const { data: properties, isLoading, isError } = useProperties(filters);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Vendas', path: '/vendas' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Header / Breadcrumb */}
      <div className="border-b border-border bg-card/50">
         <div className="container mx-auto px-4 py-4">
             <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none p-0 shadow-none" />
             <h1 className="text-3xl font-light text-primary mt-4">Imóveis à Venda</h1>
             <p className="text-muted-foreground text-sm">
               {isLoading ? 'Buscando imóveis...' : `${properties?.length || 0} imóveis encontrados`}
             </p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Filtros) */}
        <SidebarFilter />

        {/* Lista de Imóveis */}
        <div className="flex-1">
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[250px] w-full rounded-xl bg-muted/20" />
                    <Skeleton className="h-4 w-[250px] bg-muted/20" />
                    <Skeleton className="h-4 w-[150px] bg-muted/20" />
                </div>
              ))}
            </div>
          )}

          {isError && (
             <div className="w-full py-20 text-center border border-destructive/20 bg-destructive/10 rounded-lg text-red-400">
                Erro ao carregar imóveis. Verifique sua conexão.
             </div>
          )}

          {!isLoading && properties?.length === 0 && (
             <div className="w-full py-20 text-center border border-border bg-card rounded-lg">
                <p className="text-lg text-muted-foreground">Nenhum imóvel encontrado com estes filtros.</p>
                <p className="text-sm text-muted-foreground mt-2">Tente remover alguns filtros para ver mais resultados.</p>
             </div>
          )}

          {!isLoading && properties && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {properties.map((prop: any) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}