'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowUp } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { Footer } from '../../components/common/Footer';
import { AuroraMesh } from '../../components/common/AuroraMesh';
import { useTrackVisit } from '../../hooks/useTrackVisit';

export function PublicLayoutNext({ children }: { children: React.ReactNode }) {
  useTrackVisit();
  const { data } = useCms();
  const pathname = usePathname();
  const router = useRouter();
  const siteName = data.singletons.about?.fullName ?? data.singletons.hero?.fullName ?? 'Portfolio';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const elementId = hash.replace('/#', '');
    if (pathname === '/') {
      scrollToElement(elementId);
    } else {
      // Navigate to home, then scroll after page loads
      router.push('/');
      setTimeout(() => scrollToElement(elementId), 500);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/#skills', label: 'Skills', isAnchor: true },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to: string) => pathname === to;

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0B1320' }}>
      <AuroraMesh variant="dark" />

      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#0B1320]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex items-center min-w-0 sm:min-w-[280px]">
            <Link href="/" className="group flex items-center gap-3 text-xl font-bold tracking-tight">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#C77DFF] text-[#0B1320] shadow-lg shadow-[#C77DFF]/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg font-bold">{siteName.charAt(0)}</span>
              </div>
              <span className="sm:block text-white font-semibold overflow-hidden whitespace-nowrap inline-block max-w-0 animate-typewriter-fixed" style={{ verticalAlign: 'bottom' }}>
                {siteName}
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) =>
              link.isAnchor ? (
                <button
                  key={link.to}
                  type="button"
                  onClick={(e) => handleAnchorClick(e, link.to)}
                  className="relative px-4 py-2 text-sm font-medium text-[#C9D1D9] transition-all duration-300 hover:text-white group animate-fade-in rounded-lg hover:bg-white/[0.06]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActive(link.to)
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[#C9D1D9] hover:text-white hover:bg-white/[0.06]'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-transparent text-white transition-all duration-300 hover:border-[#C77DFF]/50 hover:bg-[#C77DFF]/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className={`relative mx-4 sm:mx-6 mt-4 flex flex-col rounded-2xl bg-[#0B1320]/95 backdrop-blur-xl border border-white/10 p-4 transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.to}
                  type="button"
                  onClick={(e) => handleAnchorClick(e, link.to)}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-[#C9D1D9] hover:text-white hover:bg-[#C77DFF]/[0.1] transition-all duration-300"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive(link.to) ? 'bg-[#C77DFF]/[0.15] text-white' : 'text-[#C9D1D9] hover:text-white hover:bg-[#C77DFF]/[0.1]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="relative w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20">
        <div key={pathname} className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12 xl:px-16">
          {children}
        </div>
      </main>

      <Footer />

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#C77DFF] text-[#0B1320] shadow-lg shadow-[#C77DFF]/30 transition-all duration-500 hover:scale-110 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
