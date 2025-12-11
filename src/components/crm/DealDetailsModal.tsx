'use client';

import { useEffect, useState } from 'react';
import { 
  X, Send, User, MessageSquare, Flag, History,
  CheckSquare, Calendar as CalendarIcon, Clock, 
  Trash2, PlusCircle, CheckCircle2, Circle, Building2, MapPin, Search,
  XCircle, ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';
import { toast } from 'sonner';

// --- ESTILO DE SCROLL DARK (NATIVO) ---
const customScroll = "overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1a1a1a] [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#444]";

// Helper para imagem
const fixImageSource = (url: string) => {
    if (!url) return null;
    if (process.env.NODE_ENV === 'development') return url;
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return url.replace(/http:\/\/(localhost|127\.0\.0\.1):3000/g, 'https://98.93.10.61.nip.io');
    }
    return url;
};

const TIME_OPTIONS = Array.from({ length: 24 * 4 }).map((_, i) => {
    const h = Math.floor(i / 4).toString().padStart(2, '0');
    const m = ((i % 4) * 15).toString().padStart(2, '0');
    return `${h}:${m}`;
});

interface DealDetailsModalProps {
  dealId: number | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function DealDetailsModal({ dealId, onClose, onUpdate }: DealDetailsModalProps) {
  const [deal, setDeal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'properties'>('timeline');

  // Estados
  const [showLossReason, setShowLossReason] = useState(false);
  const [lossReason, setLossReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState('CALL');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState("09:00");
  const [creatingTask, setCreatingTask] = useState(false);
  const [searchProp, setSearchProp] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [linkingProp, setLinkingProp] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchDealData();
      setActiveTab('timeline');
    } else {
      setDeal(null);
    }
  }, [dealId]);

