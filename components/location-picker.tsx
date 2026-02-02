'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      
      // Reverse geocoding using Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          console.log('Location details:', data);
        })
        .catch(err => console.error('Geocoding error:', err));
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export function LocationPicker({ onLocationSelect, initialLat = 27.7172, initialLng = 85.3240 }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUseCurrentLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentPosition({ lat, lng });
          onLocationSelect(lat, lng);
          setLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please pin your location on the map manually.');
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLocating(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-foreground/70">Loading map...</p>
        </div>
      </div>
    );
  }

  const mapCenter: [number, number] = currentPosition 
    ? [currentPosition.lat, currentPosition.lng]
    : [initialLat, initialLng];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Pin Your Exact Location
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="gap-2"
        >
          <Navigation className="h-4 w-4" />
          {locating ? 'Locating...' : 'Use Current Location'}
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          key={currentPosition ? `${currentPosition.lat}-${currentPosition.lng}` : 'default'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={onLocationSelect} />
          {currentPosition && (
            <Marker position={[currentPosition.lat, currentPosition.lng]} />
          )}
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs text-foreground/70">
          💡 Click on the map to pin your exact location
        </div>
      </div>

      <p className="text-xs text-foreground/60 text-center">
        This helps our delivery team find you accurately. Your location is only used for delivery purposes.
      </p>
    </div>
  );
}
