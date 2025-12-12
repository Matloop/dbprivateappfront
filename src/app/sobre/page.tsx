import React from 'react';
import Link from 'next/link';
import { DollarSign, Mail, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Sobre Danillo Bezerra | Consultoria Imobiliária',
  description: 'Conheça a trajetória de Danillo Bezerra, especialista em investimentos imobiliários de alto padrão no sul do Brasil.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* --- COLUNA DA ESQUERDA (CONTEÚDO) --- */}
        <div className="lg:col-span-7 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Consistência e <span className="text-primary">Resultados Reais.</span>
          </h1>
          
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-justify font-light text-muted-foreground">
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

          <div className="w-full h-px bg-border my-10" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-3 uppercase tracking-wide border-l-4 border-primary pl-3">
              Missão
            </h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Oferecer uma consultoria de investimentos imobiliários eficiente, fundamentada e personalizada, guiando o cliente nas melhores escolhas com clareza, responsabilidade e alto padrão de entrega.
            </p>
          </section>

          <div className="w-full h-px bg-border my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-3 uppercase tracking-wide border-l-4 border-primary pl-3">
              Visão
            </h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Ser reconhecido como referência em consultoria de investimentos imobiliários no Brasil, atendendo um público exigente com foco em valorização consistente, inteligência estratégica e construção de legado.
            </p>
          </section>

          <div className="w-full h-px bg-border my-8" />

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4 uppercase tracking-wide border-l-4 border-primary pl-3">
              Valores
            </h2>
            <ul className="space-y-3">
              {[
                "Integridade em cada decisão",
                "Atendimento com propósito e excelência",
                "Comprometimento com o resultado do cliente",
                "Profissionalismo e preparação contínua",
                "Relacionamento baseado em confiança e visão de longo prazo"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link 
              href="/cadastre-seu-imovel" 
              className="group flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg shadow-sm hover:border-primary hover:text-primary text-foreground transition-all duration-300 font-medium uppercase text-sm"
            >
              <DollarSign className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
              cadastre seu imóvel
            </Link>
            
            <Link 
              href="/contato" 
              className="group flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-lg shadow-sm hover:border-primary hover:text-primary text-foreground transition-all duration-300 font-medium uppercase text-sm"
            >
              <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
              entre em contato
            </Link>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA --- */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-8 w-full">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border bg-black">
              <iframe 
                className="absolute inset-0 w-full h-full object-cover"
                src="https://www.youtube.com/embed/SEU_VIDEO_ID" 
                title="Apresentação Danillo Bezerra" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">
                Balneário Camboriú • SC
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}