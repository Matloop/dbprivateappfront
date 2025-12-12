"use client";

import { useFormContext } from "react-hook-form";
import { LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { styles } from "./constants";

export function DetailsStep() {
  const { control } = useFormContext();

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-[#333] pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <LayoutGrid size={18} /> DETALHES
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Áreas e Cômodos */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { l: "Área Priv. (m²)", n: "privateArea" },
            { l: "Área Total (m²)", n: "totalArea" },
            { l: "Área Terreno (m²)", n: "landArea" },
            { l: "Quartos", n: "bedrooms" },
            { l: "Suítes", n: "suites" },
            { l: "Banheiros", n: "bathrooms" },
          ].map((f) => (
            <FormField
              key={f.n}
              control={control}
              name={f.n}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={styles.labelClass}>{f.l}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={styles.inputClass}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Garagem e Posições */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#333]">
          <FormField
            control={control}
            name="garageSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.labelClass}>Vagas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={styles.inputClass}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {[
            { l: "Tipo Garagem", n: "garageType" },
            { l: "Posição Solar", n: "solarPosition" },
            { l: "Posição Relativa", n: "relativePosition" },
          ].map((f) => (
            <FormField
              key={f.n}
              control={control}
              name={f.n}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={styles.labelClass}>{f.l}</FormLabel>
                  <FormControl>
                    <Input {...field} className={styles.inputClass} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}