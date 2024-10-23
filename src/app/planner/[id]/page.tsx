import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import ClientWrapper from '@/components/ClientWrapper';
import { Metadata } from 'next';
import { getTravelPlanById } from '@/lib/api';

type Props = {
  params: { id: string }
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata | null> {
  const travelPlan = await getTravelPlanById(params.id);

  return {
    title: `${travelPlan?.title || '여행 계획'} - 여행 플래너`,
    description: travelPlan?.description || '나만의 특별한 여행 계획을 만들어보세요.',
    openGraph: {
      title: `${travelPlan?.title || '여행 계획'} - 여행 플래너`,
      description: travelPlan?.description || '나만의 특별한 여행 계획을 만들어보세요.',
      images: ['/Travel-buddy.png'],
    },
    
  };
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/login');
  }

  return <ClientWrapper travelPlanId={params.id} />;
}