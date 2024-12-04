'use client';

import TravelPlanDetail from './TravelPlanDetail';
import BudgetTracker from './BudgetTracker';
import ItineraryManager from './ItineraryManager';
import BudgetAnalysis from './BudgetAnalysis';
import FloatingToggleManager from './FloatingToggleManager';
import { useTravelPlan } from '@/hooks/useTravelPlan';
import TravelPlanDetailSkeleton from './skeleton/TravelPlanDetailSkeleton';
import dynamic from 'next/dynamic';

const TravelRouteMap = dynamic(() => import('./TravelRouteMap'), {
  ssr: false,
  loading: () => <div>지도를 불러오는 중...</div>
});

interface ClientWrapperProps {
  travelPlanId: string;
}

export default function ClientWrapper({ travelPlanId }: ClientWrapperProps) {
  const { data: travelPlan, isLoading } = useTravelPlan(travelPlanId);

  if (isLoading) {
    return <TravelPlanDetailSkeleton />;
  }

  if (!travelPlan) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          여행 계획을 찾을 수 없습니다
        </h2>
        <p className="text-gray-600">
          요청하신 여행 계획이 존재하지 않거나 접근 권한이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-1 p-4 relative" data-cy="client-wrapper">
      <TravelPlanDetail travelPlanId={travelPlanId} travelPlan={travelPlan} />
      <BudgetTracker travelPlanId={travelPlanId} />
      <BudgetAnalysis travelPlanId={travelPlanId} />
      <TravelRouteMap travelPlanId={travelPlanId} />
      <ItineraryManager travelPlanId={travelPlanId} travelPlan={travelPlan} />
      <FloatingToggleManager travelPlanId={travelPlanId} />
    </div>
  );
}