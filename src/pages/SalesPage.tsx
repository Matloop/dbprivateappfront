import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SidebarFilter } from '../components/SidebarFilter';
import { PropertyCard } from '../components/PropertyCard';
import { Navbar } from '../components/Navbar';
import { Breadcrumb } from '../components/Breadcrumb'; // <--- IMPORTAR
import './SalesPage.css';

export const SalesPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [initialFilters, setInitialFilters] = useState<any>(null);

  const currentCity = searchParams.get('city');
  const currentNeigh = searchParams.get('neighborhood');
  const currentType = searchParams.get('types');

  // --- LÓGICA DO BREADCRUMB ---
  const getBreadcrumbItems = () => {
    const items = [{ label: 'Vendas', path: '/vendas' }];

    if (currentType) {
        items.push({ 
            label: currentType.charAt(0).toUpperCase() + currentType.slice(1).toLowerCase() + 's',
            path: `/vendas?types=${currentType}`
        });
    }

    if (currentCity) {
        let cityPath = `/vendas?city=${currentCity}`;
        if (currentType) cityPath += `&types=${currentType}`;
        
        items.push({ 
            label: currentCity, 
            path: cityPath 
        });
    }

    if (currentNeigh) {
        // O último item não precisa de path, mas colocamos por padrão
        items.push({ label: currentNeigh, path: '' });
    }

    return items;
  };

  useEffect(() => {
    const filters: any = {};
    if (currentCity) filters.city = currentCity;
    if (currentNeigh) filters.neighborhood = currentNeigh;
    if (currentType) filters.types = [currentType];
    setInitialFilters(filters);
    fetchProperties(filters);
  }, [searchParams]);

  const fetchProperties = async (filters: any = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        const val = filters[key];
        if (val) {
            if (Array.isArray(val)) val.forEach(v => params.append(key, v));
            else params.append(key, String(val));
        }
      });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/properties?${params.toString()}`);
      if (res.ok) setProperties(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="sales-page-container">
      
      {/* --- AQUI ENTRA O COMPONENTE MODULARIZADO --- */}
      <Breadcrumb items={getBreadcrumbItems()} />

      <div className="sales-main-layout">
        <div className="sales-grid-area">
          {loading ? (
            <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Carregando...</div>
          ) : (
            <div className="sales-grid">
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
              {properties.length === 0 && !loading && (
                <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: '#666', border: '1px dashed #333' }}>
                  Nenhum imóvel encontrado.
                </div>
              )}
            </div>
          )}
        </div>
        <SidebarFilter initialFilters={initialFilters} onFilterChange={fetchProperties} />
      </div>
    </div>
  );
};