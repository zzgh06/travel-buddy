import { headers } from 'next/headers';
import { TravelPlan } from '@/types/types';

export async function getTravelPlans(): Promise<TravelPlan[]> {
  try {
    const headersList = headers();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-plans`, {
      cache: 'no-store',
      headers: {
        'Cookie': headersList.get('cookie') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch travel plans:', error);
    return [];
  }
}