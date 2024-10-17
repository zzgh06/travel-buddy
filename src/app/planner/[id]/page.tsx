import { getServerSession } from 'next-auth/next';
import { notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import TravelPlanDetail from '@/components/TravelPlanDetail';
import ItineraryManager from '@/components/ItineraryManager';
import dbConnect from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';

async function getTravelPlanAndItineraries(id: string, userEmail: string) {
  await dbConnect();
  const travelPlan = await TravelPlan.findOne({ _id: id, userEmail });
  if (!travelPlan) {
    notFound();
  }
  const itineraries = await Itinerary.find({ travelPlanId: id }).sort({ date: 1, time: 1 });
  return {
    travelPlan: JSON.parse(JSON.stringify(travelPlan)),
    itineraries: JSON.parse(JSON.stringify(itineraries)),
  };
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">여행 계획 상세</h1>
        <p>이 페이지를 보려면 로그인이 필요합니다.</p>
        <a href="/login" className="text-blue-500 hover:underline">로그인하러 가기</a>
      </div>
    );
  }

  const { travelPlan, itineraries } = await getTravelPlanAndItineraries(params.id, session.user?.email || "");

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <TravelPlanDetail travelPlan={travelPlan} />
      <ItineraryManager travelPlanId={params.id} initialItineraries={itineraries} />
    </div>
  );}