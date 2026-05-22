'use client';
import { Mail, MapPin, ArrowUpRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCms } from '../../hooks/useCms';
import { detectSocialPlatform, formatPlatformLabel } from '../../utils/detectSocialPlatform';
import { iconMap } from '../../utils/iconMap';
import { useCallback } from 'react';

export function Footer() {
  const { data } = useCms();
  const navigate = useRouter();
  const location = usePathname();
  const about = data.singletons.about ?? {};
  const contact = data.singletons.contact ?? {};
  const contactInfo = contact.contactInfo ?? {};
  const socialLinks = Array.isArray(contact.socialLinks) ? contact.socialLinks : [];
  const quickLinks = [
    { label: 'Home', href: '/', isAnchor: false },
    { label: 'About', href: '/about', isAnchor: false },
    { label: 'Skills', href: '/#skills', isAnchor: true },
    { label: 'Portfolio', href: '/portfolio', isAnchor: false },
    { label: 'Contact', href: '/contact', isAnchor: false },
  ];
  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms', href: '#' },
  ];
  const year = new Date().getFullYear();

  // Handle Skills/anchor link click - works from any page
  const handleAnchorClick = useCallback((e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    const elementId = hash.replace('/#', '');
    
    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    if (location === '/') {
      scrollToElement();
    } else {
      navigate.push(`/${hash.replace('/', '')}`);
      // The PublicLayout will handle scrolling after navigation
    }
  }, [location, navigate]);

  return (
    <footer className="relative w-full bg-[#0B1320] text-white overflow-hidden">
      {/* Background Gradient Overlays - Cinematic Dark Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C77DFF] rounded-full opacity-[0.08] blur-[100px] animate-nebula-1" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#9D4EDD] rounded-full opacity-[0.06] blur-[120px] animate-nebula-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C77DFF] rounded-full opacity-[0.03] blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20 pb-8 sm:pb-10">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 sm:mb-16">
          {/* Brand Section */}
          <section className="lg:col-span-1 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 group">
              {about.profileImageUrl ? (
                <img
                  src={String(about.profileImageUrl)}
                  alt={String(about.fullName ?? 'Profile')}
                  className="h-14 w-14 rounded-2xl border-2 border-white/10 object-cover group-hover:scale-105 group-hover:border-[#C77DFF]/50 transition-all duration-300"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center text-xl font-bold group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#C77DFF]/20">
                  {(about.fullName ?? 'P').charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-[#C77DFF] transition-colors">{about.fullName ?? 'Portfolio'}</h2>
                {about.tagline && <p className="text-sm text-white/60">{about.tagline}</p>}
              </div>
            </div>
            {about.bio && (
              <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{about.bio}</p>
            )}
            
            {/* Social Links */}
            {/* <div className="flex gap-3">
              {socialLinks.slice(0, 5).map((link, index) => {
                const derived = detectSocialPlatform(String(link.url ?? ''));
                const iconKey = (link.iconKey ?? derived.iconKey) as keyof typeof iconMap;
                const Icon = iconMap[iconKey] ?? iconMap.custom;
                return (
                  <a 
                    key={`${link.url}`} 
                    className="w-10 h-10 rounded-xl bg-[#0B1320]/60 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#C77DFF] hover:border-[#C77DFF] hover:text-white hover:-translate-y-1 transition-all duration-300 group/social" 
                    href={String(link.url)} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div> */}
          </section>

          {/* Quick Links */}
          <nav className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }} aria-label="Footer navigation">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C77DFF]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.label} style={{ animationDelay: `${index * 50}ms` }}>
                  {link.isAnchor ? (
                    <button
                      type="button"
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="group inline-flex items-center gap-2 text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C77DFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </button>
                  ) : (
                    <Link 
                      className="group inline-flex items-center gap-2 text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300" 
                      href={link.href}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C77DFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C77DFF]">Contact</h3>
            <div className="space-y-4">
              {contactInfo.email && (
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-white/60 hover:text-white hover:translate-x-1 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1320]/60 border border-white/10 flex items-center justify-center group-hover:bg-[#C77DFF] group-hover:border-[#C77DFF] group-hover:scale-110 transition-all duration-300">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm">{contactInfo.email}</span>
                </a>
              )}
              {contactInfo.location && (
                <div className="flex items-center gap-3 text-white/60 group">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1320]/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm">{contactInfo.location}</span>
                </div>
              )}
            </div>
          </address>

          {/* CTA Section */}
          <section className="space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C77DFF]">Let's Work Together</h3>
            <p className="text-sm text-white/60">
              Have a project in mind? Let's create something amazing together.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              Get in Touch
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-white/60">
              <span>© {year} {about.fullName ?? 'Portfolio'}. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-white/60">
              {legalLinks.map((link) => (
                <a 
                  key={link.label} 
                  className="hover:text-white hover:-translate-y-0.5 transition-all duration-300" 
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
