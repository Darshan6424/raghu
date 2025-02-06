
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationPicker = ({ onLocationSelected, initialLat = 28.3949, initialLng = 84.1240 }: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchInput
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Update marker position
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        }
        
        // Fly to the location
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14,
            essential: true
          });
        }

        // Trigger the location selected callback
        onLocationSelected(lat, lng);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW53ZXNoMTMiLCJhIjoiY202dGhsMGExMDNmMjJscjN1dGdpYTB0cyJ9.UhrIpur7WpvGR5NmJDfbpQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialLng, initialLat],
      zoom: 6
    });

    // Add navigation controls (zoom in/out and rotation)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create marker
    marker.current = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        onLocationSelected(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click - Updated to be more precise
    map.current.on('click', (e) => {
      e.preventDefault(); // Prevent any default behavior
      
      const { lng, lat } = e.lngLat;
      
      // Update marker position immediately
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      }
      
      // Update selected location without moving the map
      onLocationSelected(lat, lng);
    });

    // Enable scroll zoom
    map.current.scrollZoom.enable();

    return () => {
      map.current?.remove();
    };
  }, [initialLat, initialLng, onLocationSelected]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          aria-label="Search location"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <div ref={mapContainer} className="w-full h-[300px] rounded-lg mb-4" />
    </div>
  );
};

export default LocationPicker;
