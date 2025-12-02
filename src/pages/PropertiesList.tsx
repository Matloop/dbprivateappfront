import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Ajuste o caminho se necessário

// Definição da tipagem básica para o Front
interface Property {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  images: { url: string; isCover: boolean }[];
  address?: {
    city: string;
    state: string;
    neighborhood: string;
  };
}

export function PropertiesList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. BUSCAR DADOS ---
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const response = await fetch('http://127.0.0.1:3000/properties', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Se sua rota for protegida
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error("Erro ao buscar imóveis");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FORMATADORES ---
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return '#28a745'; // Verde
      case 'VENDIDO': return '#dc3545';    // Vermelho
      case 'RESERVADO': return '#ffc107';  // Amarelo
      default: return '#6c757d';
    }
  };

  // --- 3. RENDERIZAÇÃO ---
  return (
    <div style={{ padding: '20px', background: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'sans-serif' }}>
      
      {/* Header da Página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#fff' }}>Gestão de Imóveis</h1>
        <button 
          onClick={() => navigate('/properties/new')} // Ajuste a rota para seu form de criação
          style={{ 
            background: '#d4af37', 
            color: '#000', 
            border: 'none', 
            padding: '10px 20px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          + Criar Imóvel
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Carregando imóveis...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#333', textAlign: 'left', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>Imagem</th>
                <th style={{ padding: '15px' }}>Ref</th>
                <th style={{ padding: '15px' }}>Título / Local</th>
                <th style={{ padding: '15px' }}>Categoria</th>
                <th style={{ padding: '15px' }}>Situação</th>
                <th style={{ padding: '15px' }}>Valor</th>
                <th style={{ padding: '15px' }}>Data</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    Nenhum imóvel cadastrado.
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} style={{ borderBottom: '1px solid #333' }}>
                    {/* Imagem (Pega a primeira ou placeholder) */}
                    <td style={{ padding: '10px', width: '80px' }}>
                      <div style={{ width: '80px', height: '60px', background: '#444', borderRadius: '4px', overflow: 'hidden' }}>
                        {prop.images && prop.images.length > 0 ? (
                          <img 
                            src={prop.images[0].url} 
                            alt="capa" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>
                            Sem Foto
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ID / Referência */}
                    <td style={{ padding: '10px', color: '#888' }}>#{prop.id}</td>

                    {/* Título e Localização */}
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{prop.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '4px' }}>
                        {prop.subtitle}
                      </div>
                      {prop.address && (
                        <div style={{ fontSize: '0.75rem', color: '#d4af37', marginTop: '4px' }}>
                          📍 {prop.address.neighborhood} - {prop.address.city}/{prop.address.state}
                        </div>
                      )}
                    </td>

                    {/* Categoria */}
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {prop.category}
                      </span>
                    </td>

                    {/* Status (Badge Colorida) */}
                    <td style={{ padding: '10px' }}>
                      <span style={{ 
                        color: getStatusColor(prop.status), 
                        border: `1px solid ${getStatusColor(prop.status)}`,
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {prop.status}
                      </span>
                    </td>

                    {/* Valor */}
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>
                      {formatCurrency(Number(prop.price))}
                    </td>

                    {/* Data Cadastro */}
                    <td style={{ padding: '10px', fontSize: '0.85rem', color: '#ccc' }}>
                      {formatDate(prop.createdAt)}
                    </td>

                    {/* Ações */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/properties/edit/${prop.id}`)}
                        style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}