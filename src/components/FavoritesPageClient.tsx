'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartOff, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesPageClient() {
  const router = useRouter();
  const { favorites } = useFavorites();
  
  // Garantir que o componente montou para evitar erro de hidratação com localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Busca os imóveis APENAS se houver favoritos
  // Passamos os IDs separados por vírgula para a API (ex: ids="1,5,9")
  const { data: properties, isLoading } = useProperties(
    favorites.length > 0 ? { ids: favorites.join(',') } : undefined
  );

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Meus Favoritos', path: '/favoritos' }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Header */}
      <div className="border-b border-border bg-card/50">
         <div className="container mx-auto px-4 py-4">
             <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none p-0 shadow-none" />
             <h1 className="text-3xl font-light text-primary mt-4 flex items-center gap-2">
               Meus Favoritos
               {favorites.length > 0 && <span className="text-lg text-muted-foreground">({favorites.length})</span>}
             </h1>
         </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        
        {/* State: Vazio (Sem favoritos) */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-card/30">
            <div className="bg-muted/20 p-6 rounded-full mb-4">
              <HeartOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sua lista está vazia</h2>
            <p className="text-muted-foreground max-w-md mt-2 mb-8">
              Você ainda não marcou nenhum imóvel como favorito.
            </p>
            <Button 
              onClick={() => router.push('/vendas')} 
              className="font-bold bg-primary text-black hover:bg-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Ir para Vendas
            </Button>
          </div>
        )}

        {/* State: Carregando API */}
        {isLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl bg-muted/20" />
                <Skeleton className="h-4 w-3/4 bg-muted/20" />
                <Skeleton className="h-4 w-1/2 bg-muted/20" />
              </div>
            ))}
          </div>
        )}

        {/* State: Lista Renderizada */}
        {!isLoading && properties && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}