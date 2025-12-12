'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, CheckCircle2, Instagram, Home } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites'; 
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  if (pathname.startsWith('/intranet') || pathname.startsWith('/login')) {
    return null;
  }
  
  const { favorites } = useFavorites();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col w-full z-50 relative bg-background transition-colors duration-300">
      {/* TOP BAR */}
      <div className="bg-muted/50 text-muted-foreground text-xs py-2 px-[5%] flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 border-b border-border">
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
      <nav className="bg-background py-4 px-[5%] flex flex-col md:flex-row justify-between items-center border-b border-border gap-4 md:gap-0 transition-colors duration-300">
        <div onClick={() => router.push('/')} className="cursor-pointer hover:opacity-90 transition-opacity">
           <img src="/logo2025.png" alt="DB Private" className="h-10 md:h-12 object-contain" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            <Home size={18} />
          </Link>
          
          <Link href="/sobre" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary", isActive('/sobre') ? "text-primary" : "text-foreground")}>
            SOBRE
          </Link>
          <Link href="/vendas" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary", isActive('/vendas') ? "text-primary" : "text-foreground")}>
            VENDAS 
          </Link>
          <Link href="/favoritos" className={cn("text-sm font-medium tracking-widest transition-colors hover:text-primary flex items-center gap-2", isActive('/favoritos') ? "text-primary" : "text-foreground")}>
            FAVORITOS
            {favorites.length > 0 && (
                <span className="bg-primary text-primary-foreground font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
                    {favorites.length}
                </span>
            )}
          </Link>

          <div className="pl-2 border-l border-border ml-2">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
};