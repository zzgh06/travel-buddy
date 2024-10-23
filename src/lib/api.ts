import { TravelPlan } from '@/types/types';
import axios from 'axios';

export async function getTravelPlanById(id: string): Promise<TravelPlan | null> {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-plans/${id}`);
    return data.data.travelPlan;
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    return null;
  }
}