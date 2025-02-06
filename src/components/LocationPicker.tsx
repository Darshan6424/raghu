
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, location: string) => void;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, className = "h-[300px]" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 1
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Create a marker
    marker.current = new mapboxgl.Marker({
      draggable: true
    });

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.current?.setCenter([longitude, latitude]);
          map.current?.setZoom(13);
          marker.current?.setLngLat([longitude, latitude]).addTo(map.current!);
          
          // Get location name using reverse geocoding
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              const locationName = data.features[0]?.place_name || '';
              onLocationSelect(latitude, longitude, locationName);
            });
        },
        () => {
          console.log('Unable to get location');
        }
      );
    }

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.current?.setLngLat([lng, lat]);
      
      // Get location name using reverse geocoding
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          const locationName = data.features[0]?.place_name || '';
          onLocationSelect(lat, lng, locationName);
        });
    });

    marker.current?.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.features[0]?.place_name || '';
            onLocationSelect(lngLat.lat, lngLat.lng, locationName);
          });
      }
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [onLocationSelect]);

  return <div ref={mapContainer} className={`w-full ${className} rounded-md`} />;
};

export default LocationPicker;
