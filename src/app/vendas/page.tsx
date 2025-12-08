import { Metadata } from 'next';
import { SalesPageClient } from '@/components/SalesPageClient';

export const metadata: Metadata = {
  title: 'Vendas - Encontre seu Imóvel',
  description: 'Confira nossa seleção de imóveis à venda em Balneário Camboriú e região.',
};

export default function VendasPage() {
  return <SalesPageClient />;
}