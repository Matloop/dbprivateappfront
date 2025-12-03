import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBed, FaBath, FaCar, FaRulerCombined, FaWhatsapp, FaRegStar, FaPrint, FaDollarSign, FaBuilding } from 'react-icons/fa';
import './PropertyDetails.css';

// Interface
interface Property {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  category: string;
  status: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number;
  totalArea?: number;
  images: { url: string; isCover: boolean }[];
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  registrationNumber?: string;
}

export function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Busca dados
  useEffect(() => {
    fetch(`http://127.0.0.1:3000/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        if (data.images && data.images.length > 0) {
            const cover = data.images.find((i: any) => i.isCover) || data.images[0];
            setActiveImage(cover.url);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val) : 'Consulte-nos';

  if (loading) return <div style={{padding: 50, textAlign:'center', color:'#fff', background:'#121212', height:'100vh'}}>Carregando...</div>;
  if (!property) return <div style={{padding: 50, textAlign:'center', color:'#fff'}}>Imóvel não encontrado.</div>;

  return (
    <div className="details-container">
      
      <div className="details-content-wrapper">
        
        {/* === ESQUERDA: GALERIA (Foto Grande + Thumbs Verticais) === */}
        <div className="details-left-col">
            
            {/* Foto Principal */}
            <div className="gallery-main-frame">
                <img src={activeImage} alt="Principal" className="gallery-main-img" />
                {/* Badge ID no canto da foto */}
                <div style={{position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.6)', color:'#fff', padding:'5px 10px', fontSize:'0.8rem', borderRadius:4}}>
                    DB PRIVATE
                </div>
            </div>

            {/* Miniaturas Verticais (lado direito da foto grande) */}
            <div className="gallery-thumbs-vertical">
                {property.images?.map((img, idx) => (
                    <img 
                        key={idx} 
                        src={img.url} 
                        className={`gallery-thumb ${activeImage === img.url ? 'active' : ''}`}
                        onClick={() => setActiveImage(img.url)}
                        alt={`thumb-${idx}`}
                    />
                ))}
            </div>
        </div>

        {/* === DIREITA: INFORMAÇÕES === */}
        <aside className="details-right-col">
            
            <div className="info-header">
                <h1 className="prop-location">{property.address?.city} - {property.address?.neighborhood}</h1>
                <h2 className="prop-title-small">
                    {property.title} <span style={{color:'#666'}}>#{property.id}</span>
                </h2>
            </div>

            {/* Lista de Especificações */}
            <div className="specs-list">
                <div className="spec-row">
                    <span className="spec-icon"><FaBed/></span>
                    <strong>{property.bedrooms}</strong> dormitórios ({property.suites} suítes)
                </div>
                <div className="spec-row">
                    <span className="spec-icon"><FaCar/></span>
                    <strong>{property.garageSpots}</strong> vagas (Privativa)
                </div>
                <div className="spec-row">
                    <span className="spec-icon"><FaBath/></span>
                    <strong>{property.bathrooms}</strong> banheiros
                </div>
                <div className="spec-row">
                    <span className="spec-icon"><FaBuilding/></span>
                    {property.subtitle || "Alto Padrão"} - {property.category}
                </div>
                <div className="spec-row">
                    <span className="spec-icon"><FaRulerCombined/></span>
                    <strong>{property.privateArea}m²</strong> de área privativa
                </div>
                {property.totalArea && (
                    <div className="spec-row">
                        <span className="spec-icon"><FaRulerCombined/></span>
                        <strong>{property.totalArea}m²</strong> de área total
                    </div>
                )}
            </div>

            {/* Tags e Badges */}
            <div className="tags-row">
                <span className="prop-tag">Consulte-nos</span>
                <span className="prop-tag">Financiamento com construtora</span>
                {property.registrationNumber && (
                    <span className="prop-tag">Incorporação: {property.registrationNumber}</span>
                )}
            </div>

            {/* Preço */}
            <div className="price-tag">
                {formatCurrency(Number(property.price))}
            </div>

            {/* Botão Ação Principal */}
            <button className="btn-whatsapp-large" onClick={() => window.open(`https://wa.me/5547996535489?text=Olá, tenho interesse no imóvel ${property.id}`, '_blank')}>
                <FaWhatsapp size={22} /> Mais Informações via WhatsApp
            </button>
            <p style={{fontSize:'0.65rem', color:'#666', marginTop:-10}}>
                Os preços, disponibilidades e condições de pagamento poderão ser alterados sem prévia comunicação.
            </p>

            {/* Menu de Ações */}
            <div className="actions-row">
                <button className="action-link"><FaRegStar /> Adicionar aos Favoritos</button>
                <button className="action-link"><FaPrint /> Imprimir</button>
                <button className="action-link"><FaDollarSign /> Financiamentos</button>
            </div>

            {/* Corretor */}
            <div className="broker-section">
                <img src="/src/assets/danillo_foto.png" alt="Corretor" className="broker-avatar" />
                <div style={{flex:1}}>
                    <h4 style={{color:'#fff', margin:0}}>Danillo Bezerra</h4>
                    <p style={{color:'#d4af37', fontSize:'0.8rem', margin:'5px 0'}}>(47) 9.9651-0619</p>
                    <p style={{color:'#888', fontSize:'0.75rem', margin:0}}>CRECI 24.966-F</p>
                </div>
            </div>

        </aside>

      </div>

      {/* === ABAIXO: DESCRIÇÃO === */}
      <div className="description-section">
        <h3 style={{color: '#fff', marginBottom: 15}}>Sobre o Imóvel</h3>
        <p style={{whiteSpace: 'pre-line'}}>{property.description}</p>
      </div>

    </div>
  );
}