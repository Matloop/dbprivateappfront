'use client'; // <--- IMPORTANTE

import Link from 'next/link'; // Link do Next
import { usePathname, useRouter } from 'next/navigation'; // Hooks do Next
import { Phone, CheckCircle2, Instagram, Home } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Substituto do useLocation
  const { favorites } = useFavorites();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col w-full z-50 relative bg-background">
      {/* TOP BAR */}
      <div className="bg-[#050505] text-gray-500 text-xs py-2 px-[5%] flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-primary" />
          <span>CRECI/SC 4.109-J - Balneário Camboriú / SC</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="tel:+554796510619" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Phone size={12} /><span>(47) 9651-0619</span>
          </a>
          <a href="https://wa.me/554796510619" target="_blank" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors">
            <FaWhatsapp size={14} /><span>WhatsApp</span>
          </a>
          <a href="https://www.instagram.com/danillobezerradb/" target="_blank" className="flex items-center hover:text-[#E1306C] transition-colors">
            <Instagram size={14} />
          </a>
        </div>
      </div>

      {/* MAIN HEADER */}
      <nav className="bg-[#0f0f0f] py-4 px-[5%] flex flex-col md:flex-row justify-between items-center border-b border-white/10 gap-4 md:gap-0">
        <div onClick={() => router.push('/')} className="cursor-pointer hover:opacity-90 transition-opacity">
           {/* IMPORTANTE: Coloque sua logo em public/assets/ ou ajuste o caminho */}
           {/* No Next, se a imagem está em public/logo.png, o src é "/logo.png" */}
           <img src="/logo2025.png" alt="DB Private" className="h-10 md:h-12 object-contain" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center justify-center w-9 h-9 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
            <Home size={18} />
          </Link>
          <Link href="/sobre" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary", isActive('/sobre') ? "text-primary" : "text-white")}>
            SOBRE
          </Link>
          <Link href="/vendas" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary", isActive('/vendas') ? "text-primary" : "text-white")}>
            VENDAS 
          </Link>
          <Link href="/favoritos" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary flex items-center gap-2", isActive('/favoritos') ? "text-primary" : "text-white")}>
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