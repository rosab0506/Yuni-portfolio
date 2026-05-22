'use client';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center max-w-lg animate-fade-in">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold leading-none bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B1320]/80 border border-white/10 shadow-xl shadow-[#C77DFF]/20 animate-bounce-subtle">
              <Search className="w-12 h-12 text-[#C77DFF]" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6">
          <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
          <span className="text-sm font-medium text-[#C77DFF]">Page Not Found</span>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Oops! Lost in Space
        </h2>
        <p className="text-[#C9D1D9] mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 group"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce-subtle" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1320]/60 text-white font-semibold rounded-xl border border-white/10 hover:border-[#C77DFF]/50 hover:-translate-y-1 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm mb-4">Perhaps you were looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: '/about', label: 'About' },
              { to: '/portfolio', label: 'Portfolio' },
              { to: '/blog', label: 'Blog' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="px-4 py-2 rounded-lg bg-[#0B1320]/40 text-[#C9D1D9] text-sm hover:bg-[#C77DFF]/20 hover:text-[#C77DFF] transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
