'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage instantly on mount
    router.replace('/');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-on-surface font-sans">
      <div className="flex flex-col items-center space-y-4 text-center px-6">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div>
          <h2 className="text-lg font-bold text-on-surface">Page Not Found (404)</h2>
          <p className="text-xs text-on-surface-variant mt-1">Redirecting you to the homepage...</p>
        </div>
      </div>
    </div>
  );
}
