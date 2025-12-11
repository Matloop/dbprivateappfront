"use client";

import { useEffect, useState } from "react";
import {
  X,
  Send,
  User,
  MessageSquare,
  Flag,
  History,
  ArrowRight,
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// UI Components (Shadcn)
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { api } from "@/lib/api";
import { toast } from "sonner";
import { CrmDealDetails } from "@/types/crm";

interface DealDetailsModalProps {
  dealId: number | null;
  onClose: () => void;
  onUpdate: () => void;
}

// Helper: Gera horários de 00:00 a 23:45
const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    for (let j = 0; j < 60; j += 15) {
      const minute = j.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

export function DealDetailsModal({
  dealId,
  onClose,
  onUpdate,
}: DealDetailsModalProps) {
  const [deal, setDeal] = useState<CrmDealDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Histórico
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Tarefas
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("CALL");
  const [taskDate, setTaskDate] = useState<Date | undefined>(undefined);
  const [taskTime, setTaskTime] = useState("09:00");
  const [creatingTask, setCreatingTask] = useState(false);

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

  // 2. SALVAR NOTA
  const handleSaveNote = async () => {
    if (!noteText.trim() || !dealId) return;
    setSavingNote(true);
    try {
      await api.post(`/crm/deals/${dealId}/notes`, { description: noteText });
      const { data } = await api.get(`/crm/deals/${dealId}`);
      setDeal(data);
      setNoteText("");
      toast.success("Anotação salva!");
    } catch (error) {
      toast.error("Erro ao salvar.");
    } finally {
      setSavingNote(false);
    }
  };

  // 3. CRIAR TAREFA
  const handleCreateTask = async () => {
    if (!taskTitle || !taskDate || !dealId) {
      toast.warning("Preencha o título e a data.");
      return;
    }
    setCreatingTask(true);

    // Combina Data + Hora
    const combinedDate = new Date(taskDate);
    const [hours, minutes] = taskTime.split(":");
    combinedDate.setHours(Number(hours), Number(minutes));

    try {
      await api.post(`/crm/deals/${dealId}/tasks`, {
        title: taskTitle,
        type: taskType,
        dueDate: combinedDate.toISOString(),
      });
      toast.success("Tarefa agendada!");

      setTaskTitle("");
      setTaskDate(undefined);
      setTaskTime("09:00");

      const { data } = await api.get(`/crm/deals/${dealId}`);
      setDeal(data);
    } catch (e) {
      toast.error("Erro ao criar tarefa.");
    } finally {
      setCreatingTask(false);
    }
  };

  // 4. TOGGLE TAREFA
  const handleToggleTask = async (taskId: number) => {
    try {
      await api.patch(`/crm/tasks/${taskId}/toggle`);
      setDeal((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t: { id: number; isCompleted: any; }) =>
                t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
              ),
            }
          : null
      );
    } catch (e) {
      toast.error("Erro ao atualizar.");
    }
  };

  // 5. DELETAR TAREFA
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Excluir tarefa?")) return;
    try {
      await api.delete(`/crm/tasks/${taskId}`);
      setDeal((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((t: { id: number; }) => t.id !== taskId),
            }
          : null
      );
      toast.success("Excluído.");
    } catch (e) {
      toast.error("Erro ao excluir.");
    }
  };

  // Helpers
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(val));

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return <Flag size={14} className="text-green-500" />;
      case "STAGE_CHANGE":
        return <ArrowRight size={14} className="text-blue-500" />;
      case "NOTE":
        return <MessageSquare size={14} className="text-yellow-500" />;
      default:
        return <History size={14} className="text-gray-500" />;
    }
  };

  return (
    <Dialog open={!!dealId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border-[#333] text-white max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-xl">
        {loading || !deal ? (
          <div className="flex-1 flex items-center justify-center text-primary">
            <div className="animate-spin mr-2 h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
            Carregando detalhes...
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
            {/* --- ESQUERDA: DADOS --- */}
            <div className="w-full md:w-1/3 border-r border-[#333] p-6 flex flex-col gap-6 bg-[#1a1a1a]">
              <div>
                <Badge
                  variant="outline"
                  className="mb-3 border-primary/50 text-primary px-3 py-1 text-xs"
                >
                  {deal.stage.name}
                </Badge>
                <h2 className="text-2xl font-bold leading-tight">
                  {deal.title}
                </h2>
                <div className="mt-4 p-3 bg-[#121212] rounded border border-[#333]">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Valor Potencial
                  </p>
                  <p className="text-2xl font-light text-green-400">
                    {formatCurrency(deal.value)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      Contato Principal
                    </span>
                    <span className="text-base">
                      {deal.lead?.name || deal.contactName || "Sem nome"}
                    </span>
                    {deal.lead?.email && (
                      <span className="text-xs text-gray-500">
                        {deal.lead.email}
                      </span>
                    )}
                  </div>
                </div>

                {deal.lead?.phone && (
                  <Button
                    variant="outline"
                    className="w-full border-green-900/30 text-green-500 hover:bg-green-900/20 hover:text-green-400 h-10"
                    onClick={() =>
                      window.open(
                        `https://wa.me/55${deal.lead!.phone.replace(
                          /\D/g,
                          ""
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    <MessageSquare size={16} className="mr-2" /> WhatsApp
                  </Button>
                )}
              </div>

              <Separator className="bg-[#333]" />

              <div className="text-xs text-gray-500 mt-auto">
                <p>
                  Criado em:{" "}
                  {formatDate(
                    deal.history[deal.history.length - 1]?.createdAt ||
                      new Date().toISOString()
                  )}
                </p>
                <p className="mt-1 font-mono">ID: #{deal.id}</p>
              </div>
            </div>

            {/* --- DIREITA: TABS --- */}
            <div className="w-full md:w-2/3 flex flex-col bg-[#0f0f0f] h-full">
              <Tabs
                defaultValue="timeline"
                className="flex-1 flex flex-col h-full"
              >
                {/* HEADER TABS */}
                <div className="border-b border-[#333] px-4 bg-[#1a1a1a] flex-shrink-0">
                  <TabsList className="bg-transparent border-b-0 w-full justify-start h-12 p-0">
                    <TabsTrigger
                      value="timeline"
                      className="data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none px-6 h-full font-bold uppercase text-xs tracking-wider"
                    >
                      Histórico
                    </TabsTrigger>
                    <TabsTrigger
                      value="tasks"
                      className="data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none px-6 h-full font-bold uppercase text-xs tracking-wider flex gap-2"
                    >
                      Tarefas
                      {deal?.tasks?.filter((t: any) => !t.isCompleted).length >
                        0 && (
                        <Badge
                          variant="destructive"
                          className="h-4 px-1 text-[9px]"
                        >
                          {deal.tasks.filter((t: any) => !t.isCompleted).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ABA HISTÓRICO */}
                <TabsContent
                  value="timeline"
                  className="flex-1 flex flex-col m-0 p-0 h-full min-h-0 data-[state=active]:flex"
                >
                  <div className="p-4 border-b border-[#333] bg-[#151515] flex-shrink-0">
                    <div className="flex gap-2">
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Escreva uma observação..."
                        className="bg-[#0a0a0a] border-[#333] min-h-[50px] resize-none focus-visible:ring-primary text-sm flex-1"
                      />
                      <Button
                        onClick={handleSaveNote}
                        disabled={savingNote || !noteText.trim()}
                        className="h-auto bg-primary text-black font-bold hover:bg-primary/90 w-14 self-stretch"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 w-full h-full">
                    <div className="p-6 space-y-6 relative pb-10">
                      <div className="absolute left-[43px] top-6 bottom-0 w-[1px] bg-[#333] z-0"></div>
                      {deal.history.map((item) => (
                        <div
                          key={item.id}
                          className="relative z-10 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center flex-shrink-0 shadow-sm ml-2">
                            {getHistoryIcon(item.type)}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="text-sm font-bold text-gray-200">
                                {item.user?.name || "Sistema"}
                              </span>
                              <span className="text-[10px] text-gray-600">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                            <div
                              className={`text-sm text-gray-400 ${
                                item.type === "NOTE"
                                  ? "bg-[#222] p-3 rounded-md border border-[#333] mt-1 text-gray-300"
                                  : ""
                              }`}
                            >
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* ABA TAREFAS */}
                <TabsContent
                  value="tasks"
                  className="flex-1 flex flex-col m-0 p-0 h-full min-h-0 data-[state=active]:flex"
                >
                  <ScrollArea className="flex-1 w-full h-full">
                    <div className="p-6 space-y-6">
                      {/* FORM TAREFA */}
                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] space-y-4 shadow-md">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <PlusCircle size={14} /> Nova Tarefa
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            placeholder="O que fazer?"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="bg-[#121212] border-[#333] flex-1 text-sm h-10"
                          />
                          <Select value={taskType} onValueChange={setTaskType}>
                            <SelectTrigger className="w-full sm:w-[140px] bg-[#121212] border-[#333] h-10 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                              <SelectItem value="CALL">📞 Ligar</SelectItem>
                              <SelectItem value="WHATSAPP">
                                💬 WhatsApp
                              </SelectItem>
                              <SelectItem value="VISIT">🏠 Visita</SelectItem>
                              <SelectItem value="MEETING">
                                🤝 Reunião
                              </SelectItem>
                              <SelectItem value="EMAIL">📧 Email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          {/* Data Picker */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full sm:flex-1 justify-start text-left font-normal bg-[#121212] border-[#333] hover:bg-[#222] hover:text-white h-10",
                                  !taskDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {taskDate ? (
                                  format(taskDate, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione a data</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-[#1a1a1a] border-[#333] text-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={taskDate}
                                onSelect={setTaskDate}
                                initialFocus
                                className="bg-[#1a1a1a] text-white"
                              />
                            </PopoverContent>
                          </Popover>

                          {/* Hora Picker (Select 24h) */}
                          <Select value={taskTime} onValueChange={setTaskTime}>
                            <SelectTrigger className="w-full sm:w-[100px] bg-[#121212] border-[#333] h-10 text-xs">
                              <Clock size={14} className="mr-2 text-gray-400" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white h-60">
                              {TIME_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            onClick={handleCreateTask}
                            disabled={creatingTask}
                            className="w-full sm:w-auto bg-primary text-black font-bold h-10 text-xs px-6"
                          >
                            {creatingTask ? "Salvando..." : "Agendar"}
                          </Button>
                        </div>
                      </div>

                      {/* LISTA DE TAREFAS */}
                      <div className="space-y-2 pb-10">
                        {deal?.tasks?.length === 0 && (
                          <div className="text-center py-10 opacity-50 flex flex-col items-center">
                            <CheckSquare size={40} className="mb-2" />
                            <p className="text-sm">Nenhuma tarefa pendente.</p>
                          </div>
                        )}

                        {deal?.tasks?.map((task: any) => {
                          const isLate =
                            new Date(task.dueDate) < new Date() &&
                            !task.isCompleted;
                          return (
                            <div
                              key={task.id}
                              className={`flex items-center gap-3 p-3 rounded-md border transition-all group ${
                                task.isCompleted
                                  ? "bg-[#121212] border-[#222] opacity-50"
                                  : "bg-[#1a1a1a] border-[#333] hover:border-gray-500"
                              }`}
                            >
                              <button
                                onClick={() => handleToggleTask(task.id)}
                                className="text-gray-400 hover:text-primary transition-colors"
                              >
                                {task.isCompleted ? (
                                  <CheckCircle2
                                    size={22}
                                    className="text-green-500"
                                  />
                                ) : (
                                  <Circle size={22} />
                                )}
                              </button>

                              <div className="flex-1">
                                <p
                                  className={`text-sm font-medium ${
                                    task.isCompleted
                                      ? "line-through text-gray-600"
                                      : "text-gray-200"
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-3 text-xs mt-1">
                                  <span
                                    className={`flex items-center gap-1 ${
                                      isLate
                                        ? "text-red-400 font-bold"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <CalendarIcon size={12} />{" "}
                                    {new Date(task.dueDate).toLocaleDateString(
                                      "pt-BR"
                                    )}
                                    <Clock size={12} className="ml-1" />{" "}
                                    {new Date(task.dueDate).toLocaleTimeString(
                                      "pt-BR",
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 px-1 border-[#444] text-gray-500 uppercase"
                                  >
                                    {task.type}
                                  </Badge>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-gray-700 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
