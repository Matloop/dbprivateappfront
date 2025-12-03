import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

// 1. LISTAS SEPARADAS
const PROPERTY_OPTS = [
  "Mobiliado", "Semimobiliado", "Vazio", "Frente Mar", "Quadra Mar", 
  "Vista Panorâmica", "Churrasqueira a Carvão", "Sacada Aberta", 
  "Sacada Integrada", "Ar Condicionado", "Aquecimento a Gás", 
  "Piso Porcelanato", "Piso Vinílico", "Automação Predial", 
  "Acabamento em Gesso", "Hidromassagem"
];

const DEVELOPMENT_OPTS = [
  "Academia", "Piscina Adulto", "Piscina Infantil", "Piscina Térmica",
  "Salão de Festas", "Espaço Gourmet", "Sala de Jogos", "Playground",
  "Brinquedoteca", "Cinema", "Sauna", "Spa", "Elevador", 
  "Portaria 24h", "Bicicletário", "Entrada para Banhistas", 
  "Box de Praia", "Heliponto", "Gerador de Energia"
];

export function NewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

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
    
    // Valores
    price: '',
    condoFee: '',
    iptuPrice: '',
    
    // Números
    bedrooms: '',
    suites: '',
    bathrooms: '',
    garageSpots: '',
    privateArea: '',
    totalArea: '',
    garageArea: '',
    
    // Datas
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

    // --- MUDANÇA: ARRAYS SEPARADOS ---
    propertyFeatures: [] as string[],
    developmentFeatures: [] as string[],

    tempImageUrl: '', 
    images: [] as { url: string, isCover: boolean }[] 
  });

  // --- BUSCAR DADOS (EDIÇÃO) ---
  useEffect(() => {
    if (isEditing) {
      fetchPropertyData();
    }
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      const sessionStr = storageKey ? localStorage.getItem(storageKey) : null;
      const token = sessionStr ? JSON.parse(sessionStr)?.access_token : null;

      // URL local para evitar delay
      const response = await fetch(`http://127.0.0.1:3000/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        setFormData({
          ...data,
          // Numéricos para string
          price: data.price || '',
          condoFee: data.condoFee || '',
          iptuPrice: data.iptuPrice || '',
          bedrooms: data.bedrooms || '',
          suites: data.suites || '',
          bathrooms: data.bathrooms || '',
          garageSpots: data.garageSpots || '',
          privateArea: data.privateArea || '',
          totalArea: data.totalArea || '',
          garageArea: data.garageArea || '',
          
          // Datas
          constructionStartDate: data.constructionStartDate ? data.constructionStartDate.split('T')[0] : '',
          deliveryDate: data.deliveryDate ? data.deliveryDate.split('T')[0] : '',

          // --- MAPEAR FEATURES SEPARADAS ---
          // O banco retorna: [{name: 'Wifi'}, {name: 'Pool'}]
          // O front precisa: ['Wifi', 'Pool']
          propertyFeatures: data.propertyFeatures ? data.propertyFeatures.map((f: any) => f.name) : [],
          developmentFeatures: data.developmentFeatures ? data.developmentFeatures.map((f: any) => f.name) : [],

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

  // --- HANDLERS ---
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

  // Handler genérico para toggles (recebe qual lista atualizar)
  const handleFeatureToggle = (listName: 'propertyFeatures' | 'developmentFeatures', feature: string) => {
    setFormData((prev) => {
      const list = prev[listName];
      if (list.includes(feature)) {
        return { ...prev, [listName]: list.filter(f => f !== feature) };
      } else {
        return { ...prev, [listName]: [...list, feature] };
      }
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

  // --- SUBMIT ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

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
        tempImageUrl: undefined,
        
        // Os arrays já estão no formato correto de strings, o backend cuidará do connectOrCreate
        propertyFeatures: formData.propertyFeatures,
        developmentFeatures: formData.developmentFeatures
      };

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
    return <div style={{padding: 50, color: '#fff'}}>Carregando dados...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d4af37' }}>{isEditing ? `Editar Imóvel #${id}` : 'Novo Imóvel'}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* BASICS */}
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

        {/* VALORES */}
        <div style={sectionStyle}>
          <h3>Valores</h3>
          <div style={rowStyle}>
            <input type="number" name="price" placeholder="Valor Venda (R$) *" value={formData.price} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="condoFee" placeholder="Condomínio (R$)" value={formData.condoFee} onChange={handleChange} style={inputStyle} />
            <input type="number" name="iptuPrice" placeholder="IPTU (R$)" value={formData.iptuPrice} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* DETALHES */}
        <div style={sectionStyle}>
          <h3>Detalhes e Áreas</h3>
          <div style={rowStyle}>
            <input type="number" name="privateArea" placeholder="Área Privativa (m²) *" value={formData.privateArea} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="totalArea" placeholder="Área Total (m²)" value={formData.totalArea} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <input type="number" name="bedrooms" placeholder="Dormitórios" value={formData.bedrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="suites" placeholder="Suítes" value={formData.suites} onChange={handleChange} style={inputStyle} />
            <input type="number" name="bathrooms" placeholder="Banheiros" value={formData.bathrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="garageSpots" placeholder="Vagas" value={formData.garageSpots} onChange={handleChange} style={inputStyle} />
          </div>
          <input type="text" name="registrationNumber" placeholder="Nº Matrícula" value={formData.registrationNumber} onChange={handleChange} style={inputStyle} />
        </div>

        {/* ENDEREÇO */}
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
        </div>

        {/* --- CARACTERÍSTICAS PRIVATIVAS --- */}
        <div style={sectionStyle}>
          <h3>Características do Imóvel (Privativo)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {PROPERTY_OPTS.map(feat => (
              <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.propertyFeatures.includes(feat)} 
                  onChange={() => handleFeatureToggle('propertyFeatures', feat)}
                  style={{accentColor: '#d4af37'}}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        {/* --- CARACTERÍSTICAS EMPREENDIMENTO --- */}
        <div style={sectionStyle}>
          <h3>Infraestrutura do Empreendimento (Comum)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {DEVELOPMENT_OPTS.map(feat => (
              <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.developmentFeatures.includes(feat)} 
                  onChange={() => handleFeatureToggle('developmentFeatures', feat)}
                  style={{accentColor: '#28a745'}}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        {/* GALERIA */}
        <div style={sectionStyle}>
          <h3>Galeria de Fotos</h3>
          <div style={rowStyle}>
            <input name="tempImageUrl" placeholder="Cole link da imagem..." value={formData.tempImageUrl} onChange={handleChange} style={inputStyle} />
            <button type="button" onClick={addImage} style={{padding: '0 20px', cursor: 'pointer', background: '#444', color: '#fff', border: 'none'}}>Adicionar</button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {formData.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: '100px', height: '80px' }}>
                <img src={img.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>&times;</button>
                {img.isCover && <span style={{position:'absolute', bottom: 0, left: 0, background: '#d4af37', fontSize: '10px', padding: '2px 4px', color: '#000'}}>Capa</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Descrição</h3>
          <textarea name="description" rows={5} value={formData.description || ''} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '15px', background: isEditing ? '#28a745' : '#d4af37', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          {loading ? 'Salvando...' : (isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR IMÓVEL')}
        </button>
      </form>
    </div>
  );
}