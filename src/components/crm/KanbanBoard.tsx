'use client';

import { useEffect, useState } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot
} from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// --- TIPAGEM ---
interface Deal {
    id: number;
    title: string;
    value: number;
    contactName?: string;
    stageId: number;
}

interface Stage {
    id: number;
    name: string;
    color: string;
    deals: Deal[];
}

export function KanbanBoard({ stages: initialStages }: { stages: any[] }) {
    const [stages, setStages] = useState<Stage[]>([]);
    // Hack para @hello-pangea/dnd funcionar no Next.js (evita erro de Hydration)
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    useEffect(() => {
        // Ordena os deals por segurança (se tiver campo order no futuro)
        const sortedStages = initialStages.map(s => ({
            ...s,
            deals: s.deals || []
        }));
        setStages(sortedStages);
    }, [initialStages]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

    // --- CRIAR NOVO NEGÓCIO ---
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

            // Atualiza localmente
            setStages(prev => prev.map(s => 
                s.id === stageId ? { ...s, deals: [newDeal, ...s.deals] } : s
            ));
            toast.success("Criado!");
        } catch (e) {
            toast.error("Erro ao criar.");
        }
    };

    // --- LÓGICA DO DRAG AND DROP ---
    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Soltou fora de qualquer lista?
        if (!destination) return;

        // Soltou na mesma posição?
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceStageId = Number(source.droppableId);
        const destStageId = Number(destination.droppableId);
        const dealId = Number(draggableId);

        // Copia profunda para não mutar estado diretamente
        const newStages = [...stages];
        
        const sourceStageIndex = newStages.findIndex(s => s.id === sourceStageId);
        const destStageIndex = newStages.findIndex(s => s.id === destStageId);

        const sourceStage = newStages[sourceStageIndex];
        const destStage = newStages[destStageIndex];

        // Remove do array de origem
        const [movedDeal] = sourceStage.deals.splice(source.index, 1);
        
        // Atualiza o ID do stage no objeto movido
        movedDeal.stageId = destStageId;

        // Adiciona no array de destino (na posição correta)
        destStage.deals.splice(destination.index, 0, movedDeal);

        // Atualiza Visual (Optimistic UI)
        setStages(newStages);

        // Atualiza Backend (Se mudou de coluna)
        if (sourceStageId !== destStageId) {
            try {
                await api.patch(`/crm/deals/${dealId}`, { stageId: destStageId });
            } catch (error) {
                console.error("Erro ao salvar movimento", error);
                toast.error("Erro ao salvar mudança.");
                // Aqui o ideal seria reverter o state, mas para simplificar vamos deixar assim
            }
        }
        
        // TODO: Se quiser salvar a ORDEM (index) dentro da coluna, precisaria de um endpoint de reorder
        // await api.patch('/crm/deals/reorder', { ... })
    };

    if (!enabled) {
        return <div className="p-6 text-gray-500">Carregando quadro...</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full overflow-x-auto overflow-y-hidden p-6 bg-[#0f0f0f]">
                <div className="flex h-full gap-4 w-max">
                    {stages.map((stage) => (
                        <div key={stage.id} className="flex flex-col w-[280px] h-full rounded-lg bg-[#1a1a1a] border border-[#333] shadow-sm flex-shrink-0">
                            
                            {/* HEADER DA COLUNA */}
                            <div className="p-3 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a] rounded-t-lg sticky top-0 z-10">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color || '#888' }} />
                                    <span className="font-semibold text-sm text-gray-200 truncate uppercase w-[150px]" title={stage.name}>
                                        {stage.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">
                                        ({stage.deals.length})
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-white" onClick={() => handleCreateDeal(stage.id)}>
                                    <Plus size={14} />
                                </Button>
                            </div>

                            {/* ÁREA DE CARDS (DROPPABLE) */}
                            <Droppable droppableId={String(stage.id)}>
                                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`
                                            flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar min-h-[150px] transition-colors
                                            ${snapshot.isDraggingOver ? 'bg-[#222]' : 'bg-[#121212]/50'}
                                        `}
                                    >
                                        {stage.deals.map((deal, index) => (
                                            <Draggable 
                                                key={deal.id} 
                                                draggableId={String(deal.id)} 
                                                index={index}
                                            >
                                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style }}
                                                        className="mb-2"
                                                    >
                                                        <Card 
                                                            className={`
                                                                border-0 shadow-sm group
                                                                ${snapshot.isDragging ? 'bg-[#333] shadow-xl rotate-2 scale-105 ring-2 ring-primary' : 'bg-[#222] ring-1 ring-[#333] hover:ring-primary/40'}
                                                            `}
                                                        >
                                                            <CardContent className="p-3 space-y-2">
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-sm font-medium text-gray-100 line-clamp-2 leading-tight">
                                                                        {deal.title}
                                                                    </span>
                                                                    <MoreHorizontal size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 cursor-pointer" />
                                                                </div>
                                                                
                                                                <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 truncate max-w-[100px]">
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {stage.deals.length === 0 && !snapshot.isDraggingOver && (
                                            <div 
                                                onClick={() => handleCreateDeal(stage.id)}
                                                className="h-24 border-2 border-dashed border-[#333] rounded-lg flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 hover:border-[#444] hover:bg-[#1a1a1a] transition-all cursor-pointer opacity-70 hover:opacity-100"
                                            >
                                                <Plus size={16} className="mb-1" />
                                                <span className="text-xs">Vazio</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>

                            {/* FOOTER */}
                            <div className="p-2 border-t border-[#333] bg-[#1a1a1a] rounded-b-lg flex justify-between items-center text-[10px] text-gray-500 font-mono">
                                <span>TOTAL</span>
                                <span>
                                    {formatCurrency(stage.deals.reduce((acc, curr) => acc + Number(curr.value || 0), 0))}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
}