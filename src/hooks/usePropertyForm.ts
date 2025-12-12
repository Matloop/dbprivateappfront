import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface UsePropertyFormProps {
  id: string;
}

export function usePropertyForm({ id }: UsePropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "", subtitle: "", oldRef: "", category: "APARTAMENTO",
      isSale: true, isRentAnnual: false, isRentSeason: false, isRentStudent: false,
      status: "DISPONIVEL", constructionStage: "PRONTO",
      isExclusive: false, showOnSite: true, hasSign: false, watermarkEnabled: false,
      displayAddress: true, isSeaFront: false, isSeaQuadra: false, isDifferentiated: false, isHighStandard: false, isFurnished: false, isSemiFurnished: false, isUnfurnished: false,
      badgeText: "", badgeColor: "",
      price: 0, promotionalPrice: 0, hasDiscount: false, condoFee: 0, iptuPrice: 0,
      acceptsFinancing: false, acceptsConstructionFinancing: false, acceptsTrade: false, acceptsVehicle: false, isMcmv: false,
      bedrooms: 0, suites: 0, bathrooms: 0, garageSpots: 0, garageType: "Privativa",
      privateArea: 0, totalArea: 0, garageArea: 0, landArea: 0,
      solarPosition: "", relativePosition: "",
      address: {
        zipCode: "", state: "SC", city: "Balneário Camboriú", neighborhood: "", street: "", number: "", complement: "",
        latitude: "", longitude: "", radius: 100,
      },
      buildingName: "", condoManager: "", buildingAdministrator: "", constructionCompany: "",
      videoUrl: "", tourUrl: "",
      images: [] as { url: string; isCover: boolean }[],
      ownerName: "", ownerPhone: "", ownerEmail: "", keysLocation: "", exclusivitySigned: false, 
      brokerNotes: "", onus: "", paymentDetails: "", incorporation: "", deliveryDate: "", 
      registrationNumber: "", branch: "matriz", responsibleBroker: "",
      metaTitle: "", metaDescription: "", description: "",
      roomFeatures: [] as string[], propertyFeatures: [] as string[], developmentFeatures: [] as string[],
      paymentConditions: [] as { description: string; value: number }[], 
    },
  });

  // Função auxiliar para extrair valor monetário de string (Ex: "Entrada R$ 1.000,00" -> 1000)
  const extractMoneyValue = (text: string) => {
    if (!text) return 0;
    // Procura por padrão R$ 0.000,00
    const match = text.match(/R\$\s*([\d\.]+,\d{2})/);
    if (match && match[1]) {
        // Remove pontos de milhar e troca vírgula por ponto decimal
        const cleanVal = match[1].replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanVal) || 0;
    }
    return 0;
  };

  // Carregar Dados
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (mounted) {
          form.reset({
            ...data,
            roomFeatures: data.roomFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
            propertyFeatures: data.propertyFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
            developmentFeatures: data.developmentFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
            
            price: Number(data.price) || 0,
            promotionalPrice: Number(data.promotionalPrice) || 0,
            condoFee: Number(data.condoFee) || 0,
            iptuPrice: Number(data.iptuPrice) || 0,
            bedrooms: Number(data.bedrooms) || 0,
            suites: Number(data.suites) || 0,
            bathrooms: Number(data.bathrooms) || 0,
            garageSpots: Number(data.garageSpots) || 0,
            privateArea: Number(data.privateArea) || 0,
            totalArea: Number(data.totalArea) || 0,
            garageArea: Number(data.garageArea) || 0,
            landArea: Number(data.landArea) || 0,
            
            address: data.address || {
              zipCode: "", state: "SC", city: "", neighborhood: "", street: "", number: "",
              complement: data.address?.complement ?? "",
              latitude: data.address?.latitude ?? "",
              longitude: data.address?.longitude ?? "",
              radius: data.address?.radius ?? 100,
            },
            
            images: data.images || [],
            deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split("T")[0] : "",
            
            oldRef: data.oldRef || "",
            badgeText: data.badgeText || "",
            badgeColor: data.badgeColor || "",
            description: data.description || "",
            solarPosition: data.solarPosition || "",
            relativePosition: data.relativePosition || "",
            brokerNotes: data.brokerNotes || "",
            ownerName: data.ownerName || "",
            ownerPhone: data.ownerPhone || "",
            paymentDetails: data.paymentDetails || "",
            incorporation: data.incorporation || "",

            // 👇 CORREÇÃO AQUI: Se o valor for 0, tenta extrair da descrição
            paymentConditions: data.paymentConditions ? data.paymentConditions.map((c: any) => {
                let val = Number(c.value);
                if (val === 0 && c.description) {
                    val = extractMoneyValue(c.description);
                }
                return {
                    description: c.description,
                    value: val
                };
            }) : [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [id, form]);

  // Salvar Dados
  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const { 
        id: _id, 
        createdAt, 
        updatedAt, 
        addressId, 
        ...cleanValues 
      } = values;

      const deliveryDate = values.deliveryDate ? new Date(values.deliveryDate) : undefined;
      const validDeliveryDate = deliveryDate instanceof Date && !isNaN(deliveryDate.getTime()) ? deliveryDate : undefined;

      const payload = {
        ...cleanValues,
        deliveryDate: validDeliveryDate,
        
        price: Number(values.price),
        privateArea: Number(values.privateArea),
        totalArea: Number(values.totalArea),
        
        address: {
            ...values.address,
            id: undefined 
        }
      };
      
      await api.patch(`/properties/${id}`, payload);
      toast.success("Salvo com sucesso!");
      router.push("/intranet");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    isLoading,
    isSaving,
    onSubmit,
  };
}