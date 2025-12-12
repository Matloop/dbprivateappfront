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

// --- ÍCONE CORRIGIDO ---
// Mantemos algumas cores específicas no ícone (bg-[#d4af37]) pois é a identidade visual do pino
// mas adaptamos as bordas.
const customIcon = L.divIcon({
  className: "custom-icon",
  html: renderToStaticMarkup(
    <div className="relative flex flex-col items-center w-8 h-8">
      {/* Bolinha do Pino */}
      <div className="relative bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg border-2 border-foreground z-10 cursor-grab active:cursor-grabbing">
        <MapPin size={20} fill="currentColor" />
      </div>
      {/* Ponta do Pino */}
      <div className="-mt-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-foreground"></div>
    </div>
  ),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      setTimeout(() => {
          map.setView([lat, lng], map.getZoom());
      }, 100);
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPicker() {
  const { control, setValue } = useFormContext();

  const latStr = useWatch({ control, name: "address.latitude" });
  const lngStr = useWatch({ control, name: "address.longitude" });
  const radiusVal = useWatch({ control, name: "address.radius" });

  const lat = parseFloat(latStr) || -26.9926;
  const lng = parseFloat(lngStr) || -48.6353;
  const radius = Number(radiusVal) || 100;

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
    // ANTES: border-[#444] bg-[#121212]
    // DEPOIS: border-border bg-muted/20
    <div className="relative w-full mt-4 border border-border rounded-md overflow-hidden bg-muted/20">
      <div className="h-[450px] w-full z-0">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={true}
          // Usamos background transparente para herdar do container
          style={{ height: "100%", width: "100%", background: "transparent" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            // Mantemos o dark_all por enquanto para não quebrar a lógica visual do mapa,
            // mas você pode alterar para uma variável condicional se quiser mapas claros no light mode.
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <ClickHandler />
          <MapUpdater lat={lat} lng={lng} />

          <Circle
            center={position}
            radius={radius}
            pathOptions={{
              color: "#d4af37", // Mantido hardcoded pois é a cor da marca (Gold)
              fillColor: "#d4af37",
              fillOpacity: 0.15,
              weight: 1
            }}
          />

          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            icon={customIcon}
            ref={markerRef}
          >
            <Popup className="text-foreground text-sm">
              Localização do Imóvel
            </Popup>
          </Marker>

        </MapContainer>
      </div>

      {/* CONTROLES FLUTUANTES */}
      {/* ANTES: bg-black/80 border-[#333] text-gray-300 */}
      {/* DEPOIS: bg-popover/90 border-border text-muted-foreground */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-popover/90 backdrop-blur border border-border p-3 rounded-md shadow-xl w-64">
        <div className="flex justify-between text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wide">
          <span>Raio de Localização</span>
          {/* ANTES: text-[#d4af37] */}
          {/* DEPOIS: text-primary */}
          <span className="text-primary">{radius} metros</span>
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
          // ANTES: bg-[#333] accent-[#d4af37]
          // DEPOIS: bg-secondary accent-primary
          className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* TOOLTIP DE AJUDA */}
      <div className="absolute top-2 right-2 z-[1000] bg-popover/90 backdrop-blur text-[10px] text-muted-foreground px-2 py-1 rounded border border-border">
        Use o <b>Scroll</b> para Zoom e <b>Arraste</b> o pino.
      </div>
    </div>
  );
}