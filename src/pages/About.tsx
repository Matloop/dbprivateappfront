import { DollarSign, Mail } from 'lucide-react';

export function About() {
  return (
    // Container Geral: bg-[#1a1a1a] para manter a cor exata do print
    <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0] py-10 px-5 font-sans">
      
      {/* Container Centralizado (max-width: 1200px) */}
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row gap-12 items-start">
        
        {/* --- COLUNA ESQUERDA (Texto) --- */}
        <div className="flex-1">
          <h1 className="text-white text-3xl font-medium mb-6">
            Consistência e Resultados Reais.
          </h1>

          <div className="space-y-4 text-[#ccc] text-justify leading-relaxed text-[0.95rem]">
            <p>
              Danillo Bezerra é consultor de investimentos imobiliários com mais de uma década de atuação nos mercados mais valorizados do sul do Brasil.
            </p>
            <p>
              Especializado em imóveis de alto padrão com forte potencial de valorização e liquidez, atende uma carteira selecionada de clientes em busca de orientação estratégica, decisões seguras e construção patrimonial sólida.
            </p>
            <p>
              Sua atuação é marcada por visão, excelência e uma abordagem personalizada, que combina inteligência de mercado, leitura comportamental e experiência prática.
            </p>
            <p>
              Com base em pilares bem definidos: ética, propósito e estratégia. Danillo conduz cada negociação como parte de um plano maior, pautado por consistência e resultados reais.
            </p>
          </div>

          {/* Divisor */}
          <div className="h-px w-full bg-[#333] my-8"></div>

          {/* Missão, Visão e Valores */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[#d4af37] text-2xl font-medium mb-2">Missão</h2>
              <p className="text-[#ccc] leading-relaxed text-[0.95rem]">
                Oferecer uma consultoria de investimentos imobiliários eficiente, fundamentada e personalizada, guiando o cliente nas melhores escolhas com clareza, responsabilidade e alto padrão de entrega.
              </p>
            </div>

            <div>
              <h2 className="text-[#d4af37] text-2xl font-medium mb-2">Visão</h2>
              <p className="text-[#ccc] leading-relaxed text-[0.95rem]">
                Ser reconhecido como referência em consultoria de investimentos imobiliários no Brasil, atendendo um público exigente com foco em valorização consistente, inteligência estratégica e construção de legado.
              </p>
            </div>

            <div>
              <h2 className="text-[#d4af37] text-2xl font-medium mb-2">Valores</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#ccc] text-[0.95rem]">
                <li>Integridade em cada decisão</li>
                <li>Atendimento com propósito e excelência</li>
                <li>Comprometimento com o resultado do cliente</li>
                <li>Profissionalismo e preparação contínua</li>
                <li>Relacionamento baseado em confiança e visão de longo prazo</li>
              </ul>
            </div>
          </div>

          {/* Links do Rodapé da Seção */}
          <div className="mt-10 flex flex-col gap-3">
            <a href="#" className="flex items-center gap-2 text-[#bbb] hover:text-[#d4af37] transition-colors text-sm font-medium">
              <DollarSign className="w-5 h-5 text-[#d4af37]" />
              CADASTRE SEU IMÓVEL
            </a>
            <a href="https://wa.me/554796510619" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#bbb] hover:text-[#d4af37] transition-colors text-sm font-medium">
              <Mail className="w-5 h-5 text-[#d4af37]" />
              ENTRE EM CONTATO
            </a>
          </div>
        </div>

        {/* --- COLUNA DIREITA (Vídeo) --- */}
        <div className="flex-1 w-full lg:sticky lg:top-6">
          <div className="w-full aspect-video bg-black rounded shadow-lg overflow-hidden border border-[#333]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/tGHLcLBw8bs?si=SeuVideoID" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}