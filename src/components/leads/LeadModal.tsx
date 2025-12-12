'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Lead, LeadStatus } from '@/types/lead';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadToEdit?: Lead | null;
}

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  context: '',
  message: '',
  notes: '',
  status: LeadStatus.NOVO
};

export function LeadModal({ isOpen, onClose, onSuccess, leadToEdit }: LeadModalProps) {
  const [saving, setSaving] = useState(false);
  
  const form = useForm({
    defaultValues
  });

  useEffect(() => {
    if (isOpen) {
        if (leadToEdit) {
            form.reset({
                name: leadToEdit.name || '',
                email: leadToEdit.email || '',
                phone: leadToEdit.phone || '',
                subject: leadToEdit.subject || '',
                context: leadToEdit.context || '',
                message: leadToEdit.message || '',
                notes: leadToEdit.notes || '',
                status: leadToEdit.status || LeadStatus.NOVO
            });
        } else {
            form.reset(defaultValues);
        }
    }
  }, [isOpen, leadToEdit, form]);

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
      {/* ANTES: bg-[#1a1a1a] border-[#333] text-white */}
      {/* DEPOIS: bg-background border-border text-foreground */}
      <DialogContent className="bg-background border-border text-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle>{leadToEdit ? 'Detalhes do Lead' : 'Novo Lead Manual'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
             Preencha as informações do cliente abaixo.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            
            <div className="grid grid-cols-2 gap-4">
                {/* CAMPO NOME */}
                <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Nome é obrigatório" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                                {/* ANTES: bg-[#121212] border-[#333] */}
                                {/* DEPOIS: bg-background border-input */}
                                <Input {...field} className="bg-background border-input text-foreground focus-visible:ring-primary" placeholder="Nome do cliente" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* CAMPO CELULAR */}
                <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Celular é obrigatório" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Celular *</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-background border-input text-foreground focus-visible:ring-primary" placeholder="(00) 00000-0000" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-background border-input text-foreground" placeholder="email@cliente.com" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-background border-input text-foreground">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                    <SelectItem value="NOVO">Novo</SelectItem>
                                    <SelectItem value="EM_ATENDIMENTO">Em Atendimento</SelectItem>
                                    <SelectItem value="AGENDOU_VISITA">Agendou Visita</SelectItem>
                                    <SelectItem value="CONVERTIDO">Convertido (Ganho)</SelectItem>
                                    <SelectItem value="PERDIDO">Perdido</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assunto</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-background border-input text-foreground" placeholder="Ex: Interesse no Ed. X" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contexto / Origem</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-background border-input text-foreground" placeholder="Ex: Instagram, Site..." />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mensagem do Cliente</FormLabel>
                        <FormControl>
                            <Textarea {...field} className="bg-background border-input text-foreground min-h-[80px]" placeholder="Mensagem original..." />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        {/* ANTES: text-yellow-500 bg-[#2a2a1a] */}
                        {/* DEPOIS: text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 */}
                        <FormLabel className="text-yellow-600 dark:text-yellow-500">Anotações Internas (Corretor)</FormLabel>
                        <FormControl>
                            <Textarea 
                                {...field} 
                                className="bg-yellow-500/5 border-yellow-500/30 text-foreground min-h-[80px] focus:border-yellow-500" 
                                placeholder="Escreva observações aqui..." 
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-muted hover:text-foreground">Cancelar</Button>
                <Button type="submit" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90" disabled={saving}>
                <Save size={16} className="mr-2" /> Salvar
                </Button>
            </div>

            </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}