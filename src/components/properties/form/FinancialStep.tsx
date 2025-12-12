"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input"; 
import { styles } from "./constants";

export function FinancialStep() {
  const { control } = useFormContext();
  const hasDiscount = useWatch({ control, name: "hasDiscount" });

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <DollarSign size={18} /> VALORES
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className={styles.labelClass}>Valor de Venda</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    {/* ANTES: text-green-400 */}
                    {/* DEPOIS: text-green-600 dark:text-green-400 */}
                    <MoneyInput
                      value={field.value}
                      onChange={field.onChange}
                      className={`${styles.inputClass} text-lg font-bold text-green-600 dark:text-green-400`}
                    />
                  </FormControl>
                  <FormField
                    control={control}
                    name="hasDiscount"
                    render={({ field: f2 }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={f2.value} onCheckedChange={f2.onChange} />
                        </FormControl>
                        {/* ANTES: text-white */}
                        {/* DEPOIS: text-foreground */}
                        <FormLabel className="font-normal text-xs text-foreground">Desconto</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>
            )}
          />

          {hasDiscount && (
            <FormField
              control={control}
              name="promotionalPrice"
              render={({ field }) => (
                <FormItem className="md:col-span-2 animate-in fade-in">
                  <FormLabel className={styles.labelClass}>Valor Promocional</FormLabel>
                  <FormControl>
                    <MoneyInput
                      value={field.value}
                      onChange={field.onChange}
                      className={`${styles.inputClass} border-green-600`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="condoFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Condomínio</FormLabel>
                <FormControl>
                   <MoneyInput value={field.value} onChange={field.onChange} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="iptuPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>IPTU</FormLabel>
                <FormControl>
                   <MoneyInput value={field.value} onChange={field.onChange} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* ANTES: bg-[#252525] border-[#333] */}
        {/* DEPOIS: bg-muted/20 border-border */}
        <div className="bg-muted/20 p-4 rounded border border-border flex flex-wrap gap-6">
          {[
            "acceptsFinancing:Aceita Financiamento",
            "acceptsConstructionFinancing:Financ. Construtora",
            "acceptsTrade:Aceita Permuta",
            "acceptsVehicle:Aceita Veículo",
            "isMcmv:Minha Casa Minha Vida",
          ].map((opt) => {
            const [key, label] = opt.split(":");
            return (
              <FormField
                key={key}
                control={control}
                name={key}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    {/* ANTES: text-gray-300 hover:text-white */}
                    {/* DEPOIS: text-muted-foreground hover:text-foreground */}
                    <FormLabel className="font-normal cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      {label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}