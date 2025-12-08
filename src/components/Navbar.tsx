import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, CheckCircle2, Instagram, Home } from 'lucide-react'; // Usando Lucide para consistência
import { FaWhatsapp } from 'react-icons/fa'; // Mantendo ícone de marca específico
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorites();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col w-full z-50 relative bg-background">
      
      {/* 1. TOP BAR */}
      <div className="bg-[#050505] text-gray-500 text-xs py-2 px-[5%] flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-primary" />
          <span>CRECI/SC 4.109-J - Balneário Camboriú / SC</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="tel:+554796510619" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Phone size={12} />
            <span>(47) 9651-0619</span>
          </a>

          <a 
            href="https://wa.me/554796510619" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
          >
            <FaWhatsapp size={14} />
            <span>WhatsApp</span>
          </a>

          <a 
            href="https://www.instagram.com/danillobezerradb/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center hover:text-[#E1306C] transition-colors"
          >
            <Instagram size={14} />
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <nav className="bg-[#0f0f0f] py-4 px-[5%] flex flex-col md:flex-row justify-between items-center border-b border-white/10 gap-4 md:gap-0">
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img src="/src/assets/logo2025.png" alt="DB Private" className="h-10 md:h-12 object-contain" />
        </div>
        
        {/* Menu */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <Link 
            to="/" 
            className="flex items-center justify-center w-9 h-9 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            <Home size={18} />
          </Link>

          <Link 
            to="/sobre" 
            className={cn(
              "text-sm font-medium tracking-widest transition-colors hover:text-primary",
              isActive('/sobre') ? "text-primary" : "text-white"
            )}
          >
            SOBRE
          </Link>
          
          <Link 
            to="/vendas" 
            className={cn(
              "text-sm font-medium tracking-widest transition-colors hover:text-primary flex items-center gap-1",
              isActive('/vendas') ? "text-primary" : "text-white"
            )}
          >
            VENDAS 
          </Link>
          
          <Link 
            to="/favoritos" 
            className={cn(
              "text-sm font-medium tracking-widest transition-colors hover:text-primary flex items-center gap-2",
              isActive('/favoritos') ? "text-primary" : "text-white"
            )}
          >
            FAVORITOS
            {favorites.length > 0 && (
                <span className="bg-primary text-black font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                </span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
};