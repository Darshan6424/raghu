
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, location: string) => void;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, className = "h-[300px]" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current || isDestroyed) return;

      try {
        // Get the Mapbox token from Supabase
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .maybeSingle();

        if (secretError) {
          console.error('Error fetching Mapbox token:', secretError);
          toast({
            title: "Error",
            description: "Failed to load the map. Please try again later.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!secretData) {
          console.error('Mapbox token not found in secrets');
          toast({
            title: "Error",
            description: "Map configuration is missing. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        mapboxgl.accessToken = secretData.value;

        // Ensure the container exists before creating the map
        if (!mapContainer.current || isDestroyed) {
          console.error('Map container not found or component destroyed');
          return;
        }
        
        // Initialize map with default center
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [0, 0],
          zoom: 2
        });

        if (isDestroyed) {
          newMap.remove();
          return;
        }

        map.current = newMap;

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Create a marker that will be shown on click or user location
        marker.current = new mapboxgl.Marker({
          draggable: true
        });

        // Get user's location if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (isDestroyed) return;
              const { latitude, longitude } = position.coords;
              newMap.setCenter([longitude, latitude]);
              newMap.setZoom(13);
              marker.current?.setLngLat([longitude, latitude]).addTo(newMap);
              
              // Get location name using reverse geocoding
              fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                  if (!isDestroyed) {
                    const locationName = data.features[0]?.place_name || '';
                    onLocationSelect(latitude, longitude, locationName);
                  }
                })
                .catch(error => {
                  console.error('Geocoding error:', error);
                });
            },
            () => {
              // If user location is not available, just keep the default view
              console.log('Unable to get location');
              if (!isDestroyed) {
                toast({
                  title: "Notice",
                  description: "Select a location by clicking on the map",
                });
              }
            }
          );
        }

        // Add click event to map for manual location selection
        newMap.on('click', (e) => {
          if (isDestroyed) return;
          const { lng, lat } = e.lngLat;
          marker.current?.setLngLat([lng, lat]).addTo(newMap);
          
          // Get location name using reverse geocoding
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              if (!isDestroyed) {
                const locationName = data.features[0]?.place_name || '';
                onLocationSelect(lat, lng, locationName);
              }
            });
        });

        // Handle marker drag end
        marker.current.on('dragend', () => {
          if (isDestroyed) return;
          const lngLat = marker.current?.getLngLat();
          if (lngLat) {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
              .then(response => response.json())
              .then(data => {
                if (!isDestroyed) {
                  const locationName = data.features[0]?.place_name || '';
                  onLocationSelect(lngLat.lat, lngLat.lng, locationName);
                }
              });
          }
        });

        newMap.on('load', () => {
          if (!isDestroyed) {
            setMapLoaded(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        if (!isDestroyed) {
          toast({
            title: "Error",
            description: "Failed to initialize the map. Please try again later.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      setIsDestroyed(true);
      // Remove marker first
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      // Then remove map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onLocationSelect, toast]);

  return (
    <div className="relative">
      <div ref={mapContainer} className={`w-full ${className} rounded-md`} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
