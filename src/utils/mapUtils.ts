
import mapboxgl from 'mapbox-gl';

export const initializeMap = (container: HTMLDivElement, token: string) => {
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [0, 0],
    zoom: 2,
    accessToken: token
  });
};

export const createMarker = () => {
  return new mapboxgl.Marker({
    draggable: true
  });
};

export const reverseGeocode = async (lng: number, lat: number, token: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`
    );
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    const data = await response.json();
    return data.features[0]?.place_name || '';
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
