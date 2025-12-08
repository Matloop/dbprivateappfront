import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Car, Ruler, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

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

export const PropertyCard = ({ property }: { property: Property }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Estado local para controlar qual imagem está aparecendo NO CARD
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const favorite = isFavorite(property.id);
  const images = property.images && property.images.length > 0 ? property.images : [{ url: 'https://via.placeholder.com/400x300?text=Sem+Foto' }];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // --- NAVEGAÇÃO DAS FOTOS DO CARD ---
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede de abrir o imóvel
    e.preventDefault();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Card
      className="group relative flex flex-col overflow-hidden border-muted bg-[#1a1a1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
      onClick={() => navigate(`/imovel/${property.id}`)}
    >
      {/* --- IMAGEM COM CARROSSEL --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black group/image">

        <img
          src={images[currentImgIndex].url}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradiente para destacar textos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        {/* Setas de Navegação (Só aparecem no hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-primary hover:text-black group-hover/image:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-primary hover:text-black group-hover/image:opacity-100"
            >
              <ChevronRight size={16} />
            </button>

            {/* Bolinhas indicadoras (opcional) */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
              {images.slice(0, 5).map((_, idx) => (
                <div key={idx} className={`h-1.5 w-1.5 rounded-full ${idx === currentImgIndex ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {property.badgeText && (
            <Badge className="w-fit border-0 bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
              {property.badgeText}
            </Badge>
          )}
        </div>

        {/* Favorito (Coração) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={`h-5 w-5 ${favorite ? "text-red-500" : ""}`}
          >
            <path d="M19 14c1.49-1.28 3.6-2.5 3.6-4.96C22.6 6.18 20.42 4 17.5 4c-3.02 0-5.5 2.54-5.5 2.54S9.52 4 6.5 4C3.58 4 1.4 6.18 1.4 9.04c0 2.46 2.1 3.68 3.6 4.96C7.9 16.7 12 20 12 20s4.1-3.3 7-6z" />
          </svg>
        </button>
      </div>

      {/* --- CONTEÚDO --- */}
      <CardContent className="flex flex-col gap-2 p-4">
        {/* Localização e Título */}
        <div className="mb-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="truncate">{property.address?.neighborhood} - {property.address?.city}</span>
          </div>
          <h3 className="mt-1 truncate text-base font-semibold text-white">
            {property.buildingName || property.title}
          </h3>
        </div>

        {/* Ícones */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-gray-400">
          <div className="flex items-center gap-1"><Bed className="h-4 w-4" /> <b>{property.bedrooms}</b></div>
          <div className="flex items-center gap-1"><Car className="h-4 w-4" /> <b>{property.garageSpots}</b></div>
          <div className="flex items-center gap-1"><Ruler className="h-4 w-4" /> <b>{property.privateArea}</b> m²</div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t border-white/5 p-4 py-3">
        <div className="flex w-full items-center justify-between">
          <span className="text-lg font-light text-white">
            {formatCurrency(Number(property.price))}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">Ref: {property.id}</span>
        </div>
      </CardFooter>
    </Card>
  );
};