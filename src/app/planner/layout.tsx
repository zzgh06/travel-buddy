import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나의 여행 계획 목록 - 여행 플래너',
  description: '당신만의 특별한 여행 계획을 관리하고 새로운 여행을 계획해보세요. 체계적인 여행 계획 관리 도구를 제공합니다.',
  openGraph: {
    title: '나의 여행 계획 목록 - 여행 플래너',
    description: '당신만의 특별한 여행 계획을 관리하고 새로운 여행을 계획해보세요.',
    images: ['/Travel-buddy.png'],
  },
};

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="planner-dashboard">
      {children}
    </section>
  );
}