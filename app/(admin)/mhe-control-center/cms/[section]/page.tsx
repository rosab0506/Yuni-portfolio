'use client';
import { use } from 'react';
import { CmsSectionEditor } from '../../../../../src/admin/pages/cms/CmsSectionEditor';

// Map URL segment → CMS section key
const sectionMap: Record<string, string> = {
  hero: 'hero', about: 'about', contact: 'contact',
  education: 'education', 'core-skills': 'skills', experience: 'experience',
  certifications: 'certifications', skills: 'techStackCategories',
  blogs: 'blogs', testimonials: 'testimonials', clients: 'clients',
  resume: 'resume', projects: 'projects', publications: 'publications',
  achievements: 'achievements',
};

export default function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  const sectionKey = sectionMap[section] ?? section;
  return <CmsSectionEditor sectionKey={sectionKey} />;
}
