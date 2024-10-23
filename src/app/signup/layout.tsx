import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 - 여행 플래너',
  description: '여행 플래너의 회원이 되어 나만의 여행 계획을 만들어보세요. 간단한 회원가입으로 여행 계획 서비스를 무료로 이용하실 수 있습니다.',
  openGraph: {
    title: '여행 플래너 회원가입',
    description: '여행 플래너의 회원이 되어 나만의 여행 계획을 만들어보세요.',
    images: ['/Travel-buddy.png'],
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="signup-page">
      {children}
    </section>
  );
}