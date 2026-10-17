import React, { useEffect, useState } from 'react';
import { api, formatDateTime } from '../../api/client';
import { AuditLog } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  Filter, 
  Clock, 
  User, 
  Tag 
} from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api.get<AuditLog[]>('/admin/audit-logs')
      .then(setLogs)
      .catch((err) => console.warn('Could not load audit logs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.entity_type?.toLowerCase().includes(q) ||
      log.entity_id?.toLowerCase().includes(q) ||
      log.admin_id?.toLowerCase().includes(q) ||
      log.detail?.toLowerCase().includes(q)
    );
  });

  const getActionBadgeColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('approve') || act.includes('confirm') || act.includes('activate')) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    if (act.includes('reject') || act.includes('suspend') || act.includes('purge') || act.includes('reset')) {
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    }
    if (act.includes('cycle') || act.includes('rule') || act.includes('update')) {
      return 'bg-gold-500/15 text-gold-300 border-gold-500/30';
    }
    return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  };

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit logs..."
          className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
          >
            &times;
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-obsidian-900/60 p-1 rounded-xl border border-white/10">
        {[
          { key: 'all', label: 'All' },
          { key: 'deposit', label: 'Deposits' },
          { key: 'withdrawal', label: 'Payouts' },
          { key: 'user', label: 'Users' },
          { key: 'cycle', label: 'Cycles' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setActionFilter(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
              actionFilter === f.key
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={fetchLogs}
        title="Refresh audit trail"
        className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-400' : ''}`} />
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Security & System Audit Trail"
      subtitle="Immutable event journal tracking all administrative decisions, reviews, status toggles, and operations."
      actions={headerActions}
    >
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
          <span>Displaying <strong>{filteredLogs.length}</strong> event records</span>
          <span className="font-mono text-[11px] text-emerald-400">Append-Only Immutable Ledger</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading security events...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No audit records found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Action Type</th>
                  <th className="py-3 px-3">Operator</th>
                  <th className="py-3 px-3">Target Entity</th>
                  <th className="py-3 px-3">Entity ID</th>
                  <th className="py-3 px-3">Audit Details & Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      {log.admin_id ? (
                        <span className="font-bold text-white font-mono text-[11px]">{log.admin_id}</span>
                      ) : (
                        <span className="text-slate-500 italic">System Automation</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">
                      <span className="capitalize">{log.entity_type}</span>
                    </td>
                    <td className="py-3 px-3 text-gold-400/90 font-bold">
                      {log.entity_id || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans max-w-sm">
                      <span className="line-clamp-2" title={log.detail || ''}>{log.detail || '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
