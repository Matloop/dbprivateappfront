import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaFileAlt, FaDollarSign, FaHome, FaBuilding, FaTh, 
  FaYoutube, FaCube, FaLock, FaKey, FaImages, FaSave, FaTimes 
} from 'react-icons/fa';

// --- CONSTANTES E LISTAS (Baseado nos seus Prints) ---

const ROOM_OPTS = [
  "Área de Serviço", "Banheiro de Serviço", "Banheiro Social", "Biblioteca",
  "Closet", "Copa", "Copa/Cozinha", "Cozinha", "Cozinha Americana",
  "Demi-Suíte", "Dependência de Empregada", "Entrada de Serviço",
  "Espaço Gourmet", "Estar Íntimo", "Hidromassagem", "Home Office",
  "Jardim", "Lavabo", "Living", "Piscina Privativa", "Sacada / Varanda",
  "Sacada com Churrasqueira", "Sacada Integrada", "Sacada Técnica",
  "Sala", "Sala de Estar", "Sala de Estar Íntimo", "Sala de Jantar",
  "Sala de TV", "Sala para 2 Ambientes", "Sala para 3 Ambientes",
  "Suíte Master", "Suíte Standard", "Terraço"
];

const PROPERTY_OPTS = [
  "Acabamento em Gesso", "Aceita Pet", "Andar Alto", "Aquecimento de Água",
  "Ar Condicionado", "Calefação", "Carpete", "Churrasqueira", "Decorado",
  "Despensa", "Fechadura Eletrônica", "Infra para Ar Split", "Internet / WiFi",
  "Lareira", "Mezanino", "Móveis Planejados", "Piso Aquecido nos Banheiros",
  "Piso Cerâmico", "Piso de Madeira", "Piso Laminado", "Piso Porcelanato",
  "Piso Vinílico", "Sistema de Alarme", "TV a Cabo", "Ventilador de Teto",
  "Vista Livre", "Vista Mar", "Vista Panorâmica"
];

const DEVELOPMENT_OPTS = [
  "Acessibilidade para PNE", "Automação Predial", "Bar", "Bicicletário",
  "Boliche", "Box de Praia", "Brinquedoteca", "Câmeras de Segurança",
  "Captação de Água", "Cinema", "Coworking", "Deck Molhado", "Depósito",
  "Elevador", "Entrada para Banhistas", "Espaço Fitness", "Espaço Gourmet",
  "Espaço Zen", "Estar Social", "Gás Central", "Gerador", 
  "Hall Decorado e Mobiliado", "Heliponto", "Hidromassagem", "Horta",
  "Infra para Veículos Elétricos", "Lavanderia Coletiva", "Lounge",
  "Medidores Individuais", "Mini Mercado", "Painéis de Energia Solar",
  "Pet Care", "Pet Place", "Piscina", "Piscina Infantil", "Piscina Térmica",
  "Playground", "Pomar", "Portão Eletrônico", "Portaria 24h",
  "Quadra de Padel", "Quadra de Tênis", "Quadra Esportiva", 
  "Quiosque Externo", "RoofTop", "Sala de Jogos", "Sala de Reunião",
  "Salão de Festas", "Sauna", "Solarium", "Spa"
];

const BADGE_COLORS = [
  { label: 'Azul (Padrão)', value: '#0d6efd' },
  { label: 'Verde (Sucesso)', value: '#198754' },
  { label: 'Vermelho (Destaque)', value: '#dc3545' },
  { label: 'Dourado (Premium)', value: '#d4af37' },
  { label: 'Preto', value: '#000000' },
];

