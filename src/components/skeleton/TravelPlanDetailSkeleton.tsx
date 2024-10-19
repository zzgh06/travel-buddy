export default function TravelPlanDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}