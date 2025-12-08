"use client"

import { useRouter } from "next/navigation"
import { Plus, CloudDownload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useProperties } from "@/hooks/useProperties"

export function PropertiesList() {
  const router = useRouter()
  
  // Busca todos os imóveis (sem filtros para trazer tudo)
  const { data, isLoading, isError, refetch } = useProperties()

  const handleImportDwv = async () => {
    const url = window.prompt("Cole o link do imóvel DWV:")
    if (!url) return
    
    const toastId = toast.loading("Iniciando importação...")
    try {
      await api.post("/properties/import-dwv", { url })
      toast.success("Imóvel importado com sucesso!", { id: toastId })
      refetch() // Atualiza a tabela
    } catch (error) {
      console.error(error)
      toast.error("Erro na importação.", { id: toastId })
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gestão de Imóveis</h1>
          <p className="text-muted-foreground text-sm">Gerencie seu portfólio imobiliário</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportDwv} className="border-[#333] hover:bg-[#333] text-gray-300">
            <CloudDownload className="mr-2 h-4 w-4" /> Importar DWV
          </Button>
          <Button onClick={() => router.push("/intranet/novo")} className="bg-primary text-black font-bold hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Novo Imóvel
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center">Erro ao carregar dados.</div>
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}
    </div>
  )
}