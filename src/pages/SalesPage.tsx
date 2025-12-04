import React, { useState, useEffect } from 'react';
import { SidebarFilter } from '../components/SidebarFilter';
import { PropertyCard } from '../components/PropertyCard';
import { Navbar } from '../components/Navbar';
import './SalesPage.css'; // Importa o CSS que você mandou

export const SalesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async (filters: any = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) value.forEach(v => params.append(key, v));
          } else {
            if (typeof value === 'number' && value === 0) return;
            params.append(key, String(value));
          }
        }
      });

      // Lembre-se: use 127.0.0.1 para evitar delay local
      const res = await fetch(`${import.meta.env.VITE_API_URL}/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="sales-page-container">
      <Navbar />

      {/* Header opcional para Breadcrumb ou Título da Página */}
      <div className="sales-header-bar">
        <h2 style={{margin: 0, fontSize: '1.5rem', color: '#d4af37'}}>Imóveis à Venda</h2>
        <span className="breadcrumb">Home / Vendas</span>
      </div>

      <div className="sales-main-layout">
        
        {/* 1. ÁREA DE GRID (AGORA NA ESQUERDA) */}
        <div className="sales-grid-area">
          {loading ? (
            <div style={{ padding: 20, color: '#aaa' }}>Carregando imóveis...</div>
          ) : (
            <div className="sales-grid">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
              
              {properties.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', border: '1px dashed #333', borderRadius: 4, color: '#666' }}>
                  Nenhum imóvel encontrado com estes filtros.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. SIDEBAR (AGORA NA DIREITA) */}
        <SidebarFilter onFilterChange={(filters) => fetchProperties(filters)} />

      </div>
    </div>
  );
};