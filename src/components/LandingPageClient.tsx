'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, Building2, DollarSign } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
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
    // ANTES: bg-[#121212] text-foreground
    // DEPOIS: bg-background text-foreground
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      
      {/* ===================================================================================== */}
      {/* HERO BANNER */}
      {/* ===================================================================================== */}
      {/* Mantemos bg-[#0a0a0a] pois é o fundo da imagem Hero, independente do tema light/dark */}
      <div className="relative w-full h-[650px] md:h-[750px] bg-[#0a0a0a] flex flex-col justify-end items-center">
      
        {/* 1. IMAGEM DE FUNDO */}
        <div className="absolute inset-0 z-0">
            <Image 
                src="/backgroundhero.jpeg" 
                alt="Balneário Camboriú"
                fill
                className="object-cover opacity-40 grayscale-[30%]"
                priority
                quality={80}
            />
            {/* Gradiente para suavizar o rodapé: from-[#121212] -> from-background */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* 2. TEXTO GIGANTE DE FUNDO (EFEITO OUTLINE) */}
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
                    quality={90}
                />
            </div>
        </div>

        {/* 4. TEXTO DE DESTAQUE */}
        {/* Mantemos text-white aqui pois está sobre a imagem escura do hero, mesmo no light mode */}
        <div className="absolute top-[20%] md:top-[25%] left-0 w-full z-20 text-center px-4">
            <p className="text-white/80 uppercase tracking-[0.2em] text-[10px] md:text-sm font-light mb-2 animate-in fade-in zoom-in duration-1000 delay-300 fill-mode-forwards">
                Bem-vindo à Imobiliária em Balneário Camboriú
            </p>
            <h2 className="text-white text-base md:text-xl font-light mb-2 animate-in fade-in zoom-in duration-1000 delay-500 fill-mode-forwards">
                Danillo Bezerra <span className="font-bold text-primary">Corretor de Imóveis</span>
            </h2>
            
            <h1 className="text-4xl md:text-7xl text-white font-serif italic animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-700 fill-mode-forwards drop-shadow-lg">
                Experiência <span className="text-primary">Única!</span>
            </h1>
        </div>

        <div className="h-16 md:h-24 w-full"></div>

      </div>

      {/* ===================================================================================== */}
      {/* BARRA DE BUSCA */}
      {/* ===================================================================================== */}
      <div className="relative z-40 w-full px-4 -mt-20 md:-mt-24 pointer-events-none">
         <div className="max-w-6xl mx-auto pointer-events-auto">
            {/* ANTES: bg-[#1a1a1a]/95 border-[#333] */}
            {/* DEPOIS: bg-card/95 border-border */}
            <div className="bg-card/95 backdrop-blur-md border border-border p-6 md:p-8 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-1000">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-primary text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Search size={16} /> Encontre seu Imóvel
                    </h3>
                    <p className="text-muted-foreground text-xs hidden md:block">Busque por cidade, tipo ou código de referência.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                        <Select value={searchCity} onValueChange={setSearchCity}>
                        {/* ANTES: bg-[#121212] border-[#333] text-gray-300 */}
                        {/* DEPOIS: bg-background border-input text-foreground */}
                        <SelectTrigger className="bg-background border-input h-12 text-foreground focus:border-primary focus:ring-0">
                            <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary" />
                            <SelectValue placeholder="Cidade" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Balneário Camboriú">Balneário Camboriú</SelectItem>
                            <SelectItem value="Itapema">Itapema</SelectItem>
                            <SelectItem value="Itajaí">Itajaí</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger className="bg-background border-input h-12 text-foreground focus:border-primary focus:ring-0">
                            <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-primary" />
                            <SelectValue placeholder="Tipo de Imóvel" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
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
                        // ANTES: bg-[#121212] border-[#333] text-white
                        // DEPOIS: bg-background border-input text-foreground
                        className="bg-background border-input h-12 pl-4 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    </div>

                    <div className="md:col-span-2">
                        <Button 
                            onClick={handleSearch}
                            className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all uppercase tracking-wide"
                        >
                            BUSCAR
                        </Button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* ===================================================================================== */}
      {/* VITRINE */}
      {/* ===================================================================================== */}
      <section className="pt-24 pb-12 px-[5%] max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-1 bg-primary"></div>
          <h2 className="text-2xl md:text-3xl font-light text-foreground">
            Imóveis em <span className="font-bold text-foreground">Destaque</span>
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
            className="border-input hover:bg-muted hover:text-primary hover:border-primary transition-all text-xs uppercase tracking-widest font-bold px-10 h-12 text-foreground"
          >
            Ver todos os imóveis
          </Button>
        </div>
      </section>

      {/* SEÇÃO EXTRA */}
      {/* ANTES: bg-[#0f0f0f] border-white/5 */}
      {/* DEPOIS: bg-muted/30 border-border */}
      <section className="bg-muted/30 py-16 px-[5%] border-t border-border">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-8 w-1 bg-primary"></div>
             <h2 className="text-2xl md:text-3xl font-light text-foreground">
               Lançamentos & <span className="font-bold text-foreground">Na Planta</span>
             </h2>
          </div>
          
          {/* ANTES: bg-[#1a1a1a] border-white/10 */}
          {/* DEPOIS: bg-card border-border */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-border p-8 rounded-lg">
             <div className="space-y-4 max-w-2xl">
                <h3 className="text-xl text-primary font-bold">Invista com Alta Rentabilidade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Temos acesso exclusivo aos pré-lançamentos das maiores construtoras de Balneário Camboriú e Praia Brava. 
                </p>
             </div>
             <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 flex items-center gap-2">
                <DollarSign size={18} />
                Falar com Especialista
             </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
}