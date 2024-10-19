import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');
  const language = searchParams.get('language') || 'ko';

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        key: apiKey,
        language: language,
        fields: 'name,rating,formatted_address,type,opening_hours,photos',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
}