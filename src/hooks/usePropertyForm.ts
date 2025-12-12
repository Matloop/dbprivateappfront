import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Tipos auxiliares se necessário (ou importar do DTO)
interface UsePropertyFormProps {
  id: string;
}

export function usePropertyForm({ id }: UsePropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Inicialização do Formulário com valores padrão seguros
  const form = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      oldRef: "",
      category: "APARTAMENTO",
      isSale: true,
      isRentAnnual: false,
      isRentSeason: false,
      isRentStudent: false,
      status: "DISPONIVEL",
      constructionStage: "PRONTO",
      isExclusive: false,
      showOnSite: true,
      hasSign: false,
      watermarkEnabled: false,
      displayAddress: true,
      isSeaFront: false,
      isSeaQuadra: false,
      isDifferentiated: false,
      isHighStandard: false,
      isFurnished: false,
      isSemiFurnished: false,
      isUnfurnished: false,
      badgeText: "",
      badgeColor: "",
      price: 0,
      promotionalPrice: 0,
      hasDiscount: false,
      condoFee: 0,
      iptuPrice: 0,
      acceptsFinancing: false,
      acceptsConstructionFinancing: false,
      acceptsTrade: false,
      acceptsVehicle: false,
      isMcmv: false,
      bedrooms: 0,
      suites: 0,
      bathrooms: 0,
      garageSpots: 0,
      garageType: "Privativa",
      privateArea: 0,
      totalArea: 0,
      garageArea: 0,
      landArea: 0,
      solarPosition: "",
      relativePosition: "Frente",
      address: {
        zipCode: "",
        state: "SC",
        city: "Balneário Camboriú",
        neighborhood: "",
        street: "",
        number: "",
        complement: "",
        latitude: "",
        longitude: "",
        radius: 100,
      },
      buildingName: "",
      condoManager: "",
      buildingAdministrator: "",
      constructionCompany: "",
      videoUrl: "",
      tourUrl: "",
      images: [] as { url: string; isCover: boolean }[],
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      keysLocation: "",
      exclusivitySigned: false,
      brokerNotes: "",
      onus: "",
      paymentDetails: "",
      incorporation: "",
      deliveryDate: "",
      registrationNumber: "",
      branch: "matriz",
      responsibleBroker: "",
      metaTitle: "",
      metaDescription: "",
      description: "",
      roomFeatures: [] as string[],
      propertyFeatures: [] as string[],
      developmentFeatures: [] as string[],
      paymentConditions: [] as { description: string; value: number }[],
    },
  });

  // Carregar Dados
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (mounted) {
          form.reset({
            ...data,
            // Tratamento de Arrays de Features (Objetos -> Strings)
            roomFeatures:
              data.roomFeatures?.map((f: any) =>
                typeof f === "string" ? f : f.name
              ) || [],
            propertyFeatures:
              data.propertyFeatures?.map((f: any) =>
                typeof f === "string" ? f : f.name
              ) || [],
            developmentFeatures:
              data.developmentFeatures?.map((f: any) =>
                typeof f === "string" ? f : f.name
              ) || [],

            // Tratamento de Números (Garantir que não venha null)
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

            // Tratamento de Endereço (Garantir objeto completo)
            address: data.address || {
              zipCode: "",
              state: "SC",
              city: "",
              neighborhood: "",
              street: "",
              number: "",
              complement: data.address?.complement ?? "",
              latitude: data.address?.latitude ?? "",
              longitude: data.address?.longitude ?? "",
              radius: data.address?.radius ?? 100,
            },

            images: data.images || [],
            deliveryDate: data.deliveryDate
              ? new Date(data.deliveryDate).toISOString().split("T")[0]
              : "",

            // Campos de texto opcionais
            oldRef: data.oldRef || "",
            badgeText: data.badgeText || "",
            badgeColor: data.badgeColor || "",
            description: data.description || "",
            solarPosition: data.solarPosition || "",
            relativePosition: data.relativePosition || "",

            paymentConditions: data.paymentConditions ? data.paymentConditions.map((c: any) => ({
                description: c.description,
                value: Number(c.value) // Garante que venha como número
            })) : [],
          });
        }
      } catch (err) {
        toast.error("Erro ao carregar dados.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id, form]);

  // Salvar Dados
  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      // Pequeno tratamento antes de enviar
      const payload = {
        ...values,
        deliveryDate: values.deliveryDate
          ? new Date(values.deliveryDate)
          : undefined,
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
