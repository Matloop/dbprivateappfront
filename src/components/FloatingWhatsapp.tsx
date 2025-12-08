import { FaWhatsapp } from 'react-icons/fa';

const CONFIG = {
  PHONE: "554796510619",
  MESSAGE: "Olá! Vim pelo site da DB Private e gostaria de mais informações."
};

export const FloatingWhatsApp = () => {
  const link = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(CONFIG.MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-xl transition-all duration-300 hover:bg-[#20ba5a] hover:scale-110 hover:-translate-y-1"
      >
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
          Fale Conosco
        </span>
        
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
        
        <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9" />
        
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-[#121212]">
          1
        </span>
      </a>
    </div>
  );
};