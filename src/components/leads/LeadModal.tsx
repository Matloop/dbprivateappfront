'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Lead, LeadStatus } from '@/types/lead';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadToEdit?: Lead | null;
}

export function LeadModal({ isOpen, onClose, onSuccess, leadToEdit }: LeadModalProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<Lead>>();

  // Popula o formulário se for edição
  useEffect(() => {
    if (leadToEdit) {
      reset(leadToEdit);
    } else {
      reset({ status: LeadStatus.NOVO }); // Padrão para novos
    }
  }, [leadToEdit, reset, isOpen]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      if (leadToEdit) {
        await api.patch(`/leads/${leadToEdit.id}`, data);
        toast.success("Lead atualizado!");
      } else {
        await api.post('/leads', data);
        toast.success("Lead cadastrado!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{leadToEdit ? 'Detalhes do Lead' : 'Novo Lead Manual'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input {...register('name', { required: true })} className="bg-[#121212] border-[#333]" />
            </div>
            <div className="space-y-1">
              <Label>Celular *</Label>
              <Input {...register('phone', { required: true })} className="bg-[#121212] border-[#333]" placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input {...register('email')} className="bg-[#121212] border-[#333]" />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(val) => setValue('status', val as LeadStatus)}
              >
                <SelectTrigger className="bg-[#121212] border-[#333]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                  <SelectItem value="NOVO">Novo</SelectItem>
                  <SelectItem value="EM_ATENDIMENTO">Em Atendimento</SelectItem>
                  <SelectItem value="AGENDOU_VISITA">Agendou Visita</SelectItem>
                  <SelectItem value="CONVERTIDO">Convertido (Ganho)</SelectItem>
                  <SelectItem value="PERDIDO">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Assunto</Label>
                <Input {...register('subject')} className="bg-[#121212] border-[#333]" placeholder="Ex: Interesse no Ed. X" />
            </div>
            <div className="space-y-1">
                <Label>Contexto / Origem</Label>
                <Input {...register('context')} className="bg-[#121212] border-[#333]" placeholder="Ex: Instagram, Site..." />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Mensagem do Cliente</Label>
            <Textarea {...register('message')} className="bg-[#121212] border-[#333] min-h-[80px]" placeholder="Mensagem original enviada pelo lead..." />
          </div>

          <div className="space-y-1">
            <Label className="text-yellow-500">Anotações Internas (Corretor)</Label>
            <Textarea {...register('notes')} className="bg-[#2a2a1a] border-yellow-900/30 min-h-[80px] focus:border-yellow-600" placeholder="Escreva observações sobre o atendimento aqui..." />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-black font-bold hover:bg-primary/90" disabled={saving}>
              <Save size={16} className="mr-2" /> Salvar
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}