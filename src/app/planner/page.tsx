import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import Link from "next/link";
import TravelPlanList from "@/components/TravelPlanList";

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="max-w-[100%] mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">여행 계획</h1>
        <p>이 페이지를 보려면 로그인이 필요합니다.</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6" data-cy="planner-page">
      <div className="flex justify-between items-center px-3">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold pb-2">✈️ 나의 여행 계획</h1>
          <p className="text-gray-500 ml-3">
            나만의 여행 계획을 편하게 작성해보세요.
          </p>
        </div>
        <Link
          href="/planner/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          새 계획 만들기
        </Link>
      </div>
      <TravelPlanList />
    </div>
  );
}