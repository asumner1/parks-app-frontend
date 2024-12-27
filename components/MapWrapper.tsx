'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center">Loading map...</div>
});

export default function MapWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Map />
    </Suspense>
  );
} 