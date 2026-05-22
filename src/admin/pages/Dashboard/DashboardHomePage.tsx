'use client';
import Link from 'next/link';
import { 
  FolderKanban, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  BarChart3,
  Users,
  Eye
} from 'lucide-react';
import { useCms } from '../../../hooks/useCms';

export function DashboardHomePage() {
  const { data } = useCms();

  const projectsCount = data.collections.projects?.length ?? 0;
  const blogsCount = data.collections.blogs?.length ?? 0;
  const skillsCount = data.collections.techStackCategories?.length ?? 0;
  const messagesCount = data.collections.contactMessages?.length ?? 0;

  const statusCounts = Object.values(data.collections).reduce(
    (acc, items) => {
      items.forEach((item) => {
        const status = (item as Record<string, unknown>).status;
        if (status === 'draft') acc.draft += 1;
        if (status === 'published') acc.published += 1;
      });
      return acc;
    },
    { draft: 0, published: 0 }
  );

  const recentActivity = Object.entries(data.collections)
    .flatMap(([collection, items]) =>
      items.map((item) => {
        const record = item as Record<string, unknown>;
        const label = String(
          record.title ??
            record.name ??
            record.subject ??
            record.slug ??
            record.company ??
            record.role ??
            record.institution ??
            record.categoryName ??
            record.certificateTitle ??
            record.issuer ??
            record.id
        );
        const timestamp = new Date(String(record.updatedAt ?? record.createdAt ?? 0)).getTime() || 0;
        return { id: String(record.id ?? label), label, collection, timestamp };
      })
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  const statCards = [
    { 
      label: 'Projects', 
      value: projectsCount, 
      icon: FolderKanban, 
      gradient: 'from-[#C77DFF] to-[#9D4EDD]',
      bgGradient: 'from-[#C77DFF]/10 to-[#9D4EDD]/10',
      href: '/mhe-control-center/cms/projects'
    },
    { 
      label: 'Blog Posts', 
      value: blogsCount, 
      icon: FileText, 
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
      href: '/mhe-control-center/cms/blogs'
    },
    { 
      label: 'Tech Stack', 
      value: skillsCount, 
      icon: Sparkles, 
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      href: '/mhe-control-center/cms/skills'
    },
    { 
      label: 'Messages', 
      value: messagesCount, 
      icon: MessageSquare, 
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      href: '/mhe-control-center/messages'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-white/60">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <Link 
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white font-medium hover:shadow-lg hover:shadow-[#C77DFF]/30 transition-all"
        >
          <Eye className="w-4 h-4" />
          View Site
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link 
            key={card.label} 
            href={card.href}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgGradient} p-6 border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#C9D1D9]">{card.label}</p>
                <p className="mt-2 text-4xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-white/60">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>View all</span>
            </div>
            {/* Decorative */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
          </Link>
        ))}
      </div>

      {/* Status & Quick Actions Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Published */}
        <div className="rounded-2xl bg-[#0B1320]/50 border border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-white/60">Published</p>
              <p className="text-2xl font-bold text-white">{statusCounts.published}</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(statusCounts.published / (statusCounts.published + statusCounts.draft || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Draft */}
        <div className="rounded-2xl bg-[#0B1320]/50 border border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-white/60">Drafts</p>
              <p className="text-2xl font-bold text-white">{statusCounts.draft}</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${(statusCounts.draft / (statusCounts.published + statusCounts.draft || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0B1320] to-[#0B1320]/80 p-6 text-white border border-white/10">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link 
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors" 
              href="/mhe-control-center/cms/projects"
            >
              <Plus className="w-4 h-4" /> New Project
            </Link>
            <Link 
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-colors" 
              href="/mhe-control-center/cms/blogs"
            >
              <Plus className="w-4 h-4" /> New Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Activity & Collections Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#0B1320]/50 border border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <BarChart3 className="w-5 h-5 text-white/60" />
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <Clock className="w-10 h-10 mx-auto mb-3 text-white/20" />
                <p>No recent edits yet</p>
              </div>
            )}
            {recentActivity.map((activity, index) => (
              <div 
                key={`${activity.collection}-${activity.id}`} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C77DFF]/20 to-[#9D4EDD]/20">
                  <FileText className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{activity.label}</p>
                  <p className="text-xs text-white/60 capitalize">{activity.collection.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
                <div className="text-xs text-white/60 whitespace-nowrap">
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collections Overview */}
        <div className="rounded-2xl bg-[#0B1320]/50 border border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Collections Overview</h2>
            <Users className="w-5 h-5 text-white/60" />
          </div>
          <div className="space-y-3">
            {Object.entries(data.collections).slice(0, 8).map(([key, items], index) => (
              <div 
                key={key} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 40) % 360}, 70%, 50%)` 
                    }}
                  />
                  <span className="text-sm font-medium text-[#C9D1D9] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">
                  {items.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
