import { Metadata } from 'next';
import { Suspense } from 'react'; // <--- 1. Importar Suspense
import { SalesPageClient } from '@/components/SalesPageClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vendas - Encontre seu Imóvel',
  description: 'Confira nossa seleção de imóveis à venda em Balneário Camboriú e região.',
};

export default function VendasPage() {
  return (
    // 2. Envolver o Client Component com Suspense
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Carregando filtros...</span>
      </div>
    }>
      <SalesPageClient />
    </Suspense>
  );
}