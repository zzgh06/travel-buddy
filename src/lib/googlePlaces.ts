import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

type Coordinates = {
  lat: number;
  lng: number;
};

const cityCoordinates: { [key: string]: Coordinates } = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '제주': { lat: 33.4996, lng: 126.5312 },
};

export async function searchNearbyPlaces(location: string, type: string = '') {
  try {
    const coordinates = cityCoordinates[location] || await getCoordinates(location);
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${coordinates.lat},${coordinates.lng}`,
        radius: 5000,
        type: type,
        language: 'ko',
        key: API_KEY
      }
    });
    
    return response.data.results;
  } catch (error) {
    throw error;
  }
}

async function getCoordinates(location: string): Promise<Coordinates> {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: location,
        key: API_KEY
      }
    });
    
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}