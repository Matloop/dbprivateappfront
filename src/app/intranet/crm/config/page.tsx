"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Pencil,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Stage {
  id: number;
  name: string;
  color: string | null;
  order: number;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

const StageItem = ({ 
  stage, 
  index, 
  onUpdate, 
  onRemove 
}: { 
  stage: Stage; 
  index: number; 
  onUpdate: (id: number, field: keyof Stage, value: any) => void;
  onRemove: (id: number) => void;
}) => {
  const [localName, setLocalName] = useState(stage.name);
  const [localColor, setLocalColor] = useState(stage.color ?? "#888888");

  useEffect(() => {
    setLocalName(stage.name);
    setLocalColor(stage.color ?? "#888888");
  }, [stage.name, stage.color]);

  const handleBlurName = () => {
    if (localName !== stage.name) {
      onUpdate(stage.id, "name", localName);
    }
  };

  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalColor(e.target.value);
    onUpdate(stage.id, "color", e.target.value);
  };

  return (
    <Draggable draggableId={String(stage.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center gap-3 p-3 border border-border rounded-md group transition-colors ${
            snapshot.isDragging ? "bg-muted shadow-lg border-primary/50" : "bg-background hover:border-muted-foreground/50"
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div
            {...provided.dragHandleProps}
            className="text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground p-1"
          >
            <GripVertical size={20} />
          </div>

          <div className="h-8 w-8 rounded flex-shrink-0 overflow-hidden relative border border-border cursor-pointer hover:scale-105 transition-transform">
            <input
              type="color"
              value={localColor}
              onChange={handleChangeColor}
              className="absolute -top-1 -left-1 w-[200%] h-[200%] cursor-pointer border-none p-0 bg-transparent"
            />
          </div>

          <div className="flex-1">
            <Label className="sr-only">Nome</Label>
            <Input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleBlurName}
              className="bg-transparent border-transparent hover:border-border focus:border-primary h-9 text-sm text-foreground font-medium"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(stage.id)}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </Draggable>
  );
};

