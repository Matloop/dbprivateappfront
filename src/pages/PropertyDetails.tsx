import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaBed, FaBath, FaCar, FaRulerCombined, FaWhatsapp, 
  FaRegStar, FaPrint, FaDollarSign, 
  FaCommentDots, FaUser, FaEnvelope, FaPhoneAlt, FaAngleDoubleRight, FaLock,
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import './PropertyDetails.css';

interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number;
  images: { url: string; isCover: boolean }[];
  address?: { city: string; neighborhood: string };
  badgeText?: string;
  badgeColor?: string;
  buildingName?: string;
  // Listas de características
  roomFeatures?: { name: string }[];
  propertyFeatures?: { name: string }[];
  developmentFeatures?: { name: string }[];
}

export function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados do Formulário
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setFormMessage(`Olá, tenho interesse no imóvel: ref #${data.id} - ${data.title}. Aguardo o contato.`);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property?.images) return;
    setActiveIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property?.images) return;
    setActiveIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

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

  const currentImage = property.images && property.images[activeIndex] ? property.images[activeIndex].url : '';

  return (
    <div className="details-container">
      <div className="details-content-wrapper">
        
        {/* === COLUNA ESQUERDA === */}
        <div className="details-left-col">
            
            {/* GALERIA */}
            <div className="gallery-wrapper">
                <div className="gallery-main-frame">
                    <img src={currentImage} alt="Principal" className="gallery-main-img" />
                    
                    {property.images.length > 1 && (
                      <>
                        <button className="gallery-nav-btn prev" onClick={handlePrev}><FaChevronLeft /></button>
                        <button className="gallery-nav-btn next" onClick={handleNext}><FaChevronRight /></button>
                      </>
                    )}
                    <div className="photo-count-badge">{activeIndex + 1} / {property.images.length}</div>
                </div>

                <div className="gallery-thumbs-vertical">
                    {property.images?.map((img, idx) => (
                        <img 
                            key={idx} 
                            src={img.url} 
                            className={`gallery-thumb ${activeIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveIndex(idx)}
                            alt={`thumb-${idx}`}
                        />
                    ))}
                </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="description-section">
                <h3 style={{color: '#fff', marginBottom: 15, fontSize: '1.5rem', fontWeight: 300}}>Sobre o Imóvel</h3>
                <p style={{whiteSpace: 'pre-line', color: '#ccc', lineHeight: 1.6}}>{property.description}</p>
            </div>

            {/* --- CARACTERÍSTICAS (CORRIGIDO PARA MOSTRAR TODAS AS LISTAS) --- */}
            <div className="features-wrapper">
                
                {/* 1. Ambientes */}
                {property.roomFeatures && property.roomFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Ambientes</h4>
                        <div className="features-list">
                            {property.roomFeatures.map((feat, i) => (
                                <div key={i} className="feature-item"><span className="feature-bullet">»</span> {feat.name}</div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Características do Imóvel */}
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

                {/* 3. Infraestrutura do Empreendimento */}
                {property.developmentFeatures && property.developmentFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Empreendimento / Lazer</h4>
                        <div className="features-list">
                            {property.developmentFeatures.map((feat, i) => (
                                <div key={i} className="feature-item"><span className="feature-bullet">»</span> {feat.name}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* === COLUNA DIREITA (SIDEBAR) === */}
        <aside className="details-right-col">
            {property.badgeText && (
                <div style={{marginBottom: 10}}>
                    <span style={{ backgroundColor: property.badgeColor || '#0d6efd', color: '#fff', padding: '5px 10px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '3px' }}>
                        {property.badgeText}
                    </span>
                </div>
            )}
            <h1 className="prop-location" style={{fontSize: '1.5rem', marginBottom: 5}}>
                {property.address?.city} - {property.address?.neighborhood}
            </h1>
            <h2 className="prop-title-small" style={{ fontSize: '1.1rem', color: '#fff', marginTop: 10 }}>
                {property.buildingName ? `${property.category} no ${property.buildingName}` : property.title} 
            </h2>

            <div className="specs-list" style={{marginTop: 20}}>
                <div className="spec-row"><span className="spec-icon"><FaBed/></span> <strong>{property.bedrooms}</strong> dormitórios ({property.suites} suítes)</div>
                <div className="spec-row"><span className="spec-icon"><FaCar/></span> <strong>{property.garageSpots}</strong> vagas</div>
                <div className="spec-row"><span className="spec-icon"><FaBath/></span> <strong>{property.bathrooms}</strong> banheiros</div>
                <div className="spec-row"><span className="spec-icon"><FaRulerCombined/></span> <strong>{property.privateArea}m²</strong> privativos</div>
            </div>

            <div className="price-tag">{formatCurrency(Number(property.price))}</div>
            
            <button className="btn-whatsapp-large" onClick={handleWhatsApp}>
                <FaWhatsapp size={22} /> MAIS INFORMAÇÕES
            </button>

            <div className="actions-row">
                <button className="action-link"><FaRegStar /> Adicionar aos Favoritos</button>
                <button className="action-link"><FaPrint /> Imprimir</button>
                <button className="action-link"><FaDollarSign /> Financiamentos</button>
            </div>

            <div className="sidebar-separator"></div>

            <div className="lead-form-container">
                <div className="lead-header"><FaCommentDots /> Mais informações</div>
                <form onSubmit={handleEmailSubmit}>
                    <label className="lead-label">Mensagem</label>
                    <textarea className="dark-textarea" rows={4} value={formMessage} onChange={e => setFormMessage(e.target.value)}/>
                    <label className="lead-label">Nome</label>
                    <div className="input-group"><input type="text" className="dark-input" required value={formName} onChange={e => setFormName(e.target.value)} /><FaUser className="input-icon-right" /></div>
                    <label className="lead-label">Email</label>
                    <div className="input-group"><input type="email" className="dark-input" required value={formEmail} onChange={e => setFormEmail(e.target.value)} /><FaEnvelope className="input-icon-right" /></div>
                    <label className="lead-label">Telefone</label>
                    <div className="input-group"><input type="tel" className="dark-input" required value={formPhone} onChange={e => setFormPhone(e.target.value)} /><FaPhoneAlt className="input-icon-right" /></div>
                    <div className="submit-row"><button type="submit" className="btn-send">enviar <FaAngleDoubleRight /></button></div>
                </form>
            </div>
        </aside>
      </div>
    </div>
  );
}