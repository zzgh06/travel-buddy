'use client';

import { useEffect, useRef } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import { useTravelStore } from '@/store/useTravelStore';
import BudgetAnalysis from './BudgetAnalysis';
import FloatingBudgetInfo from './FloatingBudgetInfo';

interface ClientWrapperProps {
  travelPlan: any;
  itineraries: any[];
}

export default function ClientWrapper({
  travelPlan: initialTravelPlan,
  itineraries: initialItineraries,
}: ClientWrapperProps) {
  const { setTravelPlan, setItineraries } = useTravelStore();
  const itineraryManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTravelPlan(initialTravelPlan);
    setItineraries(initialItineraries);
  }, [initialTravelPlan, initialItineraries, setTravelPlan, setItineraries]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 relative">
      <TravelPlanDetail />
      <BudgetTracker />
      <BudgetAnalysis />
      <ItineraryManager travelPlanId={initialTravelPlan._id} triggerRef={itineraryManagerRef} />
      <FloatingBudgetInfo triggerRef={itineraryManagerRef} />
    </div>
  );
}