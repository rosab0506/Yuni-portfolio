'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Clock, Tag, User } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { JsonLd } from '../../components/common/JsonLd';

export function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { data } = useCms();

  const post = (data.collections.blogs ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .find((item) => item.slug === slug);

  useDocumentHead({
    title: post?.title ?? 'Blog Post',
    description: post?.excerpt ?? 'Read this article on mahedihasanemon.site.',
    path: `/blog/${slug}`,
    image: post?.coverImageUrl,
    type: 'article',
  });

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#0B1320]/60 mb-6 animate-bounce-subtle">
            <BookOpen className="w-10 h-10 text-white/60" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Blog post not found</h1>
          <p className="text-[#C9D1D9] mb-6">We couldn't find the post you're looking for.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 btn-animated group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto pb-16">
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-[#C9D1D9] hover:text-[#C77DFF] hover:-translate-x-1 transition-all duration-300 mb-8 animate-fade-in group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:animate-wiggle" />
        Back to Blog
      </Link>

      <header className="relative mb-12 animate-slide-up">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
        </div>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string, index: number) => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C77DFF]/20 text-[#C77DFF] text-sm font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight hover:text-[#C77DFF] transition-colors">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-white/60 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {post.author && (
            <span className="inline-flex items-center gap-2 hover:text-[#C77DFF] transition-colors group">
              <User className="w-5 h-5 group-hover:animate-bounce-subtle" />
              {post.author}
            </span>
          )}
          {post.publishedDate && (
            <span className="inline-flex items-center gap-2 hover:text-[#C77DFF] transition-colors group">
              <Calendar className="w-5 h-5 group-hover:animate-wiggle" />
              {post.publishedDate}
            </span>
          )}
          {post.readTime && (
            <span className="inline-flex items-center gap-2 hover:text-[#C77DFF] transition-colors group">
              <Clock className="w-5 h-5 group-hover:animate-spin-slow" />
              {post.readTime} min read
            </span>
          )}
        </div>
      </header>

      {post.coverImageUrl && (
        <div className="relative group mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute -inset-2 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
          <div className="relative overflow-hidden rounded-2xl img-hover-shine">
            <img 
              className="relative w-full rounded-2xl shadow-xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-700" 
              src={post.coverImageUrl} 
              alt={post.title} 
            />
          </div>
        </div>
      )}

      <div className="prose prose-lg prose-invert max-w-none animate-fade-in" style={{ animationDelay: '400ms' }}>
        {post.excerpt && (
          <p className="text-xl text-[#C9D1D9] leading-relaxed border-l-4 border-[#C77DFF] pl-6 mb-8 hover:border-[#9D4EDD] hover:bg-[#C77DFF]/5 transition-all duration-300 rounded-r-lg">
            {post.excerpt}
          </p>
        )}
        
        {post.content && (
          <div className="bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
            {/* 
              HTML content is sanitized using sanitizeHtml utility.
              TODO [SUPABASE]: Install DOMPurify for production-grade sanitization:
              npm install dompurify && npm install -D @types/dompurify
            */}
            <div className="text-[#C9D1D9]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
          </div>
        )}
      </div>
    </article>
  );
}
