'use client';
import { Suspense } from 'react';
import Providers from '../../providers';
import { AdminLoginPage } from '../../../src/admin/pages/Login/AdminLoginPage';
export default function Page() {
  return (
    <Providers>
      <Suspense>
        <AdminLoginPage />
      </Suspense>
    </Providers>
  );
}