export function NewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // ESTADO GIGANTE COM TODOS OS CAMPOS
  const [formData, setFormData] = useState({
    // --- Identificação ---
    title: '',
    subtitle: '',
    oldRef: '',
    category: 'APARTAMENTO',
    
    // Finalidade (Checkboxes)
    isSale: true,
    isRentAnnual: false,
    isRentSeason: false,
    isRentStudent: false,

    status: 'DISPONIVEL', // Situação
    constructionStage: 'PRONTO', // Estágio
    
    // --- Configuração ---
    isExclusive: false,
    showOnSite: true,
    hasSign: false, // Placa
    
    // --- Características Importantes (Checkbox) ---
    isSeaFront: false,     // Frente Mar
    isSeaQuadra: false,    // Quadra Mar
    isDifferentiated: false, // Diferenciado
    isHighStandard: false, // Alto Padrão
    isFurnished: false,    // Mobiliado
    isSemiFurnished: false, // Semimobiliado
    isUnfurnished: false,  // Sem Mobília

    // --- Tarja ---
    badgeText: '',
    badgeColor: '',
    
    // --- Valores ---
    price: '',
    promotionalPrice: '', 
    hasDiscount: false,
    condoFee: '',
    iptuPrice: '',
    
    // --- Negociação ---
    acceptsFinancing: false,
    acceptsConstructionFinancing: false,
    acceptsTrade: false,
    acceptsVehicle: false,
    isMcmv: false,

    // --- Detalhes Técnicos ---
    bedrooms: '',
    suites: '',
    bathrooms: '',
    garageSpots: '',
    garageType: 'Privativa',
    privateArea: '',
    totalArea: '',
    garageArea: '',
    solarPosition: '',
    relativePosition: 'Frente',
    
    // --- Localização ---
    address: { 
      zipCode: '', state: 'SC', city: 'Balneário Camboriú', 
      neighborhood: '', street: '', number: '', complement: '' 
    },
    buildingName: '',
    displayAddress: true,

    // --- Mídia ---
    videoUrl: '',
    tourUrl: '',
    tempImageUrl: '', 
    images: [] as { url: string, isCover: boolean }[],

    // --- Dados Privados (Interno) ---
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    keysLocation: '',
    condoManager: '',
    buildingAdministrator: '',
    constructionCompany: '',
    exclusivitySigned: false,
    brokerNotes: '',
    
    // --- Texto ---
    description: '',
    
    // --- Arrays de Checkboxes ---
    roomFeatures: [] as string[],      // Ambientes
    propertyFeatures: [] as string[],  // Características Imóvel
    developmentFeatures: [] as string[] // Empreendimento
  });

  // --- CARREGAR DADOS ---
  useEffect(() => {
    if (isEditing) {
      fetchPropertyData();
    } else {
        setInitialLoading(false);
    }
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      const storageKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
      const sessionStr = storageKey ? localStorage.getItem(storageKey) : null;
      const token = sessionStr ? JSON.parse(sessionStr)?.access_token : null;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mapeamento seguro (evita null em inputs controlados)
        setFormData({
          ...data,
          price: data.price || '',
          promotionalPrice: data.promotionalPrice || '',
          condoFee: data.condoFee || '',
          iptuPrice: data.iptuPrice || '',
          
          bedrooms: data.bedrooms || '',
          suites: data.suites || '',
          bathrooms: data.bathrooms || '',
          garageSpots: data.garageSpots || '',
          privateArea: data.privateArea || '',
          totalArea: data.totalArea || '',
          garageArea: data.garageArea || '',
          
          // Booleanos novos (default false)
          isSale: data.isSale ?? true,
          isSeaQuadra: data.isSeaQuadra ?? false,
          
          // Arrays (Se vier do back como objeto [{name: 'X'}], converte para ['X'])
          // Se o back já mandar array de strings, remove o .map
          roomFeatures: data.roomFeatures ? (typeof data.roomFeatures[0] === 'object' ? data.roomFeatures.map((f:any) => f.name) : data.roomFeatures) : [],
          propertyFeatures: data.propertyFeatures ? (typeof data.propertyFeatures[0] === 'object' ? data.propertyFeatures.map((f:any) => f.name) : data.propertyFeatures) : [],
          developmentFeatures: data.developmentFeatures ? (typeof data.developmentFeatures[0] === 'object' ? data.developmentFeatures.map((f:any) => f.name) : data.developmentFeatures) : [],

          address: data.address || { city: '', state: 'SC', street: '', neighborhood: '', zipCode: '', number: '' },
          images: data.images || [],
          tempImageUrl: ''
        });
      } else {
        alert("Imóvel não encontrado.");
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

  const handleListToggle = (listName: 'roomFeatures' | 'propertyFeatures' | 'developmentFeatures', item: string) => {
    setFormData(prev => {
        const list = prev[listName] || [];
        if (list.includes(item)) return { ...prev, [listName]: list.filter(i => i !== item) };
        return { ...prev, [listName]: [...list, item] };
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Conversões Numéricas
      const payload = {
        ...formData,
        price: Number(formData.price),
        promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : undefined,
        condoFee: formData.condoFee ? Number(formData.condoFee) : undefined,
        iptuPrice: formData.iptuPrice ? Number(formData.iptuPrice) : undefined,
        
        bedrooms: Number(formData.bedrooms),
        suites: Number(formData.suites),
        bathrooms: Number(formData.bathrooms),
        garageSpots: Number(formData.garageSpots),
        privateArea: Number(formData.privateArea),
        totalArea: formData.totalArea ? Number(formData.totalArea) : undefined,
        garageArea: formData.garageArea ? Number(formData.garageArea) : undefined,
        
        tempImageUrl: undefined
      };

      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/properties/${id}` 
        : `${import.meta.env.VITE_API_URL}/properties`;
      
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Salvo com sucesso!");
        navigate('/intranet');
      } else {
        const err = await response.json();
        alert("Erro: " + (err.message || 'Falha ao salvar'));
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  // --- ESTILOS INLINE (Design Dark Original) ---
  const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: 'auto', background: '#1a1a1a', color: '#fff', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '2px solid #d4af37', paddingBottom: 10 },
    section: { border: '1px solid #444', padding: '15px', borderRadius: '4px', marginBottom: 20, background: '#222' },
    sectionTitle: { fontSize: '1rem', color: '#d4af37', borderBottom: '1px solid #444', paddingBottom: 5, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' as const, fontWeight: 'bold' },
    row: { display: 'flex', gap: '15px', flexWrap: 'wrap' as const, marginBottom: 10 },
    col: { flex: 1, minWidth: '150px' },
    label: { display: 'block', marginBottom: 5, fontSize: '0.85rem', color: '#ccc' },
    input: { width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', fontSize: '0.9rem' },
    checkGroup: { display: 'flex', gap: 15, flexWrap: 'wrap' as const },
    checkLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer', color: '#bbb' },
    btnSave: { padding: '12px 30px', background: isEditing ? '#28a745' : '#d4af37', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5 },
    btnCancel: { padding: '12px 30px', background: '#dc3545', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5 }
  };

  if (initialLoading) return <div style={{padding:50, color:'#fff', textAlign:'center'}}>Carregando dados...</div>;

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={{margin:0}}>{isEditing ? `Editar Imóvel #${id}` : 'Novo Imóvel'}</h2>
        <div style={{display:'flex', gap: 10}}>
            <button type="button" style={styles.btnCancel} onClick={() => navigate('/intranet')}><FaTimes /> CANCELAR</button>
            <button type="button" style={styles.btnSave} onClick={handleSubmit} disabled={loading}><FaSave /> {loading ? 'SALVANDO...' : 'SALVAR'}</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* 1. DADOS PRINCIPAIS */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaFileAlt /> Dados Principais</div>
            
            <div style={styles.row}>
                <div style={{width: 100}}>
                    <label style={styles.label}>Referência</label>
                    <input disabled value={id || 'AUTO'} style={{...styles.input, opacity: 0.5, textAlign: 'center'}} />
                </div>
                <div style={{width: 150}}>
                    <label style={styles.label}>Ref. Antiga</label>
                    <input name="oldRef" value={formData.oldRef} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Título do Anúncio *</label>
                    <input name="title" value={formData.title} onChange={handleChange} required style={styles.input} />
                </div>
            </div>

            {/* Checkboxes Superiores */}
            <div style={{...styles.row, background: '#2a2a2a', padding: 10, borderRadius: 4}}>
                <label style={styles.checkLabel}><input type="checkbox" name="showOnSite" checked={formData.showOnSite} onChange={handleChange} /> Exibir este imóvel no site</label>
                <label style={styles.checkLabel}><input type="checkbox" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} /> Imóvel Exclusivo</label>
                <label style={styles.checkLabel}><input type="checkbox" name="hasSign" checked={formData.hasSign} onChange={handleChange} /> Placa em frente ao imóvel</label>
            </div>

            {/* Finalidade */}
            <div style={{...styles.row, marginTop: 15}}>
                <label style={{...styles.label, width: 100, paddingTop: 3}}>Finalidade:</label>
                <div style={styles.checkGroup}>
                    <label style={styles.checkLabel}><input type="checkbox" name="isSale" checked={formData.isSale} onChange={handleChange} /> Venda</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isRentAnnual" checked={formData.isRentAnnual} onChange={handleChange} /> Aluguel Anual</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isRentSeason" checked={formData.isRentSeason} onChange={handleChange} /> Aluguel Temporada</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isRentStudent" checked={formData.isRentStudent} onChange={handleChange} /> Aluguel Estudante</label>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Tipo de Imóvel *</label>
                    <select name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                        <option value="APARTAMENTO">Apartamento</option>
                        <option value="CASA">Casa</option>
                        <option value="COBERTURA">Cobertura</option>
                        <option value="TERRENO">Terreno</option>
                        <option value="SALA_COMERCIAL">Sala Comercial</option>
                    </select>
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Situação *</label>
                    <div style={{...styles.checkGroup, marginTop: 10}}>
                        <label style={styles.checkLabel}><input type="radio" name="status" value="DISPONIVEL" checked={formData.status === 'DISPONIVEL'} onChange={handleChange} /> Disponível</label>
                        <label style={styles.checkLabel}><input type="radio" name="status" value="VENDIDO" checked={formData.status === 'VENDIDO'} onChange={handleChange} /> Vendido</label>
                        <label style={styles.checkLabel}><input type="radio" name="status" value="RESERVADO" checked={formData.status === 'RESERVADO'} onChange={handleChange} /> Reservado</label>
                        <label style={styles.checkLabel}><input type="radio" name="status" value="NAO_DISPONIVEL" checked={formData.status === 'NAO_DISPONIVEL'} onChange={handleChange} /> Não Disp.</label>
                        <label style={styles.checkLabel}><input type="radio" name="status" value="ALUGADO" checked={formData.status === 'ALUGADO'} onChange={handleChange} /> Alugado</label>
                    </div>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Estágio da Obra *</label>
                    <div style={{...styles.checkGroup, marginTop: 10}}>
                        <label style={styles.checkLabel}><input type="radio" name="constructionStage" value="LANCAMENTO" checked={formData.constructionStage === 'LANCAMENTO'} onChange={handleChange} /> Lançamento</label>
                        <label style={styles.checkLabel}><input type="radio" name="constructionStage" value="EM_OBRA" checked={formData.constructionStage === 'EM_OBRA'} onChange={handleChange} /> Em Construção</label>
                        <label style={styles.checkLabel}><input type="radio" name="constructionStage" value="PRONTO" checked={formData.constructionStage === 'PRONTO'} onChange={handleChange} /> Pronto para morar</label>
                    </div>
                </div>
            </div>

            {/* Características Importantes */}
            <div style={{...styles.row, marginTop: 15, borderTop: '1px dashed #444', paddingTop: 15}}>
                <label style={{...styles.label, width: 100}}>Destaques:</label>
                <div style={styles.checkGroup}>
                    <label style={styles.checkLabel}><input type="checkbox" name="isSeaFront" checked={formData.isSeaFront} onChange={handleChange} /> Frente Mar</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isSeaQuadra" checked={formData.isSeaQuadra} onChange={handleChange} /> Quadra Mar</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isFurnished" checked={formData.isFurnished} onChange={handleChange} /> Mobiliado</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isHighStandard" checked={formData.isHighStandard} onChange={handleChange} /> Alto Padrão</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isDifferentiated" checked={formData.isDifferentiated} onChange={handleChange} /> Diferenciado</label>
                </div>
            </div>

            {/* Tarja */}
            <div style={{...styles.row, marginTop: 15, alignItems: 'center'}}>
                <label style={{...styles.label, marginBottom: 0, marginRight: 10}}>💳 Tarja:</label>
                <input name="badgeText" value={formData.badgeText} onChange={handleChange} style={{...styles.input, width: 300}} placeholder="Ex: DECORADO" />
                <select name="badgeColor" value={formData.badgeColor} onChange={handleChange} style={{...styles.input, width: 150}}>
                    <option value="">Selecione Cor</option>
                    {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
            </div>
        </div>

        {/* 2. VALORES */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaDollarSign /> Valores e Negociação</div>
            
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Valor de Venda (R$)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} style={{...styles.input, fontSize: '1.2rem', fontWeight:'bold'}} />
                    <label style={{...styles.checkLabel, marginTop: 5}}>
                        <input type="checkbox" name="hasDiscount" checked={formData.hasDiscount} onChange={handleChange} /> valor com desconto
                    </label>
                </div>
                {formData.hasDiscount && (
                    <div style={styles.col}>
                        <label style={styles.label}>Valor Promocional</label>
                        <input type="number" name="promotionalPrice" value={formData.promotionalPrice} onChange={handleChange} style={{...styles.input, borderColor: '#28a745'}} />
                    </div>
                )}
            </div>

            <div style={{...styles.row, background: '#2a2a2a', padding: 10, borderRadius: 4}}>
                <div style={styles.checkGroup}>
                    <label style={styles.checkLabel}><input type="checkbox" name="acceptsFinancing" checked={formData.acceptsFinancing} onChange={handleChange} /> Aceita financiamento</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="acceptsConstructionFinancing" checked={formData.acceptsConstructionFinancing} onChange={handleChange} /> Financiamento Construtora</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="acceptsTrade" checked={formData.acceptsTrade} onChange={handleChange} /> Aceita permuta</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="acceptsVehicle" checked={formData.acceptsVehicle} onChange={handleChange} /> Aceita veículo</label>
                    <label style={styles.checkLabel}><input type="checkbox" name="isMcmv" checked={formData.isMcmv} onChange={handleChange} /> Minha Casa Minha Vida</label>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>IPTU Anual</label>
                    <input type="number" name="iptuPrice" value={formData.iptuPrice} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Condomínio Mensal</label>
                    <input type="number" name="condoFee" value={formData.condoFee} onChange={handleChange} style={styles.input} />
                </div>
            </div>
        </div>

        {/* 3. DETALHAMENTO */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaTh /> Detalhamento</div>
            <div style={styles.row}>
                <div style={styles.col}>
                    <label style={styles.label}>Área Privativa (m²)</label>
                    <input type="number" name="privateArea" value={formData.privateArea} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.col}>
                    <label style={styles.label}>Área Total (m²)</label>
                    <input type="number" name="totalArea" value={formData.totalArea} onChange={handleChange} style={styles.input} />
                </div>
            </div>
            <div style={styles.row}>
                <div style={{...styles.col, maxWidth: 100}}>
                    <label style={styles.label}>Dormitórios</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{...styles.col, maxWidth: 100}}>
                    <label style={styles.label}>Suítes</label>
                    <input type="number" name="suites" value={formData.suites} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{...styles.col, maxWidth: 100}}>
                    <label style={styles.label}>Banheiros</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} style={styles.input} />
                </div>
            </div>
            <div style={styles.row}>
                <div style={{flex:1}}>
                    <label style={styles.label}>Vagas Garagem</label>
                    <div style={{display:'flex', gap: 5}}>
                        <input type="number" name="garageSpots" value={formData.garageSpots} onChange={handleChange} style={{...styles.input, width: 80}} />
                        <select name="garageType" value={formData.garageType} onChange={handleChange} style={styles.input}>
                            <option value="Privativa">Privativa</option>
                            <option value="Rotativa">Rotativa</option>
                            <option value="Numerada">Numerada</option>
                        </select>
                    </div>
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Posição Solar</label>
                    <select name="solarPosition" value={formData.solarPosition} onChange={handleChange} style={styles.input}>
                        <option value="">Selecione...</option>
                        <option value="Norte">Norte</option>
                        <option value="Sul">Sul</option>
                        <option value="Leste">Leste</option>
                        <option value="Oeste">Oeste</option>
                        <option value="Sol da Manhã">Sol da Manhã</option>
                        <option value="Sol da Tarde">Sol da Tarde</option>
                    </select>
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Posição Relativa</label>
                    <select name="relativePosition" value={formData.relativePosition} onChange={handleChange} style={styles.input}>
                        <option value="Frente">Frente</option>
                        <option value="Fundos">Fundos</option>
                        <option value="Lateral">Lateral</option>
                    </select>
                </div>
            </div>
        </div>

        {/* 4. AS 3 LISTAS DE CARACTERÍSTICAS */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}>Características e Infraestrutura</div>
            <div style={{display:'flex', gap: 30, flexWrap:'wrap'}}>
                
                {/* Ambientes */}
                <div style={{flex: 1, minWidth: 280}}>
                    <h4 style={{color:'#ccc', borderBottom:'1px solid #444', paddingBottom:5, marginTop:0}}>Ambientes do Imóvel</h4>
                    <div style={{display:'flex', flexDirection:'column', gap: 5, maxHeight: 300, overflowY:'auto', paddingRight:5}}>
                        {ROOM_OPTS.map(item => (
                            <label key={item} style={styles.checkLabel}>
                                <input type="checkbox" checked={formData.roomFeatures.includes(item)} onChange={() => handleListToggle('roomFeatures', item)} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Características Imóvel */}
                <div style={{flex: 1, minWidth: 280}}>
                    <h4 style={{color:'#ccc', borderBottom:'1px solid #444', paddingBottom:5, marginTop:0}}>Características Imóvel</h4>
                    <div style={{display:'flex', flexDirection:'column', gap: 5, maxHeight: 300, overflowY:'auto', paddingRight:5}}>
                        {PROPERTY_OPTS.map(item => (
                            <label key={item} style={styles.checkLabel}>
                                <input type="checkbox" checked={formData.propertyFeatures.includes(item)} onChange={() => handleListToggle('propertyFeatures', item)} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Empreendimento */}
                <div style={{flex: 1, minWidth: 280}}>
                    <h4 style={{color:'#ccc', borderBottom:'1px solid #444', paddingBottom:5, marginTop:0}}>Empreendimento</h4>
                    <div style={{display:'flex', flexDirection:'column', gap: 5, maxHeight: 300, overflowY:'auto', paddingRight:5}}>
                        {DEVELOPMENT_OPTS.map(item => (
                            <label key={item} style={styles.checkLabel}>
                                <input type="checkbox" checked={formData.developmentFeatures.includes(item)} onChange={() => handleListToggle('developmentFeatures', item)} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        {/* 5. LOCALIZAÇÃO */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaHome /> Localização</div>
            <div style={styles.row}>
                <div style={{width: 120}}>
                    <label style={styles.label}>CEP</label>
                    <input name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} style={styles.input} />
                </div>
                <div style={{flex: 1}}>
                    <label style={styles.label}>Cidade</label>
                    <input name="city" value={formData.address.city} onChange={handleAddressChange} style={styles.input} />
                </div>
                <div style={{width: 60}}>
                    <label style={styles.label}>UF</label>
                    <input name="state" value={formData.address.state} onChange={handleAddressChange} style={styles.input} />
                </div>
            </div>
            <div style={styles.row}>
                <div style={{flex: 1}}>
                    <label style={styles.label}>Bairro</label>
                    <input name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} style={styles.input} />
                </div>
                <div style={{flex: 2}}>
                    <label style={styles.label}>Logradouro</label>
                    <input name="street" value={formData.address.street} onChange={handleAddressChange} style={styles.input} />
                </div>
                <div style={{width: 100}}>
                    <label style={styles.label}>Número</label>
                    <input name="number" value={formData.address.number} onChange={handleAddressChange} style={styles.input} />
                </div>
                <div style={{width: 120}}>
                    <label style={styles.label}>Compl.</label>
                    <input name="complement" value={formData.address.complement} onChange={handleAddressChange} style={styles.input} />
                </div>
            </div>
            <div style={styles.row}>
                <div style={{flex: 1}}>
                    <label style={styles.label}>Nome do Edifício</label>
                    <input name="buildingName" value={formData.buildingName} onChange={handleChange} style={styles.input} placeholder="Ex: Edifício Aurora" />
                </div>
                <div style={{display:'flex', alignItems:'center', marginTop: 20}}>
                    <label style={styles.checkLabel}><input type="checkbox" name="displayAddress" checked={formData.displayAddress} onChange={handleChange} /> Exibir endereço no site</label>
                </div>
            </div>
        </div>

        {/* 6. MÍDIA E FOTOS */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaImages /> Multimídia</div>
            <div style={styles.row}>
                <div style={{flex: 1}}>
                    <label style={styles.label}><FaYoutube color="red"/> Vídeo YouTube</label>
                    <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} style={styles.input} placeholder="https://youtube.com/..." />
                </div>
                <div style={{flex: 1}}>
                    <label style={styles.label}><FaCube color="#d4af37"/> Tour Virtual (Matterport)</label>
                    <input name="tourUrl" value={formData.tourUrl} onChange={handleChange} style={styles.input} placeholder="URL do tour..." />
                </div>
            </div>
            
            <label style={{...styles.label, marginTop: 10}}>Galeria de Fotos</label>
            <div style={styles.row}>
                <input name="tempImageUrl" placeholder="Cole o link da imagem..." value={formData.tempImageUrl} onChange={handleChange} style={styles.input} />
                <button type="button" onClick={addImage} style={{padding: '0 20px', background: '#444', color: '#fff', border:'none', cursor:'pointer'}}>Adicionar</button>
            </div>
            <div style={{display:'flex', gap: 10, flexWrap:'wrap', marginTop: 10}}>
                {formData.images.map((img, idx) => (
                    <div key={idx} style={{position:'relative', width: 100, height: 80}}>
                        <img src={img.url} alt="" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius: 4, border: '1px solid #555'}} />
                        <button type="button" onClick={() => removeImage(idx)} style={{position:'absolute', top:-5, right:-5, background:'red', color:'#fff', border:'none', width: 20, height: 20, borderRadius:'50%', cursor:'pointer'}}>&times;</button>
                        {img.isCover && <span style={{position:'absolute', bottom:0, right:0, background:'#d4af37', color:'#000', fontSize:9, padding:'1px 3px'}}>CAPA</span>}
                    </div>
                ))}
            </div>
        </div>

        {/* 7. DADOS PRIVADOS */}
        <div style={{...styles.section, border: '1px solid #5c4018', background: '#2b251e'}}>
            <div style={{...styles.sectionTitle, color: '#d4af37', borderBottomColor: '#5c4018'}}><FaLock /> Dados Privados (Uso Interno)</div>
            
            <div style={styles.row}>
                <div style={{flex:1}}>
                    <label style={styles.label}>Proprietário</label>
                    <input name="ownerName" value={formData.ownerName} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Telefone</label>
                    <input name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Email</label>
                    <input name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <div style={styles.row}>
                <div style={{flex:1}}>
                    <label style={styles.label}>Síndico</label>
                    <input name="condoManager" value={formData.condoManager} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Administradora</label>
                    <input name="buildingAdministrator" value={formData.buildingAdministrator} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Construtora</label>
                    <input name="constructionCompany" value={formData.constructionCompany} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <div style={styles.row}>
                <div style={{flex:1}}>
                    <label style={styles.label}><FaKey /> Onde estão as chaves?</label>
                    <input name="keysLocation" value={formData.keysLocation} onChange={handleChange} style={styles.input} placeholder="Ex: Portaria" />
                </div>
                <div style={{display:'flex', alignItems:'center', marginTop: 20, flex: 1}}>
                    <label style={styles.checkLabel}><input type="checkbox" name="exclusivitySigned" checked={formData.exclusivitySigned} onChange={handleChange} /> Autorização de Venda Assinada</label>
                </div>
            </div>

            <div style={{marginTop: 10}}>
                <label style={styles.label}>Observações Internas (Não aparece no site)</label>
                <textarea name="brokerNotes" value={formData.brokerNotes} onChange={handleChange} style={{...styles.input, resize:'vertical'}} rows={3} />
            </div>
        </div>

        {/* 8. DESCRIÇÃO */}
        <div style={styles.section}>
            <div style={styles.sectionTitle}><FaFileAlt /> Descrição Pública</div>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{...styles.input, resize:'vertical'}} rows={8} />
        </div>

        {/* BOTÕES FLUTUANTES OU FIXOS */}
        <div style={{display:'flex', justifyContent:'flex-end', gap: 15, marginTop: 30, paddingBottom: 50}}>
            <button type="button" style={styles.btnCancel} onClick={() => navigate('/intranet')}>CANCELAR</button>
            <button type="submit" style={styles.btnSave} disabled={loading}>{loading ? 'SALVANDO...' : 'SALVAR IMÓVEL'}</button>
        </div>

      </form>
    </div>
  );
}