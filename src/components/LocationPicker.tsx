
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { initializeMap, createMarker, reverseGeocode, getCurrentLocation } from '@/utils/mapUtils';
import LoadingSpinner from './LoadingSpinner';
import { Input } from './ui/input';

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
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token');
        const { data, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .single();

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          throw error;
        }

        if (!data?.value) {
          console.error('No Mapbox token found');
          throw new Error('Mapbox token not found');
        }

        console.log('Successfully fetched Mapbox token');
        setToken(data.value);
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
        toast({
          title: "Configuration Error",
          description: "Failed to load map configuration. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchMapboxToken();

    return () => {
      mountedRef.current = false;
    };
  }, [toast]);

  const handleLocationUpdate = async (lng: number, lat: number) => {
    if (!mountedRef.current || !token) return;
    
    try {
      const locationName = await reverseGeocode(lng, lat, token);
      if (mountedRef.current) {
        onLocationSelect(lat, lng, locationName);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Location Error",
        description: "Failed to get location details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!token || !searchQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&types=address,place,poi`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data.features);

      if (data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 14
          });
          marker.current.setLngLat([lng, lat]).addTo(map.current);
          handleLocationUpdate(lng, lat);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initialize map once we have the token
  useEffect(() => {
    if (!token || !mapContainer.current || !mountedRef.current) return;

    try {
      console.log('Initializing map with token');
      mapboxgl.accessToken = token;
      map.current = initializeMap(mapContainer.current, token);

      map.current.on('load', () => {
        if (!mountedRef.current) return;
        console.log('Map loaded successfully');
        setIsLoading(false);
      });

      marker.current = createMarker();

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

      // Try to get user's current location
      getCurrentLocation()
        .then((position) => {
          if (!mountedRef.current || !map.current || !marker.current) return;

          const { latitude, longitude } = position.coords;
          map.current.setCenter([longitude, latitude]);
          map.current.setZoom(13);
          marker.current.setLngLat([longitude, latitude]).addTo(map.current);
          handleLocationUpdate(longitude, latitude);
        })
        .catch((error) => {
          console.log('User location not available:', error);
          if (mountedRef.current) {
            toast({
              title: "Location Notice",
              description: "Select a location by clicking on the map",
            });
          }
        });

      // Set up map click handler
      map.current.on('click', (e) => {
        if (!mountedRef.current || !marker.current || !map.current) return;
        const { lng, lat } = e.lngLat;
        marker.current.setLngLat([lng, lat]).addTo(map.current);
        handleLocationUpdate(lng, lat);
      });

      // Set up marker drag handler
      if (marker.current) {
        marker.current.on('dragend', () => {
          if (!mountedRef.current || !marker.current) return;
          const lngLat = marker.current.getLngLat();
          handleLocationUpdate(lngLat.lng, lngLat.lat);
        });
      }

      return () => {
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
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
  }, [token, toast]);

  return (
    <div className="relative space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
      </div>
      <div ref={mapContainer} className={`w-full ${className} rounded-md`} />
      {isLoading && <LoadingSpinner />}
      {searchResults.length > 0 && (
        <div className="absolute top-16 left-0 right-0 bg-white rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                if (map.current && marker.current) {
                  const [lng, lat] = result.center;
                  map.current.flyTo({
                    center: [lng, lat],
                    zoom: 14
                  });
                  marker.current.setLngLat([lng, lat]).addTo(map.current);
                  handleLocationUpdate(lng, lat);
                  setSearchResults([]);
                  setSearchQuery(result.place_name);
                }
              }}
            >
              {result.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
