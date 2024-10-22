/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTravelStore } from '@/store/useTravelStore';
import { Location } from '@/types/types';
import SearchSidebar from './SearchSidebar';
import { BiSearch } from 'react-icons/bi';
import { useTravelPlan } from '@/hooks/useTravelPlan';
import { useAddLocation, useRemoveLocation, useUpdateLocation } from '@/hooks/useRouteMap';

interface TravelRouteMapProps {
  travelPlanId: string;
}

export default function TravelRouteMap({ travelPlanId }: TravelRouteMapProps) {
  const { data: travelPlan } = useTravelPlan(travelPlanId);
  const addLocationMutation = useAddLocation();
  const removeLocationMutation = useRemoveLocation();
  const updateLocationMutation = useUpdateLocation();

  const { updateLocalRouteMap } = useTravelStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const locations = travelPlan?.routeMap?.locations || [];
  const routeOrder = travelPlan?.routeMap?.routeOrder || [];

  const mapRef = useRef<L.Map | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);


  useEffect(() => {
    if (locations.length > 0 && travelPlanId) {
      const saveLocations = async () => {
        try {
          await fetch(`/api/travel-plans/${travelPlanId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              routeMap: {
                locations,
                routeOrder
              }
            })
          });
        } catch (error) {
          console.error('Failed to save locations:', error);
        }
      };
      saveLocations();
    }
  }, [locations, routeOrder, travelPlanId]);

  useEffect(() => {
    if (window.google?.maps) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        autocompleteService.current = new google.maps.places.AutocompleteService();
        placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
    });

    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode === document.head) {
        document.head.removeChild(scriptRef.current);
      }
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

  const handleAddLocation = async (location: Location) => {
    try {
      await addLocationMutation.mutateAsync({
        travelPlanId,
        location,
        currentLocations: locations,
        currentRouteOrder: routeOrder
      });
    } catch (error) {
      console.error('Failed to add location:', error);
    }
  };

  const handleRemoveLocation = async (locationId: number) => {
    try {
      await removeLocationMutation.mutateAsync({
        travelPlanId,
        locationId,
        currentLocations: locations,
        currentRouteOrder: routeOrder
      });
    } catch (error) {
      console.error('Failed to remove location:', error);
    }
  };

  const handleUpdateLocation = async (locationId: number, updates: Partial<Location>) => {
    try {
      await updateLocationMutation.mutateAsync({
        travelPlanId,
        locationId,
        updates,
        currentLocations: locations,
        currentRouteOrder: routeOrder
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newLocation: Location = {
          id: Date.now(),
          name: `위치 ${locations.length + 1}`,
          position: [e.latlng.lat, e.latlng.lng],
          type: 'attraction',
        };
        handleAddLocation(newLocation);
      },
    });
    return null;
  };

  const handleSearch = () => {
    if (!autocompleteService.current || !searchQuery.trim()) return;

    const request: google.maps.places.AutocompleteRequest = {
      input: searchQuery,
      types: ['establishment']
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSearchResults(predictions);
        setIsSidebarOpen(true);
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
        handleAddLocation(newLocation); 
        mapRef.current?.setView(newLocation.position, 13);
        setSearchResults([]);
        setSearchQuery('');
        setIsSidebarOpen(false);
      }
    });
  };

  const routePositions = useMemo(() => routeOrder.map(id =>
    locations.find(loc => loc.id === id)?.position
  ).filter((pos): pos is [number, number] => pos !== undefined), [locations, routeOrder]);

  const initialCenter = useMemo(() => {
    if (locations.length > 0) {
      return locations[0].position;
    }
    return [37.5665, 126.9780] as [number, number];
  }, [locations]);

  return (
    <div className="relative">
      <div className="my-3 p-4 z-20">
        <div className='text-center mb-3'>
          <h3 className='font-bold text-2xl mb-1'>원하는 장소를 검색해 보세요</h3>
          <p className='text-lg text-gray-500 font-medium'>근처 추천 장소를 안내합니다.</p>
        </div>
        <div className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder='장소 검색'
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-150 ease-in-out flex items-center justify-center"
          >
            <BiSearch size={20} />
          </button>
        </div>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '400px', width: '100%', zIndex: '10' }}
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
              dblclick: () => handleRemoveLocation(location.id)
            }}
          >
            <Popup>
              <input
                value={location.name}
                onChange={(e) => handleUpdateLocation(location.id, { name: e.target.value })}
              />
              <select
                value={location.type}
                onChange={(e) => handleUpdateLocation(location.id, { 
                  type: e.target.value as 'attraction' | 'restaurant' | 'hotel' 
                })}              
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
      <SearchSidebar
        searchResults={searchResults}
        onSelectPlace={handleSelectPlace}
        onClose={() => setIsSidebarOpen(false)}
        isOpen={isSidebarOpen}
      />
    </div>
  );
};