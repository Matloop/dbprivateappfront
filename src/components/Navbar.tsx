import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaInstagram, FaHome } from 'react-icons/fa';
import './Navbar.css';
import { useFavorites } from '../hooks/useFavorites';

export const Navbar = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  return (
    <div className="site-header-wrapper">
      
      {/* 1. TOP BAR (Faixa preta fina) */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="info-item">CRECI/SC 4.109-J - Balneário Camboriú / SC</span>
        </div>
        
        <div className="top-bar-right">
          {/* Telefone (Link para discagem) */}
          <a href="tel:+554796510619" className="info-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaPhoneAlt size={12} />
            <span>(47) 9651-0619</span>
          </a>

          {/* WhatsApp (Abre API direto) */}
          <a 
            href="https://wa.me/554796510619" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="info-item"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <FaWhatsapp size={14} />
            <span>WhatsApp</span>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/danillobezerradb/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="info-item"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
          >
            <FaInstagram size={16} />
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo e Menu) */}
      <nav className="main-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
             {/* Certifique-se que o caminho da imagem está correto */}
             <img src="/src/assets/logo2025.png" alt="DB Private" style={{height: '50px'}} />
        </div>
        
        <div className="nav-menu">
          <Link to="/" className="home-btn"><FaHome color="#fff" /></Link>
          <Link to="/sobre" className="nav-link">SOBRE</Link>
          
          <Link to="/vendas" className="nav-link active-link">
            VENDAS <span style={{fontSize: 10, marginLeft: 3}}>▼</span>
          </Link>
          
          <Link to="/favoritos" className="nav-link" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            FAVORITOS
            {favorites.length > 0 && (
                <span style={{
                    background: '#d4af37', color: '#000', borderRadius: '50%', 
                    fontSize: '0.7rem', width: '18px', height: '18px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                    {favorites.length}
                </span>
            )}
          </Link>
          
        </div>
      </nav>
    </div>
  );
};