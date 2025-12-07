import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Car, Ruler, MapPin, Star } from 'lucide-react'; // Ícones modernos do pacote padrão
import { useFavorites } from '../hooks/useFavorites';

// Componentes Shadcn UI
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Property {
  id: number;
  title: string;
  price: number;
  category: string;
  address?: { city: string; neighborhood: string };
  images: { url: string }[];
  badgeText?: string;
  badgeColor?: string;
  buildingName?: string;
  bedrooms: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number;
  totalArea: number;
}

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  
  // Hook de favoritos seguro
  let isFavorite = (_id: number) => false;
  let toggleFavorite = (_id: number) => {};

  try {
    const favHook = useFavorites();
    isFavorite = favHook.isFavorite;
    toggleFavorite = favHook.toggleFavorite;
  } catch (e) {
    // Silencia erro se fora do provider
  }

  const favorite = isFavorite(property.id);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-muted bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
      onClick={() => navigate(`/imovel/${property.id}`)}
    >
      {/* --- IMAGEM --- */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <img
          src={property.images && property.images.length > 0 ? property.images[0].url : 'https://via.placeholder.com/400x300?text=Sem+Foto'}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {property.badgeText && (
          <Badge 
            className="absolute right-0 top-4 rounded-l-md rounded-r-none border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md"
            style={{ backgroundColor: property.badgeColor || '#000' }}
          >
            {property.badgeText}
          </Badge>
        )}
      </div>

      {/* --- CONTEÚDO --- */}
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Localização */}
        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{property.address?.city} — {property.address?.neighborhood}</span>
        </div>

        {/* Título e Edifício */}
        <div>
          <h3 className="truncate text-lg font-semibold text-foreground">
            {property.buildingName 
              ? `${property.category} no ${property.buildingName}` 
              : property.title}
          </h3>
          {property.buildingName && (
             <p className="truncate text-sm text-muted-foreground">{property.title}</p>
          )}
        </div>

        {/* Ícones (Dorm, Vaga, etc) */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1" title="Dormitórios">
            <span className="font-bold text-foreground">{property.bedrooms}</span> <Bed className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1" title="Banheiros">
            <span className="font-bold text-foreground">{property.bathrooms}</span> <Bath className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1" title="Vagas">
            <span className="font-bold text-foreground">{property.garageSpots}</span> <Car className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1" title="Área Privativa">
            <span className="text-foreground">{property.privateArea}</span><span className="text-[10px]">m²</span> <Ruler className="h-4 w-4" />
          </div>
        </div>
      </CardContent>

      {/* --- RODAPÉ (Preço e Favorito) --- */}
      <CardFooter className="flex items-center justify-between border-t border-border p-4 pt-4">
        <span className="text-xl font-bold text-primary">
          {formatCurrency(Number(property.price))}
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-muted"
          onClick={handleFavoriteClick}
        >
          <Star 
            className={`h-5 w-5 transition-colors ${favorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
          />
        </Button>
      </CardFooter>
    </Card>
  );
};