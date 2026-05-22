import { BookOpen, Sparkles, FileText, ExternalLink, Users } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export function PublicationsPage() {
  const { data } = useCms();
  const publications = (data.collections.publications ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  useDocumentHead({
    title: 'Publications — Yuna Shimizu',
    description: 'Research publications, papers, and academic work by Yuna Shimizu in software engineering and web development.',
    path: '/publications',
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <BookOpen className="w-4 h-4 text-[#C77DFF] animate-bounce-subtle" />
          <span className="text-sm font-medium text-[#C77DFF]">Research & Papers</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          My <span className="gradient-text text-shimmer hover:animate-wiggle inline-block">Publications</span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          A collection of my research papers, articles, and academic contributions.
        </p>
      </section>

      {/* Publications List */}
      {publications.length > 0 && (
        <section className="space-y-6">
          {publications.map((pub, index) => (
            <article key={pub.id} className="group relative animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
              
              <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Publication Number */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 flex-shrink-0 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                    <span className="text-xl font-bold text-[#C77DFF]">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-white group-hover:text-[#C77DFF] transition-colors">
                      {pub.title}
                    </h2>
                    
                    {/* Authors */}
                    {Array.isArray(pub.authors) && pub.authors.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-[#C9D1D9]">
                        <Users className="w-4 h-4 text-white/60 group-hover:animate-wiggle" />
                        <span>{pub.authors.join(', ')}</span>
                      </div>
                    )}
                    
                    {/* Publisher & Date */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {pub.publisher && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C77DFF]/20 text-[#C77DFF] font-medium group-hover:bg-[#C77DFF]/30 transition-colors">
                          <Sparkles className="w-3 h-3 group-hover:animate-spin-slow" />
                          {pub.publisher}
                        </span>
                      )}
                      {pub.publishedDate && (
                        <span className="text-white/60">{pub.publishedDate}</span>
                      )}
                    </div>
                    
                    {/* DOI */}
                    {pub.doi && (
                      <p className="text-sm text-white/60">
                        <span className="font-medium">DOI:</span> {pub.doi}
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3">
                      {pub.pdfUrl && (
                        <a 
                          href={pub.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] text-sm font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <FileText className="w-4 h-4 group-hover/link:animate-bounce-subtle" />
                          View PDF
                        </a>
                      )}
                      {pub.externalUrl && (
                        <a 
                          href={pub.externalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1320]/50 text-[#C9D1D9] text-sm font-medium hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/link:animate-wiggle" />
                          View Source
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
    </div>
  );
}
