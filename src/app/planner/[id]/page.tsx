import { getServerSession } from 'next-auth/next';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import TravelPlanDetail from '@/components/TravelPlanDetail';
import ItineraryManager from '@/components/ItineraryManager';
import dbConnect from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';
import BudgetTracker from '@/components/BudgetTracker';

async function getTravelPlanAndItineraries(id: string, userEmail: string) {
  await dbConnect();
  const travelPlan = await TravelPlan.findOne({ _id: id, userEmail });
  if (!travelPlan) {
    notFound();
  }
  const itineraries = await Itinerary.find({ travelPlanId: id }).sort({ date: 1, time: 1 });
  
  const totalExpenses = itineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
  const remainingBudget = travelPlan.budget - totalExpenses;

  return {
    travelPlan: JSON.parse(JSON.stringify(travelPlan)),
    itineraries: JSON.parse(JSON.stringify(itineraries)),
    totalExpenses,
    remainingBudget,
  };
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    alert('로그인이 필요한 서비스 입니다.')
    redirect('/login');
  }

  const { travelPlan, itineraries, totalExpenses, remainingBudget } = await getTravelPlanAndItineraries(params.id, session.user?.email || "");


  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="mb-8">
        <TravelPlanDetail travelPlan={travelPlan} />
      </div>
      
      <div className="mb-8">
        <BudgetTracker 
          budget={travelPlan.budget} 
          totalExpenses={totalExpenses} 
          remainingBudget={remainingBudget} 
        />
      </div>

      <div>
        <ItineraryManager 
          travelPlanId={params.id} 
          initialItineraries={itineraries} 
        />
      </div>
    </div>
  );
}