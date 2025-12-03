import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { PropertiesList } from './PropertiesList'; // Certifique-se que o caminho está certo

// Componentes Placeholder para as abas futuras
const PlaceholderTab = ({ title }: { title: string }) => (
  <div style={{ padding: '50px', color: '#888', textAlign: 'center' }}>
    <h2 style={{ color: '#d4af37' }}>🚧 Módulo {title}</h2>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

export function Intranet({ session }: { session: any }) {
  const [activeTab, setActiveTab] = useState('imoveis');

  // Estilos (Tema Escuro + Dourado)
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      width: '100vw',
      background: '#121212', // Fundo bem escuro
      fontFamily: 'sans-serif',
      overflow: 'hidden'
    },
    header: {
      padding: '10px 30px',
      background: '#000', // Topo preto
      borderBottom: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px'
    },
    logo: {
      color: '#d4af37', // Dourado
      fontSize: '1.5rem',
      fontWeight: 'bold',
      letterSpacing: '2px',
      border: '2px solid #d4af37',
      padding: '2px 10px',
      borderRadius: '4px'
    },
    userInfo: {
      color: '#aaa',
      fontSize: '0.9rem',
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    },
    logoutBtn: {
      background: 'transparent',
      border: '1px solid #555',
      color: '#ccc',
      padding: '5px 15px',
      cursor: 'pointer',
      borderRadius: '4px',
      fontSize: '0.8rem'
    },
    navBar: {
      background: '#1a1a1a',
      display: 'flex',
      gap: '2px', // Espacinho entre abas
      padding: '10px 20px 0 20px',
      borderBottom: '1px solid #333'
    },
    tab: (isActive: boolean) => ({
      padding: '10px 25px',
      cursor: 'pointer',
      background: isActive ? '#333' : '#222', // Aba ativa mais clara
      color: isActive ? '#d4af37' : '#888',   // Texto dourado se ativo
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px',
      fontWeight: isActive ? 'bold' as const : 'normal' as const,
      borderTop: isActive ? '3px solid #d4af37' : '3px solid transparent',
      fontSize: '0.9rem',
      transition: 'all 0.2s'
    }),
    contentArea: {
      flex: 1,
      background: '#1a1a1a', // Cor de fundo do conteúdo
      overflow: 'hidden',    // Importante para a tabela ter seu próprio scroll
      position: 'relative' as const
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- 1. HEADER SUPERIOR --- */}
      <header style={styles.header}>
        <div style={styles.logo}>DB PRIVATE</div>
        
        <div style={styles.userInfo}>
          <span>Olá, <strong>{session?.user?.email}</strong></span>
          <button 
            style={styles.logoutBtn}
            onClick={() => supabase.auth.signOut()}
          >
            Sair ➔
          </button>
        </div>
      </header>

      {/* --- 2. BARRA DE NAVEGAÇÃO (ABAS) --- */}
      <nav style={styles.navBar}>
        {['Leads', 'Clientes', 'Destaques', 'Imóveis'].map((tabName) => {
          const key = tabName.toLowerCase().replace('ó', 'o'); // imoveis
          const isActive = activeTab === key;
          
          return (
            <div 
              key={key}
              style={styles.tab(isActive)}
              onClick={() => setActiveTab(key)}
            >
              {tabName}
              {key === 'leads' && <sup style={{color:'red', marginLeft:5}}>99+</sup>}
            </div>
          );
        })}
      </nav>

      {/* --- 3. ÁREA DE CONTEÚDO --- */}
      <main style={styles.contentArea}>
        
        {/* Renderização Condicional das Abas */}
        {activeTab === 'imoveis' && (
          // Aqui renderizamos a sua PropertiesList que já criamos
          // Como ela tem width: 100vw, vamos criar um wrapper para conter ela nesse espaço
          <div style={{ width: '100%', height: '100%' }}>
            <PropertiesList />
          </div>
        )}

        {activeTab === 'leads' && <PlaceholderTab title="Leads (CRM)" />}
        {activeTab === 'clientes' && <PlaceholderTab title="Carteira de Clientes" />}
        {activeTab === 'destaques' && <PlaceholderTab title="Destaques do Site" />}

      </main>
    </div>
  );
}