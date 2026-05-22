'use client';
import { Sparkles, BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useCms } from '../../hooks/useCms';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export function BlogListPage() {
  const { data } = useCms();
  const blogs = (data.collections.blogs ?? [])
    .filter((item) => item.status === 'published')
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  // Featured post is the first one
  const featuredPost = blogs[0];
  const otherPosts = blogs.slice(1);

  useDocumentHead({
    title: 'Blog — Yuna Shimizu',
    description: 'Articles, tutorials, and insights on web development, React, Node.js, and software engineering by Yuna Shimizu.',
    path: '/blog',
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <BookOpen className="w-4 h-4 text-[#C77DFF] animate-bounce-subtle" />
          <span className="text-sm font-medium text-[#C77DFF]">My Blog</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white leading-tight overflow-visible">
          Thoughts & <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent text-shimmer hover:animate-wiggle inline-block pb-1">Insights</span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          Exploring ideas, sharing knowledge, and documenting my journey through code and creativity.
        </p>
      </section>

      {/* Empty State - No blogs published yet */}
      {blogs.length === 0 && (
        <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06]" />

            <div className="relative flex flex-col items-center justify-center py-20 px-8 bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl border border-white/[0.06] text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#C77DFF]/20 rounded-full blur-xl animate-pulse-glow" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0B1320]/80 border border-white/10">
                  <BookOpen className="w-12 h-12 text-[#C77DFF] animate-bounce-subtle" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                No Blog Posts Yet
              </h2>
              <p className="text-[#C9D1D9] max-w-md mb-6 leading-relaxed">
                I'm currently working on some exciting content. Check back soon for articles on technology, development insights, and creative explorations.
              </p>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/20">
                <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
                <span className="text-sm text-[#C77DFF] font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-semibold mb-6 animate-slide-in-left hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 animate-spin-slow" />
            Featured Article
          </div>

          <article className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

            <div className="relative grid lg:grid-cols-2 gap-8 bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
              {/* Cover Image */}
              {featuredPost.coverImageUrl ? (
                <div className="relative h-64 lg:h-auto overflow-hidden img-hover-shine">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={featuredPost.coverImageUrl}
                    alt={featuredPost.title}
                  />
                </div>
              ) : (
                <div className="h-64 lg:h-auto bg-[#0B1320]/50 flex items-center justify-center animate-bg-pan">
                  <BookOpen className="w-20 h-20 text-[#C77DFF] animate-bounce-subtle" />
                </div>
              )}

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                {Array.isArray(featuredPost.tags) && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#C77DFF] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-[#C9D1D9] leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-white/60 mb-6">
                  {featuredPost.publishedDate && (
                    <span className="inline-flex items-center gap-1 hover:text-[#C77DFF] transition-colors">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.publishedDate}
                    </span>
                  )}
                  {featuredPost.readTime && (
                    <span className="inline-flex items-center gap-1 hover:text-[#C77DFF] transition-colors">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} min read
                    </span>
                  )}
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-[#C77DFF] font-semibold hover:gap-4 transition-all duration-300 btn-animated w-fit group/link"
                >
                  Read Article
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Other Posts Grid */}
      {otherPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 hover:text-[#C77DFF] transition-colors">More Articles</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post, index) => (
              <article
                key={post.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

                <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out card-animated">
                  {/* Cover Image */}
                  {post.coverImageUrl ? (
                    <div className="relative h-44 overflow-hidden img-hover-shine">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={post.coverImageUrl}
                        alt={post.title}
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-[#0B1320]/50 flex items-center justify-center animate-bg-pan">
                      <BookOpen className="w-12 h-12 text-[#C77DFF] animate-bounce-subtle" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-[#0B1320]/50 text-[#C9D1D9] text-xs hover:bg-[#C77DFF]/20 hover:text-[#C77DFF] transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#C9D1D9] line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      {post.publishedDate && (
                        <span className="text-xs text-white/60 hover:text-[#C77DFF] transition-colors">
                          {post.publishedDate}
                        </span>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#C77DFF] hover:gap-3 transition-all duration-300 group/link"
                      >
                        Read
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
