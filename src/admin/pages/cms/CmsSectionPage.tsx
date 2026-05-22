'use client';
import { useParams } from 'next/navigation';
import { CmsSectionEditor } from './CmsSectionEditor';

export function CmsSectionPage() {
  const params = useParams();
  const sectionKey = params?.sectionKey as string | undefined;
  if (!sectionKey) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-8">
        <h1 className="text-lg font-semibold text-white">Unknown section</h1>
        <p className="mt-2 text-sm text-white/60">Section not found.</p>
      </div>
    );
  }
  return <CmsSectionEditor sectionKey={sectionKey} />;
}
