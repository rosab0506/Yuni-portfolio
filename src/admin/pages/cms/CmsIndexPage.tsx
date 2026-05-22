'use client';
import Link from 'next/link';
import { sectionList } from '../../cms/cmsSchemas';

export function CmsIndexPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">CMS Sections</h1>
      <ul className="space-y-2">
        {sectionList.map((section) => (
          <li key={section.key} className="rounded-xl border border-white/10 bg-[#0B1320]/80 p-4 hover:bg-white/5 transition-colors">
            <Link href={`/mhe-control-center/cms/${section.key}`} className="text-[#C77DFF] hover:text-[#9D4EDD] font-medium">{section.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
