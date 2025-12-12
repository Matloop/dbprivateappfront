"use client";

import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hook (agora suporta criação)
import { usePropertyForm } from "@/hooks/usePropertyForm";

// Componentes Reutilizáveis
import { GeneralInfoStep } from "@/components/properties/form/GeneralInfoStep";
import { FinancialStep } from "@/components/properties/form/FinancialStep";
import { DetailsStep } from "@/components/properties/form/DetailsStep";
import { FeaturesStep } from "@/components/properties/form/FeaturesStep";
import { LocationStep } from "@/components/properties/form/LocationStep";
import { MediaStep } from "@/components/properties/form/MediaStep";
import { PrivateDataStep } from "@/components/properties/form/PrivateDataStep";
import { SeoStep } from "@/components/properties/form/SeoStep";
import { PaymentConditionsStep } from "@/components/properties/form/PaymentConditions";

export default function NewPropertyPage() {
  const router = useRouter();

  // Chamamos o hook sem ID -> Modo Criação
  const { form, isLoading, isSaving, onSubmit } = usePropertyForm({});

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-primary bg-[#121212]">
        <Loader2 className="animate-spin mr-2" /> Iniciando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-32 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#333]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ArrowLeft
              className="cursor-pointer hover:text-primary"
              onClick={() => router.push("/intranet")}
            />{" "}
            Novo Imóvel
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/intranet")}
              className="border-red-900/30 text-red-500 hover:bg-red-900/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="bg-primary text-black font-bold hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}{" "}
              Criar Imóvel
            </Button>
          </div>
        </div>

        {/* FORMULÁRIO COMPLETO (REUTILIZADO) */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <GeneralInfoStep />
            
            <FinancialStep />

            <PaymentConditionsStep />
            
            <DetailsStep />
            
            <FeaturesStep />
            
            <LocationStep />
            
            <MediaStep />
            
            <PrivateDataStep />
            
            <SeoStep />

            {/* RODAPÉ (AÇÕES FINAIS) */}
            <div className="flex justify-end gap-4 pb-20 pt-10 border-t border-[#333]">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/intranet")}
                className="border-red-900/30 text-red-500 hover:bg-red-900/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSaving}
                className="bg-primary text-black font-bold hover:bg-primary/90 h-12 px-8 text-lg"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2" />
                )}{" "}
                Criar Imóvel
              </Button>
            </div>
          </form>
        </FormProvider>

      </div>
    </div>
  );
}