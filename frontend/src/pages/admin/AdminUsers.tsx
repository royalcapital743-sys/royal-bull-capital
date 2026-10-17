import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDate } from '../../api/client';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  Users, 
  Search, 
  CheckCircle, 
  Ban, 
  Copy, 
  Check, 
  UserCheck, 
  Filter,
  RefreshCw,
  Share2
} from 'lucide-react';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  referral_code: string;
  referrer_name: string | null;
  status: string;
  balance_usd: number;
  created_at: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get<AdminUserRow[]>(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(setUsers)
      .catch((err) => console.warn('Could not fetch users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleStatus = async (user: AdminUserRow) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Set status of ${user.name} to '${nextStatus}'?`)) return;

    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
      setActionMessage(`Updated ${user.name}'s status to ${nextStatus}.`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter === 'all') return true;
    return u.status === statusFilter;
  });

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, code..."
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

      {/* Status Filter Pill Buttons */}
      <div className="flex items-center gap-1 bg-obsidian-900/60 p-1 rounded-xl border border-white/10">
        {(['all', 'active', 'suspended'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
              statusFilter === st
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <button
        onClick={fetchUsers}
        title="Refresh user list"
        className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-400' : ''}`} />
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="User Accounts & Network Directory"
      subtitle="Search clients, inspect upline/downline lineage, view wallet balances, and manage account statuses."
      actions={headerActions}
    >
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400/70 hover:text-emerald-300 font-bold">&times;</button>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
          <span>Displaying <strong>{filteredUsers.length}</strong> registered account{filteredUsers.length === 1 ? '' : 's'}</span>
          <span className="font-mono text-[11px]">System Status: Operational</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No accounts found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">User & Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Referral Code</th>
                  <th className="py-3 px-3">Upline Referrer</th>
                  <th className="py-3 px-3 text-right">Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-white text-sm">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        u.role === 'superadmin' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : u.role === 'admin'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-obsidian-900 border border-gold-500/20">
                        <span className="text-gold-300 font-bold font-mono">{u.referral_code}</span>
                        <button
                          onClick={() => handleCopyCode(u.referral_code)}
                          title="Copy referral code"
                          className="text-slate-400 hover:text-gold-400 transition-colors"
                        >
                          {copiedCode === u.referral_code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans">
                      {u.referrer_name ? (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Share2 className="w-3 h-3 text-gold-400 shrink-0" />
                          <span>{u.referrer_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">None (Root)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white font-mono text-sm">
                      ${u.balance_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${
                        u.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'superadmin' ? (
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`p-1.5 px-3 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                            u.status === 'active'
                              ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/30'
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans italic">Protected Root</span>
                      )}
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
