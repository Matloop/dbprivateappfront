"use client";

import { useEffect, useState } from "react";
import {
  X,
  Send,
  User,
  MessageSquare,
  Flag,
  History,
  CheckSquare,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Circle,
  Building2,
  MapPin,
  Search,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

// --- ESTILO DE SCROLL THEMED ---
const customScroll =
  "overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50";

// Helper para imagem
const fixImageSource = (url: string) => {
  if (!url) return null;
  if (process.env.NODE_ENV === "development") return url;
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return url.replace(
      /http:\/\/(localhost|127\.0\.0\.1):3000/g,
      "https://98.93.10.61.nip.io"
    );
  }
  return url;
};

// Tradutor de Tipos de Tarefa
const getTaskTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    CALL: "Ligação",
    MEETING: "Reunião",
    VISIT: "Visita",
    EMAIL: "Email",
    WHATSAPP: "WhatsApp",
  };
  return map[type] || type;
};

const TIME_OPTIONS = Array.from({ length: 24 * 4 }).map((_, i) => {
  const h = Math.floor(i / 4)
    .toString()
    .padStart(2, "0");
  const m = ((i % 4) * 15).toString().padStart(2, "0");
  return `${h}:${m}`;
});

interface DealDetailsModalProps {
  dealId: number | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function DealDetailsModal({
  dealId,
  onClose,
  onUpdate,
}: DealDetailsModalProps) {
  const [deal, setDeal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "timeline" | "tasks" | "properties"
  >("timeline");

  // Estados
  const [showLossReason, setShowLossReason] = useState(false);
  const [lossReason, setLossReason] = useState("");
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("CALL");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState("09:00");
  const [creatingTask, setCreatingTask] = useState(false);
  const [searchProp, setSearchProp] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [linkingProp, setLinkingProp] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchDealData();
      setActiveTab("timeline");
    } else {
      setDeal(null);
    }
  }, [dealId]);

  const fetchDealData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/crm/deals/${dealId}`);
      setDeal(data);
    } catch {
      toast.error("Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleSearchProperties = async () => {
    if (!searchProp) return;
    try {
      const { data } = await api.get(
        `/properties?search=${searchProp}&limit=5`
      );
      setSearchResults(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkProperty = async (propertyId: number) => {
    setLinkingProp(true);
    try {
      await api.post(`/crm/deals/${dealId}/properties/${propertyId}`);
      toast.success("Vinculado!");
      setSearchProp("");
      setSearchResults([]);
      fetchDealData();
    } catch {
      toast.error("Erro.");
    } finally {
      setLinkingProp(false);
    }
  };

  const handleChangeStatus = async (status: "WON" | "LOST" | "OPEN") => {
    if (status === "LOST" && !lossReason && !showLossReason) {
      setShowLossReason(true);
      return;
    }
    try {
      await api.patch(`/crm/deals/${dealId}/status`, {
        status,
        lossReason: status === "LOST" ? lossReason : undefined,
      });
      toast.success("Atualizado!");
      setShowLossReason(false);
      setLossReason("");
      fetchDealData();
      if (onUpdate) onUpdate();
    } catch {
      toast.error("Erro.");
    }
  };

  const handleUnlinkProperty = async (propertyId: number) => {
    if (!confirm("Remover?")) return;
    try {
      await api.delete(`/crm/deals/${dealId}/properties/${propertyId}`);
      toast.success("Removido.");
      fetchDealData();
    } catch {
      toast.error("Erro.");
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !date) return toast.warning("Preencha dados.");
    setCreatingTask(true);
    try {
      await api.post(`/crm/deals/${dealId}/tasks`, {
        title: taskTitle,
        type: taskType,
        dueDate: new Date(`${date}T${time}:00`).toISOString(),
      });
      toast.success("Agendado!");
      setTaskTitle("");
      fetchDealData();
    } catch {
      toast.error("Erro.");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Excluir?")) return;
    try {
      await api.delete(`/crm/tasks/${taskId}`);
      setDeal((prev: any) =>
        prev
          ? { ...prev, tasks: prev.tasks.filter((t: any) => t.id !== taskId) }
          : null
      );
      toast.success("Excluída.");
    } catch {
      toast.error("Erro.");
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await api.patch(`/crm/tasks/${taskId}/toggle`);
      setDeal((prev: any) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t: any) =>
                t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
              ),
            }
          : null
      );
    } catch {
      toast.error("Erro.");
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/crm/deals/${dealId}/notes`, { description: noteText });
      fetchDealData();
      setNoteText("");
      toast.success("Salvo.");
    } catch {
      toast.error("Erro.");
    } finally {
      setSavingNote(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(val));

  const tabBtnClass = (tab: string) =>
    `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? "border-primary text-foreground"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Dialog open={!!dealId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-border text-foreground max-w-5xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl outline-none">
        <DialogTitle className="sr-only">Detalhes</DialogTitle>

        {loading || !deal ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
            {/* ESQUERDA */}
            <div
              className={`w-full md:w-1/3 border-r border-border p-6 flex flex-col gap-6 bg-card ${customScroll}`}
            >
              <div>
                <div className="flex gap-2 mb-4">
                  {deal.status === "OPEN" ? (
                    !showLossReason ? (
                      <>
                        <Button
                          onClick={() => handleChangeStatus("WON")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-9"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> GANHO
                        </Button>
                        <Button
                          onClick={() => setShowLossReason(true)}
                          className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold h-9"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> PERDIDO
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col gap-2">
                        <Select
                          value={lossReason}
                          onValueChange={setLossReason}
                        >
                          <SelectTrigger className="bg-background border-destructive text-foreground h-9">
                            <SelectValue placeholder="Motivo?" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            <SelectItem value="Preço alto">💰 Preço</SelectItem>
                            <SelectItem value="Outro">❓ Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowLossReason(false)}
                            variant="ghost"
                            className="flex-1 h-8 text-xs"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleChangeStatus("LOST")}
                            disabled={!lossReason}
                            className="flex-1 bg-destructive h-8 text-xs font-bold text-destructive-foreground"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      className={`w-full p-2 rounded border text-center font-bold uppercase text-xs flex items-center justify-center gap-2 ${
                        deal.status === "WON"
                          ? "bg-green-900/20 border-green-600 text-green-500"
                          : "bg-destructive/20 border-destructive text-destructive"
                      }`}
                    >
                      {deal.status === "WON" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      {deal.status === "WON" ? "GANHO" : "PERDIDO"}
                      <button
                        onClick={() => handleChangeStatus("OPEN")}
                        className="ml-auto underline hover:text-foreground"
                      >
                        Reabrir
                      </button>
                    </div>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className="border-primary/50 text-primary mb-2"
                >
                  {deal.stage.name}
                </Badge>
                <h2 className="text-xl font-bold leading-tight">
                  {deal.title}
                </h2>
                <div className="mt-3 p-3 bg-background rounded border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Valor
                  </p>
                  <p className="text-xl font-light text-green-400">
                    {formatCurrency(deal.value)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    Contato
                  </span>
                  <span className="font-medium truncate">
                    {deal.lead?.name || deal.contactName}
                  </span>
                  {deal.lead?.phone && (
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/55${deal.lead!.phone.replace(
                            /\D/g,
                            ""
                          )}`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-1 text-green-500 hover:text-green-400 text-xs mt-1"
                    >
                      <MessageSquare size={12} /> WhatsApp
                    </button>
                  )}
                </div>
              </div>

              {deal.properties?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">
                    Imóveis ({deal.properties.length})
                  </p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {deal.properties.map((p: any) => {
                      const img = fixImageSource(p.images?.[0]?.url);
                      return (
                        <div
                          key={p.id}
                          className="w-8 h-8 rounded-full border-2 border-card bg-muted overflow-hidden flex items-center justify-center"
                        >
                          {img ? (
                            <img
                              src={img}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 size={12} className="text-muted-foreground" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-auto pt-10">
                ID: #{deal.id}
              </div>
            </div>

            {/* DIREITA (ABAS) */}
            <div className="w-full md:w-2/3 flex flex-col bg-background h-full overflow-hidden">
              <div className="flex border-b border-border bg-card px-4 flex-shrink-0">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={tabBtnClass("timeline")}
                >
                  Histórico
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={tabBtnClass("tasks")}
                >
                  Tarefas{" "}
                  {deal.tasks?.filter((t: any) => !t.isCompleted).length >
                    0 && (
                    <span className="ml-1 text-[9px] bg-red-900 text-red-200 px-1 rounded">
                      {deal.tasks.filter((t: any) => !t.isCompleted).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("properties")}
                  className={tabBtnClass("properties")}
                >
                  Imóveis{" "}
                  {deal.properties?.length > 0 && (
                    <span className="ml-1 text-[9px] bg-muted-foreground/30 px-1 rounded">
                      {deal.properties.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* HISTÓRICO */}
                {activeTab === "timeline" && (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border bg-muted/20 flex-shrink-0">
                      <div className="flex gap-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Nova anotação..."
                          className="bg-background border-border min-h-[50px] text-sm resize-none flex-1"
                        />
                        <Button
                          onClick={handleSaveNote}
                          disabled={savingNote || !noteText.trim()}
                          className="bg-primary text-primary-foreground font-bold h-auto w-14"
                        >
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className={`flex-1 p-6 ${customScroll}`}>
                      <div className="space-y-6 relative pb-10">
                        <div className="absolute left-[19px] top-2 bottom-0 w-[1px] bg-border z-0"></div>
                        {deal.history.map((item: any) => (
                          <div
                            key={item.id}
                            className="relative z-10 flex gap-4"
                          >
                            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0 shadow-sm z-10">
                              {item.type === "CREATED" ? (
                                <Flag size={14} className="text-green-500" />
                              ) : item.type === "NOTE" ? (
                                <MessageSquare
                                  size={14}
                                  className="text-yellow-500"
                                />
                              ) : (
                                <History size={14} className="text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-foreground">
                                  {item.user?.name || "Sistema"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>
                              <div
                                className={`text-sm text-muted-foreground ${
                                  item.type === "NOTE"
                                    ? "bg-card p-3 rounded border border-border"
                                    : ""
                                }`}
                              >
                                {item.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAREFAS (CORRIGIDO) */}
                {activeTab === "tasks" && (
                  <div className="flex flex-col h-full">
                    <div className="p-4 bg-card border-b border-border flex-shrink-0 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="O que fazer?"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className="bg-background border-border"
                        />
                        <Select value={taskType} onValueChange={setTaskType}>
                          <SelectTrigger className="w-[120px] bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            <SelectItem value="CALL">📞 Ligar</SelectItem>
                            <SelectItem value="MEETING">🤝 Reunião</SelectItem>
                            <SelectItem value="VISIT">🏠 Visita</SelectItem>
                            <SelectItem value="EMAIL">📧 Email</SelectItem>
                            <SelectItem value="WHATSAPP">
                              💬 WhatsApp
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-background border-border"
                        />
                        <Select value={time} onValueChange={setTime}>
                          <SelectTrigger className="w-[100px] bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="h-60 bg-card border-border text-foreground">
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
                          className="bg-primary text-primary-foreground font-bold px-6"
                        >
                          Agendar
                        </Button>
                      </div>
                    </div>

                    <div className={`flex-1 p-4 space-y-2 ${customScroll}`}>
                      {deal.tasks?.length === 0 && (
                        <div className="text-center py-10 opacity-50 text-muted-foreground">
                          <CheckSquare size={30} className="mx-auto mb-2" />
                          Nenhuma tarefa.
                        </div>
                      )}
                      {deal.tasks?.map((task: any) => {
                        const isLate =
                          new Date(task.dueDate) < new Date() &&
                          !task.isCompleted;
                        return (
                          <div
                            key={task.id}
                            className={`flex items-center gap-3 p-3 rounded border border-border bg-card group ${
                              task.isCompleted ? "opacity-50" : ""
                            }`}
                          >
                            <button
                              onClick={() => handleToggleTask(task.id)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              {task.isCompleted ? (
                                <CheckCircle2
                                  size={20}
                                  className="text-green-500"
                                />
                              ) : (
                                <Circle size={20} />
                              )}
                            </button>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  task.isCompleted
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {task.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs mt-1">
                                <span
                                  className={`flex items-center gap-1 ${
                                    isLate
                                      ? "text-red-400 font-bold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon size={12} />{" "}
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "pt-BR"
                                  )}{" "}
                                  {new Date(task.dueDate).toLocaleTimeString(
                                    "pt-BR",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] border-border px-1 uppercase text-muted-foreground"
                                >
                                  {getTaskTypeLabel(task.type)}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* IMÓVEIS */}
                {activeTab === "properties" && (
                  <div className="flex flex-col h-full">
                    <div className="p-4 bg-card border-b border-border flex-shrink-0 space-y-3 relative">
                      <div className="flex gap-2">
                        <Input
                          value={searchProp}
                          onChange={(e) => setSearchProp(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSearchProperties()
                          }
                          placeholder="Buscar imóvel..."
                          className="bg-background border-border"
                        />
                        <Button
                          onClick={handleSearchProperties}
                          className="bg-secondary text-secondary-foreground border border-border"
                        >
                          Buscar
                        </Button>
                      </div>
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-4 right-4 z-50 bg-background border border-border shadow-xl max-h-48 overflow-y-auto rounded-b">
                          {searchResults.map((p) => (
                            <div
                              key={p.id}
                              className="p-2 hover:bg-muted cursor-pointer flex justify-between"
                              onClick={() => handleLinkProperty(p.id)}
                            >
                              <span className="text-sm truncate">
                                {p.title}
                              </span>
                              <PlusCircle
                                size={14}
                                className="text-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 p-4 space-y-3 ${customScroll}`}>
                      {deal.properties?.length === 0 && (
                        <p className="text-center text-muted-foreground mt-10">
                          Nenhum imóvel vinculado.
                        </p>
                      )}
                      {deal.properties?.map((p: any) => {
                        const img = fixImageSource(p.images?.[0]?.url);
                        return (
                          <div
                            key={p.id}
                            className="flex gap-3 bg-card border border-border rounded p-2 mb-2 group"
                          >
                            <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {img ? (
                                <img
                                  src={img}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2
                                  size={20}
                                  className="text-muted-foreground"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-foreground truncate">
                                {p.title}
                              </h4>
                              <div className="flex justify-between items-center mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-border text-green-400"
                                >
                                  {formatCurrency(p.price)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnlinkProperty(p.id)}
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
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