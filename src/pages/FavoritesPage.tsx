import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

import { api } from '@/lib/api';
import { useFavorites } from '../hooks/useFavorites';
import { PropertyCard } from '@/components/PropertyCard';
import { Breadcrumb } from '@/components/Breadcrumb';

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não tem favoritos, não precisa buscar na API
    if (favorites.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Busca os imóveis passando os IDs separados por vírgula
    // Ex: /properties?ids=1,5,9
    api.get(`/properties?ids=${favorites.join(',')}`)
      .then(res => {
        setProperties(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar favoritos.");
      })
      .finally(() => setLoading(false));
  }, [favorites]); // Recarrega se a lista de IDs mudar

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Meus Favoritos', path: '' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* HEADER */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-6 border-b border-muted pb-6">
          <h1 className="text-3xl font-light text-primary">
            Meus Favoritos
            {properties.length > 0 && <span className="ml-2 text-lg text-muted-foreground">({properties.length})</span>}
          </h1>
          <p className="text-muted-foreground mt-2">
            Imóveis que você marcou como interessantes.
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="container mx-auto px-4">
        
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State (Sem favoritos) */}
        {!loading && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-xl bg-card/30">
            <div className="bg-muted/20 p-6 rounded-full mb-4">
              <HeartOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sua lista está vazia</h2>
            <p className="text-muted-foreground max-w-md mt-2 mb-8">
              Você ainda não favoritou nenhum imóvel. Navegue pela nossa seleção e clique no coração para salvar aqui.
            </p>
            <Button 
              onClick={() => navigate('/vendas')} 
              className="font-bold bg-primary text-black hover:bg-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Ir para Vendas
            </Button>
          </div>
        )}

        {/* Lista de Imóveis */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}