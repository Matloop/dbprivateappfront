'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Search, Filter, Kanban as KanbanIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { api } from '@/lib/api';
import { CrmPipelineDTO } from '@/types/crm'; // Importando o DTO

export default function CrmPage() {
  const [pipelines, setPipelines] = useState<CrmPipelineDTO[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados reais do Backend ao carregar a página
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const { data } = await api.get('/crm/pipelines');
        setPipelines(data);
        
        if (data.length > 0) {
          setSelectedPipelineId(data[0].id);
        } else {
            // Se não existir nenhum funil, cria um padrão automaticamente
            const { data: newPipe } = await api.post('/crm/pipelines', { name: 'Funil de Vendas' });
            setPipelines([newPipe]);
            setSelectedPipelineId(newPipe.id);
        }
      } catch (error) {
        console.error("Erro ao carregar CRM", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPipelines();
  }, []);

  // Encontra o objeto do funil selecionado para passar suas etapas
  const currentPipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#121212] text-white overflow-hidden font-sans">
      
      {/* --- HEADER OPERACIONAL --- */}
      <header className="border-b border-[#333] h-16 flex items-center justify-between px-6 bg-[#1a1a1a] flex-shrink-0">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <KanbanIcon size={20} />
            <span className="font-bold text-lg hidden md:inline">CRM</span>
          </div>

          <div className="h-6 w-px bg-[#333] hidden md:block"></div>

          {/* SELECTOR DE FUNIL REAL (Baseado no ID) */}
          <Select 
            value={selectedPipelineId} 
            onValueChange={setSelectedPipelineId}
            disabled={loading}
          >
            <SelectTrigger className="w-[220px] h-9 bg-[#121212] border-[#333] text-white focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Selecione o Funil" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
              {pipelines.map(pipe => (
                  <SelectItem key={pipe.id} value={pipe.id}>{pipe.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
                placeholder="Buscar..." 
                className="pl-9 h-9 bg-[#121212] border-[#333] w-[200px] text-xs focus-visible:ring-primary"
            />
          </div>

          <Link href="/intranet/crm/config">
            <Button variant="outline" size="icon" className="border-[#333] bg-transparent text-gray-400 hover:text-white hover:bg-[#222] h-9 w-9">
              <Settings size={18} />
            </Button>
          </Link>

          <Button className="bg-primary text-black font-bold hover:bg-primary/90 h-9 px-4 text-xs uppercase tracking-wide">
            <Plus size={16} className="mr-2" /> Novo Negócio
          </Button>
        </div>
      </header>

      {/* --- ÁREA DO KANBAN --- */}
      <div className="flex-1 overflow-hidden relative bg-[#0f0f0f]">
         {loading ? (
             <div className="flex items-center justify-center h-full text-primary">
                 <Loader2 className="animate-spin" />
             </div>
         ) : (
             // CORREÇÃO DO ERRO: Passamos 'stages' (Array), não 'funnelId' (String)
             <KanbanBoard stages={currentPipeline?.stages || []} />
         )}
      </div>

    </div>
  );
}