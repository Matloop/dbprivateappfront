'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useFormContext, useWatch } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Ícone personalizado (mesmo padrão do seu PropertyMap)
const customIcon = L.divIcon({
  className: 'custom-icon',
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-8 h-8 -mt-8 -ml-4">
      <div className="relative bg-[#d4af37] text-black p-1.5 rounded-full shadow-lg border-2 border-black z-10">
        <MapPin size={20} fill="currentColor" />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
    </div>
  ),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Componente para capturar cliques no mapa
function LocationMarker() {
  const { setValue } = useFormContext();
  
  useMapEvents({
    click(e) {
      // Atualiza o formulário ao clicar
      setValue('address.latitude', String(e.latlng.lat), { shouldDirty: true });
      setValue('address.longitude', String(e.latlng.lng), { shouldDirty: true });
    },
  });

  return null;
}

// Componente para atualizar a visão do mapa quando os inputs mudam
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPicker() {
  const { control } = useFormContext();
  const latStr = useWatch({ control, name: 'address.latitude' });
  const lngStr = useWatch({ control, name: 'address.longitude' });

  // Converte para número ou usa padrão (BC)
  const lat = parseFloat(latStr) || -26.9926;
  const lng = parseFloat(lngStr) || -48.6353;

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden border border-[#444] relative z-0 mt-4">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: '#121212' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker />
        <MapUpdater lat={lat} lng={lng} />
        {/* Mostra marcador apenas se tiver coordenadas válidas no form ou se for o default visual */}
        <Marker position={[lat, lng]} icon={customIcon} />
      </MapContainer>
      <div className="absolute top-2 right-2 z-[1000] bg-black/80 text-xs text-white px-2 py-1 rounded border border-[#333]">
        Clique no mapa para definir a posição
      </div>
    </div>
  );
}