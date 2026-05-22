import { useState } from 'react';
import { useCms } from '../../hooks/useCms';
import { Sparkles, FolderGit2, BookOpen, Trophy, Award, ExternalLink, Github, FileText, Eye, Inbox } from 'lucide-react';
import { CertificateModal } from '../../components/common/CertificateModal';
import { useDocumentHead } from '../../hooks/useDocumentHead';

const tabs = ['projects', 'publications', 'achievements'] as const;

type TabKey = (typeof tabs)[number];

const tabConfig = {
  projects: { icon: FolderGit2, label: 'Projects', gradient: 'from-[#C77DFF] to-[#9D4EDD]' },
  publications: { icon: BookOpen, label: 'Publications', gradient: 'from-[#C77DFF] to-[#9D4EDD]' },
  achievements: { icon: Trophy, label: 'Achievements', gradient: 'from-[#C77DFF] to-[#9D4EDD]' },
};

export function PortfolioPage() {
  const { data } = useCms();
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certModalImage, setCertModalImage] = useState('');

  useDocumentHead({
    title: 'Portfolio — Yuna Shimizu',
    description: 'Explore the portfolio of Yuna Shimizu — featured projects, case studies, and web development work.',
    path: '/portfolio',
  });

  const projects = (data.collections.projects ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const publications = (data.collections.publications ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const achievements = (data.collections.achievements ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const certifications = (data.collections.certifications ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const handleViewCertificate = (imageUrl: string) => {
    setCertModalImage(imageUrl);
    setCertModalOpen(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
          <span className="text-sm font-medium text-[#C77DFF]">My Portfolio</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          Work & <span className="gradient-text text-shimmer hover:animate-wiggle inline-block">Achievements</span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          A curated collection of my projects, publications, and achievements throughout my career.
        </p>
      </section>

      {/* Tab Navigation */}
      {/* <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-center overflow-x-auto pb-4 -mb-4 px-4 sm:px-0 scrollbar-hide">
          <div className="inline-flex p-1.5 bg-[#0B1320]/60 rounded-2xl border border-white/10 whitespace-nowrap min-w-fit">
            {tabs.map((tab, index) => {
              const config = tabConfig[tab];
              const Icon = config.icon;
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${isActive
                    ? 'bg-[#0B1320]/50 text-white shadow-md border border-white/20'
                    : 'text-white/60 hover:text-[#C9D1D9]'
                    }`}
                  onClick={() => setActiveTab(tab)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C77DFF] animate-bounce-subtle' : ''} transition-colors`} />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Projects Tab */}
      {activeTab === 'projects' && projects.length > 0 && (
        <section className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <article key={project.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

              <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                {project.coverImageUrl ? (
                  <div className="relative h-52 overflow-hidden img-hover-shine">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={project.coverImageUrl}
                      alt={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="h-52 bg-gradient-to-br from-[#0B1320]/50 to-[#0B1320]/60 flex items-center justify-center animate-bg-pan">
                    <FolderGit2 className="w-16 h-16 text-[#C77DFF] animate-bounce-subtle" />
                  </div>
                )}

                <div className="p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1320]/50 text-[#C77DFF] text-xs font-semibold mb-3 group-hover:bg-[#C77DFF]/20 transition-colors">
                    <Sparkles className="w-3 h-3 group-hover:animate-spin-slow" />
                    Project {String(index + 1).padStart(2, '0')}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-[#C9D1D9] mb-4 line-clamp-2">{project.description}</p>

                  {/* Tech pills — outlined, white text */}
                  {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full border border-white/40 text-white text-xs font-medium bg-transparent"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#C9D1D9] hover:text-[#C77DFF] hover:-translate-y-0.5 transition-all duration-300 group/link"
                      >
                        <Github className="w-4 h-4 group-hover/link:animate-bounce-subtle" />
                        Code
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#C9D1D9] hover:text-[#C77DFF] hover:-translate-y-0.5 transition-all duration-300 group/link"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/link:animate-wiggle" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

        </section>
      )}

      {/* Projects Empty State */}
      {activeTab === 'projects' && projects.length === 0 && (
        <section className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-[#C77DFF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">
              Projects will appear here once they are added and published.
            </p>
          </div>
        </section>
      )}

      {/* Publications Tab */}
      {activeTab === 'publications' && publications.length > 0 && (
        <section className="space-y-6">
          {publications.map((pub, index) => (
            <article key={pub.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

              <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
                  {pub.coverImageUrl ? (
                    <div className="h-40 md:h-full rounded-xl overflow-hidden img-hover-shine">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={pub.coverImageUrl}
                        alt={pub.title}
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-full rounded-xl bg-gradient-to-br from-[#0B1320]/50 to-[#0B1320]/60 flex items-center justify-center animate-bg-pan">
                      <BookOpen className="w-12 h-12 text-[#C77DFF] animate-bounce-subtle" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-semibold w-fit mb-3 group-hover:bg-[#C77DFF]/30 transition-colors">
                      <BookOpen className="w-3 h-3 group-hover:animate-wiggle" />
                      {pub.venue || 'Publication'}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors">
                      {pub.title}
                    </h2>

                    {Array.isArray(pub.authors) && pub.authors.length > 0 && (
                      <p className="text-sm text-white/60 mb-2">{pub.authors.join(', ')}</p>
                    )}

                    {pub.year && (
                      <p className="text-sm text-[#C77DFF] font-medium mb-3">Published {pub.year}</p>
                    )}

                    {pub.abstract && (
                      <p className="text-[#C9D1D9] text-sm line-clamp-2 mb-4">{pub.abstract}</p>
                    )}

                    <div className="flex items-center gap-3 mt-auto">
                      {pub.paperUrl && (
                        <a
                          href={pub.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] text-sm font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/link:animate-wiggle" />
                          View Paper
                        </a>
                      )}
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1320]/50 text-[#C9D1D9] text-sm font-medium hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <FileText className="w-4 h-4 group-hover/link:animate-bounce-subtle" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}

        </section>
      )}

      {/* Publications Empty State */}
      {activeTab === 'publications' && publications.length === 0 && (
        <section className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-[#C77DFF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Publications Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">
              Publications will appear here once they are added and published.
            </p>
          </div>
        </section>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (achievements.length > 0 || certifications.length > 0) && (
        <section className="space-y-12">
          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Trophy className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Achievements & Awards</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((item, index) => (
                  <article key={item.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

                    <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 flex-shrink-0 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                          <Trophy className="w-6 h-6 text-[#C77DFF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#C77DFF] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[#C77DFF] font-medium text-sm">{item.issuer}</p>
                          {item.year && (
                            <p className="text-sm text-white/60 mt-1">{item.year}</p>
                          )}
                          {item.description && (
                            <p className="text-[#C9D1D9] text-sm mt-3">{item.description}</p>
                          )}
                          {item.externalLink && (
                            <a
                              href={item.externalLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-[#C77DFF] font-medium mt-3 hover:gap-3 transition-all duration-300 group/link"
                            >
                              <ExternalLink className="w-4 h-4 group-hover/link:animate-wiggle" />
                              View Details
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Award className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Certifications</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <article key={cert.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

                    <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                      {cert.certificateImageUrl && (
                        <div className="h-40 overflow-hidden img-hover-shine">
                          <img
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src={cert.certificateImageUrl}
                            alt={cert.certificateTitle}
                          />
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="font-bold text-white group-hover:text-[#C77DFF] transition-colors">
                          {cert.certificateTitle}
                        </h3>
                        <p className="text-[#C77DFF] text-sm font-medium">{cert.issuer}</p>
                        <p className="text-xs text-white/60 mt-1">Issued: {cert.issueDate}</p>
                        {cert.expiryDate && (
                          <p className="text-xs text-white/60">Expires: {cert.expiryDate}</p>
                        )}
                        {cert.credentialId && (
                          <p className="text-xs text-white/60 mt-2 truncate">ID: {cert.credentialId}</p>
                        )}

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                          {cert.certificateImageUrl && (
                            <button
                              onClick={() => handleViewCertificate(cert.certificateImageUrl)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 transition-all duration-300 group/btn"
                            >
                              <Eye className="w-3 h-3 group-hover/btn:animate-wiggle" />
                              View
                            </button>
                          )}
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B1320]/50 text-[#C9D1D9] text-xs font-medium hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 group/link"
                            >
                              <ExternalLink className="w-3 h-3 group-hover/link:animate-bounce-subtle" />
                              Verify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          )}
        </section>
      )}

      {/* Achievements Empty State */}
      {activeTab === 'achievements' && achievements.length === 0 && certifications.length === 0 && (
        <section className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-[#C77DFF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">
              Achievements and certifications will appear here once they are added and published.
            </p>
          </div>
        </section>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        imageUrl={certModalImage}
        onClose={() => setCertModalOpen(false)}
      />
    </div>
  );
}
