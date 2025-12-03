import React from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaCar, FaRulerCombined, FaRegStar } from 'react-icons/fa';
import './PropertyCard.css'; // Importe o CSS criado acima
import { useNavigate } from 'react-router-dom';

// Definição da tipagem baseada no seu Backend
export interface Property {
  id: number;
  title: string;
  subtitle?: string; // Usaremos isso para aquele texto "CASA CLARENCE..."
  price: number;
  category: string;
  status: string;
  address?: {
    city: string;
    neighborhood: string;
    state: string;
  };
  bedrooms: number;
  suites: number;
  garageSpots: number;
  privateArea: number;
  images: { url: string; isCover: boolean }[];
  isExclusive?: boolean; // Para badge
  propertyFeatures?: { name: string }[];
  developmentFeatures?: { name: string }[];
}

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/imovel/${property.id}`);
  };
  // Formatador de Moeda
  const formatCurrency = (value: number) => {
    if (!value) return "Consulte";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  // Pega imagem de capa ou placeholder
  const coverImage = property.images?.find(i => i.isCover)?.url || property.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=Sem+Foto';

  return (
    <div className="db-card" onClick={goToDetails} style={{cursor: 'pointer'}}>
      
      {/* 1. Imagem e Overlays */}
      <div className="db-card-image-box">
        <img src={coverImage} alt={property.title} className="db-card-img" />
        
        {/* Texto sobreposto na imagem (Subtitle) - Ex: CASA CLARENCE... */}
        {property.subtitle && (
          <div className="db-badge-top-left">
            {property.subtitle}
          </div>
        )}

        {/* Badge de Status ou Exclusivo */}
        {property.isExclusive && (
            <div className="db-badge-top-right" style={{background: '#d4af37', color: '#000'}}>
                EXCLUSIVO
            </div>
        )}
        {!property.isExclusive && property.status !== 'DISPONIVEL' && (
             <div className="db-badge-top-right" style={{background: '#555'}}>
                {property.status}
             </div>
        )}
      </div>

      {/* 2. Conteúdo */}
      <div className="db-card-body">
        
        {/* Localização */}
        <div className="db-location">
          <FaMapMarkerAlt />
          <span>{property.address?.city} - {property.address?.neighborhood}</span>
        </div>

        {/* Título e Referência */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'flex-start'}}>
            <h3 className="db-title">{property.title}</h3>
            <span className="db-ref">#{property.id}</span>
        </div>

        {/* Ícones de Características (Linha tipo a da foto) */}
        <div className="db-features-row">
            {/* Dormitórios */}
            <div className="db-feature-item" title="Dormitórios">
                <span style={{fontWeight:'bold', color:'#fff'}}>{property.bedrooms}</span> <FaBed size={14} />
            </div>
            {/* Suítes (ícone chuveiro/banheira) */}
            <div className="db-feature-item" title="Suítes">
                <span style={{fontWeight:'bold', color:'#fff'}}>{property.suites}</span> <FaBath size={12} />
            </div>
            {/* Vagas */}
            <div className="db-feature-item" title="Vagas">
                <span style={{fontWeight:'bold', color:'#fff'}}>{property.garageSpots}</span> <FaCar size={14} />
            </div>
             {/* Área */}
             <div className="db-feature-item" title="Área Privativa">
                <span style={{fontWeight:'bold', color:'#fff'}}>{property.privateArea}</span> <span style={{fontSize:'0.7rem'}}>m²</span> <FaRulerCombined size={12} />
            </div>
        </div>

        {/* Preço e Footer */}
        <div className="db-card-footer">
          <div className="db-price">
            {formatCurrency(Number(property.price))}
          </div>
          <FaRegStar className="db-fav-icon" size={18} />
        </div>

      </div>
    </div>
  );
};