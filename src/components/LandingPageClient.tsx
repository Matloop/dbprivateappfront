'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, DollarSign } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
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

  // 1. Mudança aqui: O retorno agora é um objeto "infinite query", não um array direto.
  // Renomeei de 'properties' para 'queryData' para evitar confusão.
  const { data: queryData, isLoading, isError } = useProperties();

  // 2. Extração dos dados: "Achatamos" as páginas para ter um array simples de imóveis
  const featuredProperties = queryData?.pages.flatMap((page) => page.data) || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity && searchCity !== 'all') params.append('city', searchCity);
    if (searchType && searchType !== 'all') params.append('types', searchType);
    if (searchTerm) params.append('search', searchTerm);
    
    router.push(`/vendas?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* HERO SECTION / BUSCA */}
      <section className="bg-card border-b border-border py-12 px-[5%]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-lg border border-white/10 shadow-2xl flex flex-col gap-6">
            <div>
              <h1 className="text-xl md:text-2xl font-light text-primary uppercase tracking-widest mb-2">
                Encontre seu Imóvel
              </h1>
              <p className="text-muted-foreground text-sm">
                Busque por cidade, tipo ou código de referência.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
               <div className="w-full md:w-[240px]">
                <Select value={searchCity} onValueChange={setSearchCity}>
                  <SelectTrigger className="bg-background border-input h-12">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <SelectValue placeholder="Cidade" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Balneário Camboriú">Balneário Camboriú</SelectItem>
                    <SelectItem value="Itapema">Itapema</SelectItem>
                    <SelectItem value="Itajaí">Itajaí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               <div className="w-full md:w-[240px]">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="bg-background border-input h-12">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 size={16} />
                      <SelectValue placeholder="Tipo de Imóvel" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                    <SelectItem value="CASA">Casa</SelectItem>
                    <SelectItem value="COBERTURA">Cobertura</SelectItem>
                    <SelectItem value="SALA_COMERCIAL">Sala Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full relative">
                <Input 
                  placeholder="Ex: Edifício Aurora, Frente Mar..." 
                  className="bg-background border-input h-12 pl-4 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>

              <Button 
                onClick={handleSearch}
                className="w-full md:w-auto h-12 px-8 bg-primary text-black font-bold hover:bg-primary/90 transition-all uppercase tracking-wide"
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* VITRINE */}
      <section className="py-12 px-[5%] max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-1 bg-primary"></div>
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
            {/* 3. Correção: Usamos o array extraído (featuredProperties) para o slice */}
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
            className="border-white/20 hover:bg-white/5 hover:text-primary hover:border-primary transition-all text-xs uppercase tracking-widest font-bold px-10 h-12"
          >
            Ver todos os imóveis
          </Button>
        </div>
      </section>

      {/* SEÇÃO EXTRA */}
      <section className="bg-[#0f0f0f] py-16 px-[5%] border-t border-white/5">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-8 w-1 bg-primary"></div>
             <h2 className="text-2xl md:text-3xl font-light text-foreground">
               Lançamentos & <span className="font-bold text-white">Na Planta</span>
             </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-white/10 p-8 rounded-lg">
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