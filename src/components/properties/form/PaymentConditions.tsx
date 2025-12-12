"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Banknote, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { styles } from "./constants";

export function PaymentConditionsStep() {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentConditions",
  });

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <Banknote size={18} /> CONDIÇÕES DE PAGAMENTO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        
        {fields.map((field, index) => (
          // ANTES: bg-[#121212] border-[#333]
          // DEPOIS: bg-background border-border
          <div key={field.id} className="flex gap-4 items-end bg-background p-3 rounded border border-border">
            
            {/* DESCRIÇÃO (TEXTO) */}
            <FormField
              control={control}
              name={`paymentConditions.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs text-muted-foreground">Descrição</FormLabel>
                  <FormControl>
                    <Input 
                        {...field} 
                        onChange={(e) => {
                            field.onChange(e.target.value);
                        }}
                        className={styles.inputClass} 
                        placeholder="Ex: Entrada / Reforço Anual" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* VALOR (DINHEIRO FORMATADO) */}
            <FormField
              control={control}
              name={`paymentConditions.${index}.value`}
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel className="text-xs text-muted-foreground">Valor</FormLabel>
                  <FormControl>
                    <MoneyInput 
                        value={field.value} 
                        onChange={field.onChange}
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
                className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground mb-0.5"
            >
                <Trash size={16} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "", value: 0 })}
          // ANTES: border-[#444] text-gray-400 hover:bg-[#121212]
          // DEPOIS: border-input text-muted-foreground hover:bg-background
          className="w-full border-dashed border-input text-muted-foreground hover:text-primary hover:border-primary hover:bg-background h-10"
        >
          <Plus size={16} className="mr-2" /> Adicionar Condição
        </Button>

      </CardContent>
    </Card>
  );
}