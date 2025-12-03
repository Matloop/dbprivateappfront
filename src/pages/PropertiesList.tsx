import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Interfaces
interface PropertyImage {
  url: string;
  isCover: boolean;
}

interface Property {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  images: PropertyImage[];
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
  const [importing, setImporting] = useState(false);

  // --- ESTADOS DA GALERIA ---
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperties();
    
    // Fecha modal com ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // --- FUNÇÕES DE DADOS ---
  const getFastToken = () => {
    const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    const sessionStr = storageKey ? localStorage.getItem(storageKey) : null;
    return sessionStr ? JSON.parse(sessionStr)?.access_token : null;
  };

  const fetchProperties = async () => {
    try {
      const token = getFastToken();
      const response = await fetch('http://127.0.0.1:3000/properties', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setProperties(await response.json());
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleImportDwv = async () => {
    const url = window.prompt("Cole o link do imóvel DWV:");
    if (!url || !url.startsWith('http')) return;

    setImporting(true);
    try {
      const token = getFastToken();
      const response = await fetch('http://127.0.0.1:3000/properties/import-dwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        alert("Imóvel importado! Fotos salvas localmente.");
        fetchProperties();
      } else {
        alert("Erro ao importar.");
      }
    } catch (e) { alert("Erro de conexão."); }
    finally { setImporting(false); }
  };

  // --- FUNÇÕES DA GALERIA ---
  const openGallery = (images: PropertyImage[]) => {
    if (!images.length) return;
    setGalleryImages(images);
    setCurrentImageIndex(0);
    setIsGalleryOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // --- FORMATADORES ---
  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return '#28a745';
      case 'VENDIDO': return '#dc3545';
      case 'RESERVADO': return '#ffc107';
      default: return '#6c757d';
    }
  };

  // Styles
  const headerStyle: React.CSSProperties = { padding: '10px', textAlign: 'left', fontSize: '0.75rem', color: '#888', borderBottom: '1px solid #444', background: '#1a1a1a' };
  const cellStyle: React.CSSProperties = { padding: '8px', fontSize: '0.85rem', color: '#e0e0e0', borderBottom: '1px solid #333', verticalAlign: 'middle' };

  return (
  <div style={{ 
    width: '100%',    // Ocupa 100% do pai (aba da Intranet)
    height: '100%',   // Ocupa 100% da altura disponível
    background: '#1a1a1a', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    fontFamily: 'sans-serif' 
  }}>
      
      {/* --- HEADER --- */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222' }}>
        <h1 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
          {importing ? '⏳ Importando e Comprimindo...' : '🏢 Gestão de Imóveis'}
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleImportDwv} disabled={importing} style={{ background: 'transparent', color: '#d4af37', border: '1px solid #d4af37', padding: '8px 16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
              📥 Importar DWV
            </button>
            <button onClick={() => navigate('/properties/new')} disabled={importing} style={{ background: '#d4af37', color: '#000', border: 'none', padding: '8px 16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
              + Novo
            </button>
            
        </div>
      </div>

      {/* --- TABELA --- */}
      <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ ...headerStyle, width: '70px' }}>Fotos</th>
                <th style={{ ...headerStyle, width: '60px' }}>Ref</th>
                <th style={headerStyle}>Imóvel</th>
                <th style={{ ...headerStyle, width: '100px' }}>Situação</th>
                <th style={{ ...headerStyle, width: '120px' }}>Valor</th>
                <th style={{ ...headerStyle, width: '80px' }}>Data</th>
                <th style={{ ...headerStyle, width: '50px' }}>#</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} style={{ transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#252525'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  
                  {/* FOTO CLICÁVEL (Abre Galeria) */}
                  <td style={cellStyle}>
                    <div 
                      onClick={() => openGallery(prop.images)}
                      style={{ 
                        width: '60px', height: '45px', background: '#333', borderRadius: '4px', overflow: 'hidden', 
                        cursor: 'pointer', position: 'relative', border: '1px solid #444' 
                      }}>
                      {prop.images && prop.images.length > 0 ? (
                        <>
                          <img src={prop.images[0].url} alt="capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {/* Badge de quantidade de fotos */}
                          <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '9px', padding: '1px 3px' }}>
                            {prop.images.length}
                          </div>
                        </>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666' }}>Sem Foto</div>
                      )}
                    </div>
                  </td>

                  <td style={{ ...cellStyle, color: '#666' }}>#{prop.id}</td>
                  <td style={cellStyle}>
                    <div style={{ fontWeight: '500', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40vw' }}>{prop.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      {prop.address?.neighborhood} - {prop.category}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ color: getStatusColor(prop.status), fontSize: '0.75rem', fontWeight: 'bold' }}>{prop.status}</span>
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 'bold', color: '#d4af37' }}>{formatCurrency(Number(prop.price))}</td>
                  <td style={cellStyle}>{formatDate(prop.createdAt)}</td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <button onClick={() => navigate(`/properties/edit/${prop.id}`)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      {/* --- MODAL DE GALERIA (LIGHTBOX) --- */}
      {isGalleryOpen && (
        <div 
          onClick={() => setIsGalleryOpen(false)}
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}
        >
          {/* Botão Fechar */}
          <button 
            onClick={() => setIsGalleryOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '30px', cursor: 'pointer' }}
          >
            &times;
          </button>

          {/* Área da Imagem */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }}
          >
            <img 
              src={galleryImages[currentImageIndex].url} 
              alt="Galeria" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} 
            />
            
            {/* Navegação */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  style={{ position: 'absolute', left: '-50px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '24px', padding: '10px', cursor: 'pointer', borderRadius: '50%' }}
                >
                  ❮
                </button>
                <button 
                  onClick={nextImage}
                  style={{ position: 'absolute', right: '-50px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '24px', padding: '10px', cursor: 'pointer', borderRadius: '50%' }}
                >
                  ❯
                </button>
              </>
            )}

            {/* Contador */}
            <div style={{ textAlign: 'center', color: '#fff', marginTop: '10px', fontSize: '0.9rem' }}>
              {currentImageIndex + 1} de {galleryImages.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}