import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FloatingWhatsApp } from '../components/FloatingWhatsapp';

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      <footer style={{background: '#0f0f0f', padding: 20, textAlign: 'center', color: '#555', fontSize: '0.8rem', borderTop: '1px solid #222'}}>
        DB PRIVATE © 2025 - Todos os direitos reservados.
      </footer>

      {/* O componente deve estar aqui, fora do footer */}
      <FloatingWhatsApp />
    </div>
  );
};