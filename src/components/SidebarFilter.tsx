'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export const SidebarFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para inputs de texto (evita lentidão ao digitar)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Função para atualizar a URL
  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all' && value !== '0') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reseta paginação se existir
    params.delete('page');
    
    router.push(`/vendas?${params.toString()}`, { scroll: false });
  };

  // Checkbox Handler (Para Arrays como 'types')
  const handleCheckbox = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);

    if (current.includes(value)) {
      params.delete(key);
      current.filter(c => c !== value).forEach(c => params.append(key, c));
    } else {
      params.append(key, value);
    }
    router.push(`/vendas?${params.toString()}`, { scroll: false });
  };

  // Debounce para Inputs de Texto (Aguarda usuário parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get('search') || '')) updateURL('search', search);
      if (minPrice !== (searchParams.get('minPrice') || '')) updateURL('minPrice', minPrice);
      if (maxPrice !== (searchParams.get('maxPrice') || '')) updateURL('maxPrice', maxPrice);
    }, 600);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice]);

  return (
    <aside className="w-full lg:w-[280px] shrink-0 space-y-4 bg-[#121212] border border-[#333] rounded-lg p-4 h-fit lg:sticky lg:top-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#d4af37] flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtrar
        </h3>
        <button onClick={() => router.push('/vendas')} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
          Limpar <X size={12} />
        </button>
      </div>

      {/* BUSCA */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Ref, Edifício ou Título..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-[#d4af37]"
        />
      </div>

      <Separator className="bg-[#333]" />

      {/* ACCORDION DE FILTROS */}
      <Accordion type="multiple" defaultValue={["localizacao", "tipo", "preco", "detalhes"]} className="w-full space-y-2">
        
        {/* 1. LOCALIZAÇÃO */}
        <AccordionItem value="localizacao" className="border-b-[#333]">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-bold text-white hover:text-[#d4af37] hover:no-underline py-3">
            Localização
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Cidade</Label>
              <Select value={searchParams.get('city') || 'all'} onValueChange={(val) => updateURL('city', val)}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Balneário Camboriú">Balneário Camboriú</SelectItem>
                  <SelectItem value="Itapema">Itapema</SelectItem>
                  <SelectItem value="Itajaí">Itajaí</SelectItem>
                  <SelectItem value="Praia Brava">Praia Brava</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. TIPO DE IMÓVEL */}
        <AccordionItem value="tipo" className="border-b-[#333]">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-bold text-white hover:text-[#d4af37] hover:no-underline py-3">
            Tipo de Imóvel
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            {['Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Sala Comercial'].map((type) => {
                const val = type.toUpperCase().replace(' ', '_');
                return (
                    <div key={val} className="flex items-center space-x-2">
                        <Checkbox 
                            id={val} 
                            className="border-[#555] data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37]"
                            checked={searchParams.getAll('types').includes(val)}
                            onCheckedChange={() => handleCheckbox('types', val)}
                        />
                        <label htmlFor={val} className="text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                            {type}
                        </label>
                    </div>
                )
            })}
          </AccordionContent>
        </AccordionItem>

        {/* 3. FAIXA DE PREÇO */}
        <AccordionItem value="preco" className="border-b-[#333]">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-bold text-white hover:text-[#d4af37] hover:no-underline py-3">
            Faixa de Preço
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                  <Label className="text-[10px] text-gray-500">Mínimo (R$)</Label>
                  <Input type="number" className="bg-[#1a1a1a] border-[#333] text-white text-xs h-8" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </div>
              <div className="space-y-1">
                  <Label className="text-[10px] text-gray-500">Máximo (R$)</Label>
                  <Input type="number" className="bg-[#1a1a1a] border-[#333] text-white text-xs h-8" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 4. DETALHES (GARAGEM) */}
        <AccordionItem value="detalhes" className="border-b-[#333]">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-bold text-white hover:text-[#d4af37] hover:no-underline py-3">
            Detalhes
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <Label className="text-xs text-gray-400 mb-2 block">Vagas de Garagem</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(num => {
                const current = searchParams.get('garageSpots');
                const active = current === String(num);
                return (
                  <Button 
                      key={num} 
                      variant={active ? "default" : "outline"} 
                      size="sm" 
                      className={`flex-1 h-8 text-xs ${active ? 'bg-[#d4af37] text-black hover:bg-[#b5922b]' : 'bg-transparent border-[#333] text-gray-400 hover:text-white hover:bg-[#222]'}`}
                      onClick={() => updateURL('garageSpots', active ? null : String(num))}
                  >
                      {num}+
                  </Button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. OUTROS */}
        <AccordionItem value="outros" className="border-b-0">
            <AccordionTrigger className="text-sm uppercase tracking-wider font-bold text-white hover:text-[#d4af37] hover:no-underline py-3">
                Outros
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
                {[
                    {id: 'LANCAMENTO', label: 'Lançamento'},
                    {id: 'EM_OBRA', label: 'Em Obra'},
                    {id: 'PRONTO', label: 'Pronto'}
                ].map((stage) => (
                    <div key={stage.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={stage.id} 
                            className="border-[#555] data-[state=checked]:bg-[#d4af37]"
                            checked={searchParams.get('stage') === stage.id} 
                            onCheckedChange={() => updateURL('stage', searchParams.get('stage') === stage.id ? null : stage.id)} 
                        />
                        <label htmlFor={stage.id} className="text-sm text-gray-300 cursor-pointer hover:text-white">{stage.label}</label>
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>

      </Accordion>
    </aside>
  );
};