import { User, GraduationCap, Briefcase, Award, Code2, Sparkles, MapPin, Mail } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export function AboutPage() {
  const { data } = useCms();
  
  const published = <T extends { status?: string; orderIndex?: number }>(items: T[]) =>
    items
      .filter((item) => item.status === 'published')
      .slice()
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const about = data.singletons.about ?? {};
  const skills = published(data.collections.skills ?? []);
  const education = published(data.collections.education ?? []);
  const experience = published(data.collections.experience ?? []);
  const certifications = published(data.collections.certifications ?? []);

  useDocumentHead({
    title: 'About Yuna Shimizu',
    description: `Yuna Shimizu — ${about.currentRole ?? 'Full-Stack Developer'}. Learn about his skills, experience, education, and professional certifications.`,
    path: '/about',
  });

  return (
    <div className="pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
      </div>

      {/* Main Grid Layout - Profile Card + Content */}
      <div className="relative pt-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 lg:items-start">
        
        {/* Profile Card Column - STICKY */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="animate-slide-up">
            <div 
              className="relative group profile-card-hover"
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.classList.add('is-hovered');
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.classList.remove('is-hovered');
              }}
            >
              <div className="profile-card-glow absolute -inset-1 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] transition-all duration-500 ease-out" />
              <div className="profile-card-inner relative bg-[#0B1320]/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/[0.06] transition-all duration-500 ease-out">
                {about.profileImageUrl ? (
                  <div className="profile-card-image relative overflow-hidden rounded-2xl">
                    <img 
                      className="w-full aspect-square rounded-2xl object-cover border-4 border-white/10 shadow-lg transition-transform duration-700"
                      src={about.profileImageUrl} 
                      alt="Profile" 
                    />
                    <div className="profile-shine absolute inset-0 pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-2xl bg-[#0B1320]/50 flex items-center justify-center animate-bg-pan">
                    <User className="w-24 h-24 text-[#C77DFF] animate-bounce-subtle" />
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <h2 className="text-xl font-bold text-white hover:text-[#C77DFF] transition-colors">{about.fullName ?? 'Your Name'}</h2>
                  <p className="text-[#C77DFF] font-medium text-shimmer">{about.currentRole ?? 'Your Role'}</p>
                </div>

                {about.researchInterest && (
                  <div className="mt-4 p-3 rounded-xl bg-[#0B1320]/50 text-center hover:bg-[#C77DFF]/10 transition-colors duration-300">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Research Focus</p>
                    <p className="text-sm text-[#C9D1D9]">{about.researchInterest}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {data.singletons.contact?.contactInfo?.location && (
                    <div className="flex items-center gap-2 text-sm text-[#C9D1D9] hover:text-[#C77DFF] transition-colors group/item">
                      <MapPin className="w-4 h-4 text-white/60 group-hover/item:text-[#C77DFF] group-hover/item:animate-bounce-subtle transition-colors" />
                      {data.singletons.contact.contactInfo.location}
                    </div>
                  )}
                  {data.singletons.contact?.contactInfo?.email && (
                    <div className="flex items-center gap-2 text-sm text-[#C9D1D9] hover:text-[#C77DFF] transition-colors group/item">
                      <Mail className="w-4 h-4 text-white/60 group-hover/item:text-[#C77DFF] group-hover/item:animate-wiggle transition-colors" />
                      {data.singletons.contact.contactInfo.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Column */}
        <main className="space-y-16 min-w-0">
          {/* About Header */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
              <span className="text-sm font-medium text-[#C77DFF]">About Me</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              {about.title ?? 'Hello, I\'m'} <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent text-shimmer hover:animate-wiggle inline-block">{about.fullName ?? 'Your Name'}</span>
            </h1>
            <p className="text-lg text-[#C9D1D9] leading-relaxed max-w-4xl animate-slide-up whitespace-pre-wrap">
              {about.bio ?? 'Your bio goes here...'}
            </p>
            
            {Array.isArray(about.highlights) && about.highlights.length > 0 && (
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {about.highlights.map((item: string, index: number) => (
                  <div 
                    key={item} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C77DFF]/10 border border-[#C77DFF]/15 text-[#C77DFF] text-sm font-bold group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                      {index + 1}
                    </div>
                    <span className="text-[#C9D1D9]">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Code2 className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Core Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span 
                    key={skill.id} 
                    className="px-4 py-2 rounded-xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] text-[#C9D1D9] text-sm font-medium shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-600 ease-out cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="ml-2 text-[#C77DFF]">· {skill.level}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <GraduationCap className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Education</h2>
              </div>
              <div className="space-y-4">
                {education.map((item, index) => {
                  const startYear = item.startDate ? new Date(item.startDate).getFullYear() : null;
                  const endYear = item.endDate ? new Date(item.endDate).getFullYear() : 'Present';
                  const dateRange = startYear ? `${startYear} - ${endYear}` : (item.endDate ? new Date(item.endDate).getFullYear() : '');
                  
                  const initials = (item.institution ?? '')
                    .split(' ')
                    .map((word: string) => word[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  
                  return (
                    <article 
                      key={item.id} 
                      className="group p-5 rounded-2xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-300 ease-out"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a1f35] to-[#0B1320] border border-white/10 flex items-center justify-center group-hover:border-[#C77DFF]/30 transition-colors">
                            <span className="text-sm font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                              {initials}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white group-hover:text-[#C77DFF] transition-colors leading-tight">
                            {item.institution}
                          </h3>
                          <p className="text-[#C9D1D9] text-sm mt-0.5">
                            {item.degree}{item.field ? `, ${item.field}` : ''}
                          </p>
                          {dateRange && (
                            <p className="text-white/50 text-sm mt-0.5">
                              {dateRange}
                            </p>
                          )}
                          {item.activities && (
                            <p className="text-white/60 text-sm mt-1">
                              Activities and societies: <span className="text-[#C9D1D9]">{item.activities}</span>
                            </p>
                          )}
                          {item.description && (
                            <p className="text-white/70 text-sm mt-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Briefcase className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Experience</h2>
              </div>
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C77DFF] via-[#9D4EDD] to-transparent opacity-30" />
                
                <div className="space-y-6">
                  {experience.slice(0, 5).map((item, index) => (
                    <article 
                      key={item.id} 
                      className="relative pl-12 animate-slide-in-left"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1320]/80 border-4 border-[#C77DFF]/50 shadow-sm transition-colors">
                        <span className="text-sm font-bold text-[#C77DFF]">{index + 1}</span>
                      </div>
                      
                      <div className="p-6 rounded-2xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                        <h3 className="text-lg font-semibold text-white hover:text-[#C77DFF] transition-colors">{item.role}</h3>
                        <p className="text-[#C77DFF] font-medium">{item.company}</p>
                        <p className="text-sm text-white/60 mt-1">{item.startDate} – {item.endDate ?? 'Present'}</p>
                        {item.description && (
                          <p className="text-[#C9D1D9] mt-3">{item.description}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
