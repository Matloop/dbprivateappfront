"use client";

import { useFormContext } from "react-hook-form";
import { Search, FileText, Eraser } from "lucide-react"; // Adicionei Eraser
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toast } from "sonner"; // Para feedback visual
import { styles } from "./constants";

export function SeoStep() {
  const { control, getValues, setValue } = useFormContext();

  // --- FUNÇÃO DE LIMPEZA DE HTML ---
  const handleCleanHtml = () => {
    const currentText = getValues("description");
    if (!currentText) return;

    if (!confirm("Isso removerá toda a formatação (negrito, links) e deixará apenas o texto puro. Deseja continuar?")) {
        return;
    }

    // 1. Substitui tags de quebra de linha por quebra real
    let clean = currentText
        .replace(/<br\s*\/?>/gi, '\n') // <br> vira Enter
        .replace(/<\/p>/gi, '\n\n')    // </p> vira 2 Enters
        .replace(/<li>/gi, '• ');      // <li> vira um bullet point

    // 2. Remove todas as outras tags HTML (<div...>, <b>, <span>, etc)
    clean = clean.replace(/<[^>]+>/g, '');

    // 3. Remove excesso de espaços em branco e linhas vazias repetidas
    clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

    // 4. Decodifica entidades HTML básicas (ex: &amp; -> &)
    const txt = document.createElement("textarea");
    txt.innerHTML = clean;
    clean = txt.value;

    setValue("description", clean, { shouldDirty: true });
    toast.success("HTML removido com sucesso!");
  };

  return (
    <>
      {/* 9. SEO */}
      <Card className={styles.sectionClass}>
        <CardHeader className="border-b border-[#333] pb-3">
          <CardTitle className="text-primary flex items-center gap-2 text-base">
            <Search size={18} /> SEO (Google)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <FormField
            control={control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Meta Title</FormLabel>
                <FormControl><Input {...field} className={styles.inputClass} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Meta Description</FormLabel>
                <FormControl><Textarea {...field} className={styles.inputClass} /></FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 10. DESCRIÇÃO PÚBLICA */}
      <Card className={styles.sectionClass}>
        <CardHeader className="border-b border-[#333] pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-primary flex items-center gap-2 text-base">
            <FileText size={18} /> DESCRIÇÃO PÚBLICA
          </CardTitle>
          
          {/* --- BOTÃO LIMPAR HTML --- */}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleCleanHtml}
            className="h-8 border-[#444] text-xs text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Eraser size={14} className="mr-2" />
            Limpar HTML
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className={`${styles.inputClass} min-h-[300px] leading-relaxed font-mono text-sm`} 
                    placeholder="Digite a descrição do imóvel aqui..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}