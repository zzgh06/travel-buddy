/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from 'react';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useGooglePlaces } from '../hooks/useGooglePlaces';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/types/types';

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const PlaceRecommendations: React.FC = () => {
  const { searchTerm, setSearchTerm } = useRecommendationStore();
  const { data: places, isLoading, error } = useGooglePlaces(searchTerm);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.5665, 126.9780]); // 서울 중심 좌표
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const term = formData.get('search') as string;
    setSearchTerm(term);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">여행지 추천</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          name="search"
          placeholder="여행지를 입력하세요"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          검색
        </button>
      </form>

      {(isLoading || isGeocodingLoading) && <p>로딩 중...</p>}
      {error && <p className="text-red-500">에러가 발생했습니다: {(error as Error).message}</p>}

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 pr-4">
          <ul className="space-y-4">
            {places && places.map((place: Place) => (
              <li key={place.place_id} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p>주소: {place.vicinity}</p>
                <p>평점: {place.rating}</p>
                <p>유형: {place.types.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={mapCenter} />
            {places && places.map((place: Place) => (
              <Marker 
                key={place.place_id} 
                position={[place.geometry.location.lat, place.geometry.location.lng]}
              >
                <Popup>
                  <h3>{place.name}</h3>
                  <p>{place.vicinity}</p>
                  <p>평점: {place.rating}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default PlaceRecommendations;