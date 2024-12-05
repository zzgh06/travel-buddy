import Provider from "@/components/Provider";
import "./globals.css"

import { Metadata } from 'next';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: '여행 플래너 - 당신의 완벽한 여행 파트너',
  description: '전 세계 여행지 탐색부터 일정 관리까지, 당신의 꿈꾸던 여행을 계획하고 실현하세요.',
  keywords: '여행 계획, 여행 일정, 여행지 추천, 여행 플래너, 해외여행',
  openGraph: {
    title: '여행 플래너 - 당신의 완벽한 여행 파트너',
    description: '전 세계 여행지 탐색부터 일정 관리까지, 당신의 꿈꾸던 여행을 계획하고 실현하세요.',
    images: [
      {
        url: '/Travel-buddy.png',
        width: 1200,
        height: 630,
        alt: '여행 플래너 메인 이미지',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kr" className="max-w-[800px] min-h-[100vh] mx-auto">
      <body>
        <div className="min-h-[100vh] bg-white shadow-sm">
          <Provider>
            <header className="h-[60px] font-semibold text-3xl">
              <Navbar />
            </header>
            <main>{children}</main>
          </Provider>
        </div>
      </body>
    </html>
  )
}