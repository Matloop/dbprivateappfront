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
import { toast } from 'sonner';

export function CrmView() {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Busca os funis do backend ao carregar
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const { data } = await api.get('/crm/pipelines');
        setPipelines(data);
        if (data.length > 0) {
          setSelectedPipelineId(data[0].id);
        } else {
            // Se não tiver funil, cria um padrão
            await api.post('/crm/pipelines', { name: 'Funil de Vendas' });
            window.location.reload(); 
        }
      } catch (error) {
        console.error("Erro ao carregar CRM", error);
        toast.error("Erro ao carregar funis.");
      } finally {
        setLoading(false);
      }
    };
    fetchPipelines();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-foreground"><Loader2 className="animate-spin text-primary" /></div>;

  // Encontra o funil selecionado para passar suas etapas pro Kanban
  const currentPipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      
      {/* HEADER DO CRM */}
      <header className="border-b border-border h-16 flex items-center justify-between px-0 md:px-0 bg-background flex-shrink-0 mb-4">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <KanbanIcon size={20} />
            <span className="font-bold text-lg hidden md:inline">CRM</span>
          </div>

          <div className="h-6 w-px bg-border hidden md:block"></div>

          {/* SELECTOR DE FUNIL REAL */}
          <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
            <SelectTrigger className="w-[220px] h-9 bg-card border-border text-foreground focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Selecione o Funil" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              {pipelines.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9 h-9 bg-card border-border w-[150px] text-xs" />
          </div>

          <Link href="/intranet/crm/config">
            <Button variant="outline" size="icon" className="border-border bg-transparent text-muted-foreground hover:text-foreground h-9 w-9">
              <Settings size={18} />
            </Button>
          </Link>
        </div>
      </header>

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-hidden relative bg-background rounded-lg border border-border">
         {/* Passamos o OBJETO stages do funil atual para o Kanban */}
         {currentPipeline && <KanbanBoard stages={currentPipeline.stages} />}
      </div>

    </div>
  );
}