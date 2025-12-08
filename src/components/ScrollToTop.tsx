'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Sempre que a rota mudar, joga o scroll para o topo
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}