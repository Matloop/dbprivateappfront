import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SidebarFilter.css';

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

  // Debounce: Aguarda 600ms após a última alteração para disparar a busca
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

  // Handler genérico para inputs de texto e número
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handler para Checkboxes (Arrays)
  const handleCheckbox = (group: 'types' | 'negotiation', value: string) => {
    setFilters(prev => {
      const list = prev[group];
      return list.includes(value)
        ? { ...prev, [group]: list.filter(item => item !== value) } // Remove
        : { ...prev, [group]: [...list, value] }; // Adiciona
    });
  };

  // Handler para Botões de Garagem (Toggle)
  const handleGarage = (num: number) => {
    setFilters(prev => ({ 
      ...prev, 
      garageSpots: prev.garageSpots === num ? 0 : num // Se clicar no mesmo, desmarca
    }));
  };

  return (
    <aside className="sidebar-filter">
      
      {/* 1. BUSCA POR TEXTO */}
      <div className="filter-group header-group">
        <h3 className="filter-title-main">Encontre seu Imóvel</h3>
        <div className="search-input-wrapper">
          <input 
            type="text" 
            name="search" 
            placeholder="Ref, título ou edifício..." 
            className="dark-input" 
            style={{ paddingRight: '35px' }} // Espaço para a lupa
            onChange={handleChange}
          />
          <FaSearch className="search-icon"/>
        </div>
      </div>

      {/* 2. LOCALIZAÇÃO */}
      <div className="filter-group">
        <h4 className="filter-subtitle">LOCALIZAÇÃO</h4>
        <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: 5 }}>Cidade</label>
            <select name="city" className="dark-select" onChange={handleChange}>
                <option value="">Todas as cidades</option>
                <option value="Balneário Camboriú">Balneário Camboriú</option>
                <option value="Itapema">Itapema</option>
                <option value="Itajaí">Itajaí</option>
            </select>
        </div>
        <div>
            <label style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: 5 }}>Bairros</label>
            <select name="neighborhood" className="dark-select" onChange={handleChange}>
                <option value="">Todos os bairros</option>
                <option value="Centro">Centro</option>
                <option value="Barra Sul">Barra Sul</option>
                <option value="Barra Norte">Barra Norte</option>
                <option value="Pioneiros">Pioneiros</option>
            </select>
        </div>
      </div>

      {/* 3. TIPO DE IMÓVEL */}
      <div className="filter-group">
        <h4 className="filter-subtitle">TIPO DE IMÓVEL</h4>
        <div className="checkbox-list">
          {['APARTAMENTO', 'CASA', 'COBERTURA', 'TERRENO', 'SALA_COMERCIAL'].map(type => (
            <label key={type} className="checkbox-item">
              <input 
                type="checkbox" 
                checked={filters.types.includes(type)}
                onChange={() => handleCheckbox('types', type)} 
              />
              <span>{type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. NEGOCIAÇÃO */}
      <div className="filter-group">
        <h4 className="filter-subtitle">NEGOCIAÇÃO</h4>
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input type="checkbox" onChange={() => handleCheckbox('negotiation', 'exclusivo')} />
            <span>Exclusivo</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" onChange={() => handleCheckbox('negotiation', 'permuta')} />
            <span>Aceita permuta</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" onChange={() => handleCheckbox('negotiation', 'financiamento')} />
            <span>Aceita financiamento</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" onChange={() => handleCheckbox('negotiation', 'veiculo')} />
            <span>Aceita veículo</span>
          </label>
        </div>
      </div>

      {/* 5. ESTÁGIO DA OBRA */}
      <div className="filter-group">
        <h4 className="filter-subtitle">ESTÁGIO DA OBRA</h4>
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input 
                type="checkbox" 
                checked={filters.stage === 'LANCAMENTO'} 
                onChange={() => setFilters(p => ({...p, stage: p.stage === 'LANCAMENTO' ? '' : 'LANCAMENTO'}))} 
            />
            <span>Lançamento</span>
          </label>
          <label className="checkbox-item">
            <input 
                type="checkbox" 
                checked={filters.stage === 'EM_OBRA'} 
                onChange={() => setFilters(p => ({...p, stage: p.stage === 'EM_OBRA' ? '' : 'EM_OBRA'}))} 
            />
            <span>Em Construção</span>
          </label>
          <label className="checkbox-item">
            <input 
                type="checkbox" 
                checked={filters.stage === 'PRONTO'} 
                onChange={() => setFilters(p => ({...p, stage: p.stage === 'PRONTO' ? '' : 'PRONTO'}))} 
            />
            <span>Pronto para morar</span>
          </label>
        </div>
      </div>

      {/* 6. VAGAS DE GARAGEM */}
      <div className="filter-group">
        <h4 className="filter-subtitle">VAGAS DE GARAGEM</h4>
        <div className="garage-buttons">
          {[1, 2, 3, 4, 5].map(num => (
            <button 
              key={num} 
              className={`garage-btn ${filters.garageSpots === num ? 'active' : ''}`}
              onClick={() => handleGarage(num)}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* 7. FAIXA DE PREÇO */}
      <div className="filter-group">
        <h4 className="filter-subtitle">FAIXA DE PREÇO</h4>
        <div className="range-inputs">
          <div className="range-input-wrapper">
            <span className="range-symbol">R$</span>
            <input 
                type="number" 
                name="minPrice" 
                placeholder="Mínimo" 
                className="range-input-field price" 
                onChange={handleChange}
            />
          </div>
          <div className="range-input-wrapper">
            <span className="range-symbol">R$</span>
            <input 
                type="number" 
                name="maxPrice" 
                placeholder="Máximo" 
                className="range-input-field price" 
                onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* 8. ÁREA TOTAL */}
      <div className="filter-group" style={{ borderBottom: 'none' }}>
        <h4 className="filter-subtitle">ÁREA TOTAL</h4>
        <div className="range-inputs">
          <div className="range-input-wrapper">
            <input 
                type="number" 
                name="minArea" 
                placeholder="Mínima" 
                className="range-input-field area" 
                onChange={handleChange}
            />
            <span className="area-symbol">m²</span>
          </div>
          <div className="range-input-wrapper">
            <input 
                type="number" 
                name="maxArea" 
                placeholder="Máxima" 
                className="range-input-field area" 
                onChange={handleChange}
            />
            <span className="area-symbol">m²</span>
          </div>
        </div>
      </div>

    </aside>
  );
};