'use client'
import dynamic from 'next/dynamic'

const PlaceRecommendations = dynamic(() => import('../../components/PlaceRecommendations'), {
ssr: false
})

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">여행지 추천</h1>
      <PlaceRecommendations />
    </div>
  );
}