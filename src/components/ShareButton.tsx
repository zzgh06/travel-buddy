"use client";

import { ShareIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

interface ShareButtonProps {
  travelPlanId: string;
}

export default function ShareButton({ travelPlanId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/planner/${travelPlanId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (error) {
      console.error('URL 복사 실패:', error);
      alert('URL을 복사하는데 실패했습니다.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${copied 
          ? 'text-green-800 hover:bg-green-200' 
          : 'text-blue-800 hover:bg-blue-200'
        }`}
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? '복사됨!' : '공유하기'}
    </button>
  );
}