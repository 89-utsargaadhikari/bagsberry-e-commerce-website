'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface AddressInfo {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: AddressInfo) => void;
  initialLat?: number;
  initialLng?: number;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
  };
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

function LocationMarker({ 
  onLocationSelect, 
  onAddressUpdate 
}: { 
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressUpdate: (address: AddressInfo) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      const addressInfo: AddressInfo = {
        address: data.address?.road || data.address?.suburb || data.address?.neighbourhood || data.display_name.split(',')[0],
        city: data.address?.city || data.address?.municipality || data.address?.town || data.address?.village || 'Kathmandu',
        province: data.address?.state || 'Bagmati Province',
        postalCode: data.address?.postcode || '44600',
        fullAddress: data.display_name,
      };
      
      onAddressUpdate(addressInfo);
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export function LocationPicker({ onLocationSelect, initialLat = 27.7172, initialLng = 85.3240 }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialLat, initialLng]);
  const [mapZoom, setMapZoom] = useState(13);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reverseGeocodeCurrentLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      const addressInfo: AddressInfo = {
        address: data.address?.road || data.address?.suburb || data.address?.neighbourhood || data.display_name.split(',')[0],
        city: data.address?.city || data.address?.municipality || data.address?.town || data.address?.village || 'Kathmandu',
        province: data.address?.state || 'Bagmati Province',
        postalCode: data.address?.postcode || '44600',
        fullAddress: data.display_name,
      };
      
      onLocationSelect(lat, lng, addressInfo);
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentPosition({ lat, lng });
          setMapCenter([lat, lng]);
          setMapZoom(15);
          reverseGeocodeCurrentLocation(lat, lng);
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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      // Bias search towards Nepal
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=np&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setCurrentPosition({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(15);
    setShowResults(false);
    setSearchQuery(result.display_name);
    
    const addressInfo: AddressInfo = {
      address: result.address?.road || result.address?.suburb || result.display_name.split(',')[0],
      city: result.address?.city || result.address?.municipality || 'Kathmandu',
      province: result.address?.state || 'Bagmati Province',
      postalCode: result.address?.postcode || '44600',
      fullAddress: result.display_name,
    };
    
    onLocationSelect(lat, lng, addressInfo);
  };

  const handleAddressUpdate = (address: AddressInfo) => {
    if (currentPosition) {
      onLocationSelect(currentPosition.lat, currentPosition.lng, address);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-foreground">
          Pin Your Exact Delivery Location
        </span>
      </div>

      {/* Search Box */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search location (e.g., Thamel, Kathmandu)"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-pink-50 border border-pink-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSearchResult(result)}
                className="w-full px-4 py-2 text-left hover:bg-pink-100 border-b border-pink-100 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{result.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleUseCurrentLocation}
        disabled={locating}
        className="gap-2 w-full"
      >
        <Navigation className="h-4 w-4" />
        {locating ? 'Locating...' : 'Use My Current Location'}
      </Button>

      <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          <LocationMarker 
            onLocationSelect={(lat, lng) => setCurrentPosition({ lat, lng })} 
            onAddressUpdate={handleAddressUpdate}
          />
          {currentPosition && (
            <Marker position={[currentPosition.lat, currentPosition.lng]} />
          )}
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 bg-pink-50/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-xs text-foreground/70">
          💡 Search, use current location, or click on the map to pin
        </div>
      </div>

      <p className="text-xs text-foreground/60 text-center">
        This helps our delivery team find you accurately. Your location is only used for delivery purposes.
      </p>
    </div>
  );
}
