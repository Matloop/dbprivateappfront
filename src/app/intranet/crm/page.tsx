'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, Search, Kanban as KanbanIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { api } from '@/lib/api';
import { CrmPipelineDTO } from '@/types/crm';

export default function CrmPage() {
  const [pipelines, setPipelines] = useState<CrmPipelineDTO[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const { data } = await api.get('/crm/pipelines');
        setPipelines(data);
        
        if (data.length > 0) {
          setSelectedPipelineId(data[0].id);
        } else {
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

  const currentPipeline = pipelines.find(p => p.id === selectedPipelineId);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background text-foreground overflow-hidden font-sans">
      
      {/* --- HEADER OPERACIONAL --- */}
      <header className="border-b border-border h-16 flex items-center justify-between px-6 bg-card flex-shrink-0">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <KanbanIcon size={20} />
            <span className="font-bold text-lg hidden md:inline">CRM</span>
          </div>

          <div className="h-6 w-px bg-border hidden md:block"></div>

          <Select 
            value={selectedPipelineId} 
            onValueChange={setSelectedPipelineId}
            disabled={loading}
          >
            <SelectTrigger className="w-[220px] h-9 bg-background border-border text-foreground focus:ring-0 focus:border-primary">
              <SelectValue placeholder="Selecione o Funil" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-card-foreground">
              {pipelines.map(pipe => (
                  <SelectItem key={pipe.id} value={pipe.id}>{pipe.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar..." 
                className="pl-9 h-9 bg-background border-border w-[200px] text-xs focus-visible:ring-primary"
            />
          </div>

          <Link href="/intranet/crm/config">
            <Button variant="outline" size="icon" className="border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9">
              <Settings size={18} />
            </Button>
          </Link>

          <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 h-9 px-4 text-xs uppercase tracking-wide">
            <Plus size={16} className="mr-2" /> Novo Negócio
          </Button>
        </div>
      </header>

      {/* --- ÁREA DO KANBAN --- */}
      <div className="flex-1 overflow-hidden relative bg-muted/20">
         {loading ? (
             <div className="flex items-center justify-center h-full text-primary">
                 <Loader2 className="animate-spin" />
             </div>
         ) : (
             <KanbanBoard stages={currentPipeline?.stages || []} />
         )}
      </div>

    </div>
  );
}