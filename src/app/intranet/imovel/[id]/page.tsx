"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  DollarSign,
  Home,
  LayoutGrid,
  Image as ImageIcon,
  Lock,
  Search,
  Briefcase,
  Key,
  Plus,
  UploadCloud,
  Trash,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  useForm,
  useWatch,
  useFormContext,
  FormProvider,
} from "react-hook-form";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

// --- LISTAS DE OPÇÕES PADRÃO ---
const ROOM_OPTS = [
  "Área de Serviço",
  "Banheiro de Serviço",
  "Banheiro Social",
  "Biblioteca",
  "Closet",
  "Copa",
  "Copa/Cozinha",
  "Cozinha",
  "Cozinha Americana",
  "Demi-Suíte",
  "Dependência de Empregada",
  "Entrada de Serviço",
  "Espaço Gourmet",
  "Estar Íntimo",
  "Hidromassagem",
  "Home Office",
  "Jardim",
  "Lavabo",
  "Living",
  "Piscina Privativa",
  "Sacada / Varanda",
  "Sacada com Churrasqueira",
  "Sacada Integrada",
  "Sacada Técnica",
  "Sala",
  "Sala de Estar",
  "Sala de Estar Íntimo",
  "Sala de Jantar",
  "Sala de TV",
  "Sala para 2 Ambientes",
  "Sala para 3 Ambientes",
  "Suíte Master",
  "Suíte Standard",
  "Terraço",
];
const PROPERTY_OPTS = [
  "Acabamento em Gesso",
  "Aceita Pet",
  "Andar Alto",
  "Aquecimento de Água",
  "Ar Condicionado",
  "Calefação",
  "Carpete",
  "Churrasqueira",
  "Decorado",
  "Despensa",
  "Fechadura Eletrônica",
  "Infra para Ar Split",
  "Internet / WiFi",
  "Lareira",
  "Mezanino",
  "Móveis Planejados",
  "Piso Aquecido nos Banheiros",
  "Piso Cerâmico",
  "Piso de Madeira",
  "Piso Laminado",
  "Piso Porcelanato",
  "Piso Vinílico",
  "Sistema de Alarme",
  "TV a Cabo",
  "Ventilador de Teto",
  "Vista Livre",
  "Vista Mar",
  "Vista Panorâmica",
];
const DEVELOPMENT_OPTS = [
  "Acessibilidade para PNE",
  "Automação Predial",
  "Bar",
  "Bicicletário",
  "Boliche",
  "Box de Praia",
  "Brinquedoteca",
  "Câmeras de Segurança",
  "Captação de Água",
  "Cinema",
  "Coworking",
  "Deck Molhado",
  "Depósito",
  "Elevador",
  "Entrada para Banhistas",
  "Espaço Fitness",
  "Espaço Gourmet",
  "Espaço Zen",
  "Estar Social",
  "Gás Central",
  "Gerador",
  "Hall Decorado e Mobiliado",
  "Heliponto",
  "Hidromassagem",
  "Horta",
  "Infra para Veículos Elétricos",
  "Lavanderia Coletiva",
  "Lounge",
  "Medidores Individuais",
  "Mini Mercado",
  "Painéis de Energia Solar",
  "Pet Care",
  "Pet Place",
  "Piscina",
  "Piscina Infantil",
  "Piscina Térmica",
  "Playground",
  "Pomar",
  "Portão Eletrônico",
  "Portaria 24h",
  "Quadra de Padel",
  "Quadra de Tênis",
  "Quadra Esportiva",
  "Quiosque Externo",
  "RoofTop",
  "Sala de Jogos",
  "Sala de Reunião",
  "Salão de Festas",
  "Sauna",
  "Solarium",
  "Spa",
];
const BADGE_COLORS = [
  { label: "Azul (Padrão)", value: "#0d6efd" },
  { label: "Verde (Sucesso)", value: "#198754" },
  { label: "Vermelho (Destaque)", value: "#dc3545" },
  { label: "Dourado (Premium)", value: "#d4af37" },
  { label: "Preto", value: "#000000" },
];

type FeatureCategory =
  | "roomFeatures"
  | "propertyFeatures"
  | "developmentFeatures";

// --- SUB-COMPONENTE PARA LISTAS (Isolado para evitar loop de renderização) ---
const FeatureListGroup = ({
  title,
  name,
  options,
}: {
  title: string;
  name: FeatureCategory;
  options: string[];
}) => {
  const { control, setValue } = useFormContext();
  // useWatch garante que só este componente renderize quando a lista mudar
  const currentValues: string[] = useWatch({ control, name }) || [];
  const [newItem, setNewItem] = useState("");

  const toggleItem = (item: string) => {
    const updated = currentValues.includes(item)
      ? currentValues.filter((i) => i !== item)
      : [...currentValues, item];
    setValue(name, updated, { shouldDirty: true });
  };

  const removeCustom = (item: string) => {
    setValue(
      name,
      currentValues.filter((i) => i !== item),
      { shouldDirty: true }
    );
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
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addCustom())
            }
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
};

// --- SUB-COMPONENTE PREÇO (Corrigido com FormField) ---
const PriceSection = () => {
  const { control } = useFormContext();
  const hasDiscount = useWatch({ control, name: "hasDiscount" });

  return (
    <Card className="bg-[#1e1e1e] border-[#333] mb-6">
      <CardHeader className="border-b border-[#333] pb-3">
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
                <FormLabel className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block">
                  Valor de Venda (R$)
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10 text-lg font-bold text-green-400"
                    />
                  </FormControl>
                  <FormField
                    control={control}
                    name="hasDiscount"
                    render={({ field: f2 }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={f2.value}
                            onCheckedChange={f2.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-xs text-white">
                          Desconto
                        </FormLabel>
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
                  <FormLabel className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block">
                    Valor Promocional (R$)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10 border-green-600"
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
                <FormLabel className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block">
                  Condomínio
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="iptuPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block">
                  IPTU
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="bg-[#252525] p-4 rounded border border-[#333] flex flex-wrap gap-6">
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-sm text-gray-300 hover:text-white">
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
};

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // Estados Gerais
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Imagem
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
    },
  });

  const images = useWatch({ control: form.control, name: "images" });

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (mounted) {
          form.reset({
            ...data,
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
              zipCode: "",
              state: "SC",
              city: "",
              neighborhood: "",
              street: "",
              number: "",
              complement: "",
            },
            images: data.images || [],
            deliveryDate: data.deliveryDate
              ? new Date(data.deliveryDate).toISOString().split("T")[0]
              : "",
            oldRef: data.oldRef || "",
            badgeText: data.badgeText || "",
            badgeColor: data.badgeColor || "",
            description: data.description || "",
            solarPosition: data.solarPosition || "",
            relativePosition: data.relativePosition || "",
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
  }, [id]);

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
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

  // --- UPLOAD ---
  const addImage = () => {
    if (!tempImageUrl) return;
    form.setValue("images", [
      ...images,
      { url: tempImageUrl, isCover: images.length === 0 },
    ]);
    setTempImageUrl("");
  };
  const removeImage = (idx: number) => {
    form.setValue(
      "images",
      images.filter((_, i) => i !== idx)
    );
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await uploadFiles(files);
    }
  };
  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        formData.append("files", file);
      }
    });
    try {
      const { data } = await api.post("/properties/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImages = data.map((img: { url: string }) => ({
        url: img.url,
        isCover: false,
      }));
      const currentImages = form.getValues("images") || [];
      if (currentImages.length === 0 && newImages.length > 0) {
        newImages[0].isCover = true;
      }
      form.setValue("images", [...currentImages, ...newImages], {
        shouldDirty: true,
      });
      toast.success(`${newImages.length} imagens adicionadas!`);
    } catch (error) {
      toast.error("Erro upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Styles
  const sectionClass = "bg-[#1e1e1e] border-[#333] mb-6";
  const labelClass =
    "text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block";
  const inputClass =
    "bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10";
  const privateSectionClass = "bg-[#2b251e] border-[#5c4018] mb-6";
  const privateLabelClass =
    "text-[#a89060] text-xs uppercase mb-1 block font-bold";
  const privateInputClass =
    "bg-[#1e1a15] border-[#5c4018] text-[#d4af37] focus:border-[#d4af37]";
  const captureSectionClass =
    "bg-[#25201b] border-[#5c4018] mb-6 border-l-4 border-l-[#d4af37]";

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-primary">
        <Loader2 className="animate-spin mr-2" /> Carregando...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-32 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#333]">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ArrowLeft
              className="cursor-pointer hover:text-primary"
              onClick={() => router.push("/intranet")}
            />{" "}
            Editar Imóvel #{id}
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/intranet")}
              className="border-red-900/30 text-red-500 hover:bg-red-900/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="bg-primary text-black font-bold hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}{" "}
              Salvar
            </Button>
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. DADOS PRINCIPAIS */}
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <FileText size={18} /> DADOS PRINCIPAIS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <FormField
                    control={form.control}
                    name="oldRef"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelClass}>
                          Ref. Antiga
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-10">
                        <FormLabel className={labelClass}>
                          Título do Anúncio *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-[#252525] p-4 rounded border border-[#333] flex flex-wrap gap-6">
                  <FormField
                    control={form.control}
                    name="showOnSite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Exibir no Site
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isExclusive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Imóvel Exclusivo
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasSign"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Placa em frente ao imóvel
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#333]">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Categoria</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "APARTAMENTO"}
                        >
                          <FormControl>
                            <SelectTrigger className={inputClass}>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                            {[
                              "APARTAMENTO",
                              "CASA",
                              "COBERTURA",
                              "TERRENO",
                              "SALA_COMERCIAL",
                              "SITIO",
                              "GALPAO",
                            ].map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Situação</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "DISPONIVEL"}
                        >
                          <FormControl>
                            <SelectTrigger className={inputClass}>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                            {[
                              "DISPONIVEL",
                              "VENDIDO",
                              "RESERVADO",
                              "ALUGADO",
                              "NAO_DISPONIVEL",
                            ].map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constructionStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Estágio</FormLabel>
                        <div className="flex gap-4 items-center h-10">
                          {[
                            { v: "LANCAMENTO", l: "Lançamento" },
                            { v: "EM_OBRA", l: "Em Obras" },
                            { v: "PRONTO", l: "Pronto" },
                          ].map((opt) => (
                            <div
                              key={opt.v}
                              className="flex items-center space-x-2 cursor-pointer"
                              onClick={() => field.onChange(opt.v)}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  field.value === opt.v
                                    ? "border-blue-500"
                                    : "border-gray-500"
                                }`}
                              >
                                {field.value === opt.v && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  field.value === opt.v
                                    ? "text-white"
                                    : "text-gray-400"
                                }`}
                              >
                                {opt.l}
                              </span>
                            </div>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-[#333] pt-4 mt-4">
                  <p className={labelClass}>Características Importantes</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "isSeaFront:Frente Mar",
                      "isSeaQuadra:Quadra Mar",
                      "isFurnished:Mobiliado",
                      "isSemiFurnished:Semi-Mobiliado",
                      "isUnfurnished:Sem Mobília",
                      "isHighStandard:Alto Padrão",
                      "isDifferentiated:Diferenciado",
                    ].map((opt) => {
                      const [key, label] = opt.split(":");
                      return (
                        <FormField
                          key={key}
                          control={form.control}
                          name={key as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm text-gray-300 hover:text-white">
                                {label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-4 items-end border-t border-[#333] pt-4">
                  <FormField
                    control={form.control}
                    name="badgeText"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={labelClass}>
                          Texto da Tarja
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="badgeColor"
                    render={({ field }) => (
                      <FormItem className="w-40">
                        <FormLabel className={labelClass}>Cor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className={inputClass}>
                              <SelectValue placeholder="Cor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                            {BADGE_COLORS.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. VALORES (USANDO COMPONENTE ISOLADO) */}
            <PriceSection />

            {/* 3. DETALHAMENTO */}
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <LayoutGrid size={18} /> DETALHES
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
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
                      control={form.control}
                      name={f.n as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>{f.l}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className={inputClass}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#333]">
                  <FormField
                    control={form.control}
                    name="garageSpots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Vagas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className={inputClass}
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
                      control={form.control}
                      name={f.n as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>{f.l}</FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 4. CARACTERÍSTICAS (USANDO COMPONENTE ISOLADO) */}
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <Plus size={18} /> CARACTERÍSTICAS
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureListGroup
                  title="Ambientes"
                  name="roomFeatures"
                  options={ROOM_OPTS}
                />
                <FeatureListGroup
                  title="Do Imóvel"
                  name="propertyFeatures"
                  options={PROPERTY_OPTS}
                />
                <FeatureListGroup
                  title="Empreendimento"
                  name="developmentFeatures"
                  options={DEVELOPMENT_OPTS}
                />
              </CardContent>
            </Card>

            {/* 5. LOCALIZAÇÃO */}
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <Home size={18} /> LOCALIZAÇÃO
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel className={labelClass}>CEP</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem className="col-span-7">
                        <FormLabel className={labelClass}>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className={labelClass}>UF</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <FormField
                    control={form.control}
                    name="address.neighborhood"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel className={labelClass}>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel className={labelClass}>Logradouro</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className={labelClass}>Número</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <FormField
                    control={form.control}
                    name="buildingName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={labelClass}>
                          Nome do Edifício
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayAddress"
                    render={({ field }) => (
                      <FormItem className="flex items-center pt-6 space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Exibir endereço no site
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 6. MÍDIA */}
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <ImageIcon size={18} /> MULTIMÍDIA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>
                          Vídeo (YouTube)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tourUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Tour 360</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <p className={labelClass}>Galeria de Fotos</p>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-[#444] bg-[#252525] hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleFileSelect}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center w-full h-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                          <p className="text-gray-300 font-medium">
                            Enviando imagens...
                          </p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
                          <p className="text-gray-200 font-medium text-lg">
                            Arraste e solte imagens aqui
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            ou clique para selecionar
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 border-[#444] text-gray-300 hover:text-white hover:border-white"
                          >
                            Selecionar Arquivos
                          </Button>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-[1px] bg-[#333] flex-1"></div>
                    <span className="text-xs text-gray-500 uppercase">
                      Ou por Link
                    </span>
                    <div className="h-[1px] bg-[#333] flex-1"></div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cole o link da imagem..."
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      className={inputClass}
                    />
                    <Button
                      type="button"
                      onClick={addImage}
                      className="bg-[#333] text-white hover:bg-[#444]"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {images && images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4 bg-[#151515] p-4 rounded border border-[#333]">
                      {images.map((img: any, idx: number) => (
                        <div key={idx} className="relative aspect-square group">
                          <img
                            src={
                              img.url.includes("localhost")
                                ? img.url.replace(
                                    "http://localhost:3000",
                                    "https://98.93.10.61.nip.io"
                                  )
                                : img.url
                            }
                            alt={`Foto ${idx}`}
                            className={`w-full h-full object-cover rounded border transition-all ${
                              img.isCover
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-[#444]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                          >
                            <Trash size={12} />
                          </button>
                          {!img.isCover && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-primary hover:bg-transparent font-bold text-xs"
                                onClick={() => {
                                  const updated = images.map(
                                    (pic: any, i: number) => ({
                                      ...pic,
                                      isCover: i === idx,
                                    })
                                  );
                                  form.setValue("images", updated, {
                                    shouldDirty: true,
                                  });
                                }}
                              >
                                Definir Capa
                              </Button>
                            </div>
                          )}
                          {img.isCover && (
                            <Badge className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0 bg-primary text-black font-bold shadow-sm">
                              CAPA
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 7. DADOS INTERNOS */}
            <Card className={privateSectionClass}>
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
                      control={form.control}
                      name="buildingAdministrator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Administradora
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condoManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Síndico
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="constructionCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Construtora
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Proprietário
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Email Propriet.
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name="ownerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Telefones
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="onus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Ônus ou Restrição
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Pagamento
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={privateInputClass}
                              placeholder="Ex: 35% de entrada..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incorporation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Incorporação
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={privateInputClass} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={privateLabelClass}>
                            Data de Entrega
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className={privateInputClass}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="brokerNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={privateLabelClass}>
                        Observações Internas
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={`${privateInputClass} min-h-[100px]`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 8. CAPTAÇÃO E SEO E DESCRIÇÃO (Mantidos padrão) */}
            <Card className={captureSectionClass}>
              <CardHeader className="border-b border-[#5c4018] pb-3">
                <CardTitle className="text-[#d4af37] flex items-center gap-2 text-base">
                  <Briefcase size={18} /> CAPTAÇÃO & CHAVES
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={privateLabelClass}>
                        Matrícula
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className={privateInputClass} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={privateLabelClass}>
                          Filial
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={privateInputClass}>
                              <SelectValue />
                            </SelectTrigger>
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
                    control={form.control}
                    name="responsibleBroker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={privateLabelClass}>
                          Corretor/Responsável
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className={privateInputClass} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-4 border-t border-[#5c4018] mt-4">
                  <FormField
                    control={form.control}
                    name="keysLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`${privateLabelClass} flex items-center gap-2`}
                        >
                          <Key size={14} /> Local das Chaves
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={privateInputClass}
                            placeholder="Ex: Portaria, Imobiliária..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <Search size={18} /> SEO (Google)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Meta Title</FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClass} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} className={inputClass} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className={sectionClass}>
              <CardHeader className="border-b border-[#333] pb-3">
                <CardTitle className="text-primary flex items-center gap-2 text-base">
                  <FileText size={18} /> DESCRIÇÃO PÚBLICA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={`${inputClass} min-h-[300px] leading-relaxed`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
