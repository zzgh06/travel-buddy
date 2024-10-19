import React from 'react';

export default function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <div className="h-9 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-2 animate-pulse"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div>
              <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <div className="h-10 bg-blue-200 rounded-md animate-pulse"></div>
            <div className="h-10 bg-red-200 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};