import { FaDollarSign, FaEnvelope } from 'react-icons/fa';
import './About.css';

export const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        
        {/* --- COLUNA DA ESQUERDA (TEXTO) --- */}
        <div className="about-content">
          <h1 className="about-title">Consistência e Resultados Reais.</h1>
          
          <div className="about-bio">
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

          <hr className="divider" />

          <div className="about-section">
            <h2>Missão</h2>
            <p>
              Oferecer uma consultoria de investimentos imobiliários eficiente, fundamentada e personalizada, guiando o cliente nas melhores escolhas com clareza, responsabilidade e alto padrão de entrega.
            </p>
          </div>

          <hr className="divider" />

          <div className="about-section">
            <h2>Visão</h2>
            <p>
              Ser reconhecido como referência em consultoria de investimentos imobiliários no Brasil, atendendo um público exigente com foco em valorização consistente, inteligência estratégica e construção de legado.
            </p>
          </div>

          <hr className="divider" />

          <div className="about-section">
            <h2>Valores</h2>
            <ul className="values-list">
              <li>Integridade em cada decisão</li>
              <li>Atendimento com propósito e excelência</li>
              <li>Comprometimento com o resultado do cliente</li>
              <li>Profissionalismo e preparação contínua</li>
              <li>Relacionamento baseado em confiança e visão de longo prazo</li>
            </ul>
          </div>

          {/* Links do rodapé (Vistos no print) */}
          <div className="about-footer-links">
            <a href="/cadastre-seu-imovel" className="footer-link">
              <FaDollarSign size={14} /> cadastre seu imóvel
            </a>
            
            <a href="/contato" className="footer-link">
              <FaEnvelope size={14} /> entre em contato
            </a>
          </div>
        </div>

        {/* --- COLUNA DA DIREITA (VÍDEO) --- */}
        <div className="about-video-wrapper">
          <div className="video-container">
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
          {/* Nota: Substitua o ID do vídeo no SRC acima pelo vídeo real de Balneário Camboriú */}
        </div>

      </div>
    </div>
  );
};