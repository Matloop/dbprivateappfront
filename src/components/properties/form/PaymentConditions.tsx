"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Banknote, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { styles } from "./constants";

export function PaymentConditionsStep() {
  const { control } = useFormContext();
  
  // Hook do React Hook Form para lidar com arrays dinâmicos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentConditions",
  });

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-[#333] pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <Banknote size={18} /> CONDIÇÕES DE PAGAMENTO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-end bg-[#121212] p-3 rounded border border-[#333]">
            <FormField
              control={control}
              name={`paymentConditions.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs text-gray-500">Descrição (Ex: Entrada)</FormLabel>
                  <FormControl>
                    <Input {...field} className={styles.inputClass} placeholder="Ex: Entrada / Reforço Anual" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name={`paymentConditions.${index}.value`}
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="text-xs text-gray-500">Valor (R$)</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className={styles.inputClass} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => remove(index)}
                className="hover:bg-red-900/20 hover:text-red-500 text-gray-500 mb-0.5"
            >
                <Trash size={16} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "", value: 0 })}
          className="w-full border-dashed border-[#444] text-gray-400 hover:text-primary hover:border-primary hover:bg-[#121212] h-10"
        >
          <Plus size={16} className="mr-2" /> Adicionar Condição
        </Button>

      </CardContent>
    </Card>
  );
}