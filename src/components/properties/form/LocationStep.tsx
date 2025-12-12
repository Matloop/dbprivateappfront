"use client";

import { useFormContext } from "react-hook-form";
import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import LocationPicker from "@/components/forms/LocationPicker";
import { styles } from "./constants";

export function LocationStep() {
  const { control } = useFormContext();

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-[#333] pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <Home size={18} /> LOCALIZAÇÃO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* CEP, Cidade, Estado */}
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={control}
            name="address.zipCode"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel className={styles.labelClass}>CEP</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address.city"
            render={({ field }) => (
              <FormItem className="col-span-7">
                <FormLabel className={styles.labelClass}>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address.state"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className={styles.labelClass}>UF</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Bairro, Rua, Número */}
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className={styles.labelClass}>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address.street"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel className={styles.labelClass}>Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address.number"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className={styles.labelClass}>Número</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Edifício e Exibição */}
        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={control}
            name="buildingName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className={styles.labelClass}>Nome do Edifício</FormLabel>
                <FormControl>
                  <Input {...field} className={styles.inputClass} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="displayAddress"
            render={({ field }) => (
              <FormItem className="flex items-center pt-6 space-x-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Exibir endereço no site
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Coordenadas e Mapa */}
        <div className="border-t border-[#333] pt-4 mt-4">
          <p className={`${styles.labelClass} mb-4`}>Coordenadas Geográficas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={control}
              name="address.latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">Latitude</FormLabel>
                  <FormControl>
                    <Input {...field} className={styles.inputClass} placeholder="-26.99..." />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address.longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">Longitude</FormLabel>
                  <FormControl>
                    <Input {...field} className={styles.inputClass} placeholder="-48.63..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <LocationPicker />
        </div>
      </CardContent>
    </Card>
  );
}