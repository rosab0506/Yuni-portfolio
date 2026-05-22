'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, ExternalLink, Github, Quote, Award, ChevronRight, Sparkles, Zap, Code2, Rocket } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { JsonLd } from '../../components/common/JsonLd';
import { ResumeViewerModal } from '../../components/common/ResumeViewerModal';
import { CertificateModal } from '../../components/common/CertificateModal';

const TechToolIcon = ({ tool }: { tool: { name: string; logoUrl: string } }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = tool.logoUrl && !imgError;

  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-xl bg-[#0B1320]/50 border border-white/10 flex items-center justify-center">
        {/* {!showImage && <Code2 className="w-5 h-5 text-white/60" />} */}
        <img src={tool.logoUrl} alt="img" />
      </div>
      {showImage && (
        <img
          className="absolute inset-0 w-10 h-10 rounded-xl object-contain p-1 bg-[#0B1320] border border-white/10 group-hover/item:border-[#C77DFF]/50 transition-colors"
          src={tool.logoUrl}
          alt={tool.name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export function HomePage() {
  const { data } = useCms();
  const published = <T extends { status?: string; orderIndex?: number }>(items: T[]) =>
    items
      .filter((item) => item.status === 'published')
      .slice()
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const hero = data.singletons.hero ?? {};
  const services = published(data.collections.services ?? []);
  const projects = published(data.collections.projects ?? []);
  const featuredProjects = projects.filter((project) => project.featured);
  const blogs = published(data.collections.blogs ?? []);
  const testimonials = published(data.collections.testimonials ?? []);
  const clients = published(data.collections.clients ?? []);
  const achievements = published(data.collections.achievements ?? []);
  const certifications = published(data.collections.certifications ?? []);
  const about = data.singletons.about ?? {};
  const education = published(data.collections.education ?? []);
  const resumes = data.collections.resumes ?? [];
  const resumeSettings = data.singletons.resumeSettings ?? {};
  const activeResume =
    resumes.find((item) => item.id === resumeSettings.activeResumeId && item.status === 'active') ??
    resumes.find((item) => item.status === 'active');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{ imageUrl: string; title: string } | null>(null);
  const techStackCategories = published(data.collections.techStackCategories ?? []);

  // Intersection Observer for scroll animations
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [
    services.length,
    projects.length,
    blogs.length,
    testimonials.length,
    clients.length,
    achievements.length,
    certifications.length
  ]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
  };

  const sectionClass = (id: string) =>
    `transition-all duration-1000 ${visibleSections.has(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;

  // SEO
  const fullName = hero.fullName ?? about.fullName ?? 'Mahedi Hasan Emon';
  const headline = hero.subheadline ?? 'Full-stack engineer focused on scalable web platforms.';
  useDocumentHead({
    title: `${fullName} — Full-Stack Developer & Portfolio`,
    description: `${fullName} — ${headline} Explore projects, services, blog, and publications.`,
    path: '/',
  });

  // Structured data: Person
  const contact = data.singletons.contact ?? {};
  const socialLinks: string[] = Array.isArray(contact.socialLinks)
    ? contact.socialLinks.map((l: { url?: string }) => String(l.url ?? '')).filter(Boolean)
    : [];

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://mahedihasanemon.site/#person',
    name: 'Mahedi Hasan Emon',
    givenName: 'Mahedi Hasan',
    familyName: 'Emon',
    alternateName: ['Mahedi Emon', 'MH Emon'],
    url: 'https://mahedihasanemon.site',
    image: about.profileImageUrl ?? 'https://mahedihasanemon.site/favicon.png',
    jobTitle: about.currentRole ?? 'Full-Stack Developer',
    description: `${fullName} is a Full-Stack Developer specializing in scalable web platforms, React, Node.js, and modern cloud solutions.`,
    nationality: { '@type': 'Country', name: 'Bangladesh' },
    knowsAbout: ['Web Development', 'React', 'Node.js', 'TypeScript', 'Full-Stack Development', 'Software Engineering'],
    sameAs: socialLinks,
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': 'https://mahedihasanemon.site/#profilepage',
        name: `${fullName} — Portfolio`,
        url: 'https://mahedihasanemon.site',
        mainEntity: { '@id': 'https://mahedihasanemon.site/#person' },
        description: `Official portfolio website of ${fullName} — Full-Stack Developer.`,
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${fullName} — Portfolio`,
        url: 'https://mahedihasanemon.site',
        description: `Official portfolio website of ${fullName} — Full-Stack Developer building scalable web platforms.`,
        author: { '@id': 'https://mahedihasanemon.site/#person' },
      }} />
    <div className="space-y-32">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Premium Cinematic Landing
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={setSectionRef('hero')}
        className={`relative min-h-[85vh] flex items-center ${sectionClass('hero')}`}
      >
        {/* Radial Glow Behind Hero */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(199,125,255,0.15),transparent_60%)]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.1),transparent_60%)]" />

          {/* Floating Orbs with slow animation */}
          <div className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-[#C77DFF]/40 animate-float-slow" />
          <div className="absolute top-40 right-[15%] w-6 h-6 rounded-full bg-[#9D4EDD]/30 animate-float-medium" />
          <div className="absolute bottom-32 left-[20%] w-3 h-3 rounded-full bg-[#C77DFF]/50 animate-float-fast" />
          <div className="absolute top-1/3 right-[25%] w-5 h-5 rounded-full bg-[#E0AAFF]/25 animate-float-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 right-[10%] w-4 h-4 rounded-full bg-[#C77DFF]/35 animate-float-medium" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[60%] left-[5%] w-3 h-3 rounded-full bg-[#9D4EDD]/40 animate-float-fast" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Content */}
          <div className="space-y-8 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] animate-slide-up text-white">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] bg-[length:200%_auto] bg-clip-text text-transparent inline pb-2 animate-gradient-x whitespace-nowrap">
                {hero.fullName ?? about.fullName ?? 'Full Name'}
              </span>
            </h1>

            <p className="text-xl text-[#C9D1D9] max-w-xl leading-relaxed animate-slide-up delay-200 hover:text-white transition-colors">
              {hero.subheadline ?? 'Full-stack engineer focused on scalable web platforms.'}
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Link
                href={hero.ctaPrimaryHref ?? '/portfolio'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                {hero.ctaPrimaryLabel ?? 'View Portfolio'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Link>
              <Link
                href={hero.ctaSecondaryHref ?? '/contact'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white font-medium hover:border-[#C77DFF]/50 hover:text-white hover:-translate-y-1 transition-all duration-300"
              >
                {hero.ctaSecondaryLabel ?? 'Contact Me'}
              </Link>
            </div>

            {/* Stats Row */}
            {/* <div className="flex gap-8 pt-8 border-t border-white/10 animate-slide-up delay-500">
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">{projects.length}+</div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">Projects</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">{clients.length}+</div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">Clients</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">{certifications.length}+</div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">Certifications</div>
              </div>
            </div> */}
          </div>

          {/* Profile Image / Visual */}
          <div className="relative hidden lg:flex justify-center items-center lg:pl-8">
            {/* Background glow with entrance animation */}
            <div className="absolute w-80 h-80 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-20 blur-3xl animate-hero-glow-entrance" />

            <div className="relative animate-hero-entrance">
                <div className="relative group">
                  {/* Spinning gradient border - outer ring */}
                  <div className="absolute -inset-3 rounded-3xl overflow-hidden">
                    <div
                      className="absolute inset-0 animate-spin-border"
                      style={{ background: 'conic-gradient(from 0deg, #C77DFF, #9D4EDD, #E0AAFF, #C77DFF, #9D4EDD, #C77DFF)' }}
                    />
                  </div>
                  {/* Inner mask to create border effect */}
                  <div className="absolute -inset-1 bg-[#0B1320] rounded-3xl" />

                  {/* Secondary spinning glow (reverse direction) */}
                  <div className="absolute -inset-4 rounded-3xl overflow-hidden opacity-40 group-hover:opacity-70 transition-opacity">
                    <div className="absolute inset-0 blur-xl animate-reverse-spin"
                      style={{ background: 'conic-gradient(from 180deg, #C77DFF, transparent, #9D4EDD, transparent, #C77DFF)' }} />
                  </div>

                  {/* Gradient glow pulse */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />

                  <img
                    className="relative w-80 h-80 rounded-3xl object-cover border-4 border-white/10 shadow-2xl shadow-[#C77DFF]/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#C77DFF]/50"
                    src="./images/avatar.png"
                    alt="Profile"
                  />
                </div>

              {/* Floating Elements with Sparkle Animations */}
              <div className="absolute -top-6 -right-6 p-4 bg-[#0B1320]/80 backdrop-blur-sm border border-[#C77DFF]/30 rounded-2xl shadow-xl shadow-[#C77DFF]/20 animate-sparkle-entrance-1 animate-sparkle-1 hover:scale-110 hover:border-[#C77DFF]/60 transition-all cursor-pointer">
                <Zap className="w-8 h-8 text-[#C77DFF] drop-shadow-[0_0_8px_rgba(199,125,255,0.5)]" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-4 bg-[#0B1320]/80 backdrop-blur-sm border border-[#C77DFF]/30 rounded-2xl shadow-xl shadow-[#C77DFF]/20 animate-sparkle-entrance-2 animate-sparkle-2 hover:scale-110 hover:border-[#C77DFF]/60 transition-all cursor-pointer">
                <Rocket className="w-8 h-8 text-[#C77DFF] drop-shadow-[0_0_8px_rgba(199,125,255,0.5)]" />
              </div>
              <div className="absolute top-1/2 -right-12 p-3 bg-[#0B1320]/80 backdrop-blur-sm border border-[#9D4EDD]/30 rounded-xl shadow-lg shadow-[#9D4EDD]/20 animate-sparkle-entrance-3 animate-sparkle-3 hover:scale-110 transition-all cursor-pointer">
                <Sparkles className="w-6 h-6 text-[#9D4EDD] drop-shadow-[0_0_8px_rgba(157,78,221,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          ABOUT SECTION - Ink Purple Theme
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="about-section"
        ref={setSectionRef('about-section')}
        className={sectionClass('about-section')}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            About <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto animate-fade-in">Passionate about creating impactful digital experiences</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="relative group">
            {about.profileImageUrl ? (
              <>
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] rounded-3xl opacity-60 blur-sm group-hover:opacity-100 transition-opacity animate-gradient-border" />
                <div className="absolute -inset-4 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all duration-500" />
                <img
                  className="relative w-full aspect-square rounded-3xl object-cover shadow-2xl shadow-[#C77DFF]/20 border-2 border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#C77DFF]/50"
                  src={about.profileImageUrl}
                  alt="Profile"
                />
              </>
            ) : (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] rounded-3xl opacity-40 blur-sm animate-gradient-border" />
                <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-[#1a1f35] to-[#0B1320] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/10 to-transparent" />
                  <span className="text-8xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                    {(about.fullName ?? hero.fullName ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-lg text-[#C9D1D9] leading-relaxed hover:text-white transition-colors duration-300">
              {about.bio && about.bio.length > 200
                ? `${about.bio.slice(0, 200).trim()}...`
                : about.bio}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {about.currentRole && (
                <div className="p-4 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/50 transition-all">
                  <div className="text-xs font-semibold text-[#C77DFF] uppercase tracking-wider mb-1">Current Role</div>
                  <div className="font-medium text-white">{about.currentRole}</div>
                </div>
              )}
              {about.researchInterest && (
                <div className="p-4 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/50 transition-all">
                  <div className="text-xs font-semibold text-[#C77DFF] uppercase tracking-wider mb-1">Research Interest</div>
                  <div className="font-medium text-white">{about.researchInterest}</div>
                </div>
              )}
            </div>

            {education.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-lg shadow-[#C77DFF]/20">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-white">Education</div>
                </div>
                <div className="text-[#C9D1D9]">
                  {education[0].degree}{education[0].field ? ` in ${education[0].field}` : ''}
                </div>
                <div className="text-sm text-white/60">
                  {education[0].institution} • {education[0].endDate ? new Date(education[0].endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                </div>
              </div>
            )}

            {/* See More Link */}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/50 hover:-translate-y-1 transition-all duration-300 group"
            >
              <span>Learn More About Me</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TECH STACK SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {techStackCategories.length > 0 && (
        <section
          id="skills"
          ref={setSectionRef('skills')}
          className={sectionClass('skills')}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Tech Stack & <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Tools</span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">Technologies I work with to bring ideas to life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStackCategories.map((category, catIndex) => (
              <div
                key={category.id}
                className="group p-6 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-white mb-6 pb-4 border-b border-white/10">
                  {category.categoryName}
                </h3>
                <div className="space-y-4">
                  {(category.tools ?? []).map((tool: { id: string; name: string; logoUrl: string; proficiencyLevel: number }) => (
                    <div key={tool.id} className="flex items-center gap-4 group/item">
                      <TechToolIcon tool={tool} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#C9D1D9]">{tool.name}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#0B1320]/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] transition-all duration-1000 ease-out progress-bar"
                            style={{ width: `${tool.proficiencyLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {/* {services.length > 0 && (
        <section
          id="services-section"
          ref={setSectionRef('services-section')}
          className={sectionClass('services-section')}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              My <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">What I can do for you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative p-8 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] overflow-hidden hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C77DFF]/20 to-[#9D4EDD]/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 flex items-center justify-center mb-6 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                    <Zap className="w-7 h-7 text-[#C77DFF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-[#C9D1D9] leading-relaxed">{service.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )} */}

      {/* ═══════════════════════════════════════════════════════════════════════════
          FEATURED PROJECTS SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {featuredProjects.length > 0 && (
        <section
          id="projects-section"
          ref={setSectionRef('projects-section')}
          className={sectionClass('projects-section')}
        >
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Featured <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Projects</span>
              </h2>
              <p className="text-[#C9D1D9]">Some of my best work</p>
            </div>
            <Link href="/portfolio" className="hidden sm:flex items-center gap-2 text-[#C77DFF] font-medium hover:gap-3 transition-all">
              View All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects
              .slice(0, 4)
              .map((project) => (
                <article
                  key={project.id}
                  className="group rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] overflow-hidden hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
                >
                  {project.coverImageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={project.coverImageUrl}
                        alt={project.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-[#0B1320] text-sm font-medium hover:bg-white transition-colors"
                          >
                            <Github className="w-4 h-4" /> Code
                          </a>
                        )}
                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C77DFF] text-white text-sm font-medium hover:bg-[#9D4EDD] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#C77DFF] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#C9D1D9] line-clamp-2">{project.summary}</p>
                  </div>
                </article>
              ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/portfolio" className="btn-secondary inline-flex items-center gap-2">
              View All Projects <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          BLOG SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {blogs.length > 0 && (
        <section
          id="blog-section"
          ref={setSectionRef('blog-section')}
          className={sectionClass('blog-section')}
        >
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Latest <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Blog Posts</span>
              </h2>
              <p className="text-[#C9D1D9]">Thoughts, tutorials, and insights</p>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-[#C77DFF] font-medium hover:gap-3 transition-all">
              Read More <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="group p-6 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 flex items-center justify-center mb-5 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                  <Quote className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#C77DFF] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#C9D1D9] text-sm line-clamp-3">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 mt-4 text-[#C77DFF] text-sm font-medium group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {/* {testimonials.length > 0 && (
        <section
          id="testimonials-section"
          ref={setSectionRef('testimonials-section')}
          className={sectionClass('testimonials-section')}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Client <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">What people say about working with me</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="relative p-8 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-[#C77DFF]/20" />
                <p className="text-lg text-[#C9D1D9] italic leading-relaxed mb-6">"{item.quote}"</p>
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center text-white font-semibold">
                    {item.author?.charAt(0) ?? 'A'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.author}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )} */}

      {/* ═══════════════════════════════════════════════════════════════════════════
          CLIENTS SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      {clients.length > 0 && (
        <section
          id="clients-section"
          ref={setSectionRef('clients-section')}
          className={sectionClass('clients-section')}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Trusted <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">Clients</span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">Companies I've had the pleasure to work with</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, index) => {
              const initials = (client.name ?? '')
                .split(' ')
                .map((word: string) => word[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              const content = (
                <div
                  className={`group relative p-6 rounded-2xl bg-[#0B1320]/80 backdrop-blur-sm border shadow-lg hover:shadow-xl hover:shadow-[#C77DFF]/[0.15] transition-all duration-500 ease-out flex flex-col items-center justify-center h-48 hover:-translate-y-2 overflow-hidden ${client.featured
                    ? 'border-[#C77DFF]/30 shadow-[#C77DFF]/[0.1]'
                    : 'border-white/[0.06] shadow-[#C77DFF]/[0.05] hover:border-[#C77DFF]/30'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Featured Badge */}
                  {client.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#C77DFF]/20 border border-[#C77DFF]/30">
                      <span className="text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider">Featured</span>
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/0 to-[#9D4EDD]/0 group-hover:from-[#C77DFF]/5 group-hover:to-[#9D4EDD]/10 transition-all duration-500" />

                  {/* Logo or Initials */}
                  {client.logoUrl ? (
                    <img
                      className="max-h-14 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                      src={client.logoUrl}
                      alt={`${client.name} logo`}
                    />
                  ) : (
                    <div className="relative">
                      {/* Animated ring effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C77DFF]/20 to-[#9D4EDD]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C77DFF]/10 to-[#9D4EDD]/5 border border-[#C77DFF]/20 flex items-center justify-center group-hover:border-[#C77DFF]/50 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-[#C77DFF]/10 group-hover:shadow-[#C77DFF]/30">
                        <span className="text-2xl font-bold bg-gradient-to-br from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent drop-shadow-sm">
                          {initials}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Company Name */}
                  <div className="mt-4 text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300 text-center tracking-wide">
                    {client.name}
                  </div>

                  {/* Industry Badge */}
                  {client.industry && (
                    <div className="mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#C77DFF]/10 to-[#9D4EDD]/10 border border-[#C77DFF]/20 group-hover:border-[#C77DFF]/40 transition-all duration-300">
                      <span className="text-xs font-medium text-[#C77DFF]/80 group-hover:text-[#C77DFF] transition-colors">{client.industry}</span>
                    </div>
                  )}

                  {/* Project Duration */}
                  {client.projectDuration && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-[#C77DFF]/50" />
                      <span>{client.projectDuration}</span>
                    </div>
                  )}

                  {/* External Link Indicator */}
                  {client.websiteUrl && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-4 h-4 text-[#C77DFF]" />
                    </div>
                  )}
                </div>
              );

              if (client.websiteUrl) {
                return (
                  <a key={client.id} href={client.websiteUrl} target="_blank" rel="noreferrer" className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    {content}
                  </a>
                );
              }

              return <div key={client.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>{content}</div>;
            })}
          </div>
        </section>
      )}

      <CertificateModal
        isOpen={!!selectedCertificate}
        imageUrl={selectedCertificate?.imageUrl}
        title={selectedCertificate?.title}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
    </>
  );
}
