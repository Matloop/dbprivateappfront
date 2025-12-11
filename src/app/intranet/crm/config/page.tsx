'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, Trash2, GripVertical, Pencil, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Stage {
    id: number; // No backend é ID numérico
    name: string;
    color: string;
    order: number;
}

interface Pipeline {
    id: string; // UUID
    name: string;
    stages: Stage[];
}

export default function CrmConfigPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. CARREGAR DADOS DO BACKEND
  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
        const { data } = await api.get('/crm/pipelines');
        setPipelines(data);
        if (data.length > 0 && !activePipelineId) {
            setActivePipelineId(data[0].id);
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar funis.");
    } finally {
        setLoading(false);
    }
  };

  const activePipeline = pipelines.find(p => p.id === activePipelineId);

  // --- AÇÕES DE FUNIL (PIPELINE) ---

  const handleCreatePipeline = async () => {
    const name = window.prompt("Nome do novo funil:");
    if (!name) return;

    try {
        const { data: newPipeline } = await api.post('/crm/pipelines', { name });
        setPipelines([...pipelines, newPipeline]);
        setActivePipelineId(newPipeline.id);
        toast.success("Funil criado!");
    } catch (error) {
        toast.error("Erro ao criar funil.");
    }
  };

  const handleRenamePipeline = async (pipelineId: string) => {
    const currentName = pipelines.find(p => p.id === pipelineId)?.name;
    const newName = window.prompt("Novo nome do funil:", currentName);
    if (!newName || newName === currentName) return;

    // Atualização Otimista (Frontend primeiro)
    setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, name: newName } : p));

    try {
        // TODO: Implementar rota PATCH /crm/pipelines/:id no backend se necessário
        // Por enquanto, assumimos sucesso visual ou implementamos depois
        toast.success("Nome atualizado (Visualmente).");
    } catch (error) {
        toast.error("Erro ao renomear.");
    }
  };

  const handleDeletePipeline = async (pipelineId: string) => {
    if (pipelines.length <= 1) {
        toast.error("Você precisa ter pelo menos um funil.");
        return;
    }
    if (!confirm("Tem certeza? Todas as negociações deste funil serão perdidas permanentemente.")) return;

    try {
        // TODO: Implementar DELETE /crm/pipelines/:id no backend
        // await api.delete(`/crm/pipelines/${pipelineId}`);
        
        const newPipelines = pipelines.filter(p => p.id !== pipelineId);
        setPipelines(newPipelines);
        if (activePipelineId === pipelineId) setActivePipelineId(newPipelines[0].id);
        
        toast.success("Funil excluído.");
    } catch (error) {
        toast.error("Erro ao excluir funil.");
    }
  };

  // --- AÇÕES DE ETAPAS (STAGES) ---

  // Apenas atualiza o estado local para edição rápida. O salvamento ocorre no botão "Salvar".
  const handleStageChange = (stageId: number, field: keyof Stage, value: string) => {
    if (!activePipeline) return;

    const updatedPipelines = pipelines.map(pipeline => {
        if (pipeline.id === activePipelineId) {
            return {
                ...pipeline,
                stages: pipeline.stages.map(stage => 
                    stage.id === stageId ? { ...stage, [field]: value } : stage
                )
            };
        }
        return pipeline;
    });

    setPipelines(updatedPipelines);
  };

  const handleAddStage = async () => {
    if (!activePipelineId) return;
    
    // Cria stage REAL no backend imediatamente para gerar ID
    try {
        const { data: newStage } = await api.post('/crm/stages', {
            name: "Nova Etapa",
            color: "#888888",
            pipelineId: activePipelineId
        });

        // Adiciona ao estado local
        const updatedPipelines = pipelines.map(p => {
            if (p.id === activePipelineId) {
                return { ...p, stages: [...p.stages, newStage] };
            }
            return p;
        });
        setPipelines(updatedPipelines);
    } catch (error) {
        toast.error("Erro ao adicionar etapa.");
    }
  };

  const handleRemoveStage = async (stageId: number) => {
    if (!confirm('Tem certeza? Os negócios nesta etapa ficarão órfãos ou serão excluídos.')) return;

    // Atualiza visualmente primeiro
    const updatedPipelines = pipelines.map(p => {
        if (p.id === activePipelineId) {
            return { ...p, stages: p.stages.filter(s => s.id !== stageId) };
        }
        return p;
    });
    setPipelines(updatedPipelines);

    // TODO: Implementar DELETE /crm/stages/:id no backend
    // await api.delete(`/crm/stages/${stageId}`);
  };

  const handleSave = async () => {
    if (!activePipeline) return;
    setSaving(true);

    try {
        // Salva todas as alterações das etapas do funil ativo
        // Isso requer uma rota de Batch Update ou chamar update um por um
        // Para simplificar, vamos assumir que o backend tem um endpoint de update batch ou faremos loop
        
        // Exemplo de loop de update (não é o mais eficiente mas funciona sem mudar backend agora)
        const updates = activePipeline.stages.map(stage => 
            api.patch(`/crm/stages/${stage.id}`, { name: stage.name, color: stage.color, order: stage.order })
        );
        
        await Promise.all(updates);
        toast.success("Alterações salvas com sucesso!");
    } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar alterações.");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-primary"><Loader2 className="animate-spin" /></div>;
  if (!activePipeline) return <div className="p-10 text-white">Nenhum funil encontrado. Crie um novo.</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-[#333]">
            <div className="flex items-center gap-4">
                <Link href="/intranet?tab=crm">
                    <Button variant="ghost" size="icon" className="hover:bg-[#222] text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Configurações de CRM</h1>
                    <p className="text-gray-400 text-sm">Gerencie seus funis e etapas.</p>
                </div>
            </div>
            
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-black hover:bg-primary/90 font-bold min-w-[140px]">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save size={16} className="mr-2" />}
                {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SIDEBAR */}
            <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Seus Funis</h3>
                    <Button onClick={handleCreatePipeline} variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/10" title="Criar novo funil">
                        <Plus size={16} />
                    </Button>
                </div>
                
                <div className="space-y-1">
                    {pipelines.map(pipeline => (
                        <div 
                            key={pipeline.id}
                            className={`group flex items-center justify-between w-full px-3 py-2 rounded-md transition-all border cursor-pointer ${
                                activePipelineId === pipeline.id 
                                ? 'bg-[#252525] border-[#444] text-white' 
                                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                            onClick={() => setActivePipelineId(pipeline.id)}
                        >
                            <span className="flex-1 text-sm font-medium truncate select-none">{pipeline.name}</span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333] text-gray-200">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRenamePipeline(pipeline.id); }} className="cursor-pointer hover:bg-[#333]">
                                        <Pencil className="mr-2 h-4 w-4" /> Renomear
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeletePipeline(pipeline.id); }} className="cursor-pointer hover:bg-[#333] text-red-500 focus:text-red-500">
                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTEÚDO */}
            <div className="lg:col-span-9">
                <Card className="bg-[#1a1a1a] border-[#333]">
                    <CardHeader className="border-b border-[#333] pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg text-white">Etapas do Funil: <span className="text-primary">{activePipeline.name}</span></CardTitle>
                            <p className="text-xs text-gray-500">Edite os nomes e cores das etapas deste funil.</p>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pt-6">
                        {activePipeline.stages.map((stage) => (
                            <div key={stage.id} className="flex items-center gap-3 p-3 bg-[#121212] border border-[#333] rounded-md group hover:border-gray-600 transition-colors">
                                <div className="text-gray-600 cursor-move hover:text-white">
                                    <GripVertical size={20} />
                                </div>

                                <div className="h-8 w-8 rounded flex-shrink-0 overflow-hidden relative border border-[#333] cursor-pointer hover:scale-105 transition-transform">
                                    <input 
                                        type="color" 
                                        value={stage.color || '#888888'}
                                        onChange={(e) => handleStageChange(stage.id, 'color', e.target.value)}
                                        className="absolute -top-1 -left-1 w-[200%] h-[200%] cursor-pointer border-none p-0 bg-transparent"
                                    />
                                </div>

                                <div className="flex-1">
                                    <Label className="sr-only">Nome da etapa</Label>
                                    {/* INPUT CONTROLADO CORRIGIDO: Value ligado ao state, onChange chamando a função de update */}
                                    <Input 
                                        value={stage.name} 
                                        onChange={(e) => handleStageChange(stage.id, 'name', e.target.value)}
                                        className="bg-transparent border-transparent hover:border-[#333] focus:border-primary h-9 text-sm text-white font-medium" 
                                    />
                                </div>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleRemoveStage(stage.id)}
                                    className="text-gray-600 hover:text-red-500 hover:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}

                        <Button 
                            onClick={handleAddStage}
                            variant="outline" 
                            className="w-full mt-4 border-dashed border-[#333] text-gray-400 hover:text-primary hover:border-primary hover:bg-[#121212] h-12"
                        >
                            <Plus size={16} className="mr-2" /> Adicionar Nova Etapa
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
      </div>
    </div>
  );
}