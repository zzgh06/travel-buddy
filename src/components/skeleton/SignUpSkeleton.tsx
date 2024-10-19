import React from 'react';

export default function SignUpSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="h-10 bg-gray-200 rounded-t-md animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="h-10 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="h-10 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="h-10 bg-gray-200 rounded-b-md animate-pulse"></div>
            </div>
          </div>

          <div className="relative">
            <div className="h-10 bg-green-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};