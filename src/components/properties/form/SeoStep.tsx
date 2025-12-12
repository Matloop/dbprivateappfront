"use client";

import { useFormContext } from "react-hook-form";
import { Search, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { styles } from "./constants";

export function SeoStep() {
  const { control } = useFormContext();

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
        <CardHeader className="border-b border-[#333] pb-3">
          <CardTitle className="text-primary flex items-center gap-2 text-base">
            <FileText size={18} /> DESCRIÇÃO PÚBLICA
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} className={`${styles.inputClass} min-h-[300px] leading-relaxed`} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}