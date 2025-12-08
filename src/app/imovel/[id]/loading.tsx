import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#121212] z-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        {/* Ícone de Carregamento Dourado */}
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        
        {/* Texto opcional */}
        <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-light animate-pulse">
          Carregando detalhes...
        </p>
      </div>
    </div>
  );
}