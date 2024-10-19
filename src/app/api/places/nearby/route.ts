import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,  // 5km 반경 내 검색
        type: 'tourist_attraction',  // 관광 명소로 타입 제한
        key: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ error: 'No places found' }, { status: 404 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby places' }, { status: 500 });
  }
}