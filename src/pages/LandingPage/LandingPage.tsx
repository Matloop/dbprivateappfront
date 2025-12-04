import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { PropertyCard, type Property } from '../../components/PropertyCard';
import './LandingPage.css';

export function LandingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os imóveis
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/properties`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao buscar imóveis:", err));
  }, []);

  return (
    <div className="landing-container">
      
      {/* 1. BARRA DE PESQUISA (Alinhada à Esquerda, Sem Imagem) */}
      <div className="search-left-container">
        <div className="search-box-flat">
          
          <h3 className="search-label-title">Encontre seu Imóvel</h3>
          
          <div className="search-inputs-row">
            {/* Select 1 */}
            <select className="search-select">
              <option>Todos os Imóveis</option>
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Cobertura</option>
            </select>
            
            {/* Select 2 */}
            <select className="search-select">
              <option>Todos os Valores</option>
              <option>Até R$ 1.000.000</option>
              <option>R$ 1M a R$ 3M</option>
              <option>Acima de R$ 3.000.000</option>
            </select>

            {/* Input de Texto */}
            <div className="search-input-group">
              <input 
                type="text" 
                className="search-input" 
                placeholder="digite a cidade ou bairro..." 
              />
              <FaMapMarkerAlt className="input-icon" />
            </div>

            {/* Botão de Busca */}
            <button className="search-btn-submit">
              <FaSearch />
            </button>
          </div>

        </div>
      </div>

      {/* 2. VITRINE DE IMÓVEIS */}
      <section className="landing-content">
        
        <div className="section-title-bar">
          <h2>Imóveis com Alta Procura</h2>
        </div>

        {loading ? (
          <p style={{color: '#666', textAlign: 'center'}}>Carregando oportunidades...</p>
        ) : (
          <div className="properties-grid">
            {properties.slice(0, 4).map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

      </section>

      {/* Seção Extra */}
      <section className="landing-content" style={{paddingTop: 0}}>
        <div className="section-title-bar">
          <h2>Imóveis na Planta</h2>
        </div>
        <div style={{color: '#444'}}>Em breve...</div>
      </section>

    </div>
  );
}