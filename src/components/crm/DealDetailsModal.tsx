'use client';

import { useEffect, useState } from 'react';
import { 
  X, Send, User, Calendar, Tag, DollarSign, 
  ArrowRight, MessageSquare, Flag, History,
  CheckSquare, Calendar as CalendarIcon, Clock, 
  Trash2, PlusCircle, CheckCircle2, Circle, Building2, MapPin, Search
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CrmDealDetails } from '@/types/crm';
import Image from 'next/image';

// Helper para corrigir URL da imagem
const fixImageSource = (url: string) => {
    if (!url) return '/placeholder.jpg';
    if (process.env.NODE_ENV === 'development') return url;
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return url.replace(/http:\/\/(localhost|127\.0\.0\.1):3000/g, 'https://98.93.10.61.nip.io');
    }
    return url;
};

// Gerador de Horários
const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    for (let j = 0; j < 60; j += 15) {
      const minute = j.toString().padStart(2, '0');
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

interface DealDetailsModalProps {
  dealId: number | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function DealDetailsModal({ dealId, onClose, onUpdate }: DealDetailsModalProps) {
  const [deal, setDeal] = useState<any | null>(null); // Usando any temporariamente para facilitar a adição de 'properties'
  const [loading, setLoading] = useState(true);
  
  // Estados Anotação
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Estados Tarefa
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState('CALL');
  const [date, setDate] = useState<string>(''); // Data YYYY-MM-DD
  const [time, setTime] = useState("09:00");
  const [creatingTask, setCreatingTask] = useState(false);

  // Estados Imóveis
  const [searchProp, setSearchProp] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [linkingProp, setLinkingProp] = useState(false);

  // 1. CARREGAR DADOS
  useEffect(() => {
    if (dealId) {
      fetchDealData();
    } else {
      setDeal(null);
    }
  }, [dealId]);

  const fetchDealData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/crm/deals/${dealId}`);
      setDeal(data);
    } catch (error) {
      toast.error("Erro ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE IMÓVEIS (BUSCA E VÍNCULO) ---
  const handleSearchProperties = async () => {
    if (!searchProp) return;
    try {
        const { data } = await api.get(`/properties?search=${searchProp}&limit=5`);
        setSearchResults(data.data);
    } catch (e) { console.error(e); }
  };

  const handleLinkProperty = async (propertyId: number) => {
    setLinkingProp(true);
    try {
        await api.post(`/crm/deals/${dealId}/properties/${propertyId}`);
        toast.success("Imóvel vinculado!");
        setSearchProp('');
        setSearchResults([]);
        fetchDealData(); // Recarrega para mostrar na lista
    } catch (e) {
        toast.error("Erro ao vincular (talvez já esteja vinculado).");
    } finally {
        setLinkingProp(false);
    }
  };

  const handleUnlinkProperty = async (propertyId: number) => {
    if(!confirm("Remover este imóvel do negócio?")) return;
    try {
        await api.delete(`/crm/deals/${dealId}/properties/${propertyId}`);
        toast.success("Imóvel removido.");
        fetchDealData();
    } catch (e) { toast.error("Erro ao remover."); }
  };

  // --- LÓGICA DE TAREFAS ---
  const handleCreateTask = async () => {
    if (!taskTitle || !date || !dealId) {
        toast.warning("Preencha título e data.");
        return;
    }
    setCreatingTask(true);
    const combinedDate = new Date(`${date}T${time}:00`);
    
    try {
      await api.post(`/crm/deals/${dealId}/tasks`, {
        title: taskTitle,
        type: taskType,
        dueDate: combinedDate.toISOString()
      });
      toast.success("Tarefa agendada!");
      setTaskTitle('');
      fetchDealData();
    } catch (e) { toast.error("Erro ao criar tarefa."); } finally { setCreatingTask(false); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Excluir esta tarefa?")) return;
    
    try {
      // Chama a rota que acabamos de criar
      await api.delete(`/crm/tasks/${taskId}`);
      
      // Atualiza a lista visualmente sem recarregar tudo
      setDeal((prev: { tasks: any[]; }) => prev ? ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }) : null);
      
      toast.success("Tarefa excluída.");
    } catch (e) { 
      toast.error("Erro ao excluir."); 
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await api.patch(`/crm/tasks/${taskId}/toggle`);
      setDeal((prev: any) => prev ? ({ ...prev, tasks: prev.tasks.map((t: any) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) }) : null);
    } catch (e) { toast.error("Erro."); }
  };

  // --- LÓGICA DE NOTAS ---
  const handleSaveNote = async () => {
    if (!noteText.trim() || !dealId) return;
    setSavingNote(true);
    try {
      await api.post(`/crm/deals/${dealId}/notes`, { description: noteText });
      fetchDealData();
      setNoteText('');
      toast.success("Nota salva.");
    } catch (e) { toast.error("Erro."); } finally { setSavingNote(false); }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

  return (
    <Dialog open={!!dealId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border-[#333] text-white max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-xl">
        
        {loading || !deal ? (
          <div className="flex-1 flex items-center justify-center text-primary">Carregando...</div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
            
            {/* ESQUERDA: DADOS */}
            <div className="w-full md:w-1/3 border-r border-[#333] p-6 flex flex-col gap-6 bg-[#1a1a1a] overflow-y-auto">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/50 text-primary px-3 py-1 text-xs">{deal.stage.name}</Badge>
                <h2 className="text-2xl font-bold leading-tight">{deal.title}</h2>
                <div className="mt-4 p-3 bg-[#121212] rounded border border-[#333]">
                    <p className="text-xs text-gray-500 uppercase font-bold">Valor Potencial</p>
                    <p className="text-2xl font-light text-green-400">{formatCurrency(deal.value)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-gray-500"><User size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-bold uppercase">Contato</span>
                    <span className="text-base">{deal.lead?.name || deal.contactName}</span>
                    {deal.lead?.email && <span className="text-xs text-gray-500">{deal.lead.email}</span>}
                  </div>
                </div>
                {deal.lead?.phone && (
                  <Button variant="outline" className="w-full border-green-900/30 text-green-500 hover:bg-green-900/20 h-10" onClick={() => window.open(`https://wa.me/55${deal.lead!.phone.replace(/\D/g, '')}`, '_blank')}>
                    <MessageSquare size={16} className="mr-2" /> WhatsApp
                  </Button>
                )}
              </div>
              
              {/* IMÓVEIS VINCULADOS (RESUMO LATERAL) */}
              {deal.properties && deal.properties.length > 0 && (
                  <div className="mt-4 border-t border-[#333] pt-4">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Imóveis de Interesse ({deal.properties.length})</p>
                      <div className="flex -space-x-2 overflow-hidden">
                          {deal.properties.map((p: any) => (
                              <div key={p.id} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-[#333] overflow-hidden" title={p.title}>
                                  {p.images?.[0] && <img src={fixImageSource(p.images[0].url)} className="w-full h-full object-cover" />}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="text-xs text-gray-500 mt-auto pt-10">ID: #{deal.id}</div>
            </div>

            {/* DIREITA: TABS */}
            <div className="w-full md:w-2/3 flex flex-col bg-[#0f0f0f]">
              <Tabs defaultValue="timeline" className="flex-1 flex flex-col h-full">
                
                {/* HEADER TABS */}
                <div className="border-b border-[#333] px-4 bg-[#1a1a1a] flex-shrink-0">
                    <TabsList className="bg-transparent border-b-0 w-full justify-start h-12 p-0 gap-6">
                        <TabsTrigger value="timeline" className="tab-trigger">Histórico</TabsTrigger>
                        <TabsTrigger value="tasks" className="tab-trigger flex gap-2">
                            Tarefas {deal.tasks?.filter((t: any) => !t.isCompleted).length > 0 && <Badge variant="destructive" className="h-4 px-1 text-[9px]">{deal.tasks.filter((t: any) => !t.isCompleted).length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="properties" className="tab-trigger flex gap-2">
                            Imóveis {deal.properties?.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[9px]">{deal.properties.length}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* --- TAB: HISTÓRICO --- */}
                <TabsContent value="timeline" className="tab-content">
                    <div className="p-4 border-b border-[#333] bg-[#151515] flex-shrink-0">
                        <div className="flex gap-2">
                            <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Nova anotação..." className="bg-[#0a0a0a] border-[#333] min-h-[50px] text-sm resize-none" />
                            <Button onClick={handleSaveNote} disabled={savingNote || !noteText.trim()} className="bg-primary text-black font-bold h-auto w-14"><Send size={18}/></Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6 relative pb-4">
                            <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-[#333] z-0"></div>
                            {deal.history.map((item: any) => (
                                <div key={item.id} className="relative z-10 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {item.type === 'CREATED' ? <Flag size={14} className="text-green-500" /> : 
                                         item.type === 'STAGE_CHANGE' ? <ArrowRight size={14} className="text-blue-500" /> : 
                                         item.type === 'NOTE' ? <MessageSquare size={14} className="text-yellow-500" /> :
                                         <History size={14} className="text-gray-500" />}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-sm font-bold text-gray-200">{item.user?.name || 'Sistema'}</span>
                                            <span className="text-[10px] text-gray-600">{formatDate(item.createdAt)}</span>
                                        </div>
                                        <div className={`text-sm text-gray-400 ${item.type === 'NOTE' ? 'bg-[#1a1a1a] p-3 rounded border border-[#333] mt-1' : ''}`}>{item.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>

                {/* --- TAB: TAREFAS (CORRIGIDO SCROLL) --- */}
                <TabsContent value="tasks" className="tab-content flex flex-col h-full">
                    {/* FORM ADD TASK */}
                    <div className="p-4 bg-[#1a1a1a] border-b border-[#333] flex-shrink-0">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><PlusCircle size={14}/> Nova Tarefa</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <Input placeholder="O que fazer?" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="bg-[#121212] border-[#333] h-9 text-sm flex-1" />
                                <Select value={taskType} onValueChange={setTaskType}>
                                    <SelectTrigger className="w-[110px] h-9 bg-[#121212] border-[#333] text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                        {['CALL','WHATSAPP','VISIT','MEETING','EMAIL'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-[#121212] border-[#333] h-9 text-xs w-auto" />
                                <Select value={time} onValueChange={setTime}>
                                    <SelectTrigger className="w-[90px] h-9 bg-[#121212] border-[#333] text-xs"><Clock size={12} className="mr-1"/><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] border-[#333] text-white h-60">
                                        {TIME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleCreateTask} disabled={creatingTask} className="bg-primary text-black font-bold h-9 text-xs ml-auto">Agendar</Button>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE TAREFAS (COM SCROLL INTERNO) */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0">
                        <div className="space-y-2 pb-10">
                            {deal.tasks?.length === 0 && <p className="text-center text-gray-500 mt-10">Nenhuma tarefa.</p>}
                            {deal.tasks?.map((task: any) => {
                                const isLate = new Date(task.dueDate) < new Date() && !task.isCompleted;
                                return (
                                    <div key={task.id} className={`flex items-center gap-3 p-3 rounded border transition-all group ${task.isCompleted ? 'bg-[#121212] border-[#222] opacity-50' : 'bg-[#1a1a1a] border-[#333]'}`}>
                                        <button onClick={() => handleToggleTask(task.id)} className="text-gray-500 hover:text-primary">
                                            {task.isCompleted ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-600' : 'text-gray-200'}`}>{task.title}</p>
                                            <div className="flex items-center gap-3 text-xs mt-1">
                                                <span className={`flex items-center gap-1 ${isLate ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                                    <CalendarIcon size={12} /> {new Date(task.dueDate).toLocaleDateString('pt-BR')} 
                                                    <span className="ml-1">{new Date(task.dueDate).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
                                                </span>
                                                <Badge variant="outline" className="text-[9px] h-4 px-1 border-[#444] text-gray-500">{task.type}</Badge>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAB: IMÓVEIS (NOVO) --- */}
                <TabsContent value="properties" className="tab-content flex flex-col h-full">
                    {/* BUSCA */}
                    <div className="p-4 bg-[#1a1a1a] border-b border-[#333] flex-shrink-0 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={14}/> Vincular Imóvel</h4>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input 
                                    placeholder="Buscar por nome, ref ou edifício..." 
                                    className="pl-9 bg-[#121212] border-[#333] h-9 text-sm"
                                    value={searchProp}
                                    onChange={e => setSearchProp(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearchProperties()}
                                />
                            </div>
                            <Button onClick={handleSearchProperties} className="h-9 bg-[#333] text-white border border-[#444] hover:bg-[#444]">Buscar</Button>
                        </div>
                        {/* RESULTADOS DA BUSCA */}
                        {searchResults.length > 0 && (
                            <div className="bg-[#121212] border border-[#333] rounded max-h-40 overflow-y-auto absolute z-50 w-[calc(100%-3rem)] shadow-xl">
                                {searchResults.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-2 hover:bg-[#222] cursor-pointer" onClick={() => handleLinkProperty(p.id)}>
                                        <span className="text-sm truncate flex-1">{p.title} <span className="text-gray-500 text-xs">(Ref {p.id})</span></span>
                                        <PlusCircle size={14} className="text-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LISTA DE VINCULADOS */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0">
                        <div className="grid grid-cols-1 gap-3">
                            {deal.properties?.length === 0 && <p className="text-center text-gray-500 mt-10">Nenhum imóvel vinculado.</p>}
                            {deal.properties?.map((p: any) => (
                                <div key={p.id} className="flex gap-3 bg-[#1a1a1a] border border-[#333] rounded p-2 hover:border-[#555] transition-all group">
                                    <div className="w-20 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                                        <Image 
                                            src={fixImageSource(p.images?.[0]?.url)} 
                                            alt="" 
                                            width={80} height={80} 
                                            className="w-full h-full object-cover" 
                                            unoptimized={process.env.NODE_ENV === 'development'}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <MapPin size={12}/> {p.address?.neighborhood}, {p.address?.city}
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <Badge variant="outline" className="text-[10px] border-[#444] text-green-400">{formatCurrency(p.price)}</Badge>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleUnlinkProperty(p.id)}
                                                className="h-6 w-6 p-0 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}