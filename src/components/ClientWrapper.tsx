'use client';

import { Suspense, useEffect } from 'react';
import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import BudgetAnalysis from './BudgetAnalysis';
import { useTravelPlan, useItineraries } from '@/hooks/useTravelPlanQueries';
import { useTravelStore } from '@/store/useTravelStore';
import FloatingToggleManager from './FloatingToggleManager';
import TravelPlanDetailSkeleton from './skeleton/TravelPlanDetailSkeleton';

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
    return <div>Loading...</div>;
  }

  if (!travelPlan || !itineraries) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 relative">
      <Suspense fallback={<TravelPlanDetailSkeleton />}>
        <TravelPlanDetail travelPlanId={travelPlanId} />
      </Suspense>
      <BudgetTracker travelPlanId={travelPlanId} />
      <BudgetAnalysis travelPlanId={travelPlanId} />
      <ItineraryManager travelPlanId={travelPlanId} />
      <FloatingToggleManager travelPlanId={travelPlanId} />
    </div>
  );
}