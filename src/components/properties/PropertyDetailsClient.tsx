"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image, { ImageLoaderProps } from "next/image";
import {
  Bed, Bath, Car, Ruler, MapPin, MessageCircle, Star, Share2,
  ChevronLeft, ChevronRight, Send, Phone, ImageIcon, Check
} from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import { Breadcrumb } from "@/components/sales/Breadcrumb";
import { PropertyCard } from "@/components/properties/PropertyCard";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

// Importações do Embla para o carrossel principal customizado
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

const PropertyMap = dynamic(() => import("@/components/properties/PropertyMap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[400px] w-full rounded-xl bg-card border border-border" />
  ),
});

const fixImageSource = (url: string | undefined | null) => {
  if (!url || url === '') return '/placeholder.jpg';
  if (url.startsWith('/')) return url;
  if (process.env.NODE_ENV === 'production' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      return url.replace(/http:\/\/(localhost|127\.0\.0\.1):\d+/g, 'https://98.93.10.61.nip.io');
  }
  return url;
};

const customLoader = ({ src }: ImageLoaderProps) => {
  return src;
};

interface PropertyDetailsClientProps {
  property: any;
  similarProperties: any[];
}

export function PropertyDetailsClient({
  property,
  similarProperties,
}: PropertyDetailsClientProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // --- CONFIGURAÇÃO DO CARROSSEL ESTILO MAFRE ---
  const OPTIONS: EmblaOptionsType = { loop: true, align: "center", containScroll: false };
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);
  // -----------------------------------------------

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  if (!property) return <div className="text-center py-20 text-muted-foreground">Imóvel não encontrado.</div>;

  const images = property.images && property.images.length > 0 ? property.images : [{ url: "/placeholder.jpg" }];
  const favorite = isFavorite(property.id);

  const handleWhatsApp = () => {
    const text = `Olá, tenho interesse no imóvel ${property.title} (Ref: ${property.id})`;
    window.open(`https://wa.me/554796510619?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada!");
    setFormName(""); setFormPhone(""); setFormEmail("");
  };

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val) : "Consulte";
  const getFeatureName = (feat: any) => typeof feat === "string" ? feat : feat.name;

  const breadcrumbItems = [
    { label: "Vendas", path: "/vendas" },
    { label: property.address?.city || "Cidade", path: `/vendas?city=${property.address?.city}` },
    { label: `Ref ${property.id}`, path: "" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans overflow-x-hidden">
      
      {/* HEADER / BREADCRUMB */}
      <div className="w-full border-b border-border">
        <div className="max-w-[1600px] mx-auto">
          <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none px-5 py-4 shadow-none" />
        </div>
      </div>

      {/* --- GALERIA ESTILO CINEMA (Full Width ou Container Grande) --- */}
      <div className="w-full bg-[#050505] relative py-10 mb-8 border-b border-border overflow-hidden">
        <div className="max-w-[1920px] mx-auto relative group">
            
            {/* Viewport do Embla */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {images.map((img: any, idx: number) => {
                        const isActive = idx === selectedIndex;
                        return (
                            <div 
                                key={idx} 
                                // Ajuste da largura: basis-3/4 (75%) para desktop, 90% mobile
                                // Isso faz as imagens laterais aparecerem
                                className="flex-[0_0_90%] md:flex-[0_0_70%] lg:flex-[0_0_60%] min-w-0 relative pl-4 transition-all duration-500 ease-out"
                            >
                                <div className={`relative h-[300px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-lg transition-all duration-500 ${isActive ? 'scale-100 shadow-2xl shadow-black/50' : 'scale-95'}`}>
                                    
                                    <Image
                                        loader={customLoader}
                                        src={fixImageSource(img.url)}
                                        alt={`Foto ${idx}`}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                        unoptimized={true}
                                    />

                                    {/* MÁSCARA ESCURA (Para imagens inativas) */}
                                    <div className={`absolute inset-0 bg-black/70 transition-opacity duration-500 pointer-events-none ${isActive ? 'opacity-0' : 'opacity-100'}`} />

                                    {/* LOGO WATERMARK (Apenas na Ativa) */}
                                    {isActive && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-in fade-in duration-700 delay-300 fill-mode-forwards">
                                            <div className="relative w-32 h-32 md:w-48 md:h-48 opacity-20 invert brightness-0 filter"> 
                                                {/* Invert e brightness-0 deixa a logo branca se for preta originalmente, 
                                                    ajuste conforme sua logo. Se sua logo já é branca, remova o filter. */}
                                                <Image 
                                                    src="/logo2025.png" 
                                                    alt="Watermark"
                                                    fill
                                                    className="object-contain"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Badge (Apenas na Ativa) */}
                                    {isActive && property.badgeText && (
                                        <div className="absolute top-6 left-6 z-20">
                                            <Badge className="bg-primary text-primary-foreground font-bold uppercase text-sm px-3 py-1 shadow-lg">
                                                {property.badgeText}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* BOTÕES DE NAVEGAÇÃO (Sobrepostos) */}
            <button 
                onClick={scrollPrev} 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={scrollNext} 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-primary text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={24} />
            </button>

            {/* Contador de Imagens */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-full text-xs font-mono backdrop-blur-sm pointer-events-none">
                {selectedIndex + 1} / {images.length}
            </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* COLUNA ESQUERDA (Info) */}
        <div className="lg:col-span-8 w-full">
          
          {/* DADOS BÁSICOS */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
              <span>{property.category}</span><span>•</span><span>{property.address?.neighborhood}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-foreground leading-tight mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> <span>{property.address?.city}, {property.address?.state}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border mb-8">
            {[
              { icon: Bed, val: property.bedrooms, label: "Quartos" },
              { icon: Bath, val: property.bathrooms, label: "Banheiros" },
              { icon: Car, val: property.garageSpots, label: "Vagas" },
              { icon: Ruler, val: property.privateArea, label: "Privativos", unit: "m²" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center md:items-start p-2">
                <div className="flex items-center gap-2 text-foreground mb-1"><item.icon className="h-5 w-5 text-primary" /><span className="text-2xl font-light">{item.val} <span className="text-sm text-muted-foreground">{item.unit}</span></span></div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-foreground mb-6 border-l-4 border-primary pl-3">
                Sobre o Imóvel
            </h3>
            
            <div className="text-muted-foreground font-light text-justify leading-relaxed text-base">
                {property.description ? (
                    property.description.match(/<[a-z][\s\S]*>/i) ? (
                        <div 
                            className="
                                space-y-4 
                                [&>p]:mb-4 [&>p]:block 
                                [&>br]:content-[''] [&>br]:block [&>br]:mb-4
                                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                                [&>li]:mb-1
                                [&>strong]:font-bold [&>strong]:text-foreground
                            "
                            dangerouslySetInnerHTML={{ __html: property.description }} 
                        />
                    ) : (
                        property.description.split('\n').map((paragraph: string, index: number) => (
                            paragraph.trim() !== "" ? (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ) : <br key={index} className="block mb-4" />
                        ))
                    )
                ) : (
                    <p className="italic text-muted-foreground">Sem descrição disponível.</p>
                )}
            </div>
          </div>

          {/* CARACTERÍSTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-8">
            {property.roomFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Bed className="w-4 h-4" /> Ambientes</h3>
                <ul className="space-y-2">{property.roomFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
            {property.propertyFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Star className="w-4 h-4" /> Do Imóvel</h3>
                <ul className="space-y-2">{property.propertyFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
            {property.developmentFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Empreendimento</h3>
                <ul className="space-y-2">{property.developmentFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 w-full relative">
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card className="border border-border bg-card shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div><p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Valor de Venda</p><div className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(Number(property.price))}</div></div>
                
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase gap-2" onClick={handleWhatsApp}><MessageCircle size={18} /> Chamar no WhatsApp</Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleFavorite(property.id)} className={`flex-1 border-input bg-transparent hover:bg-muted ${favorite ? "text-primary border-primary/50" : "text-muted-foreground"}`}><Star className={`mr-2 h-4 w-4 ${favorite ? "fill-primary" : ""}`} /> Favorito</Button>
                  <Button variant="outline" className="flex-1 border-input bg-transparent hover:bg-muted text-muted-foreground"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                </div>
                
                <Separator className="bg-border" />
                
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Input placeholder="Nome completo" className="bg-background border-input text-foreground" value={formName} onChange={(e) => setFormName(e.target.value)} />
                    <Input placeholder="Telefone" className="bg-background border-input text-foreground" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                    <Input placeholder="E-mail" className="bg-background border-input text-foreground" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                  <Button type="submit" variant="ghost" className="w-full text-primary border border-primary/20 hover:bg-primary/10">Enviar Solicitação <Send className="ml-2 h-3 w-3" /></Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="flex items-center gap-4 px-4 py-2 border border-border rounded-lg bg-card">
              <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold">DB</div>
              <div className="flex-1"><p className="text-sm font-bold text-foreground">Danillo Bezerra</p><p className="text-xs text-muted-foreground">CRECI 4.109-J</p></div>
              <a href="tel:+554796510619" className="text-muted-foreground hover:text-foreground"><Phone size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-10 max-w-[1600px] mx-auto px-5">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><MapPin size={20} /> Localização</h3>
        <PropertyMap address={`${property.address?.street}, ${property.address?.number} - ${property.address?.neighborhood}, ${property.address?.city}`} lat={0} lng={0} />
      </div>

      {similarProperties.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-5 mt-20 pt-10 border-t border-border">
          <h2 className="text-2xl font-light text-foreground mb-8 border-l-4 border-primary pl-4">Imóveis <span className="font-bold">Semelhantes</span></h2>
          <div className="px-1">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">{similarProperties.map((simProp) => (<CarouselItem key={simProp.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"><PropertyCard property={simProp} /></CarouselItem>))}</CarouselContent>
              <CarouselPrevious className="left-2 bg-black/80 text-white border-none" />
              <CarouselNext className="right-2 bg-black/80 text-white border-none" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}