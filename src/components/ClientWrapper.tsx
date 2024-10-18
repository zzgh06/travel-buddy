'use client';

import { useEffect, useRef } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import BudgetAnalysis from './BudgetAnalysis';
import FloatingBudgetInfo from './FloatingBudgetInfo';
import { useTravelPlan, useItineraries } from '@/hooks/useTravelPlanQueries';
import { useTravelStore } from '@/store/useTravelStore';

interface ClientWrapperProps {
  travelPlanId: string;
}

export default function ClientWrapper({ travelPlanId }: ClientWrapperProps) {
  const { data: travelPlan, isLoading: isLoadingTravelPlan } = useTravelPlan(travelPlanId);
  const { data: itineraries, isLoading: isLoadingItineraries } = useItineraries(travelPlanId);
  const { updateExpenses } = useTravelStore();
  const itineraryManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (travelPlan && itineraries) {
      updateExpenses(itineraries, travelPlan.budget);
    }
  }, [travelPlan, itineraries, updateExpenses]);

  if (isLoadingTravelPlan || isLoadingItineraries) {
    return <div>Loading...</div>;
  }

  if (!travelPlan || !itineraries) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 relative">
      <TravelPlanDetail travelPlanId={travelPlanId} />
      <BudgetTracker travelPlanId={travelPlanId} />
      <BudgetAnalysis travelPlanId={travelPlanId} />
      <ItineraryManager travelPlanId={travelPlanId} triggerRef={itineraryManagerRef} />
      <FloatingBudgetInfo triggerRef={itineraryManagerRef} travelPlanId={travelPlanId} />
    </div>
  );
}