
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationPicker = ({ onLocationSelected, initialLat = 28.3949, initialLng = 84.1240 }: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW53ZXNoMTMiLCJhIjoiY202dGhsMGExMDNmMjJscjN1dGdpYTB0cyJ9.UhrIpur7WpvGR5NmJDfbpQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLng, initialLat], // Center on Nepal
      zoom: 6
    });

    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        onLocationSelected(lngLat.lat, lngLat.lng);
      }
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.current?.setLngLat([lng, lat]);
      onLocationSelected(lat, lng);
    });

    return () => {
      map.current?.remove();
    };
  }, [initialLat, initialLng, onLocationSelected]);

  return (
    <div ref={mapContainer} className="w-full h-[300px] rounded-lg mb-4" />
  );
};

export default LocationPicker;