export default function CrmConfigPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    try {
      const { data } = await api.get("/crm/pipelines");
      const sortedData = data.map((p: Pipeline) => ({
        ...p,
        stages: (p.stages || []).sort((a, b) => a.order - b.order),
      }));
      setPipelines(sortedData);
      if (sortedData.length > 0 && !activePipelineId) {
        setActivePipelineId(sortedData[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar funis.");
    } finally {
      setLoading(false);
    }
  };

  const activePipeline = pipelines.find((p) => p.id === activePipelineId);
  const safeStages = activePipeline?.stages || [];

  const handleUpdateStage = async (stageId: number, field: keyof Stage, value: any) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === activePipelineId) {
          return {
            ...p,
            stages: p.stages.map((s) => s.id === stageId ? { ...s, [field]: value } : s),
          };
        }
        return p;
      })
    );
    try {
      await api.patch(`/crm/stages/${stageId}`, { [field]: value });
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };

  const handleAddStage = async () => {
    if (!activePipelineId) return;
    try {
      const lastOrder = safeStages.length > 0 ? Math.max(...safeStages.map(s => s.order)) : 0;
      const { data: newStage } = await api.post("/crm/stages", {
        name: "Nova Etapa",
        color: "#888888",
        pipelineId: activePipelineId,
        order: lastOrder + 1
      });
      setPipelines((prev) =>
        prev.map((p) => p.id === activePipelineId ? { ...p, stages: [...(p.stages || []), newStage] } : p)
      );
      toast.success("Etapa criada!");
    } catch (error) {
      toast.error("Erro ao adicionar etapa.");
    }
  };

  const handleRemoveStage = async (stageId: number) => {
    if (!confirm("Tem certeza? Negócios nesta etapa serão excluídos.")) return;
    setPipelines((prev) =>
      prev.map((p) => p.id === activePipelineId ? { ...p, stages: p.stages.filter((s) => s.id !== stageId) } : p)
    );
    try {
      await api.delete(`/crm/stages/${stageId}`);
      toast.success("Removido com sucesso.");
    } catch (error) {
      toast.error("Erro ao remover.");
      fetchPipelines();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !activePipelineId) return;
    const items = Array.from(safeStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedStages = items.map((item, index) => ({ ...item, order: index }));

    setPipelines(prev => prev.map(p => 
      p.id === activePipelineId ? { ...p, stages: updatedStages } : p
    ));

    try {
      await Promise.all(updatedStages.map(s => 
        api.patch(`/crm/stages/${s.id}`, { order: s.order })
      ));
    } catch (error) {
      toast.error("Erro ao salvar ordem.");
    }
  };

  const handleCreatePipeline = async () => {
    const name = window.prompt("Nome do novo funil:");
    if (!name) return;
    try {
      const { data: newPipeline } = await api.post("/crm/pipelines", { name });
      const safePipeline = { ...newPipeline, stages: newPipeline.stages || [] };
      setPipelines((prev) => [...prev, safePipeline]);
      setActivePipelineId(safePipeline.id);
      toast.success("Funil criado!");
    } catch (error) { toast.error("Erro ao criar funil."); }
  };

  const handleRenamePipeline = async (id: string) => {
    const curr = pipelines.find(p => p.id === id);
    const newName = window.prompt("Novo nome:", curr?.name);
    if (!newName) return;
    setPipelines(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    api.patch(`/crm/pipelines/${id}`, { name: newName });
  };

  const handleDeletePipeline = async (id: string) => {
    if (!confirm("Excluir funil e todos os dados?")) return;
    try {
      await api.delete(`/crm/pipelines/${id}`);
      const filtered = pipelines.filter(p => p.id !== id);
      setPipelines(filtered);
      if (activePipelineId === id && filtered.length > 0) setActivePipelineId(filtered[0].id);
      toast.success("Funil excluído.");
    } catch { toast.error("Erro ao excluir."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-foreground"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Link href="/intranet?tab=crm">
              <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground">
                <ArrowLeft size={24} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Configurações de CRM</h1>
              <p className="text-muted-foreground text-sm">Gerencie seus funis e etapas.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">Seus Funis</h3>
              <Button onClick={handleCreatePipeline} variant="ghost" size="icon" className="h-6 w-6 text-primary"><Plus size={16} /></Button>
            </div>
            <div className="space-y-1">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  className={`group flex items-center justify-between w-full px-3 py-2 rounded-md transition-all border cursor-pointer ${
                    activePipelineId === pipeline.id 
                      ? "bg-muted border-border font-medium text-foreground" 
                      : "border-transparent text-muted-foreground hover:bg-card"
                  }`}
                  onClick={() => setActivePipelineId(pipeline.id)}
                >
                  <span className="flex-1 text-sm truncate">{pipeline.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100"><MoreVertical size={14} /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                      <DropdownMenuItem onClick={() => handleRenamePipeline(pipeline.id)}><Pencil className="mr-2 h-4 w-4" /> Renomear</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePipeline(pipeline.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="lg:col-span-9">
            <Card className="bg-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Etapas do Funil: <span className="text-primary">{activePipeline?.name}</span></CardTitle>
                  <p className="text-xs text-muted-foreground">Arraste para reordenar. Edite para salvar.</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-6">
                {enabled ? (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="stages-list">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {safeStages.map((stage, index) => (
                            <StageItem 
                              key={stage.id} 
                              stage={stage} 
                              index={index} 
                              onUpdate={handleUpdateStage}
                              onRemove={handleRemoveStage}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Carregando editor...</div>
                )}

                <Button onClick={handleAddStage} variant="outline" className="w-full mt-4 border-dashed border-border text-muted-foreground hover:text-primary hover:bg-background h-12">
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