import { getServerSession } from 'next-auth/next';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import dbConnect from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';
import ClientWrapper from '@/components/ClientWrapper';

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
    redirect('/login');
  }

  const { travelPlan, itineraries

  } = await getTravelPlanAndItineraries(params.id, session.user?.email);

  return (
    <ClientWrapper
      travelPlan={travelPlan}
      itineraries={itineraries}
    />
  );
}