"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Home as HomeIcon,
  Loader2,
  MoreVertical, // <--- NOVO ÍCONE
  History,      // <--- NOVO ÍCONE
  LogOut        // MANTIDO
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // <--- NOVO IMPORT
import { PropertiesList } from "@/components/admin/PropertiesList";
import { CrmView } from "@/components/crm/CrmView"; 
import { LeadsView } from "@/components/leads/LeadsView"; 
import { AuditHistoryModal } from "@/components/admin/AuditHistoryModal"; // <--- IMPORT DO MODAL
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ModeToggle } from "@/components/ui/mode-toggle";

// --- COMPONENTE INTERNO (Lógica real) ---
function IntranetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState("imoveis");
  const [authLoading, setAuthLoading] = useState(true);
  const [watermarkLoading, setWatermarkLoading] = useState(true);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [userEmail, setUserEmail] = useState("Administrador");
  
  // ESTADO DO MODAL DE HISTÓRICO
  const [historyOpen, setHistoryOpen] = useState(false);

  // --- 1. VERIFICAÇÃO DE AUTH E STATUS INICIAL ---
  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem("db_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setAuthLoading(false);

      const tabParam = searchParams.get('tab');
      if (tabParam && ['imoveis', 'crm', 'leads', 'clientes', 'destaques'].includes(tabParam)) {
          setActiveTab(tabParam);
      }

      try {
        const { data } = await api.get("/properties/bulk/watermark-status");
        setWatermarkEnabled(!!data.isEnabled);
      } catch (error) {
        console.error("Erro ao sincronizar status da marca d'água:", error);
      } finally {
        setWatermarkLoading(false);
      }
    };

    initPage();
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("db_token");
    router.replace("/login");
  };

  const toggleWatermark = async (newValue: boolean) => {
    const actionText = newValue ? "ATIVAR" : "REMOVER";

    if (
      !confirm(
        `Deseja realmente ${actionText} a marca d'água em TODOS os imóveis?`
      )
    ) {
      setWatermarkEnabled((prev) => !prev);
      setTimeout(() => setWatermarkEnabled((prev) => !prev), 0);
      return;
    }

    try {
      setBulkProcessing(true);
      setWatermarkEnabled(newValue);

      await api.patch("/properties/bulk/watermark", { enable: newValue });

      toast.success(`Marca d'água global: ${newValue ? "LIGADA" : "DESLIGADA"}`);
      
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao aplicar alteração.");
      setWatermarkEnabled(!newValue);
    } finally {
      setBulkProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-primary gap-2 bg-background">
        <Loader2 className="animate-spin" /> Carregando sistema...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <img 
            src="/logo2025.png" 
            alt="DB Private" 
            className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>

        <div className="flex items-center gap-4">
          
          {/* --- SWITCH MARCA D'ÁGUA --- */}
          <div 
            className={`
              flex items-center space-x-2 px-3 py-1 rounded border transition-all duration-300 hidden md:flex
              ${watermarkEnabled 
                ? "border-primary/50 bg-primary/5" 
                : "border-border bg-transparent hover:bg-muted"
              }
            `}
          >
            {watermarkLoading || bulkProcessing ? (
               <Loader2 className="h-3 w-3 animate-spin text-primary" />
            ) : (
               <Checkbox 
                 id="bulk-watermark" 
                 checked={watermarkEnabled}
                 onCheckedChange={(val) => toggleWatermark(val === true)}
                 className={`
                   data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground
                   w-3.5 h-3.5 rounded-sm
                 `}
               />
            )}
            <Label 
              htmlFor="bulk-watermark" 
              className={`
                text-xs cursor-pointer font-medium select-none tracking-wide
                ${watermarkEnabled ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              Marca D'água Global
            </Label>
          </div>

          <div className="h-4 w-px bg-border hidden md:block" />

          {/* ÁREA DO USUÁRIO + TOGGLE + MENU */}
          <div className="flex items-center gap-3">
            
            <ModeToggle />

            <div className="h-4 w-px bg-border hidden md:block" />

            <span className="text-xs text-muted-foreground hidden md:inline font-medium">
              {userEmail}
            </span>

            {/* --- MENU DROPDOWN DE AÇÕES (SUBSTITUI O LOGOUT DIRETO) --- */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground focus:ring-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                
                <DropdownMenuItem 
                  onClick={() => setHistoryOpen(true)} 
                  className="cursor-pointer hover:bg-muted focus:bg-muted"
                >
                  <History className="mr-2 h-4 w-4 text-primary" />
                  <span>Histórico de Alterações</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-border" />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className="bg-background border-b border-border px-6 pt-4 flex gap-2 overflow-x-auto transition-colors duration-300">
        {[
          { id: "imoveis", label: "Imóveis", icon: HomeIcon },
          { id: "crm", label: "CRM / Funil", icon: LayoutDashboard },
          { id: "leads", label: "Leads", icon: Megaphone },
          { id: "clientes", label: "Clientes", icon: Users },
          { id: "destaques", label: "Destaques", icon: LayoutDashboard },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-all border-b-0
                ${
                  isActive
                    ? "bg-muted text-foreground border-x border-t border-border relative top-[1px]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              <tab.icon size={14} className={isActive ? "text-primary" : ""} />
              {tab.label}
              {tab.id === "leads" && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1 font-bold">
                  99+
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 overflow-hidden relative bg-background transition-colors duration-300">
        
        {/* VIEW IMÓVEIS */}
        {activeTab === "imoveis" && (
          <div className="h-full w-full flex flex-col animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Catálogo</h2>
                  <p className="text-xs text-muted-foreground">Gestão de portfólio</p>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                <PropertiesList />
             </div>
          </div>
        )}

        {/* VIEW CRM */}
        {activeTab === "crm" && (
           <div className="h-full w-full animate-in fade-in duration-300">
              <CrmView />
           </div>
        )}

        {/* VIEW LEADS */}
        {activeTab === "leads" && (
           <div className="h-full w-full animate-in fade-in duration-300">
              <LeadsView />
           </div>
        )}

        {/* OUTROS (PLACEHOLDER) */}
        {(activeTab === "clientes" || activeTab === "destaques") && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="bg-muted p-6 rounded-full mb-4 border border-border">
               <Users size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-1 text-foreground">Em Desenvolvimento</h2>
            <p className="text-xs">Módulo será liberado em breve.</p>
          </div>
        )}
      </main>

      {/* MODAL DE HISTÓRICO */}
      <AuditHistoryModal 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
      />

    </div>
  );
}

// --- COMPONENTE PÁGINA (WRAPPER) ---
export default function IntranetPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="animate-spin" />
      </div>
    }>
      <IntranetContent />
    </Suspense>
  );
}