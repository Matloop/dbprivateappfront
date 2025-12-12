"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form"; 

type FeatureCategory = "roomFeatures" | "propertyFeatures" | "developmentFeatures";

interface FeatureListGroupProps {
  title: string;
  name: FeatureCategory;
  options: string[];
}

export function FeatureListGroup({ title, name, options }: FeatureListGroupProps) {
  const { control } = useFormContext();
  const [newItem, setNewItem] = useState("");

  return (
    // ANTES: bg-[#252525] border-[#333]
    // DEPOIS: bg-muted/20 border-border
    <div className="bg-muted/20 p-3 rounded border border-border flex flex-col h-full">
      {/* ANTES: text-gray-300 border-[#444] */}
      {/* DEPOIS: text-muted-foreground border-border */}
      <h4 className="text-muted-foreground font-bold mb-3 uppercase text-xs border-b border-border pb-2">
        {title}
      </h4>

      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const currentValues = Array.isArray(field.value) ? field.value : [];
          
          const toggleItem = (item: string) => {
            const updated = currentValues.includes(item)
              ? currentValues.filter((i: string) => i !== item)
              : [...currentValues, item];
            field.onChange(updated); 
          };

          const addCustom = () => {
            if (!newItem || newItem.trim() === "") return;
            if (!currentValues.includes(newItem)) {
              field.onChange([...currentValues, newItem]);
              setNewItem("");
              toast.success("Adicionado!");
            }
          };

          const removeCustom = (item: string) => {
            const updated = currentValues.filter((i: string) => i !== item);
            field.onChange(updated);
            toast.success("Removido!");
          };

          const customItems = currentValues.filter((item: string) => !options.includes(item));

          return (
            <FormItem className="flex flex-col h-full">
              <FormControl>
                <div className="flex flex-col h-full">
                  
                  {/* LISTA PADRÃO */}
                  <div className="h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar mb-4">
                    {options.map((item) => {
                        const isChecked = currentValues.includes(item);
                        return (
                          <div
                            key={item}
                            // ANTES: text-gray-300 hover:text-white hover:bg-white/5
                            // DEPOIS: text-muted-foreground hover:text-foreground hover:bg-muted
                            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none p-1 rounded hover:bg-muted"
                            onClick={() => toggleItem(item)}
                          >
                            <div className={`
                                h-4 w-4 rounded border flex items-center justify-center transition-colors
                                ${isChecked ? 'bg-primary border-primary' : 'border-muted-foreground bg-transparent'}
                            `}>
                                {isChecked && <span className="text-primary-foreground text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-xs">{item}</span>
                          </div>
                        )
                    })}
                  </div>

                  {/* CUSTOMIZADOS */}
                  {/* ANTES: border-[#444] bg-[#1a1a1a] */}
                  {/* DEPOIS: border-border bg-card */}
                  <div className="mt-auto pt-3 border-t border-border bg-card -mx-3 -mb-3 p-3 rounded-b">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Importados / Extras</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        {customItems.map((item: string) => (
                          // Ajuste de cores do badge para ficar legível
                          <Badge key={item} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/50 pr-1">
                            {item}
                            <X size={14} className="ml-1 cursor-pointer hover:text-destructive-foreground" onClick={() => removeCustom(item)} />
                          </Badge>
                        ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add novo..."
                        // ANTES: bg-[#111] border-[#333]
                        // DEPOIS: bg-background border-input
                        className="h-7 text-xs bg-background border-input"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
                      />
                      <Button type="button" size="sm" variant="outline" className="h-7 w-7 p-0" onClick={addCustom}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          );
        }}
      />
    </div>
  );
}