  const fetchDealData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/crm/deals/${dealId}`);
      setDeal(data);
    } catch { toast.error("Erro ao carregar."); } finally { setLoading(false); }
  };

  // Actions
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
        toast.success("Vinculado!");
        setSearchProp(''); setSearchResults([]); fetchDealData();
    } catch { toast.error("Erro."); } finally { setLinkingProp(false); }
  };

  const handleChangeStatus = async (status: 'WON' | 'LOST' | 'OPEN') => {
    if (status === 'LOST' && !lossReason && !showLossReason) { setShowLossReason(true); return; }
    try {
        await api.patch(`/crm/deals/${dealId}/status`, { status, lossReason: status === 'LOST' ? lossReason : undefined });
        toast.success("Atualizado!"); setShowLossReason(false); setLossReason(''); fetchDealData(); if (onUpdate) onUpdate();
    } catch { toast.error("Erro."); }
  };
  
  const handleUnlinkProperty = async (propertyId: number) => {
    if(!confirm("Remover?")) return;
    try { await api.delete(`/crm/deals/${dealId}/properties/${propertyId}`); toast.success("Removido."); fetchDealData(); } catch { toast.error("Erro."); }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !date) return toast.warning("Preencha dados.");
    setCreatingTask(true);
    try {
      await api.post(`/crm/deals/${dealId}/tasks`, { title: taskTitle, type: taskType, dueDate: new Date(`${date}T${time}:00`).toISOString() });
      toast.success("Agendado!"); setTaskTitle(''); fetchDealData();
    } catch { toast.error("Erro."); } finally { setCreatingTask(false); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Excluir?")) return;
    try {
      await api.delete(`/crm/tasks/${taskId}`);
      setDeal((prev: any) => prev ? ({ ...prev, tasks: prev.tasks.filter((t:any) => t.id !== taskId) }) : null);
      toast.success("Excluída.");
    } catch { toast.error("Erro."); }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await api.patch(`/crm/tasks/${taskId}/toggle`);
      setDeal((prev: any) => prev ? ({ ...prev, tasks: prev.tasks.map((t: any) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) }) : null);
    } catch { toast.error("Erro."); }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/crm/deals/${dealId}/notes`, { description: noteText });
      fetchDealData(); setNoteText(''); toast.success("Salvo.");
    } catch { toast.error("Erro."); } finally { setSavingNote(false); }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

  const tabBtnClass = (tab: string) => `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`;

  return (
    <Dialog open={!!dealId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border-[#333] text-white max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl outline-none">
        <DialogTitle className="sr-only">Detalhes</DialogTitle>
        
        {loading || !deal ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Carregando...</div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
            
            {/* ESQUERDA */}
            <div className={`w-full md:w-1/3 border-r border-[#333] p-6 flex flex-col gap-6 bg-[#1a1a1a] ${customScroll}`}>
              <div>
                <div className="flex gap-2 mb-4">
                    {deal.status === 'OPEN' ? (
                        !showLossReason ? (
                            <>
                                <Button onClick={() => handleChangeStatus('WON')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-9"><CheckCircle2 className="mr-2 h-4 w-4" /> GANHO</Button>
                                <Button onClick={() => setShowLossReason(true)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-9"><XCircle className="mr-2 h-4 w-4" /> PERDIDO</Button>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col gap-2">
                                <Select value={lossReason} onValueChange={setLossReason}>
                                    <SelectTrigger className="bg-[#121212] border-red-800 text-white h-9"><SelectValue placeholder="Motivo?" /></SelectTrigger>
                                    <SelectContent className="bg-[#1a1a1a] border-[#333] text-white"><SelectItem value="Preço alto">💰 Preço</SelectItem><SelectItem value="Outro">❓ Outro</SelectItem></SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                    <Button onClick={() => setShowLossReason(false)} variant="ghost" className="flex-1 h-8 text-xs">Cancelar</Button>
                                    <Button onClick={() => handleChangeStatus('LOST')} disabled={!lossReason} className="flex-1 bg-red-600 h-8 text-xs font-bold">Salvar</Button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className={`w-full p-2 rounded border text-center font-bold uppercase text-xs flex items-center justify-center gap-2 ${deal.status === 'WON' ? 'bg-green-900/20 border-green-600 text-green-500' : 'bg-red-900/20 border-red-600 text-red-500'}`}>
                            {deal.status === 'WON' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} {deal.status === 'WON' ? 'GANHO' : 'PERDIDO'}
                            <button onClick={() => handleChangeStatus('OPEN')} className="ml-auto underline hover:text-white">Reabrir</button>
                        </div>
                    )}
                </div>
                <Badge variant="outline" className="border-primary/50 text-primary mb-2">{deal.stage.name}</Badge>
                <h2 className="text-xl font-bold leading-tight">{deal.title}</h2>
                <div className="mt-3 p-3 bg-[#121212] rounded border border-[#333]">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Valor</p>
                    <p className="text-xl font-light text-green-400">{formatCurrency(deal.value)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-gray-500 flex-shrink-0"><User size={16} /></div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Contato</span>
                    <span className="font-medium truncate">{deal.lead?.name || deal.contactName}</span>
                    {deal.lead?.phone && <button onClick={() => window.open(`https://wa.me/55${deal.lead!.phone.replace(/\D/g, '')}`, '_blank')} className="flex items-center gap-1 text-green-500 hover:text-green-400 text-xs mt-1"><MessageSquare size={12}/> WhatsApp</button>}
                  </div>
              </div>
              
              {deal.properties?.length > 0 && (
                  <div className="border-t border-[#333] pt-4">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Imóveis ({deal.properties.length})</p>
                      <div className="flex -space-x-2 overflow-hidden">
                          {deal.properties.map((p: any) => (
                              <div key={p.id} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-[#333] overflow-hidden flex items-center justify-center">
                                  {fixImageSource(p.images?.[0]?.url) ? <img src={fixImageSource(p.images[0].url)!} className="w-full h-full object-cover"/> : <Building2 size={12} className="text-gray-500"/>}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
              <div className="text-xs text-gray-500 mt-auto pt-10">ID: #{deal.id}</div>
            </div>

            {/* DIREITA (ABAS) */}
            <div className="w-full md:w-2/3 flex flex-col bg-[#0f0f0f] h-full overflow-hidden">
              <div className="flex border-b border-[#333] bg-[#1a1a1a] px-4 flex-shrink-0">
                <button onClick={() => setActiveTab('timeline')} className={tabBtnClass('timeline')}>Histórico</button>
                <button onClick={() => setActiveTab('tasks')} className={tabBtnClass('tasks')}>Tarefas</button>
                <button onClick={() => setActiveTab('properties')} className={tabBtnClass('properties')}>Imóveis</button>
              </div>

              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* HISTÓRICO */}
                {activeTab === 'timeline' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-[#333] bg-[#151515] flex-shrink-0">
                            <div className="flex gap-2">
                                <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Nova anotação..." className="bg-[#0a0a0a] border-[#333] min-h-[50px] text-sm resize-none focus-visible:ring-primary" />
                                <Button onClick={handleSaveNote} disabled={savingNote || !noteText.trim()} className="bg-primary text-black font-bold h-auto w-14"><Send size={18}/></Button>
                            </div>
                        </div>
                        <div className={`flex-1 p-6 ${customScroll}`}>
                            <div className="space-y-6 relative pb-10">
                                <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-[#333] z-0"></div>
                                {deal.history.map((item: any) => (
                                    <div key={item.id} className="relative z-10 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center flex-shrink-0 shadow-sm z-10">
                                            {item.type === 'CREATED' ? <Flag size={14} className="text-green-500"/> : item.type === 'NOTE' ? <MessageSquare size={14} className="text-yellow-500"/> : <History size={14} className="text-gray-500"/>}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-bold text-gray-200">{item.user?.name || 'Sistema'}</span>
                                                <span className="text-[10px] text-gray-600">{formatDate(item.createdAt)}</span>
                                            </div>
                                            <div className={`text-sm text-gray-400 ${item.type === 'NOTE' ? 'bg-[#1a1a1a] p-3 rounded border border-[#333]' : ''}`}>{item.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAREFAS */}
                {activeTab === 'tasks' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 bg-[#1a1a1a] border-b border-[#333] flex-shrink-0 space-y-3">
                            <div className="flex gap-2"><Input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Título..." className="bg-[#121212] border-[#333]" /><Button onClick={handleCreateTask} disabled={creatingTask} className="bg-primary text-black font-bold w-24">Add</Button></div>
                            <div className="flex gap-2"><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-[#121212] border-[#333]" /><Select value={time} onValueChange={setTime}><SelectTrigger className="w-24 bg-[#121212] border-[#333]"><SelectValue/></SelectTrigger><SelectContent className="h-40">{TIME_OPTIONS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className={`flex-1 p-4 space-y-2 ${customScroll}`}>
                            {deal.tasks?.map((t: any) => (
                                <div key={t.id} className={`flex items-center gap-3 p-3 mb-2 rounded border border-[#333] bg-[#1a1a1a] ${t.isCompleted ? 'opacity-50' : ''}`}>
                                    <button onClick={() => handleToggleTask(t.id)} className={`w-5 h-5 rounded border flex items-center justify-center ${t.isCompleted ? 'bg-green-500 border-green-500 text-black' : 'border-gray-500'}`}>{t.isCompleted && <CheckSquare size={12}/>}</button>
                                    <div className="flex-1"><p className="text-sm font-medium text-gray-200">{t.title}</p><p className="text-xs text-gray-500">{new Date(t.dueDate).toLocaleDateString()} - {t.type}</p></div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(t.id)} className="h-8 w-8 text-gray-600 hover:text-red-500"><Trash2 size={14}/></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* IMÓVEIS */}
                {activeTab === 'properties' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 bg-[#1a1a1a] border-b border-[#333] flex-shrink-0 space-y-3 relative">
                            <div className="flex gap-2"><Input value={searchProp} onChange={e => setSearchProp(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearchProperties()} placeholder="Buscar imóvel..." className="bg-[#121212] border-[#333]" /><Button onClick={handleSearchProperties} className="bg-[#333] text-white border border-[#444]">Buscar</Button></div>
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-4 right-4 z-50 bg-[#121212] border border-[#333] shadow-xl max-h-48 overflow-y-auto rounded-b">
                                    {searchResults.map(p => (
                                        <div key={p.id} className="p-2 hover:bg-[#222] cursor-pointer flex justify-between" onClick={() => handleLinkProperty(p.id)}><span className="text-sm truncate">{p.title}</span><PlusCircle size={14} className="text-green-500"/></div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`flex-1 p-4 space-y-3 ${customScroll}`}>
                            {deal.properties?.map((p: any) => {
                                const img = fixImageSource(p.images?.[0]?.url);
                                return (
                                    <div key={p.id} className="flex gap-3 bg-[#1a1a1a] border border-[#333] rounded p-2 mb-2 group">
                                        <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {img ? <img src={img} className="w-full h-full object-cover"/> : <Building2 size={20} className="text-gray-600"/>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                                            <div className="flex justify-between items-center mt-1"><Badge variant="outline" className="text-[10px] border-[#444] text-green-400">{formatCurrency(p.price)}</Badge><Button variant="ghost" size="sm" onClick={() => handleUnlinkProperty(p.id)} className="h-6 w-6 text-gray-600 hover:text-red-500"><Trash2 size={14}/></Button></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}