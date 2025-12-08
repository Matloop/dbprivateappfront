import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sempre que a rota (pathname) mudar, joga o scroll para o topo (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Esse componente não renderiza nada visualmente
}