'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, Save, Loader2, X, Plus, Trash, 
    FileText, DollarSign, Home, LayoutGrid, Image as ImageIcon, Lock, Key, Youtube, Box
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// --- LISTAS DE OPÇÕES (ORIGINAIS) ---
const ROOM_OPTS = [
    "Área de Serviço", "Banheiro de Serviço", "Banheiro Social", "Biblioteca", "Closet", "Copa", "Copa/Cozinha", "Cozinha", "Cozinha Americana", "Demi-Suíte", "Dependência de Empregada", "Entrada de Serviço", "Espaço Gourmet", "Estar Íntimo", "Hidromassagem", "Home Office", "Jardim", "Lavabo", "Living", "Piscina Privativa", "Sacada / Varanda", "Sacada com Churrasqueira", "Sacada Integrada", "Sacada Técnica", "Sala", "Sala de Estar", "Sala de Estar Íntimo", "Sala de Jantar", "Sala de TV", "Sala para 2 Ambientes", "Sala para 3 Ambientes", "Suíte Master", "Suíte Standard", "Terraço"
];
const PROPERTY_OPTS = [
    "Acabamento em Gesso", "Aceita Pet", "Andar Alto", "Aquecimento de Água", "Ar Condicionado", "Calefação", "Carpete", "Churrasqueira", "Decorado", "Despensa", "Fechadura Eletrônica", "Infra para Ar Split", "Internet / WiFi", "Lareira", "Mezanino", "Móveis Planejados", "Piso Aquecido nos Banheiros", "Piso Cerâmico", "Piso de Madeira", "Piso Laminado", "Piso Porcelanato", "Piso Vinílico", "Sistema de Alarme", "TV a Cabo", "Ventilador de Teto", "Vista Livre", "Vista Mar", "Vista Panorâmica"
];
const DEVELOPMENT_OPTS = [
    "Acessibilidade para PNE", "Automação Predial", "Bar", "Bicicletário", "Boliche", "Box de Praia", "Brinquedoteca", "Câmeras de Segurança", "Captação de Água", "Cinema", "Coworking", "Deck Molhado", "Depósito", "Elevador", "Entrada para Banhistas", "Espaço Fitness", "Espaço Gourmet", "Espaço Zen", "Estar Social", "Gás Central", "Gerador", "Hall Decorado e Mobiliado", "Heliponto", "Hidromassagem", "Horta", "Infra para Veículos Elétricos", "Lavanderia Coletiva", "Lounge", "Medidores Individuais", "Mini Mercado", "Painéis de Energia Solar", "Pet Care", "Pet Place", "Piscina", "Piscina Infantil", "Piscina Térmica", "Playground", "Pomar", "Portão Eletrônico", "Portaria 24h", "Quadra de Padel", "Quadra de Tênis", "Quadra Esportiva", "Quiosque Externo", "RoofTop", "Sala de Jogos", "Sala de Reunião", "Salão de Festas", "Sauna", "Solarium", "Spa"
];
const BADGE_COLORS = [
    { label: 'Azul (Padrão)', value: '#0d6efd' }, { label: 'Verde (Sucesso)', value: '#198754' }, { label: 'Vermelho (Destaque)', value: '#dc3545' }, { label: 'Dourado (Premium)', value: '#d4af37' }, { label: 'Preto', value: '#000000' },
];

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Estado temporário para imagem (igual ao antigo)
    const [tempImageUrl, setTempImageUrl] = useState('');

    const form = useForm({
        defaultValues: {
            title: '', subtitle: '', oldRef: '', category: 'APARTAMENTO',
            isSale: true, isRentAnnual: false, isRentSeason: false, isRentStudent: false,
            status: 'DISPONIVEL', constructionStage: 'PRONTO',
            isExclusive: false, showOnSite: true, hasSign: false,
            isSeaFront: false, isSeaQuadra: false, isDifferentiated: false, isHighStandard: false, isFurnished: false, isSemiFurnished: false, isUnfurnished: false,
            badgeText: '', badgeColor: '',
            price: 0, promotionalPrice: 0, hasDiscount: false, condoFee: 0, iptuPrice: 0,
            acceptsFinancing: false, acceptsConstructionFinancing: false, acceptsTrade: false, acceptsVehicle: false, isMcmv: false,
            bedrooms: 0, suites: 0, bathrooms: 0, garageSpots: 0, garageType: 'Privativa',
            privateArea: 0, totalArea: 0, garageArea: 0, solarPosition: '', relativePosition: 'Frente',
            address: { zipCode: '', state: 'SC', city: 'Balneário Camboriú', neighborhood: '', street: '', number: '', complement: '' },
            buildingName: '', displayAddress: true,
            videoUrl: '', tourUrl: '', images: [] as { url: string, isCover: boolean }[],
            ownerName: '', ownerPhone: '', ownerEmail: '', keysLocation: '', condoManager: '', buildingAdministrator: '', constructionCompany: '', exclusivitySigned: false, brokerNotes: '',
            description: '',
            roomFeatures: [] as string[], propertyFeatures: [] as string[], developmentFeatures: [] as string[]
        }
    });

    useEffect(() => {
        async function loadData() {
            try {
                const { data } = await api.get(`/properties/${id}`);
                // Mapeia os dados do backend para o form
                form.reset({
                    ...data,
                    // Arrays de objetos -> Arrays de strings
                    roomFeatures: data.roomFeatures?.map((f:any) => f.name) || [],
                    propertyFeatures: data.propertyFeatures?.map((f:any) => f.name) || [],
                    developmentFeatures: data.developmentFeatures?.map((f:any) => f.name) || [],
                    // Garante valores numéricos
                    price: Number(data.price), promotionalPrice: Number(data.promotionalPrice), condoFee: Number(data.condoFee), iptuPrice: Number(data.iptuPrice),
                    bedrooms: Number(data.bedrooms), suites: Number(data.suites), bathrooms: Number(data.bathrooms), garageSpots: Number(data.garageSpots),
                    privateArea: Number(data.privateArea), totalArea: Number(data.totalArea),
                    images: data.images || []
                });
            } catch (err) {
                toast.error("Erro ao carregar dados.");
            } finally { setIsLoading(false); }
        }
        loadData();
    }, [id, form]);

    const onSubmit = async (values: any) => {
        setIsSaving(true);
        try {
            await api.patch(`/properties/${id}`, values);
            toast.success("Imóvel salvo com sucesso!");
            router.push('/intranet');
        } catch (err) {
            toast.error("Erro ao salvar.");
        } finally { setIsSaving(false); }
    };

    // Handlers de Array (Checkbox Lists)
    const handleListToggle = (listName: 'roomFeatures'|'propertyFeatures'|'developmentFeatures', item: string) => {
        const current = form.getValues(listName) || [];
        const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
        form.setValue(listName, updated, { shouldDirty: true });
    };

    const addImage = () => {
        if(!tempImageUrl) return;
        const current = form.getValues('images');
        form.setValue('images', [...current, { url: tempImageUrl, isCover: current.length === 0 }]);
        setTempImageUrl('');
    };

    const removeImage = (idx: number) => {
        const current = form.getValues('images');
        form.setValue('images', current.filter((_, i) => i !== idx));
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center text-primary"><Loader2 className="animate-spin mr-2"/> Carregando...</div>;

    // Atalhos para classes CSS repetitivas
    const sectionClass = "bg-[#1e1e1e] border-[#333] mb-6";
    const labelClass = "text-gray-400 text-xs uppercase tracking-wide font-bold mb-2 block";
    const inputClass = "bg-[#2b2b2b] border-[#444] text-white focus:border-primary h-10";
    const checkboxItemClass = "flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer";

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6 pb-32 font-sans">
            <div className="max-w-[1200px] mx-auto">
                
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#333]">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ArrowLeft className="cursor-pointer hover:text-primary" onClick={() => router.push('/intranet')} />
                            Editar Imóvel #{id}
                        </h1>
                        <p className="text-gray-500 text-sm ml-8">Atualize as informações do imóvel</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push('/intranet')} className="border-red-900/30 text-red-500 hover:bg-red-900/20 hover:text-red-400">
                            <X className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving} className="bg-primary text-black font-bold hover:bg-primary/90">
                            {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} Salvar Alterações
                        </Button>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* 1. DADOS PRINCIPAIS */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><FileText size={18}/> DADOS PRINCIPAIS</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-2">
                                    <Label className={labelClass}>Ref. Antiga</Label>
                                    <Input {...form.register('oldRef')} className={inputClass} />
                                </div>
                                <div className="md:col-span-10">
                                    <Label className={labelClass}>Título do Anúncio *</Label>
                                    <Input {...form.register('title')} className={inputClass} />
                                </div>
                            </div>
                            
                            <div className="bg-[#252525] p-4 rounded border border-[#333] flex flex-wrap gap-6">
                                <label className={checkboxItemClass}><Checkbox checked={form.watch('showOnSite')} onCheckedChange={c => form.setValue('showOnSite', !!c)} /> <span>Exibir no Site</span></label>
                                <label className={checkboxItemClass}><Checkbox checked={form.watch('isExclusive')} onCheckedChange={c => form.setValue('isExclusive', !!c)} /> <span>Exclusivo</span></label>
                                <label className={checkboxItemClass}><Checkbox checked={form.watch('hasSign')} onCheckedChange={c => form.setValue('hasSign', !!c)} /> <span>Placa no Local</span></label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className={labelClass}>Tipo de Imóvel</Label>
                                    <Select value={form.watch('category')} onValueChange={v => form.setValue('category', v)}>
                                        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                                            {['APARTAMENTO', 'CASA', 'COBERTURA', 'TERRENO', 'SALA_COMERCIAL'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className={labelClass}>Situação</Label>
                                    <Select value={form.watch('status')} onValueChange={v => form.setValue('status', v)}>
                                        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-[#2b2b2b] border-[#444] text-white">
                                            {['DISPONIVEL', 'VENDIDO', 'RESERVADO', 'ALUGADO'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border-t border-[#333] pt-4 mt-4">
                                <Label className={labelClass}>Destaques</Label>
                                <div className="flex flex-wrap gap-4">
                                    {['isSeaFront:Frente Mar', 'isSeaQuadra:Quadra Mar', 'isFurnished:Mobiliado', 'isHighStandard:Alto Padrão', 'isDifferentiated:Diferenciado'].map(opt => {
                                        const [key, label] = opt.split(':');
                                        return <label key={key} className={checkboxItemClass}><Checkbox checked={form.watch(key as any)} onCheckedChange={c => form.setValue(key as any, !!c)} /> <span>{label}</span></label>
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. VALORES */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><DollarSign size={18}/> VALORES</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className={labelClass}>Valor de Venda (R$)</Label>
                                    <Input type="number" {...form.register('price')} className={`${inputClass} text-lg font-bold text-green-400`} />
                                </div>
                                <div>
                                    <Label className={labelClass}>Condomínio</Label>
                                    <Input type="number" {...form.register('condoFee')} className={inputClass} />
                                </div>
                                <div>
                                    <Label className={labelClass}>IPTU</Label>
                                    <Input type="number" {...form.register('iptuPrice')} className={inputClass} />
                                </div>
                            </div>
                            <div className="bg-[#252525] p-4 rounded border border-[#333] flex flex-wrap gap-6">
                                {['acceptsFinancing:Aceita Financiamento', 'acceptsTrade:Aceita Permuta', 'acceptsVehicle:Aceita Veículo'].map(opt => {
                                    const [key, label] = opt.split(':');
                                    return <label key={key} className={checkboxItemClass}><Checkbox checked={form.watch(key as any)} onCheckedChange={c => form.setValue(key as any, !!c)} /> <span>{label}</span></label>
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. DETALHAMENTO */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><LayoutGrid size={18}/> DETALHES</CardTitle></CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                                {[{l:'Área Priv. (m²)', n:'privateArea'}, {l:'Área Total (m²)', n:'totalArea'}, {l:'Quartos', n:'bedrooms'}, {l:'Suítes', n:'suites'}, {l:'Banheiros', n:'bathrooms'}, {l:'Vagas', n:'garageSpots'}].map(f => (
                                    <div key={f.n}>
                                        <Label className={labelClass}>{f.l}</Label>
                                        <Input type="number" {...form.register(f.n as any)} className={inputClass} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. CARACTERÍSTICAS (LISTAS) */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><Plus size={18}/> CARACTERÍSTICAS</CardTitle></CardHeader>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Ambientes', list: ROOM_OPTS, key: 'roomFeatures' },
                                { title: 'Do Imóvel', list: PROPERTY_OPTS, key: 'propertyFeatures' },
                                { title: 'Empreendimento', list: DEVELOPMENT_OPTS, key: 'developmentFeatures' }
                            ].map(group => (
                                <div key={group.key} className="bg-[#252525] p-3 rounded border border-[#333]">
                                    <h4 className="text-gray-300 font-bold mb-3 uppercase text-xs border-b border-[#444] pb-2">{group.title}</h4>
                                    <div className="h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {group.list.map(item => (
                                            <label key={item} className={checkboxItemClass}>
                                                <Checkbox 
                                                    checked={(form.watch(group.key as any) || []).includes(item)} 
                                                    onCheckedChange={() => handleListToggle(group.key as any, item)} 
                                                />
                                                <span className="text-xs">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 5. LOCALIZAÇÃO */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><Home size={18}/> LOCALIZAÇÃO</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-3"><Label className={labelClass}>CEP</Label><Input {...form.register('address.zipCode')} className={inputClass} /></div>
                                <div className="col-span-7"><Label className={labelClass}>Cidade</Label><Input {...form.register('address.city')} className={inputClass} /></div>
                                <div className="col-span-2"><Label className={labelClass}>UF</Label><Input {...form.register('address.state')} className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4"><Label className={labelClass}>Bairro</Label><Input {...form.register('address.neighborhood')} className={inputClass} /></div>
                                <div className="col-span-6"><Label className={labelClass}>Logradouro</Label><Input {...form.register('address.street')} className={inputClass} /></div>
                                <div className="col-span-2"><Label className={labelClass}>Número</Label><Input {...form.register('address.number')} className={inputClass} /></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1"><Label className={labelClass}>Nome do Edifício</Label><Input {...form.register('buildingName')} className={inputClass} /></div>
                                <div className="flex items-center pt-6"><label className={checkboxItemClass}><Checkbox checked={form.watch('displayAddress')} onCheckedChange={c => form.setValue('displayAddress', !!c)} /> <span>Exibir endereço no site</span></label></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 6. MÍDIA E FOTOS */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><ImageIcon size={18}/> MULTIMÍDIA</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label className={labelClass}><Youtube size={12} className="inline mr-1 text-red-500"/> Vídeo (YouTube)</Label><Input {...form.register('videoUrl')} className={inputClass} /></div>
                                <div><Label className={labelClass}><Box size={12} className="inline mr-1 text-blue-500"/> Tour 360 (Matterport)</Label><Input {...form.register('tourUrl')} className={inputClass} /></div>
                            </div>
                            
                            <div className="border border-[#333] p-4 rounded bg-[#252525]">
                                <Label className={labelClass}>Adicionar Fotos</Label>
                                <div className="flex gap-2 mb-4">
                                    <Input placeholder="Cole o link da imagem..." value={tempImageUrl} onChange={e => setTempImageUrl(e.target.value)} className={inputClass} />
                                    <Button type="button" onClick={addImage} className="bg-white text-black hover:bg-gray-200">Adicionar</Button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {form.watch('images').map((img, idx) => (
                                        <div key={idx} className="relative w-24 h-20 group">
                                            <img src={img.url} className="w-full h-full object-cover rounded border border-[#555]" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                            {img.isCover && <Badge className="absolute bottom-0 right-0 text-[8px] px-1 py-0 bg-primary text-black">CAPA</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 7. DADOS INTERNOS (Privado) */}
                    <Card className="bg-[#2b251e] border-[#5c4018] mb-6">
                        <CardHeader className="border-b border-[#5c4018] pb-3"><CardTitle className="text-[#d4af37] flex items-center gap-2 text-base"><Lock size={18}/> DADOS INTERNOS (Privado)</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div><Label className="text-[#a89060] text-xs uppercase mb-1 block">Proprietário</Label><Input {...form.register('ownerName')} className="bg-[#1e1a15] border-[#5c4018] text-[#d4af37]" /></div>
                                <div><Label className="text-[#a89060] text-xs uppercase mb-1 block">Telefone</Label><Input {...form.register('ownerPhone')} className="bg-[#1e1a15] border-[#5c4018] text-[#d4af37]" /></div>
                                <div><Label className="text-[#a89060] text-xs uppercase mb-1 block">Onde estão as chaves?</Label><Input {...form.register('keysLocation')} className="bg-[#1e1a15] border-[#5c4018] text-[#d4af37]" placeholder="Ex: Portaria" /></div>
                            </div>
                            <div>
                                <Label className="text-[#a89060] text-xs uppercase mb-1 block">Observações Internas</Label>
                                <Textarea {...form.register('brokerNotes')} className="bg-[#1e1a15] border-[#5c4018] text-[#d4af37] min-h-[80px]" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 8. DESCRIÇÃO PÚBLICA */}
                    <Card className={sectionClass}>
                        <CardHeader className="border-b border-[#333] pb-3"><CardTitle className="text-primary flex items-center gap-2 text-base"><FileText size={18}/> DESCRIÇÃO DO IMÓVEL</CardTitle></CardHeader>
                        <CardContent className="pt-6">
                            <Textarea {...form.register('description')} className={`${inputClass} min-h-[300px] leading-relaxed`} />
                        </CardContent>
                    </Card>

                </form>
            </div>
        </div>
    );
}