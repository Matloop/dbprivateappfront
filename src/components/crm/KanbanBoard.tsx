'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { CrmStageDTO } from '@/types/crm'; // Importando o DTO

interface KanbanBoardProps {
    stages: CrmStageDTO[]; // Tipagem forte aqui!
}

export function KanbanBoard({ stages: initialStages }: KanbanBoardProps) {
    const [stages, setStages] = useState<CrmStageDTO[]>([]);

    // Atualiza o estado local quando as props mudam (ex: trocou de funil)
    useEffect(() => {
        setStages(initialStages || []);
    }, [initialStages]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

    const handleCreateDeal = async (stageId: number) => {
        const title = window.prompt("Nome do negócio:");
        if (!title) return;
        
        try {
            const { data: newDeal } = await api.post('/crm/deals', {
                title, 
                value: 0, 
                contactName: 'Novo Cliente',
                stageId
            });

            // Atualiza a UI otimisticamente ou baseada na resposta
            const updatedStages = stages.map(s => {
                if (s.id === stageId) {
                    return { ...s, deals: [newDeal, ...(s.deals || [])] };
                }
                return s;
            });
            setStages(updatedStages);
            toast.success("Negociação criada!");
        } catch (e) {
            console.error(e);
            toast.error("Erro ao criar negócio");
        }
    };

    return (
        <div className="h-full overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-4 w-max">
                {stages.map((stage) => (
                    <div key={stage.id} className="flex flex-col w-[280px] h-full rounded-lg bg-[#1a1a1a] border border-[#333] shadow-sm">
                        
                        {/* HEADER DA COLUNA */}
                        <div className="p-3 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a] rounded-t-lg sticky top-0 z-10">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color || '#888' }} />
                                <span className="font-semibold text-sm text-gray-200 truncate uppercase">
                                    {stage.name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    ({stage.deals?.length || 0})
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-white" onClick={() => handleCreateDeal(stage.id)}>
                                <Plus size={14} />
                            </Button>
                        </div>

                        {/* LISTA DE CARDS */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-[#121212]/50">
                            {stage.deals?.map((deal) => (
                                <Card key={deal.id} className="bg-[#222] border-0 ring-1 ring-[#333] hover:ring-primary/50 cursor-pointer shadow-lg group">
                                    <CardContent className="p-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-gray-100 line-clamp-2">{deal.title}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <User size={10} /> {deal.contactName || 'S/ Contato'}
                                            </div>
                                            {Number(deal.value) > 0 && (
                                                <Badge variant="outline" className="text-[9px] border-[#444] text-green-400 px-1 py-0 h-4">
                                                    {formatCurrency(deal.value)}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            
                            {(!stage.deals || stage.deals.length === 0) && (
                                <button onClick={() => handleCreateDeal(stage.id)} className="w-full py-8 border border-dashed border-[#333] rounded flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 hover:border-[#444] transition-all">
                                    <Plus size={20} className="mb-1 opacity-50" />
                                    <span className="text-xs">Novo Card</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}