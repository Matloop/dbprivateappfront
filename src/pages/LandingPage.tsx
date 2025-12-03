import React, { useEffect, useState } from 'react';
import './LandingPage.css';

// Ícones
import { 
  FaPhoneAlt, FaWhatsapp, FaInstagram, FaStar, FaChevronDown, 
  FaHome, FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaCar, FaRulerCombined, FaRegStar 
} from 'react-icons/fa';

// --- TIPAGEM ---
interface Property {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  category: string;
  address?: {
    city: string;
    state: string;
    neighborhood: string;
  };
  bedrooms: number;
  suites: number;
  garageSpots: number;
  privateArea: number;
  images: { url: string; isCover: boolean }[];
}

export function LandingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar Imóveis da API
  useEffect(() => {
    fetch('http://127.0.0.1:3000/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar imóveis:", err));
  }, []);

  const formatCurrency = (value: number) => {
    if (!value) return "Consulte-nos";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="landing-container">
      
      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="info-item">CRECI/SC 4.109-J - Balneário Camboriú / SC</span>
        </div>
        <div className="top-bar-right">
          <div className="info-item"><FaPhoneAlt size={12} /><span>(47) 9.9653-5489</span></div>
          <div className="info-item"><FaWhatsapp size={14} /><span>WhatsApp</span></div>
          <div className="info-item"><FaInstagram size={16} /></div>
        </div>
      </div>

      {/* 2. HEADER */}
      <nav className="main-header">
        <div className="logo-container">
            <img src='src/assets/logo2025.png'></img>
        </div>
        <div className="nav-menu">
          <div className="home-btn"><FaHome color="#fff" /></div>
          <a href="#" className="nav-link">Sobre</a>
          <a href="#" className="nav-link">Vendas</a>
          <a href="#" className="nav-link">Contato</a>
          <FaSearch className="search-btn" />
        </div>
      </nav>

      {/* 3. HERO BANNER */}
      <div className="hero-section" style={{ 
          backgroundImage: 'url("https://dwvimages.s3.amazonaws.com/images/developments/36f8314f-40ca-425c-8d7f-c686b30315d3/personal/10e47f16addab819a670c74ce25d448d84cc403b8c156fed5fc4b5e7b0dd23ad.png")' 
      }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Exclusividade e Sofisticação</h1>
          <p className="hero-subtitle">EM BALNEÁRIO CAMBORIÚ</p>
        </div>
      </div>

      {/* 4. BUSCA (FLUTUANTE) */}
      <div className="search-section">
        <h2 className="search-title">Encontre seu Imóvel!</h2>
        <div className="search-box">
          <select className="search-select">
            <option>Todos os Imóveis</option>
            <option>Apartamento</option>
            <option>Casa</option>
          </select>
          
          <select className="search-select">
            <option>Todos os Valores</option>
            <option>Até R$ 1.000.000</option>
            <option>Acima de R$ 5.000.000</option>
          </select>

          <div className="search-input-group">
            <input type="text" className="search-input" placeholder="Digite a cidade ou bairro..." />
            <FaMapMarkerAlt className="input-icon" />
          </div>

          <button className="search-submit-btn">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* 5. LISTAGEM DE IMÓVEIS */}
      <section className="properties-section">
        <div className="section-header">
          <h2>Imóveis com Alta Procura</h2>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', color: '#666'}}>Carregando oportunidades...</p>
        ) : (
          <div className="properties-grid">
            {properties.slice(0, 8).map(prop => ( // Mostra apenas os 8 primeiros
              <div key={prop.id} className="property-card">
                
                {/* Imagem + Badge */}
                <div className="card-image-container">
                  <img 
                    src={prop.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Sem+Foto'} 
                    alt={prop.title} 
                    className="card-img" 
                  />
                  <span className="card-badge">
                    {prop.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="card-content">
                  <div className="card-location">
                    <FaMapMarkerAlt size={12} />
                    {prop.address?.city} - {prop.address?.neighborhood}
                  </div>
                  
                  <h3 className="card-title" title={prop.title}>
                    {prop.title}
                  </h3>

                  {/* Especificações (Ícones) */}
                  <div className="card-specs">
                    <div className="spec-item" title="Dormitórios">
                      <FaBed /> <span>{prop.bedrooms}</span>
                    </div>
                    <div className="spec-item" title="Suítes">
                      <FaBath /> <span>{prop.suites}</span>
                    </div>
                    <div className="spec-item" title="Vagas">
                      <FaCar /> <span>{prop.garageSpots}</span>
                    </div>
                    <div className="spec-item" title="Área Privativa">
                      <FaRulerCombined /> <span>{prop.privateArea}m²</span>
                    </div>
                  </div>

                  {/* Preço e Favorito */}
                  <div className="card-footer">
                    <span className="card-price">
                      {formatCurrency(Number(prop.price))}
                    </span>
                    <FaRegStar className="card-fav-icon" size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}