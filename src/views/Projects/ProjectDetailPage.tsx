'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, FolderGit2, Sparkles, Code2 } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { data } = useCms();

  const project = (data.collections.projects ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .find((item) => item.slug === slug);

  useDocumentHead({
    title: project?.title ?? 'Project',
    description: project?.summary ?? project?.description ?? 'Explore this project by Yuna Shimizu.',
    path: `/projects/${slug}`,
    image: project?.coverImageUrl,
  });

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#0B1320]/60 mb-6 animate-bounce-subtle">
            <FolderGit2 className="w-10 h-10 text-white/60" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Project not found</h1>
          <p className="text-[#C9D1D9] mb-6">We couldn't find the project you're looking for.</p>
          <Link 
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 btn-animated group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-12 pb-16">
      <Link 
        href="/portfolio"
        className="inline-flex items-center gap-2 text-[#C9D1D9] hover:text-[#C77DFF] hover:-translate-x-1 transition-all duration-300 group animate-fade-in"
      >
        <ArrowLeft className="w-5 h-5 group-hover:animate-wiggle" />
        Back to Portfolio
      </Link>

      <header className="relative animate-slide-up">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
          <span className="text-sm font-medium text-[#C77DFF]">Project Details</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white hover:text-[#C77DFF] transition-colors">{project.title}</h1>
        
        {project.summary && (
          <p className="text-xl text-[#C9D1D9] max-w-3xl animate-fade-in" style={{ animationDelay: '100ms' }}>{project.summary}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1320]/60 text-white font-semibold rounded-xl hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#C77DFF]/20 transition-all duration-300 group"
            >
              <Github className="w-5 h-5 group-hover:animate-bounce-subtle" />
              View on GitHub
            </a>
          )}
          {project.liveDemoUrl && (
            <a 
              href={project.liveDemoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 hover:scale-105 transition-all duration-300 btn-animated group"
            >
              <ExternalLink className="w-5 h-5 group-hover:animate-wiggle" />
              Live Demo
            </a>
          )}
        </div>
      </header>

      {project.coverImageUrl && (
        <div className="relative group animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute -inset-2 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
          <div className="relative overflow-hidden rounded-2xl img-hover-shine">
            <img 
              className="relative w-full rounded-2xl shadow-xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700" 
              src={project.coverImageUrl} 
              alt={project.title} 
            />
          </div>
        </div>
      )}

      {project.description && (
        <section className="bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out card-animated animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold text-white mb-4 hover:text-[#C77DFF] transition-colors">About This Project</h2>
          <p className="text-[#C9D1D9] leading-relaxed text-lg">{project.description}</p>
        </section>
      )}

      {Array.isArray(project.techStack) && project.techStack.length > 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
              <Code2 className="w-5 h-5 text-[#C77DFF]" />
            </div>
            <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech: string, index: number) => (
              <span 
                key={tech} 
                className="px-4 py-2 rounded-xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] text-[#C9D1D9] font-medium shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-600 ease-out cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(project.galleryImages) && project.galleryImages.length > 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl font-bold text-white mb-6 hover:text-[#C77DFF] transition-colors">Gallery</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {project.galleryImages.map((src: string, index: number) => (
              <div key={src} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
                <div className="relative overflow-hidden rounded-xl img-hover-shine">
                  <img 
                    className="relative w-full rounded-xl shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] group-hover:shadow-xl group-hover:shadow-[#C77DFF]/[0.12] transition-all duration-600 ease-out" 
                    src={src} 
                    alt={`${project.title} screenshot ${index + 1}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
