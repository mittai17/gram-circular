'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default function QRRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  React.useEffect(() => {
    // Find matching batch by QR token or default to first batch
    const match =
      MOCK_BATCHES.find((b) => b.qrToken === token) || MOCK_BATCHES[0];
    router.replace(`/shared/batches/${match.batchNumber}`);
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-xs text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Resolving secure QR passport token...</span>
      </div>
    </div>
  );
}
