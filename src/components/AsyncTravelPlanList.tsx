import dbConnect from "@/lib/mongodb";
import TravelPlan from "@/models/TravelPlan";
import ClientTravelPlanList from "./ClientTravelPlanList";

async function getTravelPlans(userEmail: string) {
  await dbConnect();
  const plans = await TravelPlan.find({ userEmail }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(plans));
}

export default async function AsyncTravelPlanList({ 
  userEmail 
}: { 
  userEmail: string 
}) {
  const travelPlans = await getTravelPlans(userEmail);
  
  return <ClientTravelPlanList initialPlans={travelPlans} />;
}