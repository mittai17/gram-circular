'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicCollectionPointsMap = dynamic(
  () => import('./collection-points-map'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[460px] w-full rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 border border-gray-200">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="text-xs font-medium">Loading interactive geographic map...</span>
      </div>
    ),
  }
);

export default DynamicCollectionPointsMap;
