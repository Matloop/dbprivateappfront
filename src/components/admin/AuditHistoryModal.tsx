"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, History, RefreshCcw } from "lucide-react";
import { api } from "@/lib/api"; // Certifique-se que esse é o caminho do seu Axios configurado
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuditHistoryModal({ isOpen, onClose }: AuditHistoryModalProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Chama a rota que acabamos de criar no backend
      const { data } = await api.get("/audit-logs?limit=100");
      setLogs(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      toast.error("Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  // Função auxiliar para cores das badges
  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50";
    if (act.includes("UPDATE")) return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50";
    if (act.includes("DELETE")) return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50";
    return "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border text-foreground max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2">
              <History className="text-primary" /> Histórico de Alterações
            </DialogTitle>
            <DialogDescription>
              Registro das últimas 100 atividades no sistema.
            </DialogDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs} 
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </DialogHeader>

        {loading && logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Carregando registros...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden border border-border rounded-md relative">
            <div className="absolute inset-0 overflow-auto">
                <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                    <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-[140px]">Data/Hora</TableHead>
                    <TableHead className="w-[100px]">Ação</TableHead>
                    <TableHead className="w-[150px]">Módulo</TableHead>
                    <TableHead>Detalhes da Alteração</TableHead>
                    <TableHead className="text-right w-[180px]">Usuário</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                Nenhum registro encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        logs.map((log) => (
                        <TableRow key={log.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                            <TableCell className="text-xs text-muted-foreground font-mono">
                            {formatDate(log.createdAt)}
                            </TableCell>
                            <TableCell>
                            <Badge variant="outline" className={`text-[10px] font-bold ${getActionColor(log.action)}`}>
                                {log.action}
                            </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-xs">
                                <span className="text-foreground">{log.entity}</span>
                                <span className="text-[10px] text-muted-foreground ml-1">#{log.entityId}</span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground break-all">
                                {log.details}
                            </TableCell>
                            <TableCell className="text-right text-xs font-bold text-primary truncate max-w-[150px]" title={log.performedBy}>
                                {log.performedBy}
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
                </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}