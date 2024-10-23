import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 - 여행 플래너',
  description: '여행 플래너에 로그인하여 나만의 특별한 여행 계획을 만들어보세요. 이메일 또는 구글 계정으로 간편하게 시작할 수 있습니다.',
  openGraph: {
    title: '여행 플래너 로그인',
    description: '여행 플래너에 로그인하여 나만의 특별한 여행 계획을 만들어보세요.',
    images: ['/Travel-buddy.png'],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="login-page">
      {children}
    </section>
  );
}