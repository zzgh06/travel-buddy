'use client';

import { useEffect } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import { useTravelStore } from '@/store/useTravelStore';

interface ClientWrapperProps {
  travelPlan: any;
  itineraries: any[];
}

export default function ClientWrapper({
  travelPlan: initialTravelPlan,
  itineraries: initialItineraries,
}: ClientWrapperProps) {
  const { setTravelPlan, setItineraries } = useTravelStore();

  useEffect(() => {
    setTravelPlan(initialTravelPlan);
    setItineraries(initialItineraries);
  }, [initialTravelPlan, initialItineraries, setTravelPlan, setItineraries]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <TravelPlanDetail />
      <BudgetTracker />
      <ItineraryManager travelPlanId={initialTravelPlan._id} />
    </div>
  );
}