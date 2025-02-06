
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { initializeMap, createMarker, reverseGeocode, getCurrentLocation } from '@/utils/mapUtils';
import LoadingSpinner from './LoadingSpinner';

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, location: string) => void;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, className = "h-[300px]" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleLocationUpdate = async (lng: number, lat: number, token: string) => {
    if (!mountedRef.current) return;
    
    const locationName = await reverseGeocode(lng, lat, token);
    if (mountedRef.current) {
      onLocationSelect(lat, lng, locationName);
    }
  };

  useEffect(() => {
    const setupMap = async () => {
      if (!mapContainer.current || !mountedRef.current) return;

      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        if (secretError) throw secretError;
        if (!secretData?.value) throw new Error('Mapbox token not found');

        const token = secretData.value;
        mapboxgl.accessToken = token;

        if (!mountedRef.current) return;

        map.current = initializeMap(mapContainer.current, token);
        marker.current = createMarker();

        map.current.on('load', () => {
          if (!mountedRef.current) return;
          setIsLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          if (!mountedRef.current) return;
          toast({
            title: "Map Error",
            description: "There was an error loading the map. Please refresh the page.",
            variant: "destructive",
          });
          setIsLoading(false);
        });

        try {
          const position = await getCurrentLocation();
          if (!mountedRef.current || !map.current || !marker.current) return;

          const { latitude, longitude } = position.coords;
          map.current.setCenter([longitude, latitude]);
          map.current.setZoom(13);
          marker.current.setLngLat([longitude, latitude]).addTo(map.current);
          handleLocationUpdate(longitude, latitude, token);
        } catch (error) {
          console.log('User location not available');
          if (mountedRef.current) {
            toast({
              title: "Location Notice",
              description: "Select a location by clicking on the map",
            });
          }
        }

        map.current.on('click', (e) => {
          if (!mountedRef.current || !marker.current || !map.current) return;
          const { lng, lat } = e.lngLat;
          marker.current.setLngLat([lng, lat]).addTo(map.current);
          handleLocationUpdate(lng, lat, token);
        });

        if (marker.current) {
          marker.current.on('dragend', () => {
            if (!mountedRef.current || !marker.current) return;
            const lngLat = marker.current.getLngLat();
            handleLocationUpdate(lngLat.lng, lngLat.lat, token);
          });
        }

      } catch (error) {
        console.error('Map initialization error:', error);
        if (mountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to initialize the map. Please refresh the page.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    setupMap();
  }, [onLocationSelect, toast]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={`w-full ${className} rounded-md`} />
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default LocationPicker;
