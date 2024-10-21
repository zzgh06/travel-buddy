'use client';

import { useEffect } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import BudgetAnalysis from './BudgetAnalysis';
import { useTravelPlan, useItineraries } from '@/hooks/useTravelPlanQueries';
import { useTravelStore } from '@/store/useTravelStore';
import FloatingToggleManager from './FloatingToggleManager';
import TravelRouteMap from './TravelRouteMap';

interface ClientWrapperProps {
  travelPlanId: string;
}

export default function ClientWrapper({ travelPlanId }: ClientWrapperProps) {
  const { data: travelPlan, isLoading: isLoadingTravelPlan } = useTravelPlan(travelPlanId);
  const { data: itineraries, isLoading: isLoadingItineraries } = useItineraries(travelPlanId);
  const { updateExpenses } = useTravelStore();

  useEffect(() => {
    if (travelPlan && itineraries) {
      updateExpenses(itineraries, travelPlan.budget);
    }
  }, [travelPlan, itineraries, updateExpenses]);

  if (isLoadingTravelPlan || isLoadingItineraries) {
    return <div data-cy="loading-indicator">Loading...</div>;
  }

  if (!travelPlan || !itineraries) {
    return <div data-cy="error-message">데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-4 relative" data-cy="client-wrapper">
      <TravelPlanDetail travelPlanId={travelPlanId} />
      <BudgetTracker travelPlanId={travelPlanId} />
      <BudgetAnalysis travelPlanId={travelPlanId} />
      <TravelRouteMap />
      <ItineraryManager travelPlanId={travelPlanId} />
      <FloatingToggleManager travelPlanId={travelPlanId} />
    </div>
  );
}