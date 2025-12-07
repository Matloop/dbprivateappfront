import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Loader2, Save, FileText, Home, DollarSign, Lock, Ruler, X, 
  Image as ImageIcon, Video, CheckSquare, Trash2, Star 
} from "lucide-react";
import { toast } from "sonner";

// Imports internos
import { api } from "@/lib/api";
import { propertySchema } from "@/schemas/propertySchema";
import { AddressForm } from "@/components/forms/AddressForm";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- CONSTANTES ---
const ROOM_OPTS = [
  "Área de Serviço", "Banheiro de Serviço", "Banheiro Social", "Biblioteca", "Closet", 
  "Copa", "Copa/Cozinha", "Cozinha", "Cozinha Americana", "Demi-Suíte", "Dependência de Empregada", 
  "Entrada de Serviço", "Espaço Gourmet", "Estar Íntimo", "Hidromassagem", "Home Office", "Jardim", 
  "Lavabo", "Living", "Piscina Privativa", "Sacada / Varanda", "Sacada com Churrasqueira", 
  "Sacada Integrada", "Sacada Técnica", "Sala", "Sala de Estar", "Sala de Estar Íntimo", 
  "Sala de Jantar", "Sala de TV", "Suíte Master", "Suíte Standard", "Terraço"
];

const PROPERTY_OPTS = [
  "Acabamento em Gesso", "Aceita Pet", "Andar Alto", "Aquecimento de Água", "Ar Condicionado", 
  "Calefação", "Carpete", "Churrasqueira", "Decorado", "Despensa", "Fechadura Eletrônica", 
  "Infra para Ar Split", "Internet / WiFi", "Lareira", "Mezanino", "Móveis Planejados", 
  "Piso Aquecido nos Banheiros", "Piso Cerâmico", "Piso de Madeira", "Piso Laminado", 
  "Piso Porcelanato", "Piso Vinílico", "Sistema de Alarme", "TV a Cabo", "Ventilador de Teto", 
  "Vista Livre", "Vista Mar", "Vista Panorâmica"
];

const DEVELOPMENT_OPTS = [
  "Acessibilidade para PNE", "Automação Predial", "Bar", "Bicicletário", "Box de Praia", 
  "Brinquedoteca", "Câmeras de Segurança", "Captação de Água", "Cinema", "Coworking", 
  "Deck Molhado", "Depósito", "Elevador", "Entrada para Banhistas", "Espaço Fitness", 
  "Espaço Gourmet", "Espaço Zen", "Estar Social", "Gás Central", "Gerador", "Hall Decorado", 
  "Heliponto", "Hidromassagem", "Horta", "Infra Veículos Elétricos", "Lavanderia Coletiva", 
  "Lounge", "Medidores Individuais", "Mini Mercado", "Painéis Solares", "Pet Care", "Pet Place", 
  "Piscina", "Piscina Infantil", "Piscina Térmica", "Playground", "Pomar", "Portão Eletrônico", 
  "Portaria 24h", "Quadra de Padel", "Quadra de Tênis", "Quadra Esportiva", "Quiosque Externo", 
  "RoofTop", "Sala de Jogos", "Sala de Reunião", "Salão de Festas", "Sauna", "Solarium", "Spa"
];

const BADGE_COLORS = [
  { label: 'Azul (Padrão)', value: '#0d6efd' },
  { label: 'Verde (Sucesso)', value: '#198754' },
  { label: 'Vermelho (Destaque)', value: '#dc3545' },
  { label: 'Dourado (Premium)', value: '#d4af37' },
  { label: 'Preto', value: '#000000' },
];

