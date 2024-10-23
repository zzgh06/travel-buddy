import ClientWrapper from '@/components/ClientWrapper';
import { Metadata } from 'next';
import { getTravelPlanById } from '@/lib/api';

type Props = {
  params: { id: string }
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  try {
    const travelPlan = await getTravelPlanById(params.id);

    if (!travelPlan) {
      return {
        title: '여행 계획을 찾을 수 없습니다 - 여행 플래너',
        description: '요청하신 여행 계획을 찾을 수 없습니다.',
      };
    }

    return {
      title: `${travelPlan.title} - 여행 플래너`,
      description: travelPlan.description || '나만의 특별한 여행 계획을 만들어보세요.',
      openGraph: {
        title: `${travelPlan.title} - 여행 플래너`,
        description: travelPlan.description || '나만의 특별한 여행 계획을 만들어보세요.',
        images: ['/Travel-buddy.png'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '여행 플래너',
      description: '나만의 특별한 여행 계획을 만들어보세요.',
    };
  }
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  return <ClientWrapper travelPlanId={params.id} />;
}