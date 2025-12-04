import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertiesList.css';

// --- INTERFACES ATUALIZADAS ---
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
  updatedAt: string;
  images: PropertyImage[];
  address?: {
    city: string;
    state: string;
    neighborhood: string;
  };
  // Novos campos para a tabela
  badgeText?: string;
  badgeColor?: string;
  bedrooms: number;
  suites: number;
  garageSpots: number;
}

export function PropertiesList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  // Estados da Galeria
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperties();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // --- FUNÇÕES ---
  const getFastToken = () => {
    const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    const sessionStr = storageKey ? localStorage.getItem(storageKey) : null;
    return sessionStr ? JSON.parse(sessionStr)?.access_token : null;
  };

  const fetchProperties = async () => {
    try {
      const token = getFastToken();
      // 127.0.0.1 para evitar delay do IPv6
      const response = await fetch('http://127.0.0.1:3000/properties', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportDwv = async () => {
    const inputText = window.prompt("Cole o ENDEREÇO e o LINK DO DWV (tudo junto):");
    if (!inputText) return;

    if (!inputText.includes('http')) {
      alert("O texto colado precisa conter um link (http...)");
      return;
    }

    setImporting(true);
    try {
      const token = getFastToken();
      const response = await fetch('http://127.0.0.1:3000/properties/import-dwv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: inputText })
      });

      if (response.ok) {
        alert("Imóvel importado com sucesso!");
        fetchProperties();
      } else {
        alert("Erro ao importar.");
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setImporting(false);
    }
  };

  // --- GALERIA ---
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
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIVEL': return '#28a745';
      case 'VENDIDO': return '#dc3545';
      case 'RESERVADO': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="properties-container">

      {/* HEADER */}
      <div className="properties-header">
        <h1>{importing ? '⏳ Importando...' : '🏢 Gestão de Imóveis'}</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleImportDwv} disabled={importing}>📥 Importar</button>
          <button className="btn btn-primary" onClick={() => navigate('/properties/new')} disabled={importing}>+ Novo Imóvel</button>
        </div>
      </div>

      {/* TABELA */}
      <div className="table-wrapper">
        <table className="properties-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Fotos</th>
              <th style={{ width: '60px' }}>Ref</th>

              {/* Coluna Imóvel cresce para ocupar espaço */}
              <th>Imóvel</th>

              {/* NOVAS COLUNAS */}
              <th style={{ width: '110px' }}>Config.</th>
              <th style={{ width: '130px' }}>Destaque</th>

              <th style={{ width: '100px' }}>Situação</th>
              <th style={{ width: '120px' }}>Valor</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Cadastro</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Atualização</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 && !loading && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 30, color: '#666' }}>
                  Nenhum imóvel cadastrado. Clique em <b>+ Novo Imóvel</b>.
                </td>
              </tr>
            )}

            {properties.map((prop) => (
              <tr key={prop.id} className="table-row">

                {/* 1. Foto */}
                <td>
                  <div className="thumbnail-container" onClick={() => openGallery(prop.images)}>
                    {prop.images && prop.images.length > 0 ? (
                      <>
                        <img src={prop.images[0].url} alt="capa" className="thumbnail-img" />
                        <div className="thumbnail-count">{prop.images.length}</div>
                      </>
                    ) : (
                      <div className="no-photo">Sem Foto</div>
                    )}
                  </div>
                </td>

                {/* 2. Referência */}
                <td style={{ color: '#666' }}>#{prop.id}</td>

                {/* 3. Imóvel (Limpo, sem tarja) */}
                <td>
                  <div className="property-title">{prop.title}</div>
                  <div className="property-subtitle">
                    {prop.address?.neighborhood} - {prop.category}
                  </div>
                </td>

                {/* 4. CONFIGURAÇÃO (Dormitórios e Vagas) */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>🛏</span>
                      {prop.bedrooms}
                      {prop.suites > 0 && <span style={{ fontSize: '0.75rem', color: '#888' }}>({prop.suites} st)</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>🚗</span> {prop.garageSpots}
                    </div>
                  </div>
                </td>

                {/* 5. TARJA / DESTAQUE (Nova Coluna) */}
                <td>
                  {prop.badgeText ? (
                    <div className="badge-tarja" style={{ backgroundColor: prop.badgeColor || '#555', justifyContent: 'center' }}>
                      {prop.badgeText}
                    </div>
                  ) : (
                    <span style={{ color: '#444', fontSize: '0.8rem' }}>-</span>
                  )}
                </td>

                {/* 6. Situação */}
                <td>
                  <span
                    className="status-badge"
                    style={{
                      color: getStatusColor(prop.status),
                      border: `1px solid ${getStatusColor(prop.status)}`
                    }}
                  >
                    {prop.status}
                  </span>
                </td>

                {/* 7. Valor */}
                <td className="price-text">{formatCurrency(Number(prop.price))}</td>

                {/* 8. Data */}
                <td style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ccc' }}>
                  {formatDateTime(prop.createdAt)}
                </td>

                <td style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ccc' }}>
                  {formatDateTime(prop.updatedAt)}
                </td>

                {/* 9. Ações */}
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn btn-primary btn-icon"
                    onClick={() => navigate(`/properties/edit/${prop.id}`)}
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- LIGHTBOX --- */}
      {isGalleryOpen && galleryImages.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setIsGalleryOpen(false)}>
          <button className="lightbox-close" onClick={() => setIsGalleryOpen(false)}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={galleryImages[currentImageIndex].url} alt="Galeria" className="lightbox-img" />
            {galleryImages.length > 1 && (
              <>
                <button className="lightbox-nav nav-prev" onClick={prevImage}>❮</button>
                <button className="lightbox-nav nav-next" onClick={nextImage}>❯</button>
              </>
            )}
            <div className="lightbox-counter">
              Imagem {currentImageIndex + 1} de {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}