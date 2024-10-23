import React from 'react';

export default function TravelPlanListSkeleton(){
  return (
    <div className="max-w-[900px] mx-auto mt-4 p-4">
      <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
      
      <div className="mt-8 space-y-6">
        {[1, 2, 3].map((item) => (
          <div 
            key={item}
            className="bg-white p-6 rounded-lg border border-gray-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse" />
              <div className="h-6 bg-blue-100 rounded-full w-24 animate-pulse" />
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-2/5 animate-pulse" />
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-200 rounded mr-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};