"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFormContext, useWatch } from "react-hook-form";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// --- ÍCONE CORRIGIDO (ANCORAGEM PERFEITA) ---
const customIcon = L.divIcon({
  className: "custom-icon",
  // Removemos -mt-8 -ml-4 pois o Leaflet já cuida disso com iconAnchor
  html: renderToStaticMarkup(
    <div className="relative flex flex-col items-center w-8 h-8">
      {/* Bolinha do Pino */}
      <div className="relative bg-[#d4af37] text-black p-1.5 rounded-full shadow-lg border-2 border-black z-10 cursor-grab active:cursor-grabbing">
        <MapPin size={20} fill="currentColor" />
      </div>
      {/* Ponta do Pino */}
      <div className="-mt-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
    </div>
  ),
  iconSize: [32, 42], // Ajustado para altura total (bola + ponta)
  iconAnchor: [16, 42], // X=Metade, Y=Fundo (Ponta do pino no chão)
  popupAnchor: [0, -42], // Popup aparece acima do pino
});

// Componente para atualizar a visão do mapa quando os inputs mudam externamente
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      // Pequeno delay para garantir que o mapa carregou antes de voar
      setTimeout(() => {
          map.setView([lat, lng], map.getZoom());
      }, 100);
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPicker() {
  const { control, setValue } = useFormContext();

  // Lê os valores atuais do formulário
  const latStr = useWatch({ control, name: "address.latitude" });
  const lngStr = useWatch({ control, name: "address.longitude" });
  const radiusVal = useWatch({ control, name: "address.radius" });

  // Converte para número ou usa padrão (BC)
  const lat = parseFloat(latStr) || -26.9926;
  const lng = parseFloat(lngStr) || -48.6353;
  const radius = Number(radiusVal) || 100;

  // Garante que position seja um objeto LatLng válido
  const position = { lat, lng };

  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          setValue("address.latitude", String(newPos.lat), { shouldDirty: true });
          setValue("address.longitude", String(newPos.lng), { shouldDirty: true });
        }
      },
    }),
    [setValue]
  );

  function ClickHandler() {
    useMapEvents({
      click(e) {
        setValue("address.latitude", String(e.latlng.lat), { shouldDirty: true });
        setValue("address.longitude", String(e.latlng.lng), { shouldDirty: true });
      },
    });
    return null;
  }

  return (
    <div className="relative w-full mt-4 border border-[#444] rounded-md overflow-hidden bg-[#121212]">
      <div className="h-[450px] w-full z-0">
        <MapContainer
          center={position}
          zoom={16} // Zoom inicial mais próximo
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", background: "#121212" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <ClickHandler />
          <MapUpdater lat={lat} lng={lng} />

          {/* Círculo PRIMEIRO (para ficar embaixo do pino) */}
          <Circle
            center={position}
            radius={radius}
            pathOptions={{
              color: "#d4af37",
              fillColor: "#d4af37",
              fillOpacity: 0.15,
              weight: 1
            }}
          />

          {/* Marcador DEPOIS (para ficar em cima) */}
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            icon={customIcon}
            ref={markerRef}
          >
            <Popup className="text-black text-sm">
              Localização do Imóvel
            </Popup>
          </Marker>

        </MapContainer>
      </div>

      <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 backdrop-blur border border-[#333] p-3 rounded-md shadow-xl w-64">
        <div className="flex justify-between text-xs text-gray-300 mb-2 font-bold uppercase tracking-wide">
          <span>Raio de Localização</span>
          <span className="text-[#d4af37]">{radius} metros</span>
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          step="10"
          value={radius}
          onChange={(e) => {
            const val = Number(e.target.value);
            setValue('address.radius', val, { shouldDirty: true });
          }}
          className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
        />
      </div>

      <div className="absolute top-2 right-2 z-[1000] bg-black/80 text-[10px] text-gray-400 px-2 py-1 rounded border border-[#333]">
        Use o <b>Scroll</b> para Zoom e <b>Arraste</b> o pino.
      </div>
    </div>
  );
}