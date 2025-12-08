import { FaWhatsapp } from 'react-icons/fa';

export const FloatingWhatsApp = () => {
  const phoneNumber = "554796510619"; 
  const message = encodeURIComponent("Olá! Vim pelo site da DB Private e gostaria de mais informações.");

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-center gap-2">
      <a 
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 animate-in fade-in zoom-in"
        aria-label="Falar no WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9" />
        
        {/* Tooltip (Só aparece no hover em desktop) */}
        <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block shadow-md">
          Fale Conosco
        </span>

        {/* Efeito de "Pulse" usando Tailwind ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>

        {/* Bolinha de Notificação */}
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-[#121212]">
          1
        </span>
      </a>
    </div>
  );
};