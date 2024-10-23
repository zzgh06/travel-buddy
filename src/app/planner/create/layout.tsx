import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 여행 계획 만들기 - 여행 플래너',
  description: '목적지, 일정, 예산을 설정하고 나만의 특별한 여행 계획을 만들어보세요. 체계적인 여행 계획 도구를 제공합니다.',
  openGraph: {
    title: '새 여행 계획 만들기 - 여행 플래너',
    description: '목적지, 일정, 예산을 설정하고 나만의 특별한 여행 계획을 만들어보세요.',
    images: ['/Travel-buddy.png'],
  },
};

export default function CreateTravelPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="create-travel-plan">
      {children}
    </section>
  );
}