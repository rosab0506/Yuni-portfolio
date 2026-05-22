'use client';

import Providers from '../providers';
import { AdminLayoutNext } from '../../src/app/layouts/AdminLayoutNext';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AdminLayoutNext>{children}</AdminLayoutNext>
    </Providers>
  );
}
