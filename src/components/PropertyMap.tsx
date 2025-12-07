import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix para ícone do Leaflet no React
const customMarkerIcon = L.divIcon({
  className: 'custom-icon',
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute w-full h-full bg-primary/30 rounded-full animate-ping"></div>
        <div className="relative bg-primary text-black p-1.5 rounded-full shadow-lg border-2 border-black">
            <MapPin size={20} fill="currentColor" />
        </div>
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Componente auxiliar para atualizar a visão do mapa quando a coordenada muda
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

interface PropertyMapProps {
  address: string;
  city: string;
  neighborhood: string;
}

export function PropertyMap({ address, city, neighborhood }: PropertyMapProps) {
  // Coordenada padrão (Centro de Balneário Camboriú)
  const defaultPosition: [number, number] = [-26.9926, -48.6353];
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Função simples de Geocoding (Transforma endereço em Lat/Lng)
    const fetchCoordinates = async () => {
      if (!address && !neighborhood) return;
      
      const query = `${address}, ${neighborhood}, ${city}, Brazil`;
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // Se falhar o endereço exato, tenta só Bairro + Cidade
          const fallbackQuery = `${neighborhood}, ${city}, Brazil`;
          const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}`);
          const fallbackData = await fallbackRes.json();
          if (fallbackData && fallbackData.length > 0) {
            setPosition([parseFloat(fallbackData[0].lat), parseFloat(fallbackData[0].lon)]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
      }
    };

    fetchCoordinates();
  }, [address, city, neighborhood]);

  const activePosition = position || defaultPosition;

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/10 z-0 relative">
      <MapContainer 
        center={activePosition} 
        zoom={15} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", background: '#121212' }}
      >
        {/* Camada do Mapa - ESTILO DARK (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={activePosition} />
        
        <Marker position={activePosition} icon={customMarkerIcon}>
          <Popup className="text-black">
            <strong>{neighborhood}</strong><br />
            {address || "Localização Aproximada"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}