export function NewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loadingData, setLoadingData] = useState(isEditing);
  const [tempImageUrl, setTempImageUrl] = useState("");

  // Usando <any> para evitar conflitos de tipagem chatos
  const form = useForm<any>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "", oldRef: "", category: "APARTAMENTO", status: "DISPONIVEL", constructionStage: "PRONTO",
      price: 0, promotionalPrice: 0, hasDiscount: false, condoFee: 0, iptuPrice: 0,
      isSale: true, isRentAnnual: false, isRentSeason: false, isRentStudent: false,
      showOnSite: true, isExclusive: false, hasSign: false,
      isSeaFront: false, isSeaQuadra: false, isFurnished: false, isHighStandard: false, isDifferentiated: false, isMcmv: false,
      acceptsFinancing: false, acceptsConstructionFinancing: false, acceptsTrade: false, acceptsVehicle: false,
      privateArea: 0, totalArea: 0, bedrooms: 0, suites: 0, bathrooms: 0, garageSpots: 0, garageType: "Privativa",
      solarPosition: "", relativePosition: "Frente",
      badgeText: "", badgeColor: "", videoUrl: "", tourUrl: "",
      address: { city: "Balneário Camboriú", state: "SC", street: "", number: "", complement: "", neighborhood: "", zipCode: "" },
      buildingName: "", displayAddress: true,
      roomFeatures: [], propertyFeatures: [], developmentFeatures: [], images: [],
      ownerName: "", ownerPhone: "", ownerEmail: "", keysLocation: "", brokerNotes: "", description: ""
    },
  });

  useEffect(() => {
    if (isEditing) {
      api.get(`/properties/${id}`)
        .then((res) => {
          const data = res.data;

          // Função auxiliar para extrair nomes de arrays de objetos
          // Transforma: [{name: 'Piscina'}, {name: 'Churrasqueira'}] -> ['Piscina', 'Churrasqueira']
          const mapFeatures = (arr: any[]) => {
            if (!arr) return [];
            return arr.map((item) => (typeof item === 'object' ? item.name : item));
          };

          const cleanData = {
            ...data,
            
            // --- 1. LIMPEZA DE NULOS (Strings Opcionais) ---
            // O operador ?? "" garante que se for null ou undefined, vira string vazia
            title: data.title ?? "",
            oldRef: data.oldRef ?? "",
            solarPosition: data.solarPosition ?? "",
            relativePosition: data.relativePosition ?? "",
            badgeText: data.badgeText ?? "",
            badgeColor: data.badgeColor ?? "",
            description: data.description ?? "",
            
            // Dados Privados
            ownerName: data.ownerName ?? "",
            ownerPhone: data.ownerPhone ?? "",
            ownerEmail: data.ownerEmail ?? "",
            keysLocation: data.keysLocation ?? "",
            brokerNotes: data.brokerNotes ?? "",
            videoUrl: data.videoUrl ?? "",
            tourUrl: data.tourUrl ?? "",

            // --- 2. LIMPEZA DE ENDEREÇO ---
            address: {
              city: data.address?.city ?? "Balneário Camboriú",
              state: data.address?.state ?? "SC",
              street: data.address?.street ?? "",
              number: data.address?.number ?? "",
              complement: data.address?.complement ?? "",
              neighborhood: data.address?.neighborhood ?? "",
              zipCode: data.address?.zipCode ?? "",
            },

            // --- 3. LIMPEZA DE NÚMEROS ---
            // Garante que não entre string vazia em campo numérico
            price: Number(data.price) || 0,
            condoFee: Number(data.condoFee) || 0,
            iptuPrice: Number(data.iptuPrice) || 0,
            privateArea: Number(data.privateArea) || 0,
            totalArea: Number(data.totalArea) || 0,
            bedrooms: Number(data.bedrooms) || 0,
            suites: Number(data.suites) || 0,
            bathrooms: Number(data.bathrooms) || 0,
            garageSpots: Number(data.garageSpots) || 0,

            // --- 4. LIMPEZA DE ARRAYS (O erro dos objetos) ---
            roomFeatures: mapFeatures(data.roomFeatures),
            propertyFeatures: mapFeatures(data.propertyFeatures),
            developmentFeatures: mapFeatures(data.developmentFeatures),
            images: data.images ?? [],
          };

          // Agora sim, os dados estão limpos e no formato que o Zod gosta
          form.reset(cleanData);
        })
        .catch((err) => {
          console.error("Erro ao carregar:", err);
          toast.error("Erro ao carregar dados do imóvel.");
        })
        .finally(() => setLoadingData(false));
    }
  }, [id, form, navigate, isEditing]);

  async function onSubmit(data: any) {

    
    
    try {
      if (isEditing) {
        await api.patch(`/properties/${id}`, data);
        toast.success("Imóvel atualizado!");
      } else {
        await api.post("/properties", data);
        toast.success("Imóvel cadastrado!");
      }
      navigate("/intranet");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar.");
    }
  }

  function onError(errors: any) {
    console.log("❌ ERROS DE VALIDAÇÃO:", errors);
    toast.error("Existem campos inválidos (veja o console F12)");
    }
  // --- LÓGICA DE IMAGENS ---
  const images = form.watch("images");
  
  const handleAddImage = () => {
    if (!tempImageUrl) return;
    const current = form.getValues("images") || [];
    form.setValue("images", [...current, { url: tempImageUrl, isCover: current.length === 0 }]);
    setTempImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const current = form.getValues("images");
    form.setValue("images", current.filter((_: any, i: number) => i !== index));
  };

  const handleSetCover = (index: number) => {
    const current = form.getValues("images");
    const updated = current.map((img: any, i: number) => ({ ...img, isCover: i === index }));
    form.setValue("images", updated);
  };

  // --- LÓGICA DE CHECKBOX LISTS ---
  const handleFeatureToggle = (field: any, item: string) => {
    const current = field.value || [];
    if (current.includes(item)) {
      field.onChange(current.filter((i: string) => i !== item));
    } else {
      field.onChange([...current, item]);
    }
  };

  if (loadingData) return <div className="flex h-screen items-center justify-center text-primary"><Loader2 className="animate-spin h-10 w-10" /></div>;

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6 sticky top-0 z-50 bg-background/95 backdrop-blur py-4 border-b border-muted">
        <div>
          <h1 className="text-2xl font-bold text-primary">{isEditing ? `Ref #${id}` : "Novo Imóvel"}</h1>
          <p className="text-sm text-muted-foreground">Preencha todos os campos obrigatórios (*)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/intranet")}><X className="mr-2 h-4 w-4"/> Cancelar</Button>
          <Button onClick={form.handleSubmit(onSubmit, onError)} disabled={form.formState.isSubmitting} className="bg-primary text-black hover:bg-primary/90 font-bold">
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar
          </Button>
          
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 pb-20">
          
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 h-auto">
              <TabsTrigger value="dados" className="py-3 font-bold">Dados Básicos</TabsTrigger>
              <TabsTrigger value="detalhes" className="py-3 font-bold">Detalhes & Áreas</TabsTrigger>
              <TabsTrigger value="midia" className="py-3 font-bold">Fotos & Mídia</TabsTrigger>
              <TabsTrigger value="localizacao" className="py-3 font-bold">Localização</TabsTrigger>
              <TabsTrigger value="privado" className="py-3 font-bold text-yellow-600">Admin / Privado</TabsTrigger>
            </TabsList>

            {/* --- ABA 1: DADOS BÁSICOS --- */}
            <TabsContent value="dados" className="space-y-6 mt-6">
              <Card className="bg-card border-muted">
                <CardHeader><CardTitle className="text-primary flex items-center gap-2"><FileText/> Identificação & Valores</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                  
                  {/* Linha 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Título do Anúncio *</FormLabel>
                        <FormControl><Input placeholder="Ex: Apto Frente Mar..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="oldRef" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ref. Antiga</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                          <SelectContent>
                            {["APARTAMENTO", "CASA", "COBERTURA", "TERRENO", "SALA_COMERCIAL"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>

                  {/* Checkboxes de Finalidade */}
                  <div className="flex flex-wrap gap-4 bg-muted/20 p-4 rounded-md border border-muted">
                    <span className="text-sm font-bold text-muted-foreground mr-2">Finalidade:</span>
                    {["isSale", "isRentAnnual", "isRentSeason", "isRentStudent"].map((name) => (
                      <FormField key={name} control={form.control} name={name} render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="cursor-pointer capitalize">{name.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                        </FormItem>
                      )} />
                    ))}
                  </div>

                  {/* Situação e Tarja */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="DISPONIVEL" className="text-green-500 font-bold">Disponível</SelectItem>
                            <SelectItem value="VENDIDO" className="text-red-500 font-bold">Vendido</SelectItem>
                            <SelectItem value="RESERVADO" className="text-yellow-500 font-bold">Reservado</SelectItem>
                            <SelectItem value="ALUGADO" className="text-blue-500 font-bold">Alugado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="badgeText" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto da Tarja</FormLabel>
                        <FormControl><Input placeholder="Ex: OPORTUNIDADE" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="badgeColor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor da Tarja</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            {BADGE_COLORS.map(c => <SelectItem key={c.value} value={c.value}><span style={{color: c.value}}>●</span> {c.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>

                  {/* Valores */}
                  <div className="bg-muted/10 p-4 rounded-lg border border-muted grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel className="text-primary font-bold">Valor (R$)</FormLabel>
                        <FormControl><Input type="number" className="font-bold text-lg" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="hasDiscount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 h-10">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>Com Desconto?</FormLabel>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="promotionalPrice" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Promo</FormLabel>
                        <FormControl><Input type="number" className="border-green-800 text-green-500" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="condoFee" render={({ field }) => (
                      <FormItem><FormLabel>Condomínio</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                  </div>

                  {/* Negociação */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {[
                        {n: "acceptsFinancing", l: "Aceita Financiamento"},
                        {n: "acceptsTrade", l: "Aceita Permuta"},
                        {n: "acceptsVehicle", l: "Aceita Veículo"},
                        {n: "isMcmv", l: "Minha Casa Minha Vida"}
                    ].map(opt => (
                        <FormField key={opt.n} control={form.control} name={opt.n} render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>{opt.l}</FormLabel>
                            </FormItem>
                        )} />
                    ))}
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ABA 2: DETALHES --- */}
            <TabsContent value="detalhes" className="space-y-6 mt-6">
              <Card className="bg-card border-muted">
                <CardHeader><CardTitle className="text-primary flex items-center gap-2"><Ruler/> Configuração</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                  
                  {/* Áreas e Quartos */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="privateArea" render={({ field }) => (
                      <FormItem><FormLabel>Área Privativa (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="totalArea" render={({ field }) => (
                      <FormItem><FormLabel>Área Total (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                      <FormItem><FormLabel>Dormitórios</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="suites" render={({ field }) => (
                      <FormItem><FormLabel>Suítes</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="garageSpots" render={({ field }) => (
                      <FormItem><FormLabel>Vagas</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="garageType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Vaga</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="Privativa">Privativa</SelectItem><SelectItem value="Rotativa">Rotativa</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="solarPosition" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posição Solar</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="Norte">Norte</SelectItem><SelectItem value="Sul">Sul</SelectItem><SelectItem value="Leste">Leste</SelectItem><SelectItem value="Oeste">Oeste</SelectItem><SelectItem value="Sol da Manhã">Sol da Manhã</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>

                  {/* LISTAS DE CHECKBOXES (OS GRANDES) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="border border-muted rounded-md p-4">
                        <h4 className="font-bold mb-3 text-primary flex items-center gap-2"><CheckSquare size={16}/> Ambientes</h4>
                        <div className="h-64 overflow-y-auto space-y-2 pr-2">
                            <FormField control={form.control} name="roomFeatures" render={({ field }) => (
                                <>
                                    {ROOM_OPTS.map(item => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox checked={field.value?.includes(item)} onCheckedChange={() => handleFeatureToggle(field, item)} />
                                            <label className="text-sm cursor-pointer">{item}</label>
                                        </div>
                                    ))}
                                </>
                            )} />
                        </div>
                    </div>

                    <div className="border border-muted rounded-md p-4">
                        <h4 className="font-bold mb-3 text-primary flex items-center gap-2"><CheckSquare size={16}/> Características</h4>
                        <div className="h-64 overflow-y-auto space-y-2 pr-2">
                            <FormField control={form.control} name="propertyFeatures" render={({ field }) => (
                                <>
                                    {PROPERTY_OPTS.map(item => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox checked={field.value?.includes(item)} onCheckedChange={() => handleFeatureToggle(field, item)} />
                                            <label className="text-sm cursor-pointer">{item}</label>
                                        </div>
                                    ))}
                                </>
                            )} />
                        </div>
                    </div>

                    <div className="border border-muted rounded-md p-4">
                        <h4 className="font-bold mb-3 text-primary flex items-center gap-2"><CheckSquare size={16}/> Empreendimento</h4>
                        <div className="h-64 overflow-y-auto space-y-2 pr-2">
                            <FormField control={form.control} name="developmentFeatures" render={({ field }) => (
                                <>
                                    {DEVELOPMENT_OPTS.map(item => (
                                        <div key={item} className="flex items-center space-x-2">
                                            <Checkbox checked={field.value?.includes(item)} onCheckedChange={() => handleFeatureToggle(field, item)} />
                                            <label className="text-sm cursor-pointer">{item}</label>
                                        </div>
                                    ))}
                                </>
                            )} />
                        </div>
                    </div>
                  </div>

                  <Separator />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Pública</FormLabel>
                      <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                    </FormItem>
                  )} />

                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ABA 3: MÍDIA --- */}
            <TabsContent value="midia" className="mt-6">
              <Card className="bg-card border-muted">
                <CardHeader><CardTitle className="text-primary flex items-center gap-2"><ImageIcon/> Fotos e Vídeos</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="videoUrl" render={({ field }) => (
                      <FormItem><FormLabel className="flex items-center gap-2"><Video size={14}/> YouTube URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="tourUrl" render={({ field }) => (
                      <FormItem><FormLabel>Tour Virtual (Matterport)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                  </div>

                  {/* UPLOAD DE IMAGENS (Simples via URL) */}
                  <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input placeholder="Cole o link da imagem..." value={tempImageUrl} onChange={(e) => setTempImageUrl(e.target.value)} />
                        <Button type="button" onClick={handleAddImage} variant="secondary">Adicionar</Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map((img: any, idx: number) => (
                            <div key={idx} className="relative aspect-[4/3] group border border-muted rounded-md overflow-hidden">
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                                
                                {/* Badge de Capa */}
                                {img.isCover && <Badge className="absolute top-1 left-1 bg-primary text-black">CAPA</Badge>}
                                
                                {/* Ações (Hover) */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleRemoveImage(idx)}><Trash2 size={14}/></Button>
                                    {!img.isCover && (
                                        <Button type="button" size="icon" variant="secondary" className="h-8 w-8 text-primary" onClick={() => handleSetCover(idx)} title="Definir Capa"><Star size={14}/></Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ABA 4: LOCALIZAÇÃO --- */}
            <TabsContent value="localizacao" className="mt-6">
              <AddressForm form={form} />
            </TabsContent>

            {/* --- ABA 5: PRIVADO --- */}
            <TabsContent value="privado" className="mt-6">
              <Card className="bg-card border-yellow-900/50 bg-yellow-950/10">
                <CardHeader><CardTitle className="text-primary flex items-center gap-2"><Lock/> Dados Confidenciais</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="ownerName" render={({ field }) => (
                      <FormItem><FormLabel>Proprietário</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                      <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="ownerEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="keysLocation" render={({ field }) => (
                    <FormItem><FormLabel>Chaves</FormLabel><FormControl><Input placeholder="Ex: Portaria" {...field} /></FormControl></FormItem>
                  )} />
                  
                  <FormField control={form.control} name="brokerNotes" render={({ field }) => (
                    <FormItem><FormLabel>Observações Internas</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </form>
      </Form>
    </div>
  );
}