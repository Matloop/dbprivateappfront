import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface UsePropertyFormProps {
  id?: string;
}

// --- HELPERS DE SANITIZAÇÃO (A SOLUÇÃO ROBUSTA) ---
// Se vier null, undefined ou "null" string, retorna vazio
const safeString = (val: any) => (val === null || val === undefined || val === "null") ? "" : String(val);
// Se vier null, retorna 0
const safeNumber = (val: any) => (val === null || val === undefined || isNaN(Number(val))) ? 0 : Number(val);
// Se vier null, retorna array vazio
const safeArray = (val: any) => (Array.isArray(val) ? val : []);
// Se vier null, retorna false
const safeBool = (val: any) => !!val;

export function usePropertyForm({ id }: UsePropertyFormProps = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    // Mode: 'onChange' ajuda a ver erros em tempo real, mas 'onSubmit' é mais performático
    mode: 'onSubmit', 
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

  // Carregar Dados
  useEffect(() => {
    if (!id) return;
    
    let mounted = true;
    async function loadData() {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (mounted) {
            // AQUI ESTÁ A MÁGICA: Limpamos cada campo manualmente
            const cleanData = {
                ...data,
                
                // Textos (Evita o erro: value prop on textarea should not be null)
                title: safeString(data.title),
                subtitle: safeString(data.subtitle),
                oldRef: safeString(data.oldRef),
                badgeText: safeString(data.badgeText),
                badgeColor: safeString(data.badgeColor),
                description: safeString(data.description),
                brokerNotes: safeString(data.brokerNotes),
                ownerName: safeString(data.ownerName),
                ownerPhone: safeString(data.ownerPhone),
                ownerEmail: safeString(data.ownerEmail),
                keysLocation: safeString(data.keysLocation),
                onus: safeString(data.onus),
                paymentDetails: safeString(data.paymentDetails),
                incorporation: safeString(data.incorporation),
                metaTitle: safeString(data.metaTitle),
                metaDescription: safeString(data.metaDescription),
                solarPosition: safeString(data.solarPosition),
                relativePosition: safeString(data.relativePosition),
                videoUrl: safeString(data.videoUrl),
                tourUrl: safeString(data.tourUrl),
                garageType: safeString(data.garageType),
                buildingName: safeString(data.buildingName),
                condoManager: safeString(data.condoManager),
                buildingAdministrator: safeString(data.buildingAdministrator),
                constructionCompany: safeString(data.constructionCompany),
                registrationNumber: safeString(data.registrationNumber),
                branch: safeString(data.branch) || "matriz",
                responsibleBroker: safeString(data.responsibleBroker),

                // Números
                price: safeNumber(data.price),
                promotionalPrice: safeNumber(data.promotionalPrice),
                condoFee: safeNumber(data.condoFee),
                iptuPrice: safeNumber(data.iptuPrice),
                bedrooms: safeNumber(data.bedrooms),
                suites: safeNumber(data.suites),
                bathrooms: safeNumber(data.bathrooms),
                garageSpots: safeNumber(data.garageSpots),
                privateArea: safeNumber(data.privateArea),
                totalArea: safeNumber(data.totalArea),
                garageArea: safeNumber(data.garageArea),
                landArea: safeNumber(data.landArea),

                // Booleanos
                isExclusive: safeBool(data.isExclusive),
                showOnSite: safeBool(data.showOnSite),
                hasSign: safeBool(data.hasSign),
                watermarkEnabled: safeBool(data.watermarkEnabled),
                // ... adicione outros booleanos se sentir necessidade, mas geralmente o form lida bem

                // Arrays (Evita crash no map)
                roomFeatures: data.roomFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
                propertyFeatures: data.propertyFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
                developmentFeatures: data.developmentFeatures?.map((f: any) => typeof f === "string" ? f : f.name) || [],
                images: safeArray(data.images),
                
                // Endereço Seguro
                address: {
                    zipCode: safeString(data.address?.zipCode),
                    state: safeString(data.address?.state) || "SC",
                    city: safeString(data.address?.city),
                    neighborhood: safeString(data.address?.neighborhood),
                    street: safeString(data.address?.street),
                    number: safeString(data.address?.number),
                    complement: safeString(data.address?.complement),
                    latitude: safeString(data.address?.latitude),
                    longitude: safeString(data.address?.longitude),
                    radius: safeNumber(data.address?.radius) || 100,
                },

                // Data
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().split("T")[0] : "",

                // Condições Pagamento
                paymentConditions: safeArray(data.paymentConditions).map((c: any) => ({
                    description: safeString(c.description),
                    value: safeNumber(c.value)
                })),
            };

            form.reset(cleanData);
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

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const { id: _id, createdAt, updatedAt, addressId, ...cleanValues } = values;
      
      const deliveryDate = values.deliveryDate ? new Date(values.deliveryDate) : undefined;
      const validDeliveryDate = deliveryDate instanceof Date && !isNaN(deliveryDate.getTime()) ? deliveryDate : undefined;

      const payload = {
        ...cleanValues,
        deliveryDate: validDeliveryDate,
        price: Number(values.price),
        privateArea: Number(values.privateArea),
        totalArea: Number(values.totalArea),
        address: { ...values.address, id: undefined }
      };
      
      if (id) {
        await api.patch(`/properties/${id}`, payload);
        toast.success("Imóvel atualizado!");
      } else {
        await api.post(`/properties`, payload);
        toast.success("Imóvel criado!");
      }
      
      router.push("/intranet");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  return { form, isLoading, isSaving, onSubmit };
}