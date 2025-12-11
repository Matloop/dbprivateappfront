"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Megaphone,
  Home as HomeIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PropertiesList } from "@/components/admin/PropertiesList";
import { CrmView } from "@/components/crm/CrmView"; 
import { LeadsView } from "@/components/leads/LeadsView"; 
import { toast } from "sonner";
import { api } from "@/lib/api";

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

  // --- 1. VERIFICAÇÃO DE AUTH E STATUS INICIAL ---
  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem("db_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setAuthLoading(false);

      // 1. VERIFICA SE TEM ABA NA URL (Isso exige Suspense)
      const tabParam = searchParams.get('tab');
      if (tabParam && ['imoveis', 'crm', 'leads', 'clientes', 'destaques'].includes(tabParam)) {
          setActiveTab(tabParam);
      }

      // 2. Busca status da marca d'água
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

  // --- 2. FUNÇÃO DE TOGGLE ---
  const toggleWatermark = async (newValue: boolean) => {
    const actionText = newValue ? "ATIVAR" : "REMOVER";

    if (
      !confirm(
        `Deseja realmente ${actionText} a marca d'água em TODOS os imóveis?`
      )
    ) {
      setWatermarkEnabled((prev) => !prev);
      // Hack para forçar re-render visual do checkbox se o usuário cancelar
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
      <div className="h-screen flex items-center justify-center text-primary gap-2 bg-[#121212]">
        <Loader2 className="animate-spin" /> Carregando sistema...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-[#121212] border-b border-[#222] h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <img 
            src="/logo2025.png" 
            alt="DB Private" 
            className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>

        <div className="flex items-center gap-4">
          
          {/* --- SWITCH --- */}
          <div 
            className={`
              flex items-center space-x-2 px-3 py-1 rounded border transition-all duration-300
              ${watermarkEnabled 
                ? "border-primary/50 bg-primary/5" 
                : "border-[#333] bg-transparent hover:border-[#444]"
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
                   data-[state=checked]:bg-primary data-[state=checked]:text-black border-[#555]
                   w-3.5 h-3.5 rounded-sm
                 `}
               />
            )}
            <Label 
              htmlFor="bulk-watermark" 
              className={`
                text-xs cursor-pointer font-medium select-none tracking-wide
                ${watermarkEnabled ? "text-primary" : "text-gray-400 hover:text-white"}
              `}
            >
              Marca D'água Global
            </Label>
          </div>

          <div className="h-4 w-px bg-[#333]" />

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden md:inline font-medium">
              {userEmail}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className="bg-[#121212] border-b border-[#222] px-6 pt-4 flex gap-2 overflow-x-auto">
        {[
          { id: "imoveis", label: "Imóveis", icon: HomeIcon },
          { id: "crm", label: "CRM / Funil", icon: LayoutDashboard }, // Ajuste o ícone se quiser
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
                    ? "bg-[#1a1a1a] text-white border-x border-t border-[#333] relative top-[1px]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]"
                }
              `}
            >
              <tab.icon size={14} className={isActive ? "text-primary" : ""} />
              {tab.label}
              {tab.id === "leads" && (
                <span className="bg-red-900/50 text-red-200 text-[9px] px-1.5 py-0.5 rounded-full ml-1">
                  99+
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 overflow-hidden relative bg-[#121212]">
        
        {/* VIEW IMÓVEIS */}
        {activeTab === "imoveis" && (
          <div className="h-full w-full flex flex-col animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Catálogo</h2>
                  <p className="text-xs text-gray-500">Gestão de portfólio</p>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                <PropertiesList />
             </div>
          </div>
        )}

        {/* VIEW CRM (KANBAN) */}
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
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <div className="bg-[#1a1a1a] p-6 rounded-full mb-4 border border-[#222]">
               <Users size={32} className="text-gray-700" />
            </div>
            <h2 className="text-lg font-medium mb-1">Em Desenvolvimento</h2>
            <p className="text-xs">Módulo será liberado em breve.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// --- COMPONENTE PÁGINA (WRAPPER) ---
// Isso resolve o erro de build no Next.js
export default function IntranetPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#121212] text-primary">
        <Loader2 className="animate-spin" />
      </div>
    }>
      <IntranetContent />
    </Suspense>
  );
}