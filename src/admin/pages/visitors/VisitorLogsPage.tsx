'use client';
import { useEffect, useState } from 'react';
import { Monitor, RefreshCw, Trash2 } from 'lucide-react';

type VisitorLog = {
  id: string;
  ip_address: string;
  user_agent: string | null;
  page: string | null;
  visited_at: string;
};

export function VisitorLogsPage() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/visitor-logs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch visitor logs');
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Delete this visitor log?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/visitor-logs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAll = async () => {
    if (!confirm(`Delete all ${logs.length} visitor logs? This cannot be undone.`)) return;
    setDeletingId('all');
    try {
      await Promise.all(logs.map(l => fetch(`/api/visitor-logs/${l.id}`, { method: 'DELETE' })));
      setLogs([]);
    } catch (err) {
      alert('Some logs could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const shortUA = (ua: string | null) => {
    if (!ua) return '—';
    if (ua.includes('Mobile')) return '📱 Mobile';
    if (ua.includes('Chrome')) return '🌐 Chrome';
    if (ua.includes('Firefox')) return '🦊 Firefox';
    if (ua.includes('Safari')) return '🧭 Safari';
    return ua.slice(0, 40) + '…';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Visitor Logs</h1>
          <p className="mt-1 text-sm text-[#C9D1D9]">IP addresses and pages visited by your site visitors.</p>
        </div>
        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              type="button"
              onClick={deleteAll}
              disabled={deletingId === 'all'}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={fetchLogs}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#C9D1D9] hover:bg-white/10 hover:text-white transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-[#0B1320]/80 p-12 text-center text-[#C9D1D9]">
          Loading…
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0B1320]/80 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8 text-[#C77DFF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Visits Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">Visitor logs will appear here once someone visits your site.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0B1320]/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-[#C77DFF]">
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Browser</th>
                  <th className="px-4 py-3">Visited At</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={log.id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 font-mono text-[#C9D1D9]">{log.ip_address}</td>
                    <td className="px-4 py-3 text-white">{log.page ?? '/'}</td>
                    <td className="px-4 py-3 text-[#C9D1D9]">{shortUA(log.user_agent)}</td>
                    <td className="px-4 py-3 text-[#C9D1D9] whitespace-nowrap">{formatDate(log.visited_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => deleteLog(log.id)}
                        disabled={deletingId === log.id}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                        aria-label="Delete log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/10 px-4 py-3 text-xs text-white/40">
            Showing {logs.length} most recent visits
          </div>
        </div>
      )}
    </div>
  );
}
