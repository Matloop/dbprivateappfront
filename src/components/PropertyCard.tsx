import React from 'react';
import { FaMapMarkerAlt, FaBed, FaShower, FaCar, FaRulerCombined, FaRegStar, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import './PropertyCard.css';

// 1. Definição do objeto de dados (O Imóvel em si)
export interface Property {
  id: number;
  title: string;
  price: number;
  category: string;
  address?: { city: string; neighborhood: string };
  images: { url: string }[];
  badgeText?: string;
  badgeColor?: string;
  buildingName?: string;
  bedrooms: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number;
  totalArea: number;
}

// 2. Definição das Props do Componente (O que o componente recebe do pai)
// O componente espera receber um atributo chamado 'property' que contém os dados acima
interface PropertyCardProps {
  property: Property;
}

// 3. O Componente
export const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  
  // Hook de favoritos (tenta usar, se der erro de contexto ignora visualmente)
  let isFavorite = (_id: number) => false;
  let toggleFavorite = (_id: number) => {};

  try {
    const favHook = useFavorites();
    isFavorite = favHook.isFavorite;
    toggleFavorite = favHook.toggleFavorite;
  } catch (e) {
    // Caso o hook seja usado fora do provider, evita crash
  }

  const favorite = isFavorite(property.id);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const badgeStyle = {
    backgroundColor: property.badgeColor || 'rgba(20, 20, 20, 0.9)'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <div className="property-card" onClick={() => navigate(`/imovel/${property.id}`)}>

      <div className="card-image-container">
        <img
          src={property.images && property.images.length > 0 ? property.images[0].url : 'https://via.placeholder.com/400x300?text=Sem+Foto'}
          alt={property.title}
          className="card-image"
        />

        {property.badgeText && (
          <div className="card-badge" style={badgeStyle}>
            {property.badgeText}
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-location">
          <FaMapMarkerAlt size={12} color="#ccc" />
          {property.address?.city} – {property.address?.neighborhood}
        </div>

        <h3 className="card-title">
          {property.buildingName
            ? `${property.category} no ${property.buildingName}`
            : property.title}
        </h3>

        {property.buildingName && (
             <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '-4px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {property.title}
             </div>
        )}

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
        </div>

        <div className="card-footer">
          <div className="card-price">
            {formatCurrency(Number(property.price))}
          </div>
          
          <div onClick={handleFavoriteClick} style={{ cursor: 'pointer' }}>
            {favorite ? (
                <FaStar size={18} color="#d4af37" />
            ) : (
                <FaRegStar size={18} color="#ccc" />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};