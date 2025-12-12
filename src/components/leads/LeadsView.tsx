'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Phone, Mail, Calendar, MessageSquare, 
  MoreHorizontal, Trash2, Pencil, Loader2, ArrowRightCircle 
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { LeadModal } from './LeadModal';
import { SendToCrmModal } from './SendToCrmModal';

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const { data } = await api.get(`/leads?${params.toString()}`);
      setLeads(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;
    try {
        await api.delete(`/leads/${id}`);
        toast.success("Lead excluído.");
        fetchLeads();
    } catch (error) {
        toast.error("Erro ao excluir.");
    }
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }

  const handleSendToCrm = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsCrmModalOpen(true);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOVO': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50';
      case 'EM_ATENDIMENTO': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50';
      case 'AGENDOU_VISITA': return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/50';
      case 'CONVERTIDO': return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50';
      case 'PERDIDO': return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    // ANTES: bg-[#121212] text-white
    // DEPOIS: bg-background text-foreground
    <div className="h-full flex flex-col bg-background text-foreground">
      
      {/* HEADER DE AÇÕES */}
      {/* ANTES: border-[#333] bg-[#1a1a1a] */}
      {/* DEPOIS: border-border bg-card */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {/* ANTES: bg-[#121212] border-[#333] */}
                {/* DEPOIS: bg-background border-input */}
                <Input 
                    placeholder="Buscar por nome, email ou telefone..." 
                    className="pl-9 bg-background border-input text-foreground"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background border-input text-foreground">
                    <div className="flex items-center gap-2">
                        <Filter size={14} />
                        <SelectValue placeholder="Status" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="ALL">Todos os Status</SelectItem>
                    <SelectItem value="NOVO">Novo</SelectItem>
                    <SelectItem value="EM_ATENDIMENTO">Em Atendimento</SelectItem>
                    <SelectItem value="AGENDOU_VISITA">Agendou Visita</SelectItem>
                    <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                    <SelectItem value="PERDIDO">Perdido</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Button onClick={handleNew} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 w-full md:w-auto">
            <Plus size={16} className="mr-2" /> Novo Lead
        </Button>
      </div>

      {/* TABELA */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
            <div className="h-full flex items-center justify-center text-primary"><Loader2 className="animate-spin" /></div>
        ) : (
            // ANTES: border-[#333] bg-[#1a1a1a]
            // DEPOIS: border-border bg-card
            <div className="border border-border rounded-md overflow-hidden bg-card">
                <Table>
                    {/* ANTES: bg-[#222] */}
                    {/* DEPOIS: bg-muted/50 */}
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border hover:bg-muted/50">
                            <TableHead className="text-muted-foreground">Nome / Contato</TableHead>
                            <TableHead className="text-muted-foreground">Assunto / Contexto</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-muted-foreground">Data</TableHead>
                            <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Nenhum lead encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                // ANTES: border-[#333] hover:bg-[#252525]
                                // DEPOIS: border-border hover:bg-muted/30
                                <TableRow key={lead.id} className="border-border hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{lead.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><Phone size={10}/> {lead.phone}</span>
                                                {lead.email && <span className="flex items-center gap-1 border-l border-border pl-2"><Mail size={10}/> {lead.email}</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[250px]">
                                            <span className="text-sm text-foreground truncate" title={lead.subject || ''}>{lead.subject || 'Sem assunto'}</span>
                                            <span className="text-xs text-muted-foreground truncate" title={lead.context || ''}>{lead.context || 'Origem desconhecida'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${getStatusColor(lead.status)} border text-[10px]`}>
                                            {lead.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Calendar size={14} />
                                            {formatDate(lead.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground w-48">
                                                <DropdownMenuItem 
                                                    onClick={() => handleSendToCrm(lead)} 
                                                    className="cursor-pointer hover:bg-muted text-primary font-bold focus:text-primary"
                                                >
                                                    <ArrowRightCircle className="mr-2 h-4 w-4" /> Enviar p/ CRM
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuSeparator className="bg-border" />

                                                <DropdownMenuItem onClick={() => handleEdit(lead)} className="cursor-pointer hover:bg-muted">
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar / Ver
                                                </DropdownMenuItem>
                                                
                                                {lead.phone && (
                                                    <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank')} className="cursor-pointer hover:bg-muted text-green-600 dark:text-green-500">
                                                        <MessageSquare className="mr-2 h-4 w-4" /> Chamar WhatsApp
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator className="bg-border" />

                                                <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="cursor-pointer hover:bg-muted text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        )}
      </div>

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeads} 
        leadToEdit={selectedLead}
      />

      <SendToCrmModal 
        isOpen={isCrmModalOpen}
        onClose={() => {
            setIsCrmModalOpen(false);
            fetchLeads(); 
        }}
        lead={leadToConvert}
      />

    </div>
  );
}