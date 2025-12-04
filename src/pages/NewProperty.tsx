import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

// --- CONSTANTES E OPÇÕES ---

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

const BADGE_COLORS = [
  { label: 'Azul (Padrão)', value: '#0d6efd' },
  { label: 'Verde (Sucesso)', value: '#198754' },
  { label: 'Vermelho (Destaque)', value: '#dc3545' },
  { label: 'Laranja (Alerta)', value: '#fd7e14' },
  { label: 'Preto/Cinza', value: '#343a40' },
  { label: 'Dourado (Premium)', value: '#d4af37' },
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

    // Tarja
    badgeText: '',
    badgeColor: '',
    
    // Valores
    price: '',
    condoFee: '',
    iptuPrice: '',
    
    // Números e Áreas
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
    
    // Endereço
    address: {
      zipCode: '',
      state: 'SC',
      city: 'Balneário Camboriú',
      neighborhood: '',
      street: '',
      number: '',
      complement: ''
    },

    // Arrays separados
    propertyFeatures: [] as string[],
    developmentFeatures: [] as string[],

    // Imagens
    tempImageUrl: '', 
    images: [] as { url: string, isCover: boolean }[] 
  });

  // --- 1. CARREGAR DADOS (MÓDULO DE EDIÇÃO) ---
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

      const response = await fetch(`http://127.0.0.1:3000/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        setFormData({
          ...data,
          // Converte Nulls/Numbers para string vazia nos inputs
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
          
          badgeText: data.badgeText || '',
          badgeColor: data.badgeColor || '',
          
          // Tratamento de Datas (YYYY-MM-DD)
          constructionStartDate: data.constructionStartDate ? String(data.constructionStartDate).split('T')[0] : '',
          deliveryDate: data.deliveryDate ? String(data.deliveryDate).split('T')[0] : '',

          // Mapeando Features: Backend (Objeto) -> Frontend (Array de Strings)
          propertyFeatures: data.propertyFeatures 
            ? data.propertyFeatures.map((f: any) => f.name) 
            : [],
            
          developmentFeatures: data.developmentFeatures 
            ? data.developmentFeatures.map((f: any) => f.name) 
            : [],

          address: data.address || { city: '', state: '', street: '', neighborhood: '', zipCode: '', number: '' },
          images: data.images || [],
          tempImageUrl: ''
        });
      } else {
        alert("Erro ao carregar imóvel. Talvez ele tenha sido excluído.");
        navigate('/intranet');
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao buscar dados.");
    } finally {
      setInitialLoading(false);
    }
  };

  // --- HANDLERS (EVENTOS DE INPUT) ---
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

  // Lógica para marcar/desmarcar checkboxes nas listas
  const handleFeatureToggle = (listName: 'propertyFeatures' | 'developmentFeatures', feature: string) => {
    setFormData((prev) => {
      const list = prev[listName];
      if (list.includes(feature)) {
        return { ...prev, [listName]: list.filter(f => f !== feature) }; // Remove
      } else {
        return { ...prev, [listName]: [...list, feature] }; // Adiciona
      }
    });
  };

  // --- IMAGENS ---
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

  // --- SALVAR (SUBMIT) ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Monta o payload, convertendo strings para números e limpando dados
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
        
        // Se a data vier vazia, manda undefined
        constructionStartDate: formData.constructionStartDate || undefined,
        deliveryDate: formData.deliveryDate || undefined,
        
        // Remove campo temporário
        tempImageUrl: undefined,
        
        // Backend novo espera esses arrays
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
        alert(isEditing ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!');
        navigate('/intranet');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || 'Falha ao salvar'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // --- ESTILOS INLINE (Simples) ---
  const sectionStyle = { 
    border: '1px solid #444', 
    padding: '15px', 
    borderRadius: '8px', 
    display: 'flex', 
    flexDirection: 'column' as const, 
    gap: '10px' 
  };
  const rowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' as const };
  const inputStyle = { padding: '10px', flex: 1, minWidth: '150px' };

  if (initialLoading) {
    return <div style={{padding: 50, color: '#fff', textAlign: 'center'}}>Carregando dados do imóvel...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '20px' }}>
        {isEditing ? `Editar Imóvel #${id}` : 'Novo Imóvel'}
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* --- 1. BLOCO DA TARJA --- */}
        <div style={sectionStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37' }}>
            💳 Tarja de Destaque <span style={{fontSize:'0.8rem', fontWeight:'normal', color:'#aaa'}}>(Opcional)</span>
          </h3>
          <p style={{fontSize: '0.85rem', color: '#888', margin: 0}}>Texto curto para destacar o imóvel na lista (Ex: MOBILIADO)</p>
          
          <div style={rowStyle}>
             <div style={{flex: 2}}>
                <input 
                  name="badgeText" 
                  placeholder="Texto da Tarja" 
                  value={formData.badgeText} 
                  onChange={handleChange} 
                  style={inputStyle} 
                />
             </div>
             <div style={{flex: 1}}>
                <select name="badgeColor" value={formData.badgeColor} onChange={handleChange} style={inputStyle}>
                    <option value="">Selecione a Cor</option>
                    {BADGE_COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
             </div>
          </div>
          {/* Preview */}
          {formData.badgeText && (
             <div style={{marginTop: 5}}>
                <span style={{ fontSize:'0.8rem', color:'#aaa' }}>Prévia: </span>
                <span style={{
                   background: formData.badgeColor || '#555',
                   color: '#fff', padding: '2px 8px', borderRadius: 4, 
                   fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                    {formData.badgeText}
                </span>
             </div>
          )}
        </div>

        {/* --- 2. DADOS BÁSICOS --- */}
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
          <input name="title" placeholder="Título do Anúncio *" value={formData.title} onChange={handleChange} required style={inputStyle} />
          <input name="subtitle" placeholder="Subtítulo (Ex: 3 suítes com vista mar)" value={formData.subtitle || ''} onChange={handleChange} style={inputStyle} />
          <div style={rowStyle}>
             <label style={{cursor:'pointer'}}><input type="checkbox" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} /> É Exclusivo?</label>
             <label style={{cursor:'pointer'}}><input type="checkbox" name="showOnSite" checked={formData.showOnSite} onChange={handleChange} /> Mostrar no Site?</label>
          </div>
        </div>

        {/* --- 3. VALORES --- */}
        <div style={sectionStyle}>
          <h3>Valores</h3>
          <div style={rowStyle}>
            <input type="number" name="price" placeholder="Valor Venda (R$) *" value={formData.price} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="condoFee" placeholder="Condomínio (R$)" value={formData.condoFee} onChange={handleChange} style={inputStyle} />
            <input type="number" name="iptuPrice" placeholder="IPTU (R$)" value={formData.iptuPrice} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- 4. DETALHES --- */}
        <div style={sectionStyle}>
          <h3>Detalhes e Áreas</h3>
          <div style={rowStyle}>
            <input type="number" name="privateArea" placeholder="Área Privativa (m²) *" value={formData.privateArea} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="totalArea" placeholder="Área Total (m²)" value={formData.totalArea} onChange={handleChange} style={inputStyle} />
            <input type="number" name="garageArea" placeholder="Área Garagem (m²)" value={formData.garageArea} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <input type="number" name="bedrooms" placeholder="Dormitórios" value={formData.bedrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="suites" placeholder="Suítes" value={formData.suites} onChange={handleChange} style={inputStyle} />
            <input type="number" name="bathrooms" placeholder="Banheiros" value={formData.bathrooms} onChange={handleChange} style={inputStyle} />
            <input type="number" name="garageSpots" placeholder="Vagas" value={formData.garageSpots} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <input type="text" name="registrationNumber" placeholder="Nº Matrícula" value={formData.registrationNumber} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- 5. ENDEREÇO --- */}
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
          <input name="complement" placeholder="Complemento" value={formData.address.complement} onChange={handleAddressChange} style={inputStyle} />
        </div>

        {/* --- 6. DATAS --- */}
        <div style={sectionStyle}>
            <h3>Datas da Obra</h3>
            <div style={rowStyle}>
                <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem', color: '#aaa'}}>Início</label>
                    <input type="date" name="constructionStartDate" value={formData.constructionStartDate} onChange={handleChange} style={{...inputStyle, width: '100%'}} />
                </div>
                <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem', color: '#aaa'}}>Entrega Prevista</label>
                    <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} style={{...inputStyle, width: '100%'}} />
                </div>
            </div>
        </div>

        {/* --- 7. CARACTERÍSTICAS PRIVATIVAS (DO IMÓVEL) --- */}
        <div style={sectionStyle}>
          <h3 style={{color: '#d4af37'}}>Características do Imóvel</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {PROPERTY_OPTS.map(feat => (
              <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: '#ccc' }}>
                <input 
                  type="checkbox" 
                  checked={formData.propertyFeatures.includes(feat)} 
                  onChange={() => handleFeatureToggle('propertyFeatures', feat)}
                  style={{width: 16, height: 16, accentColor: '#d4af37'}}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        {/* --- 8. CARACTERÍSTICAS COMUNS (DO EMPREENDIMENTO) --- */}
        <div style={sectionStyle}>
          <h3 style={{color: '#28a745'}}>Infraestrutura do Empreendimento</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {DEVELOPMENT_OPTS.map(feat => (
              <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', color: '#ccc' }}>
                <input 
                  type="checkbox" 
                  checked={formData.developmentFeatures.includes(feat)} 
                  onChange={() => handleFeatureToggle('developmentFeatures', feat)}
                  style={{width: 16, height: 16, accentColor: '#28a745'}}
                />
                {feat}
              </label>
            ))}
          </div>
        </div>

        {/* --- 9. GALERIA --- */}
        <div style={sectionStyle}>
          <h3>Galeria de Fotos</h3>
          <div style={rowStyle}>
            <input name="tempImageUrl" placeholder="Cole o link da imagem aqui..." value={formData.tempImageUrl} onChange={handleChange} style={inputStyle} />
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

        {/* --- 10. DESCRIÇÃO E OBSERVAÇÕES --- */}
        <div style={sectionStyle}>
          <h3>Descrição Completa</h3>
          <textarea name="description" rows={5} value={formData.description || ''} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} />
        </div>

        <div style={sectionStyle}>
          <h3>Observações Internas (Corretor)</h3>
          <textarea name="brokerNotes" rows={3} value={formData.brokerNotes || ''} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}} />
        </div>

        {/* BOTÃO FINAL */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '15px', 
            background: isEditing ? '#28a745' : '#d4af37', 
            color: isEditing ? '#fff' : '#000', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '1.1rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '20px'
          }}
        >
          {loading ? 'Processando...' : (isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR IMÓVEL')}
        </button>

      </form>
    </div>
  );
}