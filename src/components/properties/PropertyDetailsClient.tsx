"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image, { ImageLoaderProps } from "next/image";
import {
  Bed, Bath, Car, Ruler, MapPin, MessageCircle, Star, Share2,
  ChevronLeft, ChevronRight, Send, Phone, ImageIcon, Check, Facebook
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Usando react-icons para whats se preferir, ou lucide
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
  
  // --- CONFIGURAÇÃO DO CARROSSEL ---
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
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
      <div className="w-full border-b border-border bg-card">
        <div className="max-w-[1600px] mx-auto">
          <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none px-5 py-4 shadow-none" />
        </div>
      </div>

      {/* ===================================================================================== */}
      {/* AREA DE DESTAQUE (FOTOS + BARRA ESCURA + PREÇO) */}
      {/* ===================================================================================== */}
      <div className="relative w-full">
        
        {/* 1. CARROSSEL (Altura Reduzida) */}
        <div className="w-full bg-[#050505] relative overflow-hidden py-4"> 
            <div className="w-full mx-auto relative group">
                {/* Viewport do Embla */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y">
                        {images.map((img: any, idx: number) => {
                            const isActive = idx === selectedIndex;
                            return (
                                <div 
                                    key={idx} 
                                    // Ajuste de largura para mostrar pedaços das laterais
                                    className="flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_50%] min-w-0 relative pl-2 transition-all duration-700 ease-in-out"
                                >
                                    {/* Altura fixa controlada para desktop (550px) e mobile (300px) */}
                                    <div className={`relative h-[300px] md:h-[550px] w-full overflow-hidden transition-all duration-700 ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-40 grayscale-[50%] z-0'}`}>
                                        
                                        <Image
                                            loader={customLoader}
                                            src={fixImageSource(img.url)}
                                            alt={`Foto ${idx}`}
                                            fill
                                            className="object-cover"
                                            priority={idx === 0}
                                            unoptimized={true}
                                        />

                                        {/* LOGO WATERMARK (Centralizada e sutil) */}
                                        {isActive && property.watermarkEnabled && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-in fade-in duration-1000 delay-300">
                                                <div className="relative w-32 h-32 md:w-48 md:h-48 opacity-30 invert brightness-0 filter drop-shadow-lg"> 
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
                                        
                                        {/* Badge na Foto */}
                                        {isActive && property.badgeText && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <Badge className="bg-primary text-primary-foreground font-bold uppercase text-xs px-3 py-1 shadow-lg border-none">
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

                {/* BOTÕES DE NAVEGAÇÃO */}
                <button 
                    onClick={scrollPrev} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/70 text-white p-3 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                >
                    <ChevronLeft size={30} strokeWidth={1} />
                </button>
                <button 
                    onClick={scrollNext} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/70 text-white p-3 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                >
                    <ChevronRight size={30} strokeWidth={1} />
                </button>
                
                {/* Contador */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs tracking-widest font-light pointer-events-none drop-shadow-md">
                    {String(selectedIndex + 1).padStart(2, '0')} <span className="mx-2">|</span> {String(images.length).padStart(2, '0')}
                </div>
            </div>
        </div>

        {/* 2. BARRA DE INFORMAÇÕES (ABAIXO DAS FOTOS) */}
        <div className="bg-[#1e1e1e] w-full text-white py-8 border-b border-white/5 relative z-10">
            <div className="max-w-[1600px] mx-auto px-5 relative flex flex-col md:flex-row items-start md:items-center min-h-[140px]">
                
                {/* LADO ESQUERDO (Infos) */}
                <div className="w-full md:w-2/3 pr-0 md:pr-10 space-y-4">
                    {/* Código e Share */}
                    <div className="flex items-center gap-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
                        <span>CÓDIGO: <span className="text-white">{property.id}</span></span>
                        <div className="flex items-center gap-3">
                            <span>COMPARTILHE O IMÓVEL:</span>
                            <button onClick={handleShare} className="hover:text-primary transition-colors"><Facebook size={14}/></button>
                            <button onClick={handleWhatsApp} className="hover:text-primary transition-colors"><FaWhatsapp size={14}/></button>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl md:text-4xl font-normal leading-tight text-white">
                        {property.title}
                    </h1>

                    {/* Ícones / Specs */}
                    <div className="flex flex-wrap gap-8 pt-2">
                        {/* Localização */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Localização</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <MapPin size={16} /> <span>{property.address?.neighborhood}, {property.address?.city}</span>
                            </div>
                        </div>
                        {/* Dormitórios */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Dormitórios</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Bed size={16} /> <span>{property.bedrooms} Quartos ({property.suites} Suítes)</span>
                            </div>
                        </div>
                        {/* Área */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Área Privativa</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Ruler size={16} /> <span>{property.privateArea} m²</span>
                            </div>
                        </div>
                        {/* Garagem */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">Garagem</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Car size={16} /> <span>{property.garageSpots} Vagas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. CARD FLUTUANTE DE PREÇO (DIREITA) */}
                <div className="w-full md:w-[400px] md:absolute md:right-5 md:bottom-0 z-20 mt-8 md:mt-0 shadow-2xl">
                    {/* Caixa Preço */}
                    <div className="bg-[#2a2a2a] p-8 text-center border-t-4 border-primary">
                        <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Valor do Imóvel</span>
                        <div className="text-4xl text-white font-light mb-4">
                            <span className="text-sm align-top mr-1">R$</span>
                            {property.price ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(Number(property.price)) : "Consulte"}
                        </div>
                        
                        <div className="flex justify-center gap-6 text-[10px] text-gray-400 uppercase font-bold border-t border-white/10 pt-4">
                            <div>IPTU: <span className="text-white">{formatCurrency(property.iptuPrice)}</span></div>
                            <div>Condomínio: <span className="text-white">{formatCurrency(property.condoFee)}</span></div>
                        </div>
                    </div>

                    {/* Caixa Contato */}
                    <div className="bg-[#1f1f1f] p-6 text-center border-t border-white/5">
                        <p className="text-sm text-gray-300 mb-1">Interessado neste imóvel?</p>
                        <p className="text-lg font-bold text-white mb-4">Fale conosco!</p>
                        
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={handleWhatsApp}
                                className="w-full h-12 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold uppercase tracking-wide gap-2 rounded-none"
                            >
                                <FaWhatsapp size={18} /> Conversar no WhatsApp
                            </Button>
                            
                            <div className="flex items-center justify-center gap-2 text-gray-400 mt-2">
                                <Phone size={14} /> 
                                <span className="text-sm">Vendas: <span className="text-white font-bold text-lg ml-1">47 9651-0619</span></span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* ===================================================================================== */}
      {/* CONTEÚDO PRINCIPAL (Grid) */}
      {/* ===================================================================================== */}
      <div className="max-w-[1600px] mx-auto px-5 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* COLUNA ESQUERDA (Descrição e Detalhes) */}
        <div className="lg:col-span-8 w-full space-y-12">
          
          {/* DESCRIÇÃO */}
          <div>
            <h3 className="text-xl font-medium text-foreground mb-6 border-l-4 border-primary pl-4 uppercase tracking-widest">
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

          {/* CARACTERÍSTICAS EM LISTA */}
          <div className="border-t border-border pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {property.roomFeatures?.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Bed className="w-4 h-4" /> Ambientes</h3>
                    <ul className="space-y-2">{property.roomFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
                </div>
                )}
                {property.propertyFeatures?.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Star className="w-4 h-4" /> Características</h3>
                    <ul className="space-y-2">{property.propertyFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
                </div>
                )}
                {property.developmentFeatures?.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Empreendimento</h3>
                    <ul className="space-y-2">{property.developmentFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-muted-foreground"><Check className="w-4 h-4 text-primary mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
                </div>
                )}
            </div>
          </div>

          {/* MAPA */}
          <div className="border-t border-border pt-10">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><MapPin size={20} /> Localização</h3>
            <PropertyMap address={`${property.address?.street}, ${property.address?.number} - ${property.address?.neighborhood}, ${property.address?.city}`} lat={0} lng={0} />
          </div>

        </div>

        {/* COLUNA DIREITA (Formulário Sticky) */}
        <div className="lg:col-span-4 w-full relative">
          <div className="lg:sticky lg:top-6 space-y-8">
            
            {/* Form de Lead */}
            <Card className="border border-border bg-card shadow-xl rounded-none">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                    <h4 className="text-lg font-bold text-foreground uppercase tracking-wide">Agende uma Visita</h4>
                    <p className="text-xs text-muted-foreground mt-2">Preencha seus dados e entraremos em contato.</p>
                </div>
                
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Input placeholder="Nome completo" className="bg-background border-input text-foreground h-12" value={formName} onChange={(e) => setFormName(e.target.value)} />
                    <Input placeholder="Telefone / WhatsApp" className="bg-background border-input text-foreground h-12" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                    <Input placeholder="E-mail" className="bg-background border-input text-foreground h-12" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-wide rounded-none hover:bg-primary/90">
                    Enviar Solicitação <Send className="ml-2 h-3 w-3" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Ações Extras */}
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => toggleFavorite(property.id)} className={`h-12 border-input bg-transparent hover:bg-muted ${favorite ? "text-red-500 border-red-500/50" : "text-muted-foreground"}`}>
                    <Star className={`mr-2 h-4 w-4 ${favorite ? "fill-red-500" : ""}`} /> 
                    {favorite ? "Favoritado" : "Favoritar"}
                </Button>
                <Button variant="outline" onClick={handleShare} className="h-12 border-input bg-transparent hover:bg-muted text-muted-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                </Button>
            </div>

          </div>
        </div>
      </div>

      {/* IMÓVEIS SEMELHANTES */}
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