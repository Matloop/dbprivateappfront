'use client'; // Obrigatório para Contextos

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // O useState garante que o Client não seja recriado em re-renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto de cache padrão
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}