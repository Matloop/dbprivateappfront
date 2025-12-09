'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image, { ImageLoaderProps } from 'next/image';
import { Bed, Bath, Car, Ruler, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Função auxiliar para URLs
const fixImageSource = (url: string | undefined | null) => {
  if (!url || url === '') return '/placeholder.jpg';
  if (url.startsWith('/')) return url;
  if (process.env.NODE_ENV === 'production' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      return url.replace(/http:\/\/(localhost|127\.0\.0\.1):\d+/g, 'https://98.93.10.61.nip.io');
  }
  return url;
};

// Loader para evitar otimização excessiva em localhost se necessário
const customLoader = ({ src }: ImageLoaderProps) => src;

export interface Property {
  id: number;
  title: string;
  price: number;
  category: string;
  address?: { city: string; neighborhood: string };
  images: { url: string }[];
  badgeText?: string;
  buildingName?: string;
  bedrooms: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number;
}

export const PropertyCard = ({ property }: { property: Property }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const favorite = isFavorite(property.id);
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [{ url: '/placeholder.jpg' }]; 

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const currentImageUrl = fixImageSource(images[currentImgIndex]?.url);

  return (
    <Link href={`/imovel/${property.id}`} className="block group">
      <Card className="relative flex flex-col overflow-hidden border-border bg-[#1a1a1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
        
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black group/image">
          
          <Image
            loader={customLoader}
            src={currentImageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            // Prioridade apenas se for a primeira imagem da lista (opcional, ajuda performance)
            priority={false} 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

          {/* --- ALTERAÇÃO AQUI: Setas sempre visíveis --- */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-primary hover:text-black z-20 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-primary hover:text-black z-20 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {property.badgeText && (
              <Badge className="w-fit border-0 bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
                {property.badgeText}
              </Badge>
            )}
          </div>

          <button onClick={handleFavoriteClick} className="absolute top-3 right-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500 z-20">
            <Heart size={20} className={cn(favorite && "fill-red-500 text-red-500")} />
          </button>
        </div>

        <CardContent className="flex flex-col gap-2 p-4">
          <div className="mb-1">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="truncate">{property.address?.neighborhood} - {property.address?.city}</span>
            </div>
            <h3 className="mt-1 truncate text-base font-semibold text-white">
              {property.buildingName || property.title}
            </h3>
          </div>

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
    </Link>
  );
};