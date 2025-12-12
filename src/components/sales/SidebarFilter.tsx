'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const SidebarFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minArea, setMinArea] = useState(searchParams.get('minArea') || '');
  const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || '');

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '0') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
    });
    
    params.delete('page'); 
    router.push(`/vendas?${params.toString()}`, { scroll: false });
  };

  const handleCheckboxArray = (key: string, value: string) => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
        const updates: Record<string, string | null> = {};
        if (search !== (searchParams.get('search') || '')) updates.search = search;
        if (minPrice !== (searchParams.get('minPrice') || '')) updates.minPrice = minPrice;
        if (maxPrice !== (searchParams.get('maxPrice') || '')) updates.maxPrice = maxPrice;
        if (minArea !== (searchParams.get('minArea') || '')) updates.minArea = minArea;
        if (maxArea !== (searchParams.get('maxArea') || '')) updates.maxArea = maxArea;
        
        if (Object.keys(updates).length > 0) updateURL(updates);
    }, 600);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, minArea, maxArea]);

  return (
    // ANTES: bg-[#121212] border-[#333]
    // DEPOIS: bg-card border-border
    <aside className="w-full lg:w-[300px] shrink-0 space-y-4 bg-card border border-border rounded-lg p-5 h-fit lg:sticky lg:top-4 shadow-xl">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        {/* ANTES: text-[#d4af37] */}
        {/* DEPOIS: text-primary */}
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <Filter className="h-3 w-3" /> Filtros Avançados
        </h3>
        {(searchParams.toString().length > 0) && (
            <button onClick={() => router.push('/vendas')} className="text-[10px] uppercase font-bold text-destructive hover:text-destructive/80 flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded">
                Limpar <X size={10} />
            </button>
        )}
      </div>

      {/* BUSCA RÁPIDA */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {/* ANTES: bg-[#1a1a1a] border-[#333] text-white focus-visible:ring-[#d4af37] */}
        {/* DEPOIS: bg-background border-input text-foreground focus-visible:ring-primary */}
        <Input 
          placeholder="Código, Edifício ou Título..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-background border-input text-foreground text-xs placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
        />
      </div>

      {/* ACCORDION */}
      <Accordion type="multiple" defaultValue={["negociacao", "tipo", "dormitorios", "preco"]} className="w-full space-y-1">
        
        {/* 1. NEGOCIAÇÃO */}
        <AccordionItem value="negociacao" className="border-b-border">
          {/* ANTES: text-white hover:text-[#d4af37] */}
          {/* DEPOIS: text-foreground hover:text-primary */}
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Negociação</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-1">
             {[
                { id: 'com desconto', label: 'Com Desconto', badge: true },
                { id: 'exclusivo', label: 'Imóvel Exclusivo', badge: true },
                { id: 'permuta', label: 'Aceita Permuta' },
                { id: 'financiamento', label: 'Aceita Financiamento' },
                { id: 'veiculo', label: 'Aceita Veículo' }
             ].map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                        {/* ANTES: border-[#555] data-[state=checked]:bg-[#d4af37] */}
                        {/* DEPOIS: border-input data-[state=checked]:bg-primary */}
                        <Checkbox 
                            id={item.id} 
                            className="border-input h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            checked={searchParams.getAll('negotiation').includes(item.id)}
                            onCheckedChange={() => handleCheckboxArray('negotiation', item.id)}
                        />
                        <label htmlFor={item.id} className="text-xs text-muted-foreground cursor-pointer group-hover:text-foreground transition-colors">
                            {item.label}
                        </label>
                    </div>
                </div>
             ))}
          </AccordionContent>
        </AccordionItem>

        {/* 2. TIPO DE IMÓVEL */}
        <AccordionItem value="tipo" className="border-b-border">
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Tipo de Imóvel</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-1">
            {['Apartamento', 'Apartamento Garden', 'Cobertura', 'Casa', 'Casa em Condomínio', 'Terreno', 'Sala Comercial'].map((type) => {
                const val = type.toUpperCase().replace(/\s/g, '_'); 
                return (
                    <div key={val} className="flex items-center space-x-2">
                        <Checkbox 
                            id={val} 
                            className="border-input h-3.5 w-3.5 data-[state=checked]:bg-primary"
                            checked={searchParams.getAll('types').includes(val)}
                            onCheckedChange={() => handleCheckboxArray('types', val)}
                        />
                        <label htmlFor={val} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            {type}
                        </label>
                    </div>
                )
            })}
          </AccordionContent>
        </AccordionItem>
        
        {/* 3. ESTÁGIO DA OBRA */}
        <AccordionItem value="estagio" className="border-b-border">
            <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Estágio da Obra</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-1">
                {[
                    {id: 'LANCAMENTO', label: 'Lançamento'},
                    {id: 'EM_OBRA', label: 'Em Construção'},
                    {id: 'PRONTO', label: 'Pronto para morar'}
                ].map((stage) => (
                    <div key={stage.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={stage.id} 
                            className="border-input h-3.5 w-3.5 data-[state=checked]:bg-primary"
                            checked={searchParams.get('stage') === stage.id} 
                            onCheckedChange={() => updateURL({ stage: searchParams.get('stage') === stage.id ? null : stage.id })} 
                        />
                        <label htmlFor={stage.id} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">{stage.label}</label>
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>

        {/* 4. DORMITÓRIOS & SUÍTES */}
        <AccordionItem value="dormitorios" className="border-b-border">
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Dormitórios</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
             <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(num => {
                const active = searchParams.get('bedrooms') === String(num);
                return (
                  <Button key={num} variant="outline" size="sm" 
                      // ANTES: bg-[#d4af37] text-black : bg-[#1a1a1a] text-gray-400
                      // DEPOIS: bg-primary text-primary-foreground : bg-background text-muted-foreground
                      className={`flex-1 h-7 text-[10px] font-bold ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      onClick={() => updateURL({ bedrooms: active ? null : String(num) })}
                  >
                      {num}+
                  </Button>
                )
              })}
            </div>
            
            <div className="mt-4">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold mb-2 block">Suítes</Label>
                <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(num => {
                    const active = searchParams.get('suites') === String(num);
                    return (
                    <Button key={num} variant="outline" size="sm" 
                        className={`flex-1 h-7 text-[10px] font-bold ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                        onClick={() => updateURL({ suites: active ? null : String(num) })}
                    >
                        {num}+
                    </Button>
                    )
                })}
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. VAGAS DE GARAGEM */}
        <AccordionItem value="garagem" className="border-b-border">
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Vagas de Garagem</AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(num => {
                const active = searchParams.get('garageSpots') === String(num);
                return (
                  <Button key={num} variant="outline" size="sm" 
                      className={`flex-1 h-7 text-[10px] font-bold ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      onClick={() => updateURL({ garageSpots: active ? null : String(num) })}
                  >
                      {num}+
                  </Button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 6. FAIXA DE PREÇO */}
        <AccordionItem value="preco" className="border-b-border">
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Faixa de Preço</AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Mínimo</Label>
                  <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                      <Input type="number" className="pl-7 bg-background border-input text-foreground text-xs h-8 focus-visible:ring-primary" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  </div>
              </div>
              <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Máximo</Label>
                  <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                      <Input type="number" className="pl-7 bg-background border-input text-foreground text-xs h-8 focus-visible:ring-primary" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 7. ÁREA TOTAL */}
        <AccordionItem value="area" className="border-b-0">
          <AccordionTrigger className="text-xs uppercase font-bold text-foreground hover:text-primary py-3">Área Total</AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Mínima</Label>
                  <div className="relative">
                      <Input type="number" className="pr-6 bg-background border-input text-foreground text-xs h-8 focus-visible:ring-primary" value={minArea} onChange={(e) => setMinArea(e.target.value)} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">m²</span>
                  </div>
              </div>
              <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Máxima</Label>
                  <div className="relative">
                      <Input type="number" className="pr-6 bg-background border-input text-foreground text-xs h-8 focus-visible:ring-primary" value={maxArea} onChange={(e) => setMaxArea(e.target.value)} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">m²</span>
                  </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </aside>
  );
};