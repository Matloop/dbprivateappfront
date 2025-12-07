import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bed, Bath, Car, Ruler, MapPin, 
  MessageCircle, Star, Share2, 
  ChevronLeft, ChevronRight, Send
} from 'lucide-react';
import { toast } from "sonner";

import { api } from '@/lib/api';
import { useFavorites } from '../hooks/useFavorites';
import { Breadcrumb } from '../components/Breadcrumb';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites(); 
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Formulário
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/properties/${id}`)
      .then(res => {
        setProperty(res.data);
        setFormMessage(`Olá, tenho interesse na ref #${res.data.id}.`);
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
    window.open(`https://wa.me/5547996535489?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada!");
    setFormName(''); setFormPhone(''); setFormEmail('');
  };

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val) : 'Consulte';

  if (loading) return <div className="container mx-auto py-20 px-4"><Skeleton className="h-[600px] w-full rounded-xl bg-muted/20" /></div>;
  if (!property) return <div className="text-center py-20 text-muted-foreground">Imóvel não encontrado.</div>;

  const currentImage = property.images?.[activeImgIndex]?.url || '';
  const favorite = isFavorite(property.id);

  const breadcrumbItems = [
    { label: 'Vendas', path: '/vendas' },
    { label: property.address?.city, path: `/vendas?city=${property.address?.city}` },
    { label: `Ref ${property.id}`, path: '' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 pb-20 font-sans selection:bg-primary/30">
      
      <div className="container mx-auto px-6 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- COLUNA ESQUERDA (FOTOS E INFO) --- */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* GALERIA AJUSTADA (Mais larga, thumbs menores) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 h-[500px]">
            
            {/* FOTO PRINCIPAL (Ocupa 5 colunas agora, ficando maior) */}
            <div className="relative md:col-span-5 h-full w-full overflow-hidden rounded-sm bg-[#050505] group">
              
              {/* Blur Sutil */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
                style={{ backgroundImage: `url(${currentImage})` }}
              />
              
              <img 
                src={currentImage} 
                alt="Principal" 
                className="relative h-full w-full object-contain z-10 transition-transform duration-700 ease-out" 
              />

              {/* Setas */}
              <div className="absolute inset-0 z-20 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={handlePrevImg} className="bg-black/20 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={handleNextImg} className="bg-black/20 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                {property.badgeText && (
                  <Badge className="bg-white/90 text-black hover:bg-white font-medium text-xs uppercase tracking-widest border-0">
                    {property.badgeText}
                  </Badge>
                )}
              </div>

              {/* CONTADOR DE FOTOS (VOLTOU!) */}
              <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 shadow-lg">
                {activeImgIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* MINIATURAS LATERAIS (1 Coluna - Mais estreita) */}
            {/* Scroll customizado para ficar minimalista */}
            <div className="hidden md:flex flex-col gap-2 h-full overflow-y-auto pr-1 
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-white/10
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              
              {property.images.map((img: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-sm transition-all duration-300 
                    ${idx === activeImgIndex ? 'opacity-100 ring-1 ring-white' : 'opacity-40 hover:opacity-100'}`}
                >
                  <img src={img.url} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFORMAÇÕES PRINCIPAIS */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                {property.category} &bull; {property.address?.neighborhood}
              </span>
              <h1 className="text-3xl md:text-4xl font-light text-white leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-500 gap-2 text-sm mt-1">
                <MapPin className="h-4 w-4" />
                <span>{property.address?.city}, {property.address?.state}</span>
              </div>
            </div>

            {/* ÍCONES MINIMALISTAS */}
            <div className="flex flex-wrap gap-8 md:gap-12 py-6 border-y border-white/5">
              {[
                { icon: Bed, val: property.bedrooms, label: "Quartos" },
                { icon: Bath, val: property.bathrooms, label: "Banheiros" },
                { icon: Car, val: property.garageSpots, label: "Vagas" },
                { icon: Ruler, val: property.privateArea, label: "Privativos", unit: "m²" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-start">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <item.icon className="h-5 w-5 text-primary/80" />
                    <span className="text-2xl font-light">{item.val}{item.unit}</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-medium pl-7">{item.label}</span>
                </div>
              ))}
            </div>

            {/* DESCRIÇÃO E CARACTERÍSTICAS */}
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-lg font-medium text-white">Sobre</h3>
                <p className="whitespace-pre-line text-gray-400 leading-7 font-light">
                  {property.description}
                </p>
              </div>

              <div className="md:col-span-5 space-y-6">
                {property.developmentFeatures?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Diferenciais</h3>
                    <ul className="space-y-2">
                      {property.developmentFeatures.slice(0, 8).map((feat: any, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="h-1 w-1 rounded-full bg-primary" /> {feat.name}
                        </li>
                      ))}
                      {property.developmentFeatures.length > 8 && <li className="text-xs text-gray-600 pl-4 italic">+ e muito mais</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUNA DIREITA (CONTATO CLEAN) --- */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-6 space-y-6">
            
            {/* CARD DE PREÇO E AÇÃO */}
            <Card className="border-0 bg-[#121212] shadow-2xl">
              <CardContent className="p-8 space-y-8">
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Valor de Venda</p>
                  <div className="text-3xl font-light text-white">
                    {formatCurrency(Number(property.price))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wide text-xs"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Conversar no WhatsApp
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => toggleFavorite(property.id)} 
                      className={`flex-1 border-white/10 hover:bg-white/5 hover:text-white ${favorite ? 'text-primary border-primary/30' : 'text-gray-400'}`}
                    >
                      <Star className={`mr-2 h-4 w-4 ${favorite ? "fill-primary" : ""}`} /> Favorito
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white">
                      <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                    </Button>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* FORMULÁRIO MINIMALISTA (LINHAS) */}
                <form onSubmit={handleLeadSubmit} className="space-y-5">
                  <p className="text-sm font-medium text-white">Solicitar Contato</p>
                  
                  <div className="space-y-4">
                    <Input 
                      placeholder="Nome completo" 
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary placeholder:text-gray-600 transition-colors" 
                      required 
                      value={formName} 
                      onChange={e => setFormName(e.target.value)} 
                    />
                    <Input 
                      placeholder="Seu telefone" 
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary placeholder:text-gray-600 transition-colors" 
                      required 
                      value={formPhone} 
                      onChange={e => setFormPhone(e.target.value)} 
                    />
                    <Input 
                      placeholder="Seu e-mail" 
                      type="email"
                      className="bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary placeholder:text-gray-600 transition-colors" 
                      required 
                      value={formEmail} 
                      onChange={e => setFormEmail(e.target.value)} 
                    />
                  </div>

                  <Button type="submit" variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase text-xs tracking-widest justify-between px-0">
                    Enviar Mensagem <Send className="h-4 w-4" />
                  </Button>
                </form>

              </CardContent>
            </Card>

            {/* CARD DO CORRETOR */}
            <div className="flex items-center gap-4 px-4">
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">DB</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Danillo Bezerra</p>
                <p className="text-xs text-gray-500">CRECI 24.966-F</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}