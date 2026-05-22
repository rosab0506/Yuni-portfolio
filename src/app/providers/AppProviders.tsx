'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { CmsProvider } from '../../context/CmsContext';
import { LoadingProvider } from '../../context/LoadingContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <CmsProvider>{children}</CmsProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
