import { Place } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const translateType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'point_of_interest': '관광지',
    'establishment': '시설',
    'tourist_attraction': '관광 명소',
    'restaurant': '음식점',
    'cafe': '카페',
    'park': '공원',
    'museum': '박물관',
  };
  return typeMap[type] || type;
};

export const useGooglePlaces = (searchTerm: string) => {
  return useQuery({
    queryKey: ['places', searchTerm],
    queryFn: async (): Promise<Place[]> => {
      if (!searchTerm) return [];
      
      console.log(`Fetching data for: ${searchTerm}`);
      
      try {
        const { data: cityData } = await axios.get(`/api/places/geocode?address=${encodeURIComponent(searchTerm)}`);
        
        if (!cityData.results || cityData.results.length === 0) {
          throw new Error(`CITY_NOT_FOUND: ${JSON.stringify(cityData)}`);
        }
        
        const { lat, lng } = cityData.results[0].geometry.location;
        
        const { data: placesData } = await axios.get(`/api/places/nearby?lat=${lat}&lng=${lng}`);
        
        if (!placesData.results || placesData.results.length === 0) {
          throw new Error('NO_PLACES_FOUND');
        }
        
        const detailedPlaces = await Promise.all(placesData.results.map(async (place: any) => {
          const { data: detailData } = await axios.get(`/api/places/details?place_id=${place.place_id}&language=ko`);
          const detail = detailData.result;
          
          return {
            place_id: detail.place_id,
            name: detail.name,
            vicinity: detail.vicinity || detail.formatted_address,
            rating: detail.rating || '평가 없음',
            types: detail.types.map(translateType),
            opening_hours: detail.opening_hours,
            geometry: place.geometry,
          };
        }));
        
        return detailedPlaces;
      } catch (error) {
        console.error('Error in useGooglePlaces:', error);
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error || 'An error occurred');
        }
        throw error;
      }
    },
    enabled: !!searchTerm,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGeocode = (searchTerm: string) => {
  return useQuery({
    queryKey: ['geocode', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const { data } = await axios.get(`/api/geocode?address=${encodeURIComponent(searchTerm)}`);
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      return null;
    },
    enabled: !!searchTerm,
  });
};