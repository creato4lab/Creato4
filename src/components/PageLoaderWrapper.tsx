'use client';

import { Suspense } from 'react';
import { PageLoader } from './PageLoader';

export function PageLoaderWrapper() {
  return (
    <Suspense fallback={null}>
      <PageLoader />
    </Suspense>
  );
}
