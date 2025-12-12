"use client";

import { useFormContext } from "react-hook-form";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { styles, BADGE_COLORS } from "./constants";

export function GeneralInfoStep() {
  const { control } = useFormContext();

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-[#333] pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <FileText size={18} /> DADOS PRINCIPAIS
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <FormField
            control={control}
            name="oldRef"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className={styles.labelClass}>Ref. Antiga</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-10">
                <FormLabel className={styles.labelClass}>Título do Anúncio *</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="bg-[#252525] p-4 rounded border border-[#333] flex flex-wrap gap-6">
          <FormField
            control={control}
            name="showOnSite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal cursor-pointer">Exibir no Site</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="isExclusive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal cursor-pointer">Imóvel Exclusivo</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="hasSign"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal cursor-pointer">Placa em frente ao imóvel</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="watermarkEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal cursor-pointer text-blue-400 font-bold">Aplicar Marca D'água</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#333]">
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || "APARTAMENTO"}>
                  <FormControl>
                    <SelectTrigger className={styles.inputClass}><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                    {["APARTAMENTO", "CASA", "COBERTURA", "TERRENO", "SALA_COMERCIAL", "SITIO", "GALPAO"].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Situação</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || "DISPONIVEL"}>
                  <FormControl>
                    <SelectTrigger className={styles.inputClass}><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                    {["DISPONIVEL", "VENDIDO", "RESERVADO", "ALUGADO", "NAO_DISPONIVEL"].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="constructionStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Estágio</FormLabel>
                <div className="flex gap-4 items-center h-10">
                  {[
                    { v: "LANCAMENTO", l: "Lançamento" },
                    { v: "EM_OBRA", l: "Em Obras" },
                    { v: "PRONTO", l: "Pronto" },
                  ].map((opt) => (
                    <div key={opt.v} className="flex items-center space-x-2 cursor-pointer" onClick={() => field.onChange(opt.v)}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${field.value === opt.v ? "border-blue-500" : "border-gray-500"}`}>
                        {field.value === opt.v && (<div className="w-2 h-2 rounded-full bg-blue-500" />)}
                      </div>
                      <span className={`text-sm ${field.value === opt.v ? "text-white" : "text-gray-400"}`}>{opt.l}</span>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="border-t border-[#333] pt-4 mt-4">
          <p className={styles.labelClass}>Características Importantes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "isSeaFront:Frente Mar",
              "isSeaQuadra:Quadra Mar",
              "isFurnished:Mobiliado",
              "isSemiFurnished:Semi-Mobiliado",
              "isUnfurnished:Sem Mobília",
              "isHighStandard:Alto Padrão",
              "isDifferentiated:Diferenciado",
            ].map((opt) => {
              const [key, label] = opt.split(":");
              return (
                <FormField
                  key={key}
                  control={control}
                  name={key}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="font-normal cursor-pointer text-sm text-gray-300 hover:text-white">{label}</FormLabel>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 items-end border-t border-[#333] pt-4">
          <FormField
            control={control}
            name="badgeText"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className={styles.labelClass}>Texto da Tarja</FormLabel>
                <FormControl><Input {...field} className={styles.inputClass} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="badgeColor"
            render={({ field }) => (
              <FormItem className="w-40">
                <FormLabel className={styles.labelClass}>Cor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl><SelectTrigger className={styles.inputClass}><SelectValue placeholder="Cor" /></SelectTrigger></FormControl>
                  <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                    {BADGE_COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}