'use client';
import { Suspense } from 'react';
import Providers from '../../../providers';
import { AuthCallbackPage } from '../../../../src/admin/pages/AuthCallback/AuthCallbackPage';
export default function Page() {
  return (
    <Providers>
      <Suspense>
        <AuthCallbackPage />
      </Suspense>
    </Providers>
  );
}
