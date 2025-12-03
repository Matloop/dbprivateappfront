import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom'; // Adicionado useParams

// Lista de características (mesma do banco)
const FEATURE_OPTIONS = [
  "Academia", "Piscina", "Elevador", "Salão de festas", "Playground", 
  "Brinquedoteca", "Sauna", "Spa", "Sala de jogos", "Espaço gourmet",
  "Portaria 24h", "Mobiliado", "Churrasqueira", "Ar Condicionado",
  "Vista Panorâmica", "Aquecimento a Gás", "Importado DWV"
];

export function NewProperty() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL (se existir)
  const isEditing = !!id; // Boolean: true se estiver editando

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'APARTAMENTO',
    transactionType: 'VENDA',
    status: 'DISPONIVEL',
    isExclusive: false,
    showOnSite: true,
    exclusivityDocUrl: '',
    registrationNumber: '',
    brokerNotes: '',
    description: '',
    price: '',
    condoFee: '',
    iptuPrice: '',
    bedrooms: '',
    suites: '',
    bathrooms: '',
    garageSpots: '',
    privateArea: '',
    totalArea: '',
    garageArea: '',
    constructionStartDate: '',
    deliveryDate: '',
    address: {
      zipCode: '',
      state: 'SC',
      city: 'Balneário Camboriú',
      neighborhood: '',
      street: '',
      number: '',
      complement: ''
    },
    features: [] as string[],
    tempImageUrl: '', 
    images: [] as { url: string, isCover: boolean }[] 
  });

  // --- 1. BUSCAR DADOS SE FOR EDIÇÃO ---
  useEffect(() => {
    if (isEditing) {
      fetchPropertyData();
    }
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      // Token rápido
      const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      const sessionStr = storageKey ? localStorage.getItem(storageKey) : null;
      const token = sessionStr ? JSON.parse(sessionStr)?.access_token : null;

      const response = await fetch(`http://127.0.0.1:3000/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Populando o form com os dados do back
        setFormData({
          ...data,
          // Converte números para string para o input não reclamar
          price: data.price || '',
          condoFee: data.condoFee || '',
          iptuPrice: data.iptuPrice || '',
          bedrooms: data.bedrooms || '',
          suites: data.suites || '',
          bathrooms: data.bathrooms || '',
          garageSpots: data.garageSpots || '',
          privateArea: data.privateArea || '',
          totalArea: data.totalArea || '',
          
          // Tratamento de datas (vem ISO do back 2023-10-05T00..., input quer 2023-10-05)
          constructionStartDate: data.constructionStartDate ? data.constructionStartDate.split('T')[0] : '',
          deliveryDate: data.deliveryDate ? data.deliveryDate.split('T')[0] : '',

          // Tratamento de Features (vem array de objetos [{name: 'Pool'}], form quer string ['Pool'])
          features: data.features ? data.features.map((f: any) => f.name) : [],

          // Endereço (se vier null, mantem objeto vazio)
          address: data.address || { city: '', state: '', street: '', neighborhood: '', zipCode: '', number: '' },

          images: data.images || [],
          tempImageUrl: ''
        });
      } else {
        alert("Erro ao carregar imóvel.");
        navigate('/intranet');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInitialLoading(false);
    }
  };

  // --- HANDLERS (Iguais ao anterior) ---
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      if (exists) return { ...prev, features: prev.features.filter(f => f !== feature) };
      return { ...prev, features: [...prev.features, feature] };
    });
  };

  const addImage = () => {
    if (!formData.tempImageUrl) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: prev.tempImageUrl, isCover: prev.images.length === 0 }],
      tempImageUrl: ''
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ================= ENVIO =================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Prepara payload (converte strings para números)
      const payload = {
        ...formData,
        price: Number(formData.price),
        condoFee: formData.condoFee ? Number(formData.condoFee) : undefined,
        iptuPrice: formData.iptuPrice ? Number(formData.iptuPrice) : undefined,
        bedrooms: Number(formData.bedrooms),
        suites: Number(formData.suites),
        bathrooms: Number(formData.bathrooms),
        garageSpots: Number(formData.garageSpots),
        privateArea: Number(formData.privateArea),
        totalArea: formData.totalArea ? Number(formData.totalArea) : undefined,
        garageArea: formData.garageArea ? Number(formData.garageArea) : undefined,
        constructionStartDate: formData.constructionStartDate || undefined,
        deliveryDate: formData.deliveryDate || undefined,
        tempImageUrl: undefined
      };

      // DECISÃO: POST (Criar) ou PATCH (Editar)
      const url = isEditing 
        ? `http://127.0.0.1:3000/properties/${id}` 
        : 'http://127.0.0.1:3000/properties';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(isEditing ? 'Imóvel atualizado!' : 'Imóvel cadastrado!');
        navigate('/intranet');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || 'Falha na requisição'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = { border: '1px solid #444', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column' as const, gap: '10px' };
  const rowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' as const };
  const inputStyle = { padding: '10px', flex: 1, minWidth: '150px' };

  if (initialLoading) {
    return <div style={{padding: 50, color: '#fff'}}>Carregando dados do imóvel...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d4af37' }}>
        {isEditing ? `Editar Imóvel #${id}` : 'Novo Imóvel'}
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* --- DADOS --- */}
        <div style={sectionStyle}>
          <h3>Informações Básicas</h3>
          <div style={rowStyle}>
            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="CASA">Casa</option>
              <option value="COBERTURA">Cobertura</option>
              <option value="TERRENO">Terreno</option>
              <option value="SALA_COMERCIAL">Sala Comercial</option>
              <option value="GALPAO">Galpão</option>
            </select>
            
            <select name="transactionType" value={formData.transactionType} onChange={handleChange} style={inputStyle}>
              <option value="VENDA">Venda</option>
              <option value="LOCACAO">Locação</option>
            </select>

            {/* Campo de Status só aparece na edição */}
            {isEditing && (
              <select name="status" value={formData.status} onChange={handleChange} style={{...inputStyle, borderColor: '#d4af37'}}>
                <option value="DISPONIVEL">Disponível</option>
                <option value="RESERVADO">Reservado</option>
                <option value="VENDIDO">Vendido</option>
                <option value="ALUGADO">Alugado</option>
              </select>
            )}
          </div>

          <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} required style={inputStyle} />
          <input name="subtitle" placeholder="Subtítulo" value={formData.subtitle || ''} onChange={handleChange} style={inputStyle} />
          
          <div style={rowStyle}>
             <label><input type="checkbox" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} /> É Exclusivo?</label>
             <label><input type="checkbox" name="showOnSite" checked={formData.showOnSite} onChange={handleChange} /> Mostrar no Site?</label>
          </div>
        </div>

        {/* --- VALORES --- */}
        <div style={sectionStyle}>
          <h3>Valores</h3>
          <div style={rowStyle}>
            <input type="number" name="price" placeholder="Valor Venda (R$) *" value={formData.price} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="condoFee" placeholder="Condomínio (R$)" value={formData.condoFee} onChange={handleChange} style={inputStyle} />
            <input type="number" name="iptuPrice" placeholder="IPTU (R$)" value={formData.iptuPrice} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- DETALHES --- */}
        <div style={sectionStyle}>
          <h3>Detalhes e Áreas</h3>
          <div style={rowStyle}>
            <input type="number" name="privateArea" placeholder="Área Privativa (m²) *" value={formData.privateArea} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="totalArea" placeholder="Área Total (m²)" value={formData.totalArea} onChange={handleChange} style={inputStyle} />
            <input type="number" name="garageArea" placeholder="Área Garagem" value={formData.garageArea} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <input type="number" name="bedrooms" placeholder="Dormitórios" value={formData.bedrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="suites" placeholder="Suítes" value={formData.suites} onChange={handleChange} style={inputStyle} />
            <input type="number" name="bathrooms" placeholder="Banheiros" value={formData.bathrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="garageSpots" placeholder="Vagas" value={formData.garageSpots} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- ENDEREÇO --- */}
        <div style={sectionStyle}>
          <h3>Localização</h3>
          <div style={rowStyle}>
            <input name="zipCode" placeholder="CEP" value={formData.address.zipCode} onChange={handleAddressChange} style={inputStyle} />
            <input name="city" placeholder="Cidade" value={formData.address.city} onChange={handleAddressChange} style={inputStyle} />
            <input name="state" placeholder="UF" value={formData.address.state} onChange={handleAddressChange} style={{...inputStyle, maxWidth: '60px'}} />
          </div>
          <div style={rowStyle}>
            <input name="neighborhood" placeholder="Bairro" value={formData.address.neighborhood} onChange={handleAddressChange} style={inputStyle} />
            <input name="street" placeholder="Rua" value={formData.address.street} onChange={handleAddressChange} style={inputStyle} />
            <input name="number" placeholder="Nº" value={formData.address.number} onChange={handleAddressChange} style={{...inputStyle, maxWidth: '100px'}} />
          </div>
          <input name="complement" placeholder="Complemento" value={formData.address.complement || ''} onChange={handleAddressChange} style={inputStyle} />
        </div>

        {/* --- DATAS --- */}
        <div style={sectionStyle}>
          <h3>Datas</h3>
          <div style={rowStyle}>
            <div style={{flex: 1}}>
              <label style={{fontSize: '0.8rem', color: '#aaa'}}>Início Obra</label>
              <input type="date" name="constructionStartDate" value={formData.constructionStartDate} onChange={handleChange} style={{...inputStyle, width: '100%'}} />
            </div>
            <div style={{flex: 1}}>
            <label style={{fontSize: '0.8rem', color: '#aaa'}}>Previsão Entrega</label>
              <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} style={{...inputStyle, width: '100%'}} />
            </div>
          </div>
        </div>

        {/* --- FEATURES --- */}
        <div style={sectionStyle}>
          <h3>Características</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {FEATURE_OPTIONS.map(feat => (
              <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={formData.features.includes(feat)} 
                  onChange={() => handleFeatureToggle(feat)}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        {/* --- GALERIA --- */}
        <div style={sectionStyle}>
          <h3>Galeria de Fotos</h3>
          <div style={rowStyle}>
            <input 
              name="tempImageUrl" 
              placeholder="Cole link de imagem extra..." 
              value={formData.tempImageUrl} 
              onChange={handleChange} 
              style={inputStyle} 
            />
            <button type="button" onClick={addImage} style={{padding: '0 20px', cursor: 'pointer', background: '#444', color: '#fff', border: 'none'}}>
              Adicionar
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {formData.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: '100px', height: '80px' }}>
                <img src={img.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                >
                  &times;
                </button>
                {img.isCover && <span style={{position:'absolute', bottom: 0, left: 0, background: '#d4af37', fontSize: '10px', padding: '2px 4px', color: '#000'}}>Capa</span>}
              </div>
            ))}
          </div>
        </div>

        {/* --- DESCRIÇÃO --- */}
        <div style={sectionStyle}>
          <h3>Descrição</h3>
          <textarea name="description" rows={5} value={formData.description || ''} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '15px', 
            background: isEditing ? '#28a745' : '#d4af37', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '1.1rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1 
          }}
        >
          {loading ? 'Salvando...' : (isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR IMÓVEL')}
        </button>

      </form>
    </div>
  );
}