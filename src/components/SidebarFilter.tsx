import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
// O CSS já está sendo importado no SalesPage ou globalmente, 
// mas se quiser garantir: import '../pages/SalesPage.css';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

export const SidebarFilter = ({ onFilterChange }: FilterProps) => {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    neighborhood: '',
    types: [] as string[],
    negotiation: [] as string[],
    stage: '',
    garageSpots: 0,
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (group: 'types' | 'negotiation', value: string) => {
    setFilters(prev => {
      const list = prev[group];
      return list.includes(value)
        ? { ...prev, [group]: list.filter(item => item !== value) }
        : { ...prev, [group]: [...list, value] };
    });
  };

  return (
    <aside className="sales-sidebar">
      
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        <h3>Encontre seu Imóvel</h3>
        <div style={{position: 'relative', marginTop: 10}}>
            <input 
                type="text" 
                name="search" 
                placeholder="busca por ref ou título..." 
                className="filter-input" 
                style={{paddingRight: 30}}
                onChange={handleChange}
            />
            <FaSearch style={{position: 'absolute', right: 10, top: 10, color: '#666'}} />
        </div>
      </div>

      {/* Localização */}
      <div className="filter-section">
        <div className="filter-title">LOCALIZAÇÃO</div>
        <div style={{marginBottom: 10}}>
            <label style={{fontSize: '0.8rem', color:'#888', display:'block', marginBottom: 5}}>Cidade</label>
            <select name="city" className="filter-select" onChange={handleChange}>
                <option value="">Todas</option>
                <option value="Balneário Camboriú">Balneário Camboriú</option>
                <option value="Itapema">Itapema</option>
            </select>
        </div>
        <div>
            <label style={{fontSize: '0.8rem', color:'#888', display:'block', marginBottom: 5}}>Bairros</label>
            <select name="neighborhood" className="filter-select" onChange={handleChange}>
                <option value="">Escolha a cidade...</option>
                {/* Aqui você poderia carregar bairros dinamicamente */}
            </select>
        </div>
      </div>

      {/* Tipo de Imóvel */}
      <div className="filter-section">
        <div className="filter-title">TIPO DE IMÓVEL</div>
        {['APARTAMENTO', 'CASA', 'COBERTURA', 'TERRENO'].map(type => (
            <div key={type} className="checkbox-row" onClick={() => handleCheckbox('types', type)}>
                <div className="checkbox-label">
                    <input 
                        type="checkbox" 
                        checked={filters.types.includes(type)} 
                        onChange={() => {}} // Controlado pelo onClick da div
                        style={{accentColor: '#d4af37'}}
                    />
                    <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                </div>
                {/* <span className="checkbox-count">0</span>  <- Use se tiver contagem */}
            </div>
        ))}
      </div>

      {/* Características / Negociação */}
      <div className="filter-section">
        <div className="filter-title">CARACTERÍSTICAS</div>
        <div className="checkbox-row" onClick={() => handleCheckbox('negotiation', 'exclusivo')}>
            <div className="checkbox-label">
                <input type="checkbox" checked={filters.negotiation.includes('exclusivo')} onChange={()=>{}} style={{accentColor: '#d4af37'}}/>
                <span>Exclusivo</span>
            </div>
        </div>
        <div className="checkbox-row" onClick={() => handleCheckbox('negotiation', 'permuta')}>
            <div className="checkbox-label">
                <input type="checkbox" checked={filters.negotiation.includes('permuta')} onChange={()=>{}} style={{accentColor: '#d4af37'}}/>
                <span>Aceita Permuta</span>
            </div>
        </div>
        <div className="checkbox-row" onClick={() => handleCheckbox('negotiation', 'financiamento')}>
            <div className="checkbox-label">
                <input type="checkbox" checked={filters.negotiation.includes('financiamento')} onChange={()=>{}} style={{accentColor: '#d4af37'}}/>
                <span>Aceita Financiamento</span>
            </div>
        </div>
      </div>

      {/* Estágio da Obra */}
      <div className="filter-section">
        <div className="filter-title">ESTÁGIO DA OBRA</div>
        {['LANCAMENTO', 'EM_OBRA', 'PRONTO'].map(stg => (
             <div key={stg} className="checkbox-row" onClick={() => setFilters(p => ({...p, stage: p.stage === stg ? '' : stg}))}>
                <div className="checkbox-label">
                    <input type="checkbox" checked={filters.stage === stg} onChange={()=>{}} style={{accentColor: '#d4af37'}}/>
                    <span>{stg === 'EM_OBRA' ? 'Em Construção' : (stg === 'PRONTO' ? 'Pronto para morar' : 'Lançamento')}</span>
                </div>
            </div>
        ))}
      </div>

      {/* Vagas */}
      <div className="filter-section">
        <div className="filter-title">VAGAS DE GARAGEM</div>
        <div className="number-btn-group">
            {[1, 2, 3, 4, 5].map(num => (
                <button 
                    key={num} 
                    className={`number-btn ${filters.garageSpots === num ? 'active' : ''}`}
                    onClick={() => setFilters(p => ({...p, garageSpots: p.garageSpots === num ? 0 : num}))}
                >
                    {num}+
                </button>
            ))}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="filter-section">
        <div className="filter-title">FAIXA DE PREÇO</div>
        <div className="range-inputs">
            <div className="range-input-wrapper">
                <span className="range-symbol">R$</span>
                <input type="number" name="minPrice" placeholder="Mínimo" className="range-input-field" onChange={handleChange}/>
            </div>
            <div className="range-input-wrapper">
                <span className="range-symbol">R$</span>
                <input type="number" name="maxPrice" placeholder="Máximo" className="range-input-field" onChange={handleChange}/>
            </div>
        </div>
      </div>

      {/* Área Total */}
      <div className="filter-section" style={{borderBottom: 'none'}}>
        <div className="filter-title">ÁREA TOTAL</div>
        <div className="range-inputs">
            <div className="range-input-wrapper">
                <input type="number" name="minArea" placeholder="Mínima" className="range-input-field" style={{paddingLeft: 10}} onChange={handleChange}/>
                <span className="range-symbol" style={{left: 'auto', right: 10}}>m²</span>
            </div>
            <div className="range-input-wrapper">
                <input type="number" name="maxArea" placeholder="Máxima" className="range-input-field" style={{paddingLeft: 10}} onChange={handleChange}/>
                <span className="range-symbol" style={{left: 'auto', right: 10}}>m²</span>
            </div>
        </div>
      </div>

    </aside>
  );
};