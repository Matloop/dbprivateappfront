'use client';

import { useEffect, useState } from 'react';
import { Loader2, Kanban as KanbanIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Lead } from '@/types/lead';

interface SendToCrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export function SendToCrmModal({ isOpen, onClose, lead }: SendToCrmModalProps) {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/crm/pipelines')
        .then(res => {
          setPipelines(res.data);
          if (res.data.length > 0) {
            setSelectedPipelineId(res.data[0].id);
          }
        })
        .catch(() => toast.error("Erro ao carregar funis."))
        .finally(() => setLoading(false));
    } else {
        setSelectedPipelineId('');
        setSelectedStageId('');
    }
  }, [isOpen]);

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  useEffect(() => {
    if (selectedPipeline && selectedPipeline.stages.length > 0) {
        setSelectedStageId(String(selectedPipeline.stages[0].id));
    }
  }, [selectedPipeline]);

  const handleSend = async () => {
    if (!lead || !selectedStageId) return;

    setSending(true);
    try {
      await api.post('/crm/deals', {
        title: lead.subject || lead.name,
        value: 0,
        contactName: lead.name, 
        stageId: Number(selectedStageId),
        leadId: lead.id, 
        priority: 'medium'
      });

      await api.patch(`/leads/${lead.id}`, { status: 'CONVERTIDO' });

      toast.success("Negócio criado e vinculado ao Lead!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar negócio.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* ANTES: bg-[#1a1a1a] border-[#333] text-white */}
      {/* DEPOIS: bg-background border-border text-foreground */}
      <DialogContent className="bg-background border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KanbanIcon size={20} className="text-primary" /> 
            Enviar para o CRM
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Transforme o lead <strong>{lead?.name}</strong> em um negócio no seu funil de vendas.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
            <div className="space-y-4 py-4">
                
                {/* SELEÇÃO DE FUNIL */}
                <div className="space-y-2">
                    <Label>Selecione o Funil</Label>
                    <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
                        <SelectTrigger className="bg-background border-input text-foreground">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {pipelines.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SELEÇÃO DE ETAPA */}
                <div className="space-y-2">
                    <Label>Selecione a Etapa de Entrada</Label>
                    <Select value={selectedStageId} onValueChange={setSelectedStageId} disabled={!selectedPipelineId}>
                        <SelectTrigger className="bg-background border-input text-foreground">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {selectedPipeline?.stages?.map((s: any) => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
        )}

        <DialogFooter>
            <Button variant="ghost" onClick={onClose} className="hover:bg-muted hover:text-foreground">Cancelar</Button>
            <Button 
                onClick={handleSend} 
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                disabled={sending || !selectedStageId}
            >
                {sending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Confirmar Envio
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}