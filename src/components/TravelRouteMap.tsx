import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  const mapRef = useRef<L.Map | null>(null);

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

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLocation: Location = {
          id: Date.now(),
          name: searchQuery,
          position: [parseFloat(lat), parseFloat(lon)],
          type: 'attraction',
        };
        addLocation(newLocation);
        mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 13);
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
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
