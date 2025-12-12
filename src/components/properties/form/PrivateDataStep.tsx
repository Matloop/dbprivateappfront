"use client";

import { useFormContext } from "react-hook-form";
import { Lock, Briefcase, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { styles } from "./constants";

export function PrivateDataStep() {
  const { control } = useFormContext();

  return (
    <>
      {/* 7. DADOS INTERNOS */}
      <Card className={styles.privateSectionClass}>
        <CardHeader className="border-b border-[#5c4018] pb-3">
          <CardTitle className="text-[#d4af37] flex items-center gap-2 text-base">
            <Lock size={18} /> DADOS PRIVADOS (INTERNO)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          <div className="p-4 border border-[#5c4018] rounded bg-[#25201b]/50 mb-4">
            <h4 className="text-[#a89060] text-xs uppercase font-bold mb-3 border-b border-[#5c4018] pb-2">
              Pessoal Edifício
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="buildingAdministrator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Administradora</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="condoManager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Síndico</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={control}
                name="constructionCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Construtora</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Proprietário</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="ownerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Email Propriet.</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="exclusivitySigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-[#d4af37] data-[state=checked]:bg-[#d4af37]"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-[#d4af37]">
                      Autorização de venda assinada
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={control}
                name="ownerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Telefones</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="onus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Ônus ou Restrição</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="paymentDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Pagamento</FormLabel>
                    <FormControl>
                      <Input {...field} className={styles.privateInputClass} placeholder="Ex: 35% de entrada..." />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="incorporation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Incorporação</FormLabel>
                    <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={styles.privateLabelClass}>Data de Entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className={styles.privateInputClass} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={control}
            name="brokerNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.privateLabelClass}>Observações Internas</FormLabel>
                <FormControl>
                  <Textarea {...field} className={`${styles.privateInputClass} min-h-[100px]`} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 8. CAPTAÇÃO & CHAVES */}
      <Card className={styles.captureSectionClass}>
        <CardHeader className="border-b border-[#5c4018] pb-3">
          <CardTitle className="text-[#d4af37] flex items-center gap-2 text-base">
            <Briefcase size={18} /> CAPTAÇÃO & CHAVES
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <FormField
            control={control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.privateLabelClass}>Matrícula</FormLabel>
                <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={styles.privateLabelClass}>Filial</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={styles.privateInputClass}><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1e1a15] border-[#5c4018] text-[#d4af37]">
                      <SelectItem value="matriz">Matriz</SelectItem>
                      <SelectItem value="filial">Filial</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="responsibleBroker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={styles.privateLabelClass}>Corretor/Responsável</FormLabel>
                  <FormControl><Input {...field} className={styles.privateInputClass} /></FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="pt-4 border-t border-[#5c4018] mt-4">
            <FormField
              control={control}
              name="keysLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${styles.privateLabelClass} flex items-center gap-2`}>
                    <Key size={14} /> Local das Chaves
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className={styles.privateInputClass} placeholder="Ex: Portaria, Imobiliária..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}