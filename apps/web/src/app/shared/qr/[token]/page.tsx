'use client';

import * as React from 'react';
import { MOCK_BATCHES } from '@/lib/mock-data';

export default async function QRRedirectPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const match =
    MOCK_BATCHES.find((b) => b.qrToken === token) || MOCK_BATCHES[0];

  // Client-side redirect to the batch detail page
  if (typeof window !== 'undefined') {
    window.location.replace(`/shared/batches/${match.batchNumber}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-xs text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Resolving secure QR passport token...</span>
      </div>
    </div>
  );
}
