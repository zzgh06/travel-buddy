import { TravelPlan } from '@/types/types';
import { cookies } from 'next/headers';

export async function getTravelPlanById(id: string): Promise<TravelPlan | null> {
  try {
    const cookieStore = cookies();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-plans/${id}`, {
      headers: {
        Cookie: cookieStore.toString(), 
      },
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.travelPlan;
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    return null;
  }
}