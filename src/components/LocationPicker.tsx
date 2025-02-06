
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
    
    // Nepal bounds
    const nepalBounds = [
      [80.0884, 26.3478], // Southwest coordinates
      [88.2039, 30.4227]  // Northeast coordinates
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLng, initialLat],
      zoom: 7,
      maxBounds: nepalBounds,
      minZoom: 6 // Prevent zooming out too far
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    // Handle marker drag
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        onLocationSelected(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click without reloading
    map.current.on('click', (e) => {
      e.preventDefault();
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
        onLocationSelected(lat, lng);
      }
    });

    map.current.scrollZoom.enable();

    return () => {
      map.current?.remove();
    };
  }, []); // Remove initialLat and initialLng from dependencies

  return (
    <div className="space-y-2">
      <div ref={mapContainer} className="w-full h-[300px] rounded-lg mb-4" />
    </div>
  );
};

export default LocationPicker;
