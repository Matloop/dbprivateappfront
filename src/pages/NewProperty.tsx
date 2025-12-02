import { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ajuste o import
import { useNavigate } from 'react-router-dom';

// Lista de características para os checkboxes (baseado nas suas prints)
const FEATURE_OPTIONS = [
  "Academia", "Piscina", "Elevador", "Salão de festas", "Playground", 
  "Brinquedoteca", "Sauna", "Spa", "Sala de jogos", "Espaço gourmet",
  "Portaria 24h", "Mobiliado", "Churrasqueira", "Ar Condicionado",
  "Vista Panorâmica", "Aquecimento a Gás"
];

export function NewProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado inicial espelhando o DTO
  const [formData, setFormData] = useState({
    // Básicos
    title: '',
    subtitle: '',
    category: 'APARTAMENTO', // Default do Enum
    transactionType: 'VENDA',
    status: 'DISPONIVEL',
    isExclusive: false,
    showOnSite: true,
    exclusivityDocUrl: '',
    registrationNumber: '', // Matrícula
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

    // Objetos Aninhados
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
    
    // Gerenciamento simples de URLs de imagem
    tempImageUrl: '', 
    images: [] as { url: string, isCover: boolean }[] 
  });

  // 1. Handler Genérico para campos "planos"
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 2. Handler para Endereço (Nested Object)
  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // 3. Handler para Features (Array de Strings)
  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      if (exists) {
        return { ...prev, features: prev.features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...prev.features, feature] };
      }
    });
  };

  // 4. Handler para Adicionar Imagem (Simulação de URL)
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

      // PREPARAÇÃO DO PAYLOAD
      // O backend espera números (Int/Float), mas inputs HTML retornam String.
      // Precisamos converter.
      const payload = {
        ...formData,
        // Convertendo números
        price: Number(formData.price),
        condoFee: formData.condoFee ? Number(formData.condoFee) : undefined,
        iptuPrice: formData.iptuPrice ? Number(formData.iptuPrice) : undefined,
        bedrooms: Number(formData.bedrooms),
        suites: Number(formData.suites),
        bathrooms: Number(formData.bathrooms),
        garageSpots: Number(formData.garageSpots),
        garageArea: formData.garageArea ? Number(formData.garageArea) : undefined, 

        privateArea: Number(formData.privateArea),
        totalArea: formData.totalArea ? Number(formData.totalArea) : undefined,
        
        // Datas vazias viram undefined
        constructionStartDate: formData.constructionStartDate || undefined,
        deliveryDate: formData.deliveryDate || undefined,

        // Limpando campos auxiliares que não vão pro back
        tempImageUrl: undefined
      };

      const response = await fetch('http://127.0.0.1:3000/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Imóvel cadastrado com sucesso!');
        navigate('/intranet'); // Ou sua rota de sucesso
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message || 'Falha ao cadastrar'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos simples inline (substitua por CSS Modules ou Tailwind se preferir)
  const sectionStyle = { border: '1px solid #444', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column' as const, gap: '10px' };
  const rowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' as const };
  const inputStyle = { padding: '10px', flex: 1, minWidth: '150px' };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d4af37' }}>Novo Imóvel</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* --- 1. DADOS PRINCIPAIS --- */}
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
          </div>

          <input name="title" placeholder="Título do Anúncio *" value={formData.title} onChange={handleChange} required style={inputStyle} />
          <input name="subtitle" placeholder="Subtítulo (Ex: 3 suítes + vista mar)" value={formData.subtitle} onChange={handleChange} style={inputStyle} />
          
          <div style={rowStyle}>
             <label><input type="checkbox" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} /> É Exclusivo?</label>
             <label><input type="checkbox" name="showOnSite" checked={formData.showOnSite} onChange={handleChange} /> Mostrar no Site?</label>
          </div>
        </div>

        {/* --- 2. VALORES --- */}
        <div style={sectionStyle}>
          <h3>Valores</h3>
          <div style={rowStyle}>
            <input type="number" name="price" placeholder="Valor Venda (R$) *" value={formData.price} onChange={handleChange} required style={inputStyle} />
            <input type="number" name="condoFee" placeholder="Condomínio (R$)" value={formData.condoFee} onChange={handleChange} style={inputStyle} />
            <input type="number" name="iptuPrice" placeholder="IPTU (R$)" value={formData.iptuPrice} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- 3. CARACTERÍSTICAS & ÁREAS --- */}
        <div style={sectionStyle}>
          <h3>Detalhes</h3>
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
          <div style={rowStyle}>
            <input type="text" name="registrationNumber" placeholder="Nº Matrícula" value={formData.registrationNumber} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* --- 4. ENDEREÇO (Objeto aninhado) --- */}
        <div style={sectionStyle}>
          <h3>Localização</h3>
          <div style={rowStyle}>
            <input name="zipCode" placeholder="CEP" value={formData.address.zipCode} onChange={handleAddressChange} required style={inputStyle} />
            <input name="city" placeholder="Cidade" value={formData.address.city} onChange={handleAddressChange} required style={inputStyle} />
            <input name="state" placeholder="UF" value={formData.address.state} onChange={handleAddressChange} style={{...inputStyle, maxWidth: '60px'}} />
          </div>
          <div style={rowStyle}>
            <input name="neighborhood" placeholder="Bairro" value={formData.address.neighborhood} onChange={handleAddressChange} required style={inputStyle} />
            <input name="street" placeholder="Rua" value={formData.address.street} onChange={handleAddressChange} required style={inputStyle} />
            <input name="number" placeholder="Número" value={formData.address.number} onChange={handleAddressChange} required style={{...inputStyle, maxWidth: '100px'}} />
          </div>
          <input name="complement" placeholder="Complemento" value={formData.address.complement} onChange={handleAddressChange} style={inputStyle} />
        </div>

        {/* --- 5. DATAS --- */}
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

        {/* --- 6. CHECKBOXES (FEATURES) --- */}
        <div style={sectionStyle}>
          <h3>Características do Empreendimento</h3>
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

        {/* --- 7. GALERIA (URLs) --- */}
        <div style={sectionStyle}>
          <h3>Galeria de Fotos</h3>
          <div style={rowStyle}>
            <input 
              name="tempImageUrl" 
              placeholder="Cole o link da imagem aqui (https://...)" 
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

        {/* --- 8. DESCRIÇÃO --- */}
        <div style={sectionStyle}>
          <h3>Descrição Completa</h3>
          <textarea 
            name="description" 
            rows={5} 
            value={formData.description} 
            onChange={handleChange} 
            style={{...inputStyle, resize: 'vertical'}} 
          />
        </div>

        <div style={sectionStyle}>
          <h3>Observações (Interno)</h3>
          <textarea 
            name="brokerNotes" 
            rows={3} 
            placeholder="Infos de comissão, contato do proprietário, etc."
            value={formData.brokerNotes} 
            onChange={handleChange} 
            style={{...inputStyle, resize: 'vertical'}} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '15px', 
            background: '#d4af37', 
            color: '#000', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '1.1rem', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1 
          }}
        >
          {loading ? 'Salvando...' : 'CADASTRAR IMÓVEL'}
        </button>

      </form>
    </div>
  );
}