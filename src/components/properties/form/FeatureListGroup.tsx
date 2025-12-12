"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Definição do tipo para garantir segurança
type FeatureCategory = "roomFeatures" | "propertyFeatures" | "developmentFeatures";

interface FeatureListGroupProps {
  title: string;
  name: FeatureCategory;
  options: string[];
}

export function FeatureListGroup({ title, name, options }: FeatureListGroupProps) {
  const { control, setValue } = useFormContext();
  const currentValues: string[] = useWatch({ control, name }) || [];
  const [newItem, setNewItem] = useState("");

  const toggleItem = (item: string) => {
    const updated = currentValues.includes(item)
      ? currentValues.filter((i) => i !== item)
      : [...currentValues, item];
    setValue(name, updated, { shouldDirty: true });
  };

  const removeCustom = (item: string) => {
    setValue(name, currentValues.filter((i) => i !== item), { shouldDirty: true });
    toast.success("Item removido!");
  };

  const addCustom = () => {
    if (!newItem || newItem.trim() === "") return;
    if (!currentValues.includes(newItem)) {
      setValue(name, [...currentValues, newItem], { shouldDirty: true });
      setNewItem("");
      toast.success("Adicionado!");
    }
  };

  const customItems = currentValues.filter((item) => !options.includes(item));

  return (
    <div className="bg-[#252525] p-3 rounded border border-[#333] flex flex-col h-full">
      <h4 className="text-gray-300 font-bold mb-3 uppercase text-xs border-b border-[#444] pb-2">
        {title}
      </h4>

      {/* Lista Padrão */}
      <div className="h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar mb-4">
        {options.map((item) => (
          <div
            key={item}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer select-none p-1 rounded hover:bg-white/5"
            onClick={() => toggleItem(item)}
          >
            <Checkbox checked={currentValues.includes(item)} />
            <span className="text-xs">{item}</span>
          </div>
        ))}
      </div>

      {/* Área de Extras / Importados */}
      <div className="mt-auto pt-3 border-t border-[#444] bg-[#1a1a1a] -mx-3 -mb-3 p-3 rounded-b">
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">
          Importados / Extras
        </p>

        {customItems.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Nenhum item extra.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-3">
            {customItems.map((item, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-red-900/30 text-red-200 hover:bg-red-900/50 border border-red-900 pr-1 flex items-center gap-1 max-w-full truncate"
              >
                <span className="truncate max-w-[150px]" title={item}>
                  {item}
                </span>
                <X
                  size={14}
                  className="cursor-pointer hover:text-white shrink-0"
                  onClick={() => removeCustom(item)}
                />
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add novo..."
            className="h-7 text-xs bg-[#111] border-[#333]"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 border-[#333]"
            onClick={addCustom}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}