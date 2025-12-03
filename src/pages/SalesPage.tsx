import { useEffect, useState } from 'react';
import { PropertyCard, type Property } from '../components/PropertyCard';
import { FaTh, FaList, FaSearch } from 'react-icons/fa';
import './SalesPage.css'; // Certifique-se que o CSS que mandei antes está aqui

export function SalesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros (Estado para UI)
  const [filters, setFilters] = useState({
    bedrooms: null as number | null,
    suites: null as number | null,
    garages: null as number | null,
  });

  // Busca Imóveis
  useEffect(() => {
    // Usando IP direto para evitar delay de DNS local
    fetch('http://127.0.0.1:3000/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, []);

  // Helpers para renderizar botões e checkbox
  const renderNumberButtons = (field: 'bedrooms' | 'suites' | 'garages', currentValue: number | null) => (
    <div className="number-btn-group">
      {[1, 2, 3, 4, 5].map(num => (
        <button
          key={num}
          className={`number-btn ${currentValue === num ? 'active' : ''}`}
          onClick={() => setFilters(prev => ({ ...prev, [field]: prev[field] === num ? null : num }))}
        >
          {num}+
        </button>
      ))}
    </div>
  );

  const renderCheckbox = (label: string, count?: number) => (
    <label className="checkbox-row">
      <div className="checkbox-label">
        <input type="checkbox" style={{ accentColor: '#d4af37' }} />
        <span>{label}</span>
      </div>
      {count !== undefined && <span className="checkbox-count">{count}</span>}
    </label>
  );

  return (
    <div className="sales-page-container">
      
      {/* HEADER INTERNO (Breadcrumb e Título) */}
      <div className="sales-header-bar">
        <div>
           <h1 style={{fontSize: '1.8rem', fontWeight: 300, color: '#d4af37', margin: 0}}>Imóveis à Venda</h1>
           <span className="breadcrumb">Home / Vendas</span>
        </div>
        <div style={{color: '#888', fontSize: '0.9rem'}}>
            <strong>{properties.length}</strong> imóveis encontrados
        </div>
      </div>

      <div className="sales-main-layout">
        
        {/* --- GRID DE IMÓVEIS (ESQUERDA) --- */}
        <main className="sales-grid-area">
            
            {/* Barra de Ordenação */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center', fontSize: '0.9rem', color: '#888'}}>
                <div style={{display:'flex', gap: 10, alignItems: 'center'}}>
                    Ordenar por: 
                    <select style={{background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding: '5px 10px', borderRadius: 4}}>
                        <option>DATA MAIS RECENTE</option>
                        <option>MAIOR PREÇO</option>
                        <option>MENOR PREÇO</option>
                    </select>
                </div>
                <div style={{display:'flex', gap: 10}}>
                    <FaTh color="#fff" cursor="pointer" title="Grade"/>
                    <FaList color="#444" cursor="pointer" title="Lista"/>
                </div>
            </div>

            {loading ? (
                <p style={{color: '#fff'}}>Carregando imóveis...</p>
            ) : (
                <div className="sales-grid">
                    {properties.map(prop => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            )}
        </main>

        {/* --- SIDEBAR DE FILTROS (DIREITA) --- */}
        <aside className="sales-sidebar">
            <div className="sidebar-header">
                <h3>Encontre seu Imóvel</h3>
            </div>

            {/* Busca Texto */}
            <div className="filter-section">
                <div style={{position: 'relative'}}>
                    <input type="text" placeholder="busca por ref ou título..." className="filter-input" style={{paddingRight: 30}} />
                    <FaSearch style={{position: 'absolute', right: 10, top: 12, color: '#666'}} />
                </div>
            </div>

            {/* Localização */}
            <div className="filter-section">
                <div className="filter-title">LOCALIZAÇÃO</div>
                <label style={{display:'block', marginBottom:5, fontSize:'0.8rem', color:'#888'}}>Cidade</label>
                <select className="filter-select" style={{marginBottom: 10}}>
                    <option>QUALQUER</option>
                    <option>Balneário Camboriú</option>
                    <option>Itapema</option>
                </select>

                <label style={{display:'block', marginBottom:5, fontSize:'0.8rem', color:'#888'}}>Bairros</label>
                <select className="filter-select" disabled>
                    <option>Escolha a cidade...</option>
                </select>
            </div>

            {/* Tipo de Imóvel */}
            <div className="filter-section">
                <div className="filter-title">TIPO DE IMÓVEL</div>
                {renderCheckbox("Qualquer")}
                {renderCheckbox("Apartamentos (todos)", 75)}
                {renderCheckbox("Apartamento", 65)}
                {renderCheckbox("Cobertura", 1)}
                {renderCheckbox("Casa em Condomínio", 3)}
            </div>

            {/* Características */}
            <div className="filter-section">
                <div className="filter-title">CARACTERÍSTICAS</div>
                {renderCheckbox("Frente para o mar", 21)}
                {renderCheckbox("Quadra do Mar", 12)}
                {renderCheckbox("Mobiliado", 48)}
                {renderCheckbox("Alto Padrão", 72)}
            </div>

            {/* Dormitórios */}
            <div className="filter-section">
                <div className="filter-title">DORMITÓRIOS</div>
                {renderNumberButtons('bedrooms', filters.bedrooms)}
            </div>

            {/* Suítes */}
            <div className="filter-section">
                <div className="filter-title">SUÍTES</div>
                {renderNumberButtons('suites', filters.suites)}
            </div>

            {/* Garagens */}
            <div className="filter-section">
                <div className="filter-title">GARAGENS</div>
                {renderNumberButtons('garages', filters.garages)}
            </div>

            {/* Faixa de Preço */}
            <div className="filter-section">
                <div className="filter-title">FAIXA DE PREÇO</div>
                <div className="range-inputs">
                    <div className="range-input-wrapper">
                        <label style={{fontSize:'0.8rem', color:'#888', display:'block', marginBottom:5}}>Mínimo</label>
                        <span className="range-symbol">R$</span>
                        <input type="number" className="range-input-field" placeholder="" />
                    </div>
                    <div className="range-input-wrapper">
                        <label style={{fontSize:'0.8rem', color:'#888', display:'block', marginBottom:5}}>Máximo</label>
                        <span className="range-symbol">R$</span>
                        <input type="number" className="range-input-field" placeholder="ilimitado" />
                    </div>
                </div>
            </div>
            
            <div style={{padding: 15}}>
                <button style={{width: '100%', padding: '12px', background: '#d4af37', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: 4}}>
                    FILTRAR
                </button>
            </div>

        </aside>

      </div>
    </div>
  );
}