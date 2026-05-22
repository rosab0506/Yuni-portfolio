'use client';

import Providers from '../providers';
import { PublicLayoutNext } from '../../src/app/layouts/PublicLayoutNext';

export default function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <PublicLayoutNext>{children}</PublicLayoutNext>
    </Providers>
  );
}
