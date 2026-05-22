'use client';

import { AppProviders } from '../src/app/providers/AppProviders';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
