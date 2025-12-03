import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaInstagram, FaHome, FaSearch } from 'react-icons/fa';
import './Navbar.css'; // Vamos criar esse CSS logo abaixo

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="site-header-wrapper">
      
      {/* 1. TOP BAR (Faixa preta fina) */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="info-item">CRECI/SC 4.109-J - Balneário Camboriú / SC</span>
        </div>
        <div className="top-bar-right">
          <div className="info-item"><FaPhoneAlt size={12} /><span>(47) 9.9653-5489</span></div>
          <div className="info-item"><FaWhatsapp size={14} /><span>WhatsApp</span></div>
          <div className="info-item"><FaInstagram size={16} /></div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo e Menu) */}
      <nav className="main-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
             {/* Substitua pelo caminho real da sua logo */}
             <img src="/src/assets/logo2025.png" alt="DB Private" style={{height: '50px'}} />
        </div>
        
        <div className="nav-menu">
          <Link to="/" className="home-btn"><FaHome color="#fff" /></Link>
          <Link to="/sobre" className="nav-link">SOBRE</Link>
          
          {/* Botão Vendas com destaque Dourado */}
          <Link to="/vendas" className="nav-link active-link">
            VENDAS <span style={{fontSize: 10, marginLeft: 3}}>▼</span>
          </Link>
          
          <Link to="/contato" className="nav-link">CONTATO</Link>
          
          <FaSearch className="search-btn" />
        </div>
      </nav>
    </div>
  );
};