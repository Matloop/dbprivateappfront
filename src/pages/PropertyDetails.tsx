import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaBed, FaBath, FaCar, FaRulerCombined, FaWhatsapp, 
  FaRegStar, FaPrint, FaDollarSign, 
  FaCommentDots, FaUser, FaEnvelope, FaPhoneAlt, FaAngleDoubleRight, FaLock 
} from 'react-icons/fa';
import './PropertyDetails.css'; // Certifique-se de manter o CSS desse layout

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
  // Novos campos
  badgeText?: string;
  badgeColor?: string;
  buildingName?: string;
  propertyFeatures?: { name: string }[];
  developmentFeatures?: { name: string }[];
}

export function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Estados do Formulário
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        if (data.images && data.images.length > 0) {
            // Tenta pegar a capa, se não, pega a primeira
            const cover = data.images.find((i: any) => i.isCover) || data.images[0];
            setActiveImage(cover.url);
        }
        setFormMessage(`Olá, tenho interesse no imóvel: ref #${data.id} - ${data.title}. Aguardo o contato.`);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleWhatsApp = () => {
    if (!property) return;
    const text = `Olá, tenho interesse no imóvel ${property.title} (Ref: ${property.id})`;
    window.open(`https://wa.me/5547996535489?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mensagem simulada enviada!`);
  };

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val) : 'Consulte-nos';

  if (loading) return <div style={{padding: 50, textAlign:'center', color:'#fff', background:'#121212', height:'100vh'}}>Carregando...</div>;
  if (!property) return <div style={{padding: 50, textAlign:'center', color:'#fff'}}>Imóvel não encontrado.</div>;

  return (
    <div className="details-container">
      
      <div className="details-content-wrapper">
        
        {/* === COLUNA ESQUERDA: FOTOS E DESCRIÇÃO === */}
        <div className="details-left-col">
            
            {/* Galeria Principal */}
            <div style={{display:'flex', gap: 10, height: 500, marginBottom: 40}}>
                <div className="gallery-main-frame">
                    <img src={activeImage} alt="Principal" className="gallery-main-img" />
                </div>
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

            {/* Descrição */}
            <div className="description-section" style={{border: 'none', margin: 0, padding: 0}}>
                <h3 style={{color: '#fff', marginBottom: 15, fontSize: '1.5rem', fontWeight: 300}}>Sobre o Imóvel</h3>
                <p style={{whiteSpace: 'pre-line', color: '#ccc', lineHeight: 1.6}}>{property.description}</p>
            </div>

            {/* Features (Características) */}
            <div className="features-wrapper">
                {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Características do Imóvel</h4>
                        <div className="features-list">
                            {property.propertyFeatures.map((feat, i) => (
                                <div key={i} className="feature-item"><span className="feature-bullet">»</span> {feat.name}</div>
                            ))}
                        </div>
                    </div>
                )}

                {property.developmentFeatures && property.developmentFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Infraestrutura do Empreendimento</h4>
                        <div className="features-list">
                            {property.developmentFeatures.map((feat, i) => (
                                <div key={i} className="feature-item"><span className="feature-bullet">»</span> {feat.name}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* === COLUNA DIREITA: SIDEBAR === */}
        <aside className="details-right-col">
            
            {/* 1. TARJA (NO TOPO IGUAL AO PRINT) */}
            {property.badgeText && (
                <div style={{marginBottom: 10}}>
                    <span style={{ 
                        backgroundColor: property.badgeColor || '#0d6efd', // Azul padrão igual ao print
                        color: '#fff',
                        padding: '5px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        borderRadius: '3px',
                        display: 'inline-block'
                    }}>
                        {property.badgeText}
                    </span>
                </div>
            )}

            {/* 2. LOCALIZAÇÃO */}
            <h1 className="prop-location" style={{fontSize: '1.5rem', marginBottom: 5}}>
                {property.address?.city} - {property.address?.neighborhood}
            </h1>

            {/* 3. TÍTULO INTELIGENTE (MODIFICAÇÃO SOLICITADA) */}
            {/* Se tiver Edifício, o título principal muda */}
            <h2 className="prop-title-small" style={{ fontSize: '1.1rem', color: '#fff', marginTop: 10 }}>
                {property.buildingName 
                    ? `${property.category} no ${property.buildingName}` 
                    : property.title
                } 
                
                {/* Se não tiver edifício, mostra o ID aqui */}
                {!property.buildingName && <span style={{color:'#666', fontWeight:'normal'}}> #{property.id}</span>}
            </h2>

            {/* Se tiver edifício, mostramos o título original (ex: "202 Galeriaa") como subtítulo */}
            {property.buildingName && (
                <div style={{color: '#888', fontSize: '0.9rem', marginTop: 5, marginBottom: 15}}>
                    {property.title} <span style={{color:'#666'}}>#{property.id}</span>
                </div>
            )}

            {/* Ícones de Configuração */}
            <div className="specs-list" style={{marginTop: 20}}>
                <div className="spec-row"><span className="spec-icon"><FaBed/></span> <strong>{property.bedrooms}</strong> dormitórios ({property.suites} suítes)</div>
                <div className="spec-row"><span className="spec-icon"><FaCar/></span> <strong>{property.garageSpots}</strong> vagas</div>
                <div className="spec-row"><span className="spec-icon"><FaBath/></span> <strong>{property.bathrooms}</strong> banheiros</div>
                <div className="spec-row"><span className="spec-icon"><FaRulerCombined/></span> <strong>{property.privateArea}m²</strong> privativos</div>
            </div>

            {/* Preço */}
            <div className="price-tag">
                {formatCurrency(Number(property.price))}
            </div>

            {/* Botão Whatsapp */}
            <button className="btn-whatsapp-large" onClick={handleWhatsApp}>
                <FaWhatsapp size={22} /> MAIS INFORMAÇÕES VIA WHATSAPP
            </button>

            <div className="actions-row">
                <button className="action-link"><FaRegStar /> Adicionar aos Favoritos</button>
                <button className="action-link"><FaPrint /> Imprimir</button>
                <button className="action-link"><FaDollarSign /> Financiamentos</button>
            </div>

            <div className="sidebar-separator"></div>

            {/* Formulário */}
            <div className="lead-form-container">
                <div className="lead-header">
                    <FaCommentDots /> Mais informações sobre este imóvel
                </div>

                <form onSubmit={handleEmailSubmit}>
                    <label className="lead-label">Mensagem <span>*</span></label>
                    <textarea 
                        className="dark-textarea" 
                        rows={4}
                        value={formMessage}
                        onChange={e => setFormMessage(e.target.value)}
                    />

                    <label className="lead-label">Nome Completo <span>*</span></label>
                    <div className="input-group">
                        <input type="text" className="dark-input" required value={formName} onChange={e => setFormName(e.target.value)} />
                        <FaUser className="input-icon-right" />
                    </div>

                    <label className="lead-label">Email <span>*</span></label>
                    <div className="input-group">
                        <input type="email" className="dark-input" required value={formEmail} onChange={e => setFormEmail(e.target.value)} />
                        <FaEnvelope className="input-icon-right" />
                    </div>

                    <label className="lead-label">Telefone <span>*</span></label>
                    <div className="input-group">
                        <input type="tel" className="dark-input" required value={formPhone} onChange={e => setFormPhone(e.target.value)} />
                        <FaPhoneAlt className="input-icon-right" />
                    </div>

                    <div className="submit-row">
                        <button type="submit" className="btn-send">enviar <FaAngleDoubleRight /></button>
                    </div>
                    
                    <div className="privacy-text">
                        <FaLock size={10} /> Seus dados estão protegidos.
                    </div>
                </form>
            </div>
        </aside>

      </div>
    </div>
  );
}