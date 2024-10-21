import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTravelStore } from '@/store/useTravelStore';
import { Location } from '@/types/types';

export default function TravelRouteMap() {
  const {
    locations,
    routeOrder,
    addLocation,
    updateLocation,
    removeLocation
  } = useTravelStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createNumberedIcon = useCallback((number: number) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: white;
        border: 2px solid #000;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      ">${number}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }, [])

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newLocation: Location = {
          id: Date.now(),
          name: `위치 ${locations.length + 1}`,
          position: [e.latlng.lat, e.latlng.lng],
          type: 'attraction',
        };
        addLocation(newLocation);
      },
    });
    return null;
  };

  const handleSearch = () => {
    if (!autocompleteService.current) return;

    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      types: ['establishment']
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSearchResults(predictions);
      }
    });
  };

  const handleSelectPlace = (placeId: string) => {
    if (!placesService.current) return;

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['name', 'geometry']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
        const newLocation: Location = {
          id: Date.now(),
          name: place.name || '알 수 없는 장소',
          position: [place.geometry.location.lat(), place.geometry.location.lng()],
          type: 'attraction',
        };
        addLocation(newLocation);
        mapRef.current?.setView(newLocation.position, 13);
        setSearchResults([]);
        setSearchQuery('');
      }
    });
  };

  const handleMarkerDoubleClick = (id: number) => {
    removeLocation(id);
  };

  const routePositions = useMemo(() => routeOrder.map(id =>
    locations.find(loc => loc.id === id)?.position
  ).filter((pos): pos is [number, number] => pos !== undefined), [locations, routeOrder]);

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='장소 검색'
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.place_id} onClick={() => handleSelectPlace(result.place_id)}>
              {result.description}
            </li>
          ))}
        </ul>
      )}
      <MapContainer
        center={[37.5665, 126.9780]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={createNumberedIcon(index + 1)}
            eventHandlers={{
              dblclick: () => handleMarkerDoubleClick(location.id)
            }}
          >
            <Popup>
              <input
                value={location.name}
                onChange={(e) => updateLocation(location.id, { name: e.target.value })}
              />
              <select
                value={location.type}
                onChange={(e) => updateLocation(location.id, { type: e.target.value as 'attraction' | 'restaurant' | 'hotel' })}
              >
                <option value="attraction">관광지</option>
                <option value="restaurant">음식점</option>
                <option value="hotel">숙소</option>
              </select>
            </Popup>
          </Marker>
        ))}
        <Polyline positions={routePositions} color="blue" />
      </MapContainer>
    </div>
  );
};