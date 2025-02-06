
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";

interface Marker {
  lat: number;
  lng: number;
  popup?: string;
}

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  markers?: Marker[];
  readOnly?: boolean;
}

const LocationPicker = ({ 
  onLocationSelected, 
  initialLat = 28.3949, 
  initialLng = 84.1240,
  markers = [],
  readOnly = false
}: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mainMarker = useRef<mapboxgl.Marker | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW53ZXNoMTMiLCJhIjoiY202dGhsMGExMDNmMjJscjN1dGdpYTB0cyJ9.UhrIpur7WpvGR5NmJDfbpQ';
    
    const nepalBounds: [number, number, number, number] = [
      80.0884, // west
      26.3478, // south
      88.2039, // east
      30.4227  // north
    ];

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialLng, initialLat],
        zoom: 7,
        maxBounds: nepalBounds,
        minZoom: 6,
        dragRotate: !readOnly,
        scrollZoom: !readOnly
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast({
          title: "Map Error",
          description: "There was an error loading the map. Please try again.",
          variant: "destructive"
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      if (markers.length === 0 && !readOnly) {
        mainMarker.current = new mapboxgl.Marker({
          draggable: !readOnly
        })
          .setLngLat([initialLng, initialLat])
          .addTo(map.current);

        if (!readOnly) {
          mainMarker.current.on('dragend', () => {
            const lngLat = mainMarker.current?.getLngLat();
            if (lngLat) {
              onLocationSelected(lngLat.lat, lngLat.lng);
            }
          });

          map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            map.current?.easeTo({
              center: [lng, lat],
              duration: 1000,
              zoom: map.current.getZoom()
            });
            mainMarker.current?.setLngLat([lng, lat]);
            onLocationSelected(lat, lng);
          });
        }
      } else {
        markers.forEach(markerData => {
          const marker = new mapboxgl.Marker({
            draggable: false
          })
            .setLngLat([markerData.lng, markerData.lat])
            .addTo(map.current!);

          if (markerData.popup) {
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(markerData.popup);
            marker.setPopup(popup);
          }

          markerRefs.current.push(marker);
        });

        if (markers.length > 1) {
          const bounds = new mapboxgl.LngLatBounds();
          markers.forEach(marker => {
            bounds.extend([marker.lng, marker.lat]);
          });
          map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
        } else if (markers.length === 1) {
          map.current.easeTo({
            center: [markers[0].lng, markers[0].lat],
            zoom: 7,
            duration: 1000
          });
        }
      }

      if (!readOnly) {
        map.current.scrollZoom.enable();
      } else {
        map.current.scrollZoom.disable();
        map.current.dragPan.disable();
        map.current.doubleClickZoom.disable();
        map.current.touchZoomRotate.disable();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "There was an error initializing the map. Please try again.",
        variant: "destructive"
      });
    }

    return () => {
      markerRefs.current.forEach(marker => marker.remove());
      mainMarker.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []); // Only run on mount

  // Handle prop changes without reinitializing the map
  useEffect(() => {
    if (!map.current) return;

    if (markers.length > 0) {
      // Clear existing markers
      markerRefs.current.forEach(marker => marker.remove());
      markerRefs.current = [];

      markers.forEach(markerData => {
        const marker = new mapboxgl.Marker({
          draggable: false
        })
          .setLngLat([markerData.lng, markerData.lat])
          .addTo(map.current!);

        if (markerData.popup) {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(markerData.popup);
          marker.setPopup(popup);
        }

        markerRefs.current.push(marker);
      });

      if (markers.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        markers.forEach(marker => {
          bounds.extend([marker.lng, marker.lat]);
        });
        map.current.easeTo({
          padding: 50,
          duration: 1000,
          essential: true
        });
        map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
      } else if (markers.length === 1) {
        map.current.easeTo({
          center: [markers[0].lng, markers[0].lat],
          zoom: 7,
          duration: 1000,
          essential: true
        });
      }
    }
  }, [markers]);

  return (
    <div className="space-y-2">
      <div ref={mapContainer} className="w-full h-[300px] rounded-lg mb-4" />
    </div>
  );
};

export default LocationPicker;
