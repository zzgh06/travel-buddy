export default function TravelPlanDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto mt-4 p-4 space-y-3">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-300">
        <div className="h-8 w-2/3 bg-gray-200 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-300 px-8 py-6">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="bg-white py-3 px-4 rounded-lg border border-gray-300">
        <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-50 p-2 rounded-lg shadow space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-300">
        <div className="p-4">
          <div className="h-8 w-64 bg-gray-200 rounded mb-3 mx-auto animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded mb-3 mx-auto animate-pulse" />
          <div className="flex justify-center gap-2 mb-3">
            <div className="h-10 flex-1 max-w-3xl bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-[400px] w-full bg-gray-200" />
      </div>

      <div className="bg-white mt-3 p-6 rounded-lg border border-gray-300">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
          <div className="col-span-2 space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}