'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// 1. Correção do ícone do Leaflet que some no React
const customIcon = L.divIcon({
  className: 'custom-icon',
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8 -mt-8 -ml-4">
        <div className="absolute w-full h-full bg-[#d4af37]/30 rounded-full animate-ping"></div>
        <div className="relative bg-[#d4af37] text-black p-1.5 rounded-full shadow-lg border-2 border-black z-10">
            <MapPin size={20} fill="currentColor" />
        </div>
        {/* Triângulo ponta */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface PropertyMapProps {
  lat: number;
  lng: number;
  address?: string;
}

const PropertyMap = ({ lat, lng, address }: PropertyMapProps) => {
  // Posição padrão (BC) se não tiver coordenadas
  const position: [number, number] = [lat || -26.9926, lng || -48.6353];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-[#333] z-0 relative shadow-lg">
      <MapContainer 
        center={position} 
        zoom={16} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", background: '#121212' }}
      >
        {/* Tema Escuro do Mapa (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={position} icon={customIcon}>
          <Popup className="text-black text-sm font-sans">
            <strong>Localização do Imóvel</strong><br />
            {address || "Balneário Camboriú, SC"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;