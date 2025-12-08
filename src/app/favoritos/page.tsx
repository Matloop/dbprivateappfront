import { Metadata } from 'next';
import { FavoritesPageClient } from '@/components/FavoritesPageClient';

export const metadata: Metadata = {
  title: 'Meus Favoritos | DB Private',
  description: 'Lista de imóveis salvos.',
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}