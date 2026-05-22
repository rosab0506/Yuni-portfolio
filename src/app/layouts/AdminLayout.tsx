import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  MessageSquare,
  PenLine,
  SquareStack,
  Users,
  FileText,
  Mail,
  ChevronDown,
  LogOut,
  Search,
  Menu,
  X,
  Bell,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCms } from '../../hooks/useCms';

export function AdminLayout() {
  const { role, signOut } = useAuth();
  const { data } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const baseLink =
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200';
  const inactiveLink = 'text-white/60 hover:text-white hover:bg-white/5';
  const activeLink = 'text-white bg-gradient-to-r from-[#C77DFF]/20 to-[#9D4EDD]/20 border border-[#C77DFF]/30';
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';
  const mainOffset = isCollapsed ? 'lg:ml-20' : 'lg:ml-72';

  const collectionRoutes: Record<string, string> = {
    projects: '/mhe-control-center/cms/projects',
    blogs: '/mhe-control-center/cms/blogs',
    publications: '/mhe-control-center/cms/publications',
    achievements: '/mhe-control-center/cms/achievements',
    services: '/mhe-control-center/cms/services',
    education: '/mhe-control-center/cms/education',
    testimonials: '/mhe-control-center/cms/testimonials',
    clients: '/mhe-control-center/cms/clients',
    techStackCategories: '/mhe-control-center/cms/skills',
    contactMessages: '/mhe-control-center/messages',
    resumes: '/mhe-control-center/cms/resume',
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [] as Array<{ id: string; label: string; collection: string; href: string }>;

    const getLabel = (item: Record<string, unknown>) =>
      String(
        item.title ??
          item.name ??
          item.subject ??
          item.slug ??
          item.company ??
          item.role ??
          item.institution ??
          item.categoryName ??
          item.certificateTitle ??
          item.issuer ??
          item.id
      );

    const results: Array<{ id: string; label: string; collection: string; href: string }> = [];
    Object.entries(data.collections).forEach(([collectionKey, items]) => {
      const route = collectionRoutes[collectionKey];
      if (!route) return;
      items.forEach((item) => {
        const itemRecord = item as Record<string, unknown>;
        const haystack = JSON.stringify(itemRecord).toLowerCase();
        if (!haystack.includes(query)) return;
        results.push({
          id: String(itemRecord.id ?? `${collectionKey}-${results.length}`),
          label: getLabel(itemRecord),
          collection: collectionKey,
          href: route,
        });
      });
    });

    return results.slice(0, 8);
  }, [data.collections, searchQuery]);

  const navSections = [
    {
      title: 'Content',
      items: [
        { to: '/mhe-control-center/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/mhe-control-center/cms/hero', icon: Home, label: 'Hero' },
        { to: '/mhe-control-center/cms/about', icon: Users, label: 'About' },
        { to: '/mhe-control-center/cms/contact', icon: Mail, label: 'Contact' },
      ],
    },
    {
      title: 'Profile',
      items: [
        { to: '/mhe-control-center/cms/education', icon: GraduationCap, label: 'Education' },
        { to: '/mhe-control-center/cms/core-skills', icon: Layers, label: 'Core Skills' },
        { to: '/mhe-control-center/cms/experience', icon: Briefcase, label: 'Experience' },
        { to: '/mhe-control-center/cms/certifications', icon: BadgeCheck, label: 'Certifications' },
        { to: '/mhe-control-center/cms/skills', icon: Sparkles, label: 'Tech Stack' },
      ],
    },
    {
      title: 'Portfolio',
      items: [
        { to: '/mhe-control-center/portfolio', icon: FolderKanban, label: 'Overview' },
        { to: '/mhe-control-center/cms/projects', icon: SquareStack, label: 'Projects' },
        { to: '/mhe-control-center/cms/publications', icon: BookOpen, label: 'Publications' },
        { to: '/mhe-control-center/cms/achievements', icon: BadgeCheck, label: 'Achievements' },
      ],
    },
    {
      title: 'Engagement',
      items: [
        { to: '/mhe-control-center/cms/services', icon: PenLine, label: 'Services' },
        { to: '/mhe-control-center/cms/blogs', icon: FileText, label: 'Blogs' },
        { to: '/mhe-control-center/cms/testimonials', icon: MessageSquare, label: 'Testimonials' },
        { to: '/mhe-control-center/cms/clients', icon: Users, label: 'Clients' },
      ],
    },
    {
      title: 'System',
      items: [
        { to: '/mhe-control-center/cms/resume', icon: FileText, label: 'Resume' },
        { to: '/mhe-control-center/messages', icon: MessageSquare, label: 'Messages' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1320]">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Premium Ink Purple Theme */}
      <aside className={`
        fixed left-0 top-0 z-50 h-full ${sidebarWidth} 
        bg-gradient-to-b from-[#0B1320] via-[#0B1320] to-[#0B1320]/80
        border-r border-white/10 transition-all duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] shadow-lg shadow-[#C77DFF]/30">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Admin Panel</div>
              <div className="text-xs text-[#C77DFF]">Portfolio CMS</div>
            </div>
          </div>
          <button
            type="button"
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B1320]/60 border border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-[#C77DFF]/50 transition-all"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/60 hover:bg-[#C77DFF]/20 hover:text-white transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-5rem)] overflow-y-auto px-3 py-6 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <div className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">
                  {section.title}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink 
                      to={item.to} 
                      className={({ isActive }) => `
                        ${baseLink} 
                        ${isActive ? activeLink : inactiveLink}
                        ${isCollapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'group-hover:scale-110'} transition-transform`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`${mainOffset} transition-all duration-300`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0B1320]/90 backdrop-blur-xl px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#C9D1D9] hover:bg-white/5 hover:text-white transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                className="w-64 md:w-80 rounded-xl border border-white/10 bg-[#0B1320]/60 py-2.5 pl-11 pr-4 text-sm text-white placeholder-white/60 focus:border-[#C77DFF] focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-[#C77DFF]/20 transition-all"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
              />
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-white/10 bg-[#0B1320]/95 shadow-xl shadow-black/30 overflow-hidden backdrop-blur-xl">
                  <ul className="max-h-72 overflow-auto py-2">
                    {searchResults.map((result) => (
                      <li key={`${result.collection}-${result.id}`}>
                        <NavLink
                          to={result.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-white">{result.label}</div>
                            <div className="text-xs text-[#C77DFF] uppercase">{result.collection}</div>
                          </div>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 px-3 py-2 hover:bg-white/5 transition-colors"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {data.singletons.about?.profileImageUrl ? (
                  <img
                    src={data.singletons.about.profileImageUrl}
                    alt="Admin avatar"
                    className="h-8 w-8 rounded-lg border-2 border-[#C77DFF]/30 object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] text-sm font-bold text-[#0B1320]">
                    {(data.singletons.about?.fullName ?? 'A').charAt(0)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">
                    {data.singletons.about?.fullName ?? 'Admin'}
                  </div>
                  <div className="text-xs text-white/60">{role ?? 'guest'}</div>
                </div>
                <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0B1320]/95 shadow-xl shadow-black/30 overflow-hidden animate-scale-in backdrop-blur-xl">
                  <div className="p-4 border-b border-white/10">
                    <div className="text-sm font-medium text-white">
                      {data.singletons.about?.fullName ?? 'Admin User'}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {role === 'admin' ? 'Administrator' : 'Guest User'}
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#C9D1D9] hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => {
                        navigate('/');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Home className="h-4 w-4" /> 
                      <span>View Site</span>
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#C77DFF] hover:bg-[#C77DFF]/10 transition-colors"
                      onClick={async () => {
                        await signOut();
                        navigate('/mhe-control-center/login');
                      }}
                    >
                      <LogOut className="h-4 w-4" /> 
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8 bg-[#0B1320] min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}