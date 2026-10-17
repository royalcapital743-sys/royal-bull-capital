import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDate } from '../../api/client';
import { Users, Search, Sparkles, CheckCircle, Ban, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

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
      setActionMessage(`Updated ${user.name} status to ${nextStatus}.`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-2 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            User Accounts & Network Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Search users, toggle status, and inspect downline network structures.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or code..."
            className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Referral Code</th>
                <th className="py-3 px-3">Referred By</th>
                <th className="py-3 px-3 text-right">Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-semibold text-white font-sans">{u.name}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{u.email}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold text-gold-400">{u.role}</td>
                  <td className="py-3 px-3 text-gold-300 font-bold">{u.referral_code}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{u.referrer_name || '—'}</td>
                  <td className="py-3 px-3 text-right font-bold text-white">${u.balance_usd.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 font-sans">
                      <button
                        onClick={() => toggleStatus(u)}
                        className={`p-1.5 px-2.5 rounded-lg border text-[11px] font-bold transition-all ${
                          u.status === 'active'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
