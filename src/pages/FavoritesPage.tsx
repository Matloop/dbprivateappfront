import { useEffect, useState } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { useFavorites } from '../hooks/useFavorites';
import { FaHeartBroken } from 'react-icons/fa';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([]);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Chama o backend passando os IDs separados por vírgula
        const res = await fetch(`${import.meta.env.VITE_API_URL}/properties?ids=${favorites.join(',')}`);
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

    fetchFavorites();
  }, [favorites]); // Recarrega se a lista de favoritos mudar

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      
      
      <div style={{ padding: '30px 5%', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0, color: '#d4af37', fontSize: '1.8rem', fontWeight: 300 }}>Meus Favoritos</h2>
      </div>
        
      <div style={{ padding: '30px 5%' }}>
        {loading ? (
          <div style={{ color: '#888' }}>Carregando favoritos...</div>
        ) : properties.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '25px' 
          }}>
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <FaHeartBroken size={50} style={{ marginBottom: 15, opacity: 0.5 }} />
            <h3>Sua lista de favoritos está vazia.</h3>
            <p>Navegue pelos imóveis e clique no coração para salvar.</p>
            <a href="/vendas" style={{ color: '#d4af37', textDecoration: 'none', marginTop: 10, display: 'inline-block' }}>Ir para Vendas</a>
          </div>
        )}
      </div>
    </div>
  );
};