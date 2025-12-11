'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Building2, DollarSign } from 'lucide-react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function LandingPageClient() {
  const router = useRouter();
  
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: queryData, isLoading, isError } = useProperties();
  const featuredProperties = queryData?.pages.flatMap((page) => page.data) || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity && searchCity !== 'all') params.append('city', searchCity);
    if (searchType && searchType !== 'all') params.append('types', searchType);
    if (searchTerm) params.append('search', searchTerm);
    
    router.push(`/vendas?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-foreground flex flex-col overflow-x-hidden">
      
      {/* ===================================================================================== */}
      {/* HERO BANNER */}
      {/* ===================================================================================== */}
      <div className="relative w-full h-[650px] md:h-[750px] bg-[#0a0a0a] flex flex-col justify-end items-center">
      
        {/* 1. IMAGEM DE FUNDO */}
        <div className="absolute inset-0 z-0">
            <Image 
                src="/backgroundhero.jpeg" 
                alt="Balneário Camboriú"
                fill
                className="object-cover opacity-40 grayscale-[30%]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
        </div>

        {/* 2. TEXTO GIGANTE DE FUNDO */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-10 select-none pointer-events-none overflow-hidden leading-none">
            <span 
                className="text-[18vw] font-black text-transparent uppercase whitespace-nowrap"
                style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)' }}
            >
                Experiência
            </span>
            <span 
                className="text-[18vw] font-black text-transparent uppercase whitespace-nowrap -mt-[4vw]"
                style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)' }}
            >
                Única
            </span>
        </div>

        {/* 3. FOTO DO CORRETOR */}
        <div className="absolute bottom-0 z-10 w-full flex justify-center items-end pointer-events-none">
            <div className="relative h-[400px] md:h-[600px] w-auto aspect-[3/4] animate-in slide-in-from-bottom duration-1000 fade-in-0">
                <Image 
                    src="/danillohero.png" 
                    alt="Danillo Bezerra"
                    fill
                    className="object-contain object-bottom"
                    priority
                />
            </div>
        </div>

        {/* 4. TEXTO DE DESTAQUE */}
        <div className="absolute top-[20%] md:top-[25%] left-0 w-full z-20 text-center px-4">
            <p className="text-white/80 uppercase tracking-[0.2em] text-[10px] md:text-sm font-light mb-2 animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-forwards">
                Bem-vindo à Imobiliária em Balneário Camboriú
            </p>
            <h2 className="text-white text-base md:text-xl font-light mb-2 animate-in fade-in zoom-in duration-1000 delay-500 fill-mode-forwards">
                Danillo Bezerra <span className="font-bold text-[#d4af37]">Corretor de Imóveis</span>
            </h2>
            <h1 className="text-4xl md:text-7xl text-white font-serif italic animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-700 fill-mode-forwards drop-shadow-lg">
                Experiência <span className="text-[#d4af37]">Única!</span>
            </h1>
        </div>

        {/* 5. ESPAÇO RESERVADO PARA A BUSCA (Para não cortar o pé da foto) */}
        <div className="h-16 md:h-24 w-full"></div>

      </div>

      {/* ===================================================================================== */}
      {/* BARRA DE BUSCA (FLUTUANTE ENTRE AS SEÇÕES) */}
      {/* ===================================================================================== */}
      <div className="relative z-40 w-full px-4 -mt-20 md:-mt-24 pointer-events-none">
         <div className="max-w-6xl mx-auto pointer-events-auto">
            <div className="bg-[#1a1a1a]/95 backdrop-blur-md border border-[#333] p-6 md:p-8 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-1000">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[#d4af37] text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Search size={16} /> Encontre seu Imóvel
                    </h3>
                    <p className="text-gray-500 text-xs hidden md:block">Busque por cidade, tipo ou código.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                        <Select value={searchCity} onValueChange={setSearchCity}>
                        <SelectTrigger className="bg-[#121212] border-[#333] h-12 text-gray-300 focus:border-[#d4af37] focus:ring-0">
                            <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[#d4af37]" />
                            <SelectValue placeholder="Cidade" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-[#333] text-gray-300">
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Balneário Camboriú">Balneário Camboriú</SelectItem>
                            <SelectItem value="Itapema">Itapema</SelectItem>
                            <SelectItem value="Itajaí">Itajaí</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger className="bg-[#121212] border-[#333] h-12 text-gray-300 focus:border-[#d4af37] focus:ring-0">
                            <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-[#d4af37]" />
                            <SelectValue placeholder="Tipo de Imóvel" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-[#333] text-gray-300">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                            <SelectItem value="CASA">Casa</SelectItem>
                            <SelectItem value="COBERTURA">Cobertura</SelectItem>
                            <SelectItem value="SALA_COMERCIAL">Sala Comercial</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-4 relative">
                        <Input 
                        placeholder="Ex: Edifício Aurora, Frente Mar..." 
                        className="bg-[#121212] border-[#333] h-12 pl-4 pr-10 text-white placeholder:text-gray-600 focus:border-[#d4af37] focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    </div>

                    <div className="md:col-span-2">
                        <Button 
                            onClick={handleSearch}
                            className="w-full h-12 bg-[#d4af37] text-black font-bold hover:bg-[#b5952f] transition-all uppercase tracking-wide"
                        >
                            BUSCAR
                        </Button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* ===================================================================================== */}
      {/* VITRINE (COM PADDING EXTRA NO TOPO) */}
      {/* ===================================================================================== */}
      <section className="pt-24 pb-12 px-[5%] max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-1 bg-[#d4af37]"></div>
          <h2 className="text-2xl md:text-3xl font-light text-foreground">
            Imóveis em <span className="font-bold text-white">Destaque</span>
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl bg-muted/20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-muted/20" />
                  <Skeleton className="h-4 w-[200px] bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProperties.slice(0, 8).map((prop: any) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/vendas')}
            className="border-white/20 hover:bg-white/5 hover:text-[#d4af37] hover:border-[#d4af37] transition-all text-xs uppercase tracking-widest font-bold px-10 h-12"
          >
            Ver todos os imóveis
          </Button>
        </div>
      </section>

      {/* SEÇÃO EXTRA */}
      
    </div>
  );
}