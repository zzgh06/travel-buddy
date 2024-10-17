import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import { notFound } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import TravelPlanDetail from '@/components/TravelPlanDetail';

async function getTravelPlan(id: string, userEmail: string) {
  await dbConnect();
  const plan = await TravelPlan.findOne({ _id: id, userEmail });
  if (!plan) {
    notFound();
  }
  return JSON.parse(JSON.stringify(plan));
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

  const plan = await getTravelPlan(params.id, session.user?.email || "");

  return <TravelPlanDetail plan={plan} />;
}