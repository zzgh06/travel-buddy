import Link from 'next/link';
import { FaPlane, FaMapMarkedAlt, FaCalendarAlt } from 'react-icons/fa';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            여행의 시작, 여기서부터
          </h1>
          <p className="text-xl text-white opacity-80">
            당신의 꿈꾸던 여행을 계획하고 실현하세요
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<FaPlane className="text-4xl mb-4" />}
            title="목적지 탐색"
            description="전 세계의 아름다운 목적지를 발견하고 선택하세요."
          />
          <FeatureCard
            icon={<FaMapMarkedAlt className="text-4xl mb-4" />}
            title="여행 계획 수립"
            description="일정, 숙소, 교통편을 한 눈에 관리하세요."
          />
          <FeatureCard
            icon={<FaCalendarAlt className="text-4xl mb-4 text-center" />}
            title="일정 관리"
            description="체계적인 일정 관리로 완벽한 여행을 준비하세요."
          />
        </div>

        <div className="text-center">
          <Link href="/planner/create" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-100 transition duration-300">
            여행 계획 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 rounded-lg p-6 text-white transition duration-300 transform hover:scale-105 hover:bg-opacity-30">
      {icon}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="opacity-80">{description}</p>
    </div>
  );
}