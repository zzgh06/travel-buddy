import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 마커 아이콘 설정
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Location {
  id: number;
  name: string;
  position: [number, number];
  type: 'attraction' | 'restaurant' | 'hotel';
}

export default function Map(){
  const [locations, setLocations] = useState<Location[]>([]);
  const [routeOrder, setRouteOrder] = useState<number[]>([]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newLocation: Location = {
          id: Date.now(),
          name: `Location ${locations.length + 1}`,
          position: [e.latlng.lat, e.latlng.lng],
          type: 'attraction', // 기본값
        };
        setLocations(prevLocations => [...prevLocations, newLocation]);
        setRouteOrder(prevOrder => [...prevOrder, newLocation.id]);
      },
    });
    return null;
  };

  const updateLocationName = (id: number, newName: string) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, name: newName } : loc
    ));
  };

  const updateLocationType = (id: number, newType: 'attraction' | 'restaurant' | 'hotel') => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, type: newType } : loc
    ));
  };

  const routePositions = routeOrder.map(id => 
    locations.find(loc => loc.id === id)?.position
  ).filter((pos): pos is [number, number] => pos !== undefined);

  return (
    <MapContainer 
      center={[37.5665, 126.9780]} // 서울 중심 좌표
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {locations.map((location) => (
        <Marker key={location.id} position={location.position} icon={customIcon}>
          <Popup>
            <input 
              value={location.name}
              onChange={(e) => updateLocationName(location.id, e.target.value)}
            />
            <select 
              value={location.type}
              onChange={(e) => updateLocationType(location.id, e.target.value as 'attraction' | 'restaurant' | 'hotel')}
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
  );
};
