import React from 'react';
import { FaMapMarkerAlt, FaBed, FaShower, FaCar, FaRulerCombined, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number;
    category: string; // Adicionado: Obrigatório para montar "Apartamento no Edifício X"
    address?: { city: string; neighborhood: string };
    images: { url: string }[];
    
    // Campos da tarja
    badgeText?: string;
    badgeColor?: string;
    
    // Edifício
    buildingName?: string;

    // Features
    bedrooms: number;
    bathrooms: number;
    garageSpots: number;
    privateArea: number;
    totalArea: number;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // Define a cor de fundo: usa a do banco ou um preto padrão se não tiver cor definida
  const badgeStyle = {
    backgroundColor: property.badgeColor || 'rgba(20, 20, 20, 0.9)'
  };

  return (
    <div className="property-card" onClick={() => navigate(`/imovel/${property.id}`)} style={{ cursor: 'pointer' }}>

      {/* 1. CONTAINER DA FOTO + TARJA */}
      <div className="card-image-container">
        {/* Imagem (Pega a primeira ou um placeholder) */}
        <img
          src={property.images[0]?.url || 'https://via.placeholder.com/400x300?text=Sem+Foto'}
          alt={property.title}
          className="card-image"
        />

        {/* --- A TARJA (BADGE) --- */}
        {property.badgeText && (
          <div className="card-badge" style={badgeStyle}>
            {property.badgeText}
          </div>
        )}
      </div>

      {/* 2. CONTEÚDO */}
      <div className="card-content">

        {/* Localização */}
        <div className="card-location">
          <FaMapMarkerAlt size={12} color="#ccc" />
          {property.address?.city} – {property.address?.neighborhood}
        </div>

        {/* TÍTULO INTELIGENTE */}
        {/* Se tiver Edifício: Mostra "Apartamento no Edifício X" */}
        {/* Se não tiver: Mostra o título original cadastrado */}
        <h3 className="card-title">
          {property.buildingName
            ? `${property.category} no ${property.buildingName}`
            : property.title}
        </h3>

        {/* SUBTÍTULO (Se tiver edifício, mostra o título original embaixo para complementar) */}
        {property.buildingName && (
             <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '-4px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {property.title}
             </div>
        )}

        {/* Ícones (Dorm, Banho, Vaga, Área) */}
        <div className="card-features">
          <div className="feature-item" title="Dormitórios">
            <span style={{ fontWeight: 'bold' }}>{property.bedrooms}</span> <FaBed />
          </div>
          <div className="feature-item" title="Banheiros">
            <span style={{ fontWeight: 'bold' }}>{property.bathrooms}</span> <FaShower />
          </div>
          <div className="feature-item" title="Vagas">
            <span style={{ fontWeight: 'bold' }}>{property.garageSpots}</span> <FaCar />
          </div>
          <div className="feature-item" title="Área Privativa">
            <span style={{ fontStyle: 'italic' }}>{property.privateArea}</span> <span style={{ fontSize: 10 }}>m²</span> <FaRulerCombined />
          </div>
          {/* Área Total */}
          {property.totalArea > 0 && (
            <div className="feature-item" title="Área Total" style={{ opacity: 0.6 }}>
                <span style={{ fontStyle: 'italic' }}>{property.totalArea}</span> <span style={{ fontSize: 10 }}>t</span>
            </div>
          )}
        </div>

        {/* Rodapé (Preço e Favorito) */}
        <div className="card-footer">
          <div className="card-price">
            {formatCurrency(Number(property.price))}
          </div>
          <FaRegStar size={18} color="#ccc" style={{ cursor: 'pointer' }} />
        </div>

      </div>
    </div>
  );
};