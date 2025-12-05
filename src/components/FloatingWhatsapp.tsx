import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export const FloatingWhatsApp = () => {
  const phoneNumber = "554796510619"; 
  const message = encodeURIComponent("Olá! Vim pelo site da DB Private e gostaria de mais informações.");

  return (
    <a 
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        zIndex: 99999, // Z-Index bem alto para garantir
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'transform 0.3s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <FaWhatsapp size={35} />
      
      {/* Bolinha de Notificação */}
      <span style={{
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: '#ff0000',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #121212'
      }}>
        1
      </span>
    </a>
  );
};