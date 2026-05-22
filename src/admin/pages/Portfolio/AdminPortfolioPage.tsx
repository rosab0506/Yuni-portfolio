import { useState } from 'react';
import { CmsSectionEditor } from '../cms/CmsSectionEditor';

const tabs = ['projects', 'publications', 'achievements'] as const;

type TabKey = (typeof tabs)[number];

export function AdminPortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('projects');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-[#C9D1D9]">Manage projects, publications, and achievements.</p>
      </div>
      <div className="flex flex-wrap gap-2 rounded border border-white/10 bg-[#0B1320]/80 p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              activeTab === tab
                ? 'bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white'
                : 'border border-white/10 text-[#C9D1D9] hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'projects' && <CmsSectionEditor sectionKey="projects" />}
        {activeTab === 'publications' && <CmsSectionEditor sectionKey="publications" />}
        {activeTab === 'achievements' && <CmsSectionEditor sectionKey="achievements" />}
      </div>
    </div>
  );
}
