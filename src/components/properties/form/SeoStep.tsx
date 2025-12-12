"use client";

import { useFormContext } from "react-hook-form";
import { Search, FileText, Eraser } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { styles } from "./constants";

export function SeoStep() {
  const { control, getValues, setValue } = useFormContext();

  const handleCleanHtml = () => {
    const currentText = getValues("description");
    if (!currentText) return;

    if (!confirm("Isso removerá toda a formatação (negrito, links) e deixará apenas o texto puro. Deseja continuar?")) {
        return;
    }

    let clean = currentText
        .replace(/<br\s*\/?>/gi, '\n') 
        .replace(/<\/p>/gi, '\n\n')    
        .replace(/<li>/gi, '• ');      

    clean = clean.replace(/<[^>]+>/g, '');
    clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

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
        <CardHeader className="border-b border-border pb-3">
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
        <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-primary flex items-center gap-2 text-base">
            <FileText size={18} /> DESCRIÇÃO PÚBLICA
          </CardTitle>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleCleanHtml}
            // ANTES: border-[#444] text-gray-400 hover:text-white
            // DEPOIS: border-input text-muted-foreground hover:text-foreground
            className="h-8 border-input text-xs text-muted-foreground hover:text-foreground hover:border-destructive hover:bg-destructive/10 transition-colors"
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