import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Carrega ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem('db_favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(favId => favId !== id); // Remove
    } else {
      newFavorites = [...favorites, id]; // Adiciona
    }
    setFavorites(newFavorites);
    localStorage.setItem('db_favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};