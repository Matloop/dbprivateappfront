import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaBed, FaBath, FaCar, FaRulerCombined, FaWhatsapp, 
  FaRegStar, FaPrint, FaDollarSign, FaBuilding, 
  FaCommentDots, FaUser, FaEnvelope, FaPhoneAlt, FaAngleDoubleRight, FaLock 
} from 'react-icons/fa';
import './PropertyDetails.css';

// Interface atualizada
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
            const cover = data.images.find((i: any) => i.isCover) || data.images[0];
            setActiveImage(cover.url);
        }
        // Mensagem padrão ao carregar
        setFormMessage(`Olá, tenho interesse no imóvel: ref #${data.id} ${data.title}. Aguardo o contato. Obrigado.`);
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
    alert(`Mensagem enviada com sucesso! \nNome: ${formName}\nEmail: ${formEmail}`);
    // Aqui você conectaria com seu backend para enviar o email real
  };

  const formatCurrency = (val?: number) => val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val) : 'Consulte-nos';

  if (loading) return <div style={{padding: 50, textAlign:'center', color:'#fff', background:'#121212', height:'100vh'}}>Carregando...</div>;
  if (!property) return <div style={{padding: 50, textAlign:'center', color:'#fff'}}>Imóvel não encontrado.</div>;

  return (
    <div className="details-container">
      
      <div className="details-content-wrapper">
        
        {/* === ESQUERDA: GALERIA E DESCRIÇÃO === */}
        <div className="details-left-col">
            
            {/* Galeria (Código Igual) */}
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

            {/* Descrição Texto Longo */}
            <div className="description-section" style={{border: 'none', margin: 0, padding: 0}}>
                <h3 style={{color: '#fff', marginBottom: 15, fontSize: '1.5rem', fontWeight: 300}}>Sobre o Imóvel</h3>
                <p style={{whiteSpace: 'pre-line', color: '#ccc', lineHeight: 1.6}}>{property.description}</p>
            </div>

            {/* === CARACTERÍSTICAS (NOVO) === */}
            <div className="features-wrapper">
                
                {/* 1. Características do Imóvel */}
                {property.propertyFeatures && property.propertyFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Características do Imóvel</h4>
                        <div className="features-list">
                            {property.propertyFeatures.map((feat, i) => (
                                <div key={i} className="feature-item">
                                    <span className="feature-bullet">»</span> {feat.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Infraestrutura do Empreendimento */}
                {property.developmentFeatures && property.developmentFeatures.length > 0 && (
                    <div className="features-block">
                        <h4 className="features-title">Infraestrutura do Empreendimento</h4>
                        <div className="features-list">
                            {property.developmentFeatures.map((feat, i) => (
                                <div key={i} className="feature-item">
                                    <span className="feature-bullet">»</span> {feat.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>

        {/* === DIREITA: SIDEBAR === */}
        <aside className="details-right-col">
            
            {/* Info Básica */}
            <div className="info-header">
                <h1 className="prop-location">{property.address?.city} - {property.address?.neighborhood}</h1>
                <h2 className="prop-title-small">
                    {property.title} <span style={{color:'#666'}}>#{property.id}</span>
                </h2>
            </div>

            {/* Ícones */}
            <div className="specs-list">
                <div className="spec-row"><span className="spec-icon"><FaBed/></span> <strong>{property.bedrooms}</strong> dormitórios ({property.suites} suítes)</div>
                <div className="spec-row"><span className="spec-icon"><FaCar/></span> <strong>{property.garageSpots}</strong> vagas</div>
                <div className="spec-row"><span className="spec-icon"><FaBath/></span> <strong>{property.bathrooms}</strong> banheiros</div>
                <div className="spec-row"><span className="spec-icon"><FaRulerCombined/></span> <strong>{property.privateArea}m²</strong> privativos</div>
            </div>

            {/* Preço */}
            <div className="price-tag">
                {formatCurrency(Number(property.price))}
            </div>

            {/* Botão Whatsapp (Verde) */}
            <button className="btn-whatsapp-large" onClick={handleWhatsApp}>
                <FaWhatsapp size={22} /> Mais Informações via WhatsApp
            </button>

            {/* Ações Extras */}
            <div className="actions-row">
                <button className="action-link"><FaRegStar /> Adicionar aos Favoritos</button>
                <button className="action-link"><FaPrint /> Imprimir</button>
                <button className="action-link"><FaDollarSign /> Financiamentos</button>
            </div>

            {/* Separador */}
            <div className="sidebar-separator"></div>

            {/* === FORMULÁRIO DE CONTATO (DARK) === */}
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
                        <span className="required-text">* campos obrigatórios</span>
                        <button type="submit" className="btn-send">
                            enviar <FaAngleDoubleRight />
                        </button>
                    </div>

                    <div className="privacy-text">
                        <FaLock size={10} /> Ao enviar você está aceitando a <span className="privacy-link">política de privacidade</span>.
                    </div>

                    

                </form>
            </div>

        </aside>

      </div>
    </div>
  );
}