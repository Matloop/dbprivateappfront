"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Home, Search, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import LocationPicker from "@/components/forms/LocationPicker";
import { toast } from "sonner";
import { locationService } from "@/services/location"; 
import { styles } from "./constants";

export function LocationStep() {
  const { control, setValue, getValues, watch } = useFormContext();
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCoords, setLoadingCoords] = useState(false);

  // --- BUSCA CEP ---
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    if (!cep || cep.length < 8) return;

    setLoadingCep(true);
    try {
      const data = await locationService.getAddressByCep(cep);
      
      setValue("address.street", data.street);
      setValue("address.neighborhood", data.neighborhood);
      setValue("address.city", data.city);
      setValue("address.state", data.state);
      
      toast.success("Endereço encontrado!");
      
      const numberInput = document.querySelector('input[name="address.number"]') as HTMLInputElement;
      if (numberInput) numberInput.focus();

    } catch (error) {
      toast.error("CEP não encontrado.");
    } finally {
      setLoadingCep(false);
    }
  };

  // --- BUSCA COORDENADAS AUTOMÁTICAS ---
  const handleAutoCoords = async () => {
    const address = getValues("address");
    
    if (!address.street || !address.city || !address.state) {
      toast.warning("Preencha Rua, Cidade e Estado para buscar as coordenadas.");
      return;
    }

    const query = `${address.street}, ${address.number || ''}, ${address.neighborhood}, ${address.city}, ${address.state}, Brasil`;

    setLoadingCoords(true);
    try {
      const coords = await locationService.getCoordinates(query);
      
      setValue("address.latitude", coords.lat, { shouldDirty: true });
      setValue("address.longitude", coords.lng, { shouldDirty: true });
      
      toast.success("Coordenadas atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível achar a localização exata. Tente ajustar o endereço ou mova o pino manualmente.");
    } finally {
      setLoadingCoords(false);
    }
  };

  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-border pb-3">
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
                <FormLabel className={styles.labelClass}>
                    CEP {loadingCep && <Loader2 className="inline h-3 w-3 animate-spin ml-1"/>}
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className={styles.inputClass} 
                    placeholder="00000-000"
                    onBlur={(e) => {
                        field.onBlur(); 
                        handleCepBlur(e); 
                    }}
                  />
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
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className={styles.labelClass}>Coordenadas Geográficas</p>
            
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAutoCoords}
                disabled={loadingCoords}
                // ANTES: border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black
                // DEPOIS: border-primary text-primary hover:bg-primary hover:text-primary-foreground
                className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
                {loadingCoords ? <Loader2 className="animate-spin mr-2 h-3 w-3" /> : <MapPin className="mr-2 h-3 w-3" />}
                Gerar pelo Endereço
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={control}
              name="address.latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Latitude</FormLabel>
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
                  <FormLabel className="text-xs text-muted-foreground">Longitude</FormLabel>
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