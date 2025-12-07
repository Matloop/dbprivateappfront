import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, CloudDownload } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns, Property } from "./properties/columns"; // Ajuste o caminho se necessário

export function PropertiesList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/properties");
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar lista de imóveis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleImportDwv = async () => {
    const url = window.prompt("Cole o link do imóvel DWV:");
    if (!url) return;
    
    toast.info("Iniciando importação...");
    try {
      await api.post("/properties/import-dwv", { url });
      toast.success("Imóvel importado com sucesso!");
      fetchProperties();
    } catch {
      toast.error("Erro na importação.");
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Imóveis</h1>
          <p className="text-muted-foreground">Gerencie seu portfólio imobiliário</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportDwv}>
            <CloudDownload className="mr-2 h-4 w-4" /> Importar DWV
          </Button>
          <Button onClick={() => navigate("/properties/new")} className="bg-primary text-black font-bold">
            <Plus className="mr-2 h-4 w-4" /> Novo Imóvel
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Carregando imóveis...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}