'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Phone, Mail, Calendar, MessageSquare, 
  MoreHorizontal, Trash2, Pencil, Loader2 
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadModal } from './LeadModal';

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Passa os filtros na URL
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
    // Debounce simples para a busca
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

  // Helper para formatar data
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper para cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOVO': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'EM_ATENDIMENTO': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'AGENDOU_VISITA': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'CONVERTIDO': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PERDIDO': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white">
      
      {/* HEADER DE AÇÕES */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-[#333] bg-[#1a1a1a]">
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                    placeholder="Buscar por nome, email ou telefone..." 
                    className="pl-9 bg-[#121212] border-[#333] text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-[#121212] border-[#333] text-white">
                    <div className="flex items-center gap-2">
                        <Filter size={14} />
                        <SelectValue placeholder="Status" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                    <SelectItem value="ALL">Todos os Status</SelectItem>
                    <SelectItem value="NOVO">Novo</SelectItem>
                    <SelectItem value="EM_ATENDIMENTO">Em Atendimento</SelectItem>
                    <SelectItem value="AGENDOU_VISITA">Agendou Visita</SelectItem>
                    <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                    <SelectItem value="PERDIDO">Perdido</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Button onClick={handleNew} className="bg-primary text-black font-bold hover:bg-primary/90 w-full md:w-auto">
            <Plus size={16} className="mr-2" /> Novo Lead
        </Button>
      </div>

      {/* TABELA */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
            <div className="h-full flex items-center justify-center text-primary"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="border border-[#333] rounded-md overflow-hidden bg-[#1a1a1a]">
                <Table>
                    <TableHeader className="bg-[#222]">
                        <TableRow className="border-[#333] hover:bg-[#222]">
                            <TableHead className="text-gray-400">Nome / Contato</TableHead>
                            <TableHead className="text-gray-400">Assunto / Contexto</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    Nenhum lead encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id} className="border-[#333] hover:bg-[#252525]">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{lead.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><Phone size={10}/> {lead.phone}</span>
                                                {lead.email && <span className="flex items-center gap-1 border-l border-[#444] pl-2"><Mail size={10}/> {lead.email}</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[250px]">
                                            <span className="text-sm text-gray-200 truncate" title={lead.subject}>{lead.subject || 'Sem assunto'}</span>
                                            <span className="text-xs text-gray-500 truncate" title={lead.context}>{lead.context || 'Origem desconhecida'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${getStatusColor(lead.status)} border text-[10px]`}>
                                            {lead.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={14} />
                                            {formatDate(lead.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333] text-gray-200">
                                                <DropdownMenuItem onClick={() => handleEdit(lead)} className="cursor-pointer hover:bg-[#333]">
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar / Ver
                                                </DropdownMenuItem>
                                                
                                                {lead.phone && (
                                                    <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank')} className="cursor-pointer hover:bg-[#333] text-green-500">
                                                        <MessageSquare className="mr-2 h-4 w-4" /> Chamar WhatsApp
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="cursor-pointer hover:bg-[#333] text-red-500 focus:text-red-500">
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

      {/* MODAL (FORMULÁRIO) */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeads} 
        leadToEdit={selectedLead}
      />

    </div>
  );
}