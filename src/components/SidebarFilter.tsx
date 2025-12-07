import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface FiltersState {
  search: string;
  city: string;
  neighborhood: string;
  types: string[];       // Array de strings
  negotiation: string[]; // Array de strings
  stage: string;
  garageSpots: number;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
}

interface FilterProps {
  onFilterChange: (filters: FiltersState) => void;
  initialFilters?: Partial<FiltersState>; // Partial significa que pode vir incompleto da URL
}

export const SidebarFilter = ({ onFilterChange, initialFilters }: FilterProps) => {
  
  // 1. INICIALIZAÇÃO INTELIGENTE (Evita piscar)
  // Já começa o estado com os valores que vieram da URL (props)
  const [filters, setFilters] = useState(() => {
    const defaults = {
      search: '', city: '', neighborhood: '', stage: '',
      garageSpots: 0, minPrice: '', maxPrice: '', minArea: '', maxArea: '',
      types: [] as string[], negotiation: [] as string[],
    };

    if (initialFilters) {
      return {
        ...defaults,
        ...initialFilters,
        // Garante que seja array
        types: Array.isArray(initialFilters.types) ? initialFilters.types : (initialFilters.types ? [initialFilters.types] : []),
      };
    }
    return defaults;
  });

  // 2. EFEITO ÚNICO (Dispara a busca)
  // Esse efeito roda quando o componente monta (busca inicial) 
  // E quando o usuário mexe em algo (com delay de 600ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  // --- HANDLERS (Iguais ao anterior) ---
  const handleChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (group: 'types' | 'negotiation', value: string) => {
    setFilters(prev => {
      const list = prev[group];
      return list.includes(value)
        ? { ...prev, [group]: list.filter(item => item !== value) }
        : { ...prev, [group]: [...list, value] };
    });
  };

  const handleGarage = (num: number) => {
    setFilters(prev => ({ ...prev, garageSpots: prev.garageSpots === num ? 0 : num }));
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6 bg-card border border-muted rounded-lg p-4 h-fit lg:sticky lg:top-4 shadow-sm">
      
      {/* CABEÇALHO */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filtrar Imóveis
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Ref, Edifício ou Título..." 
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <Separator />

      {/* ACORDEÃO */}
      <Accordion type="multiple" defaultValue={["localizacao", "tipo", "valores"]} className="w-full">
        
        <AccordionItem value="localizacao">
          <AccordionTrigger className="font-bold hover:text-primary">LOCALIZAÇÃO</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Select value={filters.city} onValueChange={(val) => handleChange('city', val === 'all' ? '' : val)}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Balneário Camboriú">Balneário Camboriú</SelectItem>
                  <SelectItem value="Itapema">Itapema</SelectItem>
                  <SelectItem value="Itajaí">Itajaí</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Select value={filters.neighborhood} onValueChange={(val) => handleChange('neighborhood', val === 'all' ? '' : val)}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Centro">Centro</SelectItem>
                  <SelectItem value="Barra Sul">Barra Sul</SelectItem>
                  <SelectItem value="Barra Norte">Barra Norte</SelectItem>
                  <SelectItem value="Pioneiros">Pioneiros</SelectItem>
                  <SelectItem value="Nações">Nações</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipo">
          <AccordionTrigger className="font-bold hover:text-primary">TIPO DE IMÓVEL</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {['APARTAMENTO', 'CASA', 'COBERTURA', 'TERRENO', 'SALA_COMERCIAL'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={type} 
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => handleCheckbox('types', type)}
                />
                <label htmlFor={type} className="text-sm font-medium cursor-pointer capitalize">
                  {type.toLowerCase().replace('_', ' ')}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="valores">
          <AccordionTrigger className="font-bold hover:text-primary">FAIXA DE PREÇO</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Mínimo (R$)</Label><Input type="number" value={filters.minPrice} onChange={(e) => handleChange('minPrice', e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-xs">Máximo (R$)</Label><Input type="number" value={filters.maxPrice} onChange={(e) => handleChange('maxPrice', e.target.value)} /></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="detalhes">
          <AccordionTrigger className="font-bold hover:text-primary">DETALHES</AccordionTrigger>
          <AccordionContent className="space-y-6">
            <div className="space-y-3">
              <Label>Vagas de Garagem</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <Button key={num} variant={filters.garageSpots === num ? "default" : "outline"} size="sm" className="flex-1" onClick={() => handleGarage(num)}>{num}+</Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Área Mín (m²)</Label><Input type="number" value={filters.minArea} onChange={(e) => handleChange('minArea', e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-xs">Área Máx (m²)</Label><Input type="number" value={filters.maxArea} onChange={(e) => handleChange('maxArea', e.target.value)} /></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="outros">
          <AccordionTrigger className="font-bold hover:text-primary">OUTROS</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold">Estágio</Label>
              {[{id:'LANCAMENTO',l:'Lançamento'}, {id:'EM_OBRA',l:'Em Obra'}, {id:'PRONTO',l:'Pronto'}].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} checked={filters.stage === item.id} onCheckedChange={() => handleChange('stage', filters.stage === item.id ? '' : item.id)} />
                  <label htmlFor={item.id} className="text-sm cursor-pointer">{item.l}</label>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold">Negociação</Label>
              {[{id:'permuta',l:'Permuta'}, {id:'financiamento',l:'Financiamento'}, {id:'veiculo',l:'Veículo'}].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox id={item.id} checked={filters.negotiation.includes(item.id)} onCheckedChange={() => handleCheckbox('negotiation', item.id)} />
                  <label htmlFor={item.id} className="text-sm cursor-pointer">{item.l}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full text-destructive hover:text-destructive border-destructive/50" 
        onClick={() => setFilters({ search: '', city: '', neighborhood: '', types: [], negotiation: [], stage: '', garageSpots: 0, minPrice: '', maxPrice: '', minArea: '', maxArea: '' })}>
        Limpar Filtros
      </Button>
    </aside>
  );
};