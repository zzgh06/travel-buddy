'use client';

import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import BudgetAnalysis from './BudgetAnalysis';
import FloatingToggleManager from './FloatingToggleManager';
import TravelRouteMap from './TravelRouteMap';
import { useItineraries, useTravelPlan } from '@/hooks/useTravelPlan';
import TravelPlanDetailSkeleton from './skeleton/TravelPlanDetailSkeleton';

interface ClientWrapperProps {
  travelPlanId: string;
}

export default function ClientWrapper({ travelPlanId }: ClientWrapperProps) {
  const { isLoading: isLoadingTravelPlan } = useTravelPlan(travelPlanId);
  const { isLoading: isLoadingItineraries } = useItineraries(travelPlanId);

  const isLoading = isLoadingTravelPlan || isLoadingItineraries;

  if (isLoading) {
    return <TravelPlanDetailSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-1 p-4 relative" data-cy="client-wrapper">
      <TravelPlanDetail travelPlanId={travelPlanId} />
      <BudgetTracker travelPlanId={travelPlanId} />
      <BudgetAnalysis travelPlanId={travelPlanId} />
      <TravelRouteMap travelPlanId={travelPlanId} />
      <ItineraryManager travelPlanId={travelPlanId} />
      <FloatingToggleManager travelPlanId={travelPlanId} />
    </div>
  );
}