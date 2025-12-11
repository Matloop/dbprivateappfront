"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image, { ImageLoaderProps } from "next/image";
import {
  Bed, Bath, Car, Ruler, MapPin, MessageCircle, Star, Share2,
  ChevronLeft, ChevronRight, Send, Phone, ImageIcon, Check
} from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/hooks/useFavorites";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyCard } from "@/components/PropertyCard";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[400px] w-full rounded-xl bg-[#1a1a1a] border border-[#333]" />
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
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  
  // Debug para ver se o dado está chegando (abra o console do navegador F12)
  useEffect(() => {
    console.log("Marca d'água ativada?", property.watermarkEnabled);
  }, [property]);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  if (!property) return <div className="text-center py-20 text-gray-400">Imóvel não encontrado.</div>;

  const images = property.images && property.images.length > 0 ? property.images : [{ url: "/placeholder.jpg" }];
  const currentImage = fixImageSource(images[activeImgIndex]?.url);
  const favorite = isFavorite(property.id);

  const handleNextImg = () => setActiveImgIndex((prev) => (prev + 1) % images.length);
  const handlePrevImg = () => setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);

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
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] pb-20 font-sans">
      <div className="w-full border-b border-[#222]">
        <div className="max-w-[1600px] mx-auto">
          <Breadcrumb items={breadcrumbItems} className="bg-transparent border-none px-5 py-4 shadow-none" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-8 w-full">
          
          {/* GALERIA */}
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[550px] mb-10 group">
            <div className="flex-1 bg-black relative rounded-md overflow-hidden border border-[#222] min-h-[300px] lg:min-h-full">
              
              <Image
                key={currentImage}
                loader={customLoader}
                src={currentImage}
                alt={property.title}
                fill
                className="object-contain z-10"
                priority={true}
                unoptimized={true}
                sizes="(max-width: 1200px) 100vw, 800px"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg"; }}
              />

              {/* --- LÓGICA DA MARCA D'ÁGUA CORRIGIDA --- */}
              {/* Removemos o mix-blend-overlay que faz a logo sumir dependendo da cor de fundo */}
              {property.watermarkEnabled && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
                    {/* 
                       Ajuste de tamanho:
                       w-24 (mobile) = 96px
                       md:w-32 (desktop) = 128px
                       h-12 / h-16 = define a altura do container da logo
                    */}
                    <div className="relative w-18 h-12 md:w-32 md:h-16 opacity-90">
                        <Image 
                            src="/logo2025.png" 
                            alt="Watermark"
                            fill
                            className="object-contain drop-shadow-md" // drop-shadow ajuda a ver a logo se o fundo for branco
                            unoptimized={true}
                        />
                    </div>
                </div>
              )}

              <div className="absolute inset-0 z-20 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handlePrevImg} className="bg-black/40 hover:bg-primary text-white p-2 rounded-full backdrop-blur-sm"><ChevronLeft /></button>
                <button onClick={handleNextImg} className="bg-black/40 hover:bg-primary text-white p-2 rounded-full backdrop-blur-sm"><ChevronRight /></button>
              </div>
              <div className="absolute top-4 left-4 z-20">
                {property.badgeText && <Badge className="bg-primary text-black font-bold uppercase">{property.badgeText}</Badge>}
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto w-full lg:w-[130px] h-[100px] lg:h-full scrollbar-hide">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative aspect-[4/3] w-[120px] lg:w-full flex-shrink-0 rounded-md overflow-hidden border-2 ${idx === activeImgIndex ? "border-primary" : "border-transparent opacity-50"}`}
                  >
                    <Image loader={customLoader} src={fixImageSource(img.url)} alt="thumb" fill className="object-cover" loading="lazy" unoptimized={true} sizes="150px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DADOS BÁSICOS */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
              <span>{property.category}</span><span>•</span><span>{property.address?.neighborhood}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-white leading-tight mb-2">{property.title}</h1>
            <div className="flex items-center text-[#888] gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> <span>{property.address?.city}, {property.address?.state}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-[#222] mb-8">
            {[
              { icon: Bed, val: property.bedrooms, label: "Quartos" },
              { icon: Bath, val: property.bathrooms, label: "Banheiros" },
              { icon: Car, val: property.garageSpots, label: "Vagas" },
              { icon: Ruler, val: property.privateArea, label: "Privativos", unit: "m²" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center md:items-start p-2">
                <div className="flex items-center gap-2 text-white mb-1"><item.icon className="h-5 w-5 text-primary" /><span className="text-2xl font-light">{item.val} <span className="text-sm text-[#666]">{item.unit}</span></span></div>
                <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* DESCRIÇÃO */}
          <div className="mb-12">
            <h3 className="text-xl font-medium text-white mb-4 border-l-4 border-primary pl-3">Sobre o Imóvel</h3>
            <div className="text-[#ccc] leading-relaxed font-light text-justify space-y-4" dangerouslySetInnerHTML={{ __html: property.description || "" }} />
          </div>

          {/* CARACTERÍSTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#222] pt-8">
            {property.roomFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Bed className="w-4 h-4" /> Ambientes</h3>
                <ul className="space-y-2">{property.roomFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-[#bbb]"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
            {property.propertyFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Star className="w-4 h-4" /> Do Imóvel</h3>
                <ul className="space-y-2">{property.propertyFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-[#bbb]"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
            {property.developmentFeatures?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Empreendimento</h3>
                <ul className="space-y-2">{property.developmentFeatures.map((feat: any, i: number) => (<li key={i} className="flex items-start text-sm text-[#bbb]"><Check className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />{getFeatureName(feat)}</li>))}</ul>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 w-full relative">
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card className="border border-[#222] bg-[#1a1a1a] shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div><p className="text-xs text-[#666] uppercase tracking-widest font-bold mb-1">Valor de Venda</p><div className="text-3xl font-bold text-white tracking-tight">{formatCurrency(Number(property.price))}</div></div>
                <Button className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-bold uppercase gap-2" onClick={handleWhatsApp}><MessageCircle size={18} /> Chamar no WhatsApp</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleFavorite(property.id)} className={`flex-1 border-[#333] bg-transparent hover:bg-[#333] ${favorite ? "text-primary border-primary/50" : "text-[#888]"}`}><Star className={`mr-2 h-4 w-4 ${favorite ? "fill-primary" : ""}`} /> Favorito</Button>
                  <Button variant="outline" className="flex-1 border-[#333] bg-transparent hover:bg-[#333] text-[#888]"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
                </div>
                <Separator className="bg-[#333]" />
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Input placeholder="Nome completo" className="bg-[#121212] border-[#333] text-white" value={formName} onChange={(e) => setFormName(e.target.value)} />
                    <Input placeholder="Telefone" className="bg-[#121212] border-[#333] text-white" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                    <Input placeholder="E-mail" className="bg-[#121212] border-[#333] text-white" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                  <Button type="submit" variant="ghost" className="w-full text-primary border border-primary/20">Enviar Solicitação <Send className="ml-2 h-3 w-3" /></Button>
                </form>
              </CardContent>
            </Card>
            <div className="flex items-center gap-4 px-4 py-2 border border-[#222] rounded-lg bg-[#1a1a1a]">
              <div className="h-10 w-10 rounded-full bg-[#121212] border border-[#333] flex items-center justify-center text-primary font-bold">DB</div>
              <div className="flex-1"><p className="text-sm font-bold text-white">Danillo Bezerra</p><p className="text-xs text-[#666]">CRECI 4.109-J</p></div>
              <a href="tel:+554796510619" className="text-[#666] hover:text-white"><Phone size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-10 max-w-[1600px] mx-auto px-5">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><MapPin size={20} /> Localização</h3>
        <PropertyMap address={`${property.address?.street}, ${property.address?.number} - ${property.address?.neighborhood}, ${property.address?.city}`} lat={0} lng={0} />
      </div>

      {similarProperties.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-5 mt-20 pt-10 border-t border-[#222]">
          <h2 className="text-2xl font-light text-white mb-8 border-l-4 border-primary pl-4">Imóveis <span className="font-bold">Semelhantes</span></h2>
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