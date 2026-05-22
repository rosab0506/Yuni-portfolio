import { FolderGit2, Globe, GithubIcon } from 'lucide-react';
import { useCms } from '../../hooks/useCms';

export function ProjectsPage() {
  const { data } = useCms();
  const projects = (data.collections.projects ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="pt-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
          Featured{' '}
          <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto">
          A showcase of my recent work, side projects, and experiments with cutting-edge technologies.
        </p>
      </section>

      {/* Grid */}
      {projects.length > 0 && (
        <section>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl border border-white/[0.12] bg-[#0c0c14] overflow-hidden"
              >
                {/* Logo / image — centered, padded, no separate bg */}
                <div className="flex items-center justify-center pt-10 pb-6 px-8">
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-48 h-48 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <FolderGit2 className="w-20 h-20 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 px-7 pb-8 gap-3">
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[15px] text-white/60 leading-relaxed">
                    {project.summary ?? project.description}
                  </p>

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

                  {/* Links */}
                  {(project.liveDemoUrl || project.githubUrl) && (
                    <div className="flex items-center gap-6 mt-2">
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[15px] text-white/50 hover:text-white transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                          Website
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[15px] text-white/50 hover:text-white transition-colors"
                        >
                          <GithubIcon className="w-5 h-5" />
                          Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
