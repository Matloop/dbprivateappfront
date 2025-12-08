import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bed, Bath, Car, Ruler, MapPin, 
  MessageCircle, Star, Share2, 
  ChevronLeft, ChevronRight, Send, Phone
} from 'lucide-react';
import { toast } from "sonner";

import { api } from '@/lib/api';
import { useFavorites } from '../hooks/useFavorites';
import { Breadcrumb } from '../components/Breadcrumb';
import { PropertyCard } from '@/components/PropertyCard';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export function PropertyDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites(); 
  
  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Formulário de Lead
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    
    // 1. Busca o Imóvel
    api.get(`/properties/${id}`)
      .then(res => {
        const propData = res.data;
        setProperty(propData);

        // 2. Busca Semelhantes
        if (propData.address?.city && propData.category) {
          api.get(`/properties?city=${propData.address.city}&types=${propData.category}`)
            .then(simRes => {
              const filtered = simRes.data.filter((p: any) => p.id !== propData.id);
              setSimilarProperties(filtered);
            })
            .catch(console.error);
        }
      })
      .catch(() => toast.error("Erro ao carregar imóvel."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleNextImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!property?.images?.length) return;
    setActiveImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImg = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!property?.images?.length) return;
    setActiveImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleWhatsApp = () => {
    if (!property) return;
    const text = `Olá, tenho interesse no imóvel ${property.title} (Ref: ${property.id})`;
    window.open(`https://wa.me/554796510619?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada! Entraremos em contato em breve.");
    setFormName(''); setFormPhone(''); setFormEmail('');
  };

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val) : 'Consulte';

  const getFeatureName = (feat: any) => typeof feat === 'string' ? feat : feat.name;

  if (loading) return (
    <div className="container mx-auto py-10 px-5 max-w-[1600px]">
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full rounded-xl bg-muted/20" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="h-[200px] w-full rounded-xl bg-muted/20 col-span-2" />
           <Skeleton className="h-[400px] w-full rounded-xl bg-muted/20" />
        </div>
      </div>
    </div>
  );

  if (!property) return <div className="text-center py-20 text-muted-foreground">Imóvel não encontrado.</div>;

  const currentImage = property.images?.[activeImgIndex]?.url || '';
  const favorite = isFavorite(property.id);

  // Lista combinada de características
  const indoorFeatures = [
    ...(property.roomFeatures || []),
    ...(property.propertyFeatures || [])
  ];

  const breadcrumbItems = [
    { label: 'Vendas', path: '/vendas' },
    { label: property.address?.city || 'Cidade', path: `/vendas?city=${property.address?.city}` },
    { label: `Ref ${property.id}`, path: '' }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] pb-20 font-sans selection:bg-primary/30">
      
      {/* Breadcrumbs */}
      <div className="w-full border-b border-[#222]">
        <div className="max-w-[1600px] mx-auto">
           <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none px-5 py-4" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* =======================
            COLUNA ESQUERDA (2/3)
           ======================= */}
        <div className="lg:col-span-8 w-full">
          
          {/* GALERIA (Layout: Foto Grande Esquerda + Thumbs Direita no Desktop) */}
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[550px] mb-10 group">
            
            {/* Foto Principal */}
            <div className="flex-1 bg-black relative rounded-md overflow-hidden border border-[#222]">
              {/* Imagem com efeito de blur no fundo para preencher espaço se ratio for diferente */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl"
                style={{ backgroundImage: `url(${currentImage})` }}
              />
              <img 
                src={currentImage} 
                alt="Principal" 
                className="relative h-full w-full object-contain z-10 transition-transform duration-500" 
              />
              
              {/* Botões Navegação (Sobrepostos) */}
              <div className="absolute inset-0 z-20 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={handlePrevImg} className="bg-black/40 hover:bg-primary hover:text-black text-white p-2 rounded-full backdrop-blur-sm transition-all"><ChevronLeft size={24} /></button>
                <button onClick={handleNextImg} className="bg-black/40 hover:bg-primary hover:text-black text-white p-2 rounded-full backdrop-blur-sm transition-all"><ChevronRight size={24} /></button>
              </div>
              
              {/* Badge Topo */}
              <div className="absolute top-4 left-4 z-20">
                {property.badgeText && <Badge className="bg-primary text-black hover:bg-primary font-bold text-xs uppercase tracking-widest border-0">{property.badgeText}</Badge>}
              </div>
              
              {/* Contador */}
              <div className="absolute bottom-4 right-4 z-20 bg-black/70 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                {activeImgIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Miniaturas (Vertical no Desktop, Horizontal no Mobile) */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto w-full lg:w-[130px] h-[100px] lg:h-full scrollbar-hide">
              {property.images.map((img: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative aspect-[4/3] w-[120px] lg:w-full flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${idx === activeImgIndex ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img.url} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* CABEÇALHO DO IMÓVEL */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
              <span>{property.category}</span>
              <span>•</span>
              <span>{property.address?.neighborhood}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-white leading-tight mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-[#888] gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> 
              <span>{property.address?.city}, {property.address?.state}</span>
            </div>
          </div>

          {/* ÍCONES DE RESUMO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-[#222] mb-8">
            {[
              { icon: Bed, val: property.bedrooms, label: "Quartos" },
              { icon: Bath, val: property.bathrooms, label: "Banheiros" },
              { icon: Car, val: property.garageSpots, label: "Vagas" },
              { icon: Ruler, val: property.privateArea, label: "Privativos", unit: "m²" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center md:items-start p-2">
                <div className="flex items-center gap-2 text-white mb-1">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-light">{item.val} <span className="text-sm text-[#666]">{item.unit}</span></span>
                </div>
                <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-white mb-4 border-l-4 border-primary pl-3">Sobre o Imóvel</h3>
            <p className="whitespace-pre-line text-[#ccc] leading-relaxed font-light text-justify">
              {property.description}
            </p>
          </div>

          {/* CARACTERÍSTICAS (Listas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {indoorFeatures.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Características do Imóvel</h3>
                <ul className="space-y-2">
                  {indoorFeatures.map((feat: any, i: number) => (
                    <li key={i} className="flex items-start text-sm text-[#bbb] hover:text-white transition-colors">
                      <span className="text-primary mr-2 font-bold">✓</span> 
                      {getFeatureName(feat)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.developmentFeatures?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Empreendimento / Lazer</h3>
                <ul className="space-y-2">
                  {property.developmentFeatures.map((feat: any, i: number) => (
                    <li key={i} className="flex items-start text-sm text-[#bbb] hover:text-white transition-colors">
                      <span className="text-primary mr-2 font-bold">✓</span> 
                      {getFeatureName(feat)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* =======================
            COLUNA DIREITA (Sidebar Sticky)
           ======================= */}
        <div className="lg:col-span-4 w-full relative">
          <div className="lg:sticky lg:top-6 space-y-6">
            
            {/* CARD DE VALOR E AÇÃO */}
            <Card className="border border-[#222] bg-[#1a1a1a] shadow-xl">
              <CardContent className="p-6 space-y-6">
                
                {/* Preço */}
                <div>
                  <p className="text-xs text-[#666] uppercase tracking-widest font-bold mb-1">Valor de Venda</p>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(Number(property.price))}
                  </div>
                  {property.condoFee > 0 && <p className="text-xs text-[#666] mt-1">Condomínio: {formatCurrency(Number(property.condoFee))}</p>}
                </div>

                {/* Botões Principais */}
                <Button 
                    className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase tracking-wide text-xs flex items-center gap-2" 
                    onClick={handleWhatsApp}
                >
                  <MessageCircle size={18} /> 
                  Chamar no WhatsApp
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(property.id)} 
                    className={`flex-1 border-[#333] bg-transparent hover:bg-[#333] h-10 text-xs uppercase font-bold ${favorite ? 'text-primary border-primary/50' : 'text-[#888]'}`}
                  >
                    <Star className={`mr-2 h-4 w-4 ${favorite ? "fill-primary" : ""}`} /> 
                    Favorito
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#333] bg-transparent hover:bg-[#333] text-[#888] hover:text-white h-10 text-xs uppercase font-bold">
                    <Share2 className="mr-2 h-4 w-4" /> 
                    Compartilhar
                  </Button>
                </div>

                <Separator className="bg-[#333]" />

                {/* Formulário de Contato */}
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Solicitar mais informações</p>
                    <p className="text-xs text-[#666]">Preencha seus dados abaixo</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Input 
                        placeholder="Nome completo" 
                        className="bg-[#121212] border-[#333] text-white focus:border-primary h-10 text-sm" 
                        required 
                        value={formName} 
                        onChange={e => setFormName(e.target.value)} 
                    />
                    <Input 
                        placeholder="Seu telefone / WhatsApp" 
                        className="bg-[#121212] border-[#333] text-white focus:border-primary h-10 text-sm" 
                        required 
                        value={formPhone} 
                        onChange={e => setFormPhone(e.target.value)} 
                    />
                    <Input 
                        placeholder="Seu e-mail" 
                        type="email" 
                        className="bg-[#121212] border-[#333] text-white focus:border-primary h-10 text-sm" 
                        required 
                        value={formEmail} 
                        onChange={e => setFormEmail(e.target.value)} 
                    />
                  </div>

                  <Button type="submit" variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase text-xs tracking-widest border border-primary/20 h-10">
                    Enviar Solicitação <Send className="ml-2 h-3 w-3" />
                  </Button>
                </form>

              </CardContent>
            </Card>

            {/* CARD DO CORRETOR */}
            <div className="flex items-center gap-4 px-4 py-2 border border-[#222] rounded-lg bg-[#1a1a1a]">
              <div className="h-10 w-10 rounded-full bg-[#121212] border border-[#333] flex items-center justify-center text-primary font-bold">
                DB
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Danillo Bezerra</p>
                <p className="text-xs text-[#666]">CRECI 4.109-J</p>
              </div>
              <a href="tel:+554796510619" className="text-[#666] hover:text-white">
                  <Phone size={18} />
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* =======================
          CARROSSEL DE SEMELHANTES
         ======================= */}
      {similarProperties.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-5 mt-20 pt-10 border-t border-[#222]">
          <h2 className="text-2xl font-light text-white mb-8 border-l-4 border-primary pl-4">
            Imóveis <span className="font-bold">Semelhantes</span>
          </h2>
          
          <div className="px-1">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {similarProperties.slice(0, 8).map((simProp) => (
                  <CarouselItem key={simProp.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <PropertyCard property={simProp} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/80 text-white border-none hover:bg-primary hover:text-black" />
              <CarouselNext className="right-2 bg-black/80 text-white border-none hover:bg-primary hover:text-black" />
            </Carousel>
          </div>
        </div>
      )}

    </div>
  );
}