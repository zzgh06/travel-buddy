import React from 'react';

export default function CreateTravelPlanSkeleton(){
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white">
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
      <div className="space-y-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>

        <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>
  );
};