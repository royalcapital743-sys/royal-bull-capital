import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatMoney } from '../../api/client';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  Sliders, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Layers, 
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Clock
} from 'lucide-react';

interface AdminStats {
  total_users: number;
  active_users: number;
  total_deposits_usd: number;
  pending_deposits_count: number;
  total_commissions_usd: number;
  pending_withdrawals_count: number;
  pending_withdrawals_usd: number;
  paid_withdrawals_usd: number;
  open_tickets_count: number;
}

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycleLoading, setCycleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchStats = () => {
    setLoading(true);
    api.get<AdminStats>('/admin/overview')
      .then(setStats)
      .catch((err) => console.warn('Could not load admin stats:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRunMonthlyCycle = async () => {
    if (!window.confirm('Run the simulated monthly cycle (5% ROI + 5% principal credit) for all eligible deposits?')) return;
    setCycleLoading(true);
    setMessage(null);
    try {
      const res = await api.post<{ message: string }>('/admin/monthly-cycle', {});
      setMessage(res.message);
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to execute monthly cycle.');
    } finally {
      setCycleLoading(false);
    }
  };

  const handlePurgeTestData = async () => {
    if (!window.confirm('WARNING: Reset database to clean production baseline? This removes all test users, transactions, and deposits while preserving your root administrator account.')) return;
    setResetLoading(true);
    setMessage(null);
    try {
      const res = await api.post<{ message: string }>('/admin/reset-demo', {});
      setMessage(res.message);
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Reset failed.');
    } finally {
      setResetLoading(false);
    }
  };

  const actionButtons = (
    <>
      <button
        onClick={handleRunMonthlyCycle}
        disabled={cycleLoading}
        className="inline-flex items-center gap-2 bg-obsidian-850 hover:bg-obsidian-800 text-gold-400 border border-gold-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
      >
        <Play className="w-3.5 h-3.5" />
        <span>{cycleLoading ? 'Running Cycle...' : 'Run 5% Monthly Cycle'}</span>
      </button>

      <button
        onClick={handlePurgeTestData}
        disabled={resetLoading}
        className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>{resetLoading ? 'Purging...' : 'Purge Test Data'}</span>
      </button>
    </>
  );

  return (
    <AdminLayout
      title="Platform Operations & Command Console"
      subtitle="Comprehensive metrics, incoming approvals, automated commission cascades, and governance."
      actions={actionButtons}
    >
      {/* Toast Alert */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-emerald-400/70 hover:text-emerald-300 font-bold text-xs">Dismiss</button>
        </div>
      )}

      {/* Action Required Banner if pending items exist */}
      {stats && (stats.pending_deposits_count > 0 || stats.pending_withdrawals_count > 0) && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Attention Required: Pending Queue</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {stats.pending_deposits_count > 0 && `${stats.pending_deposits_count} pending deposit${stats.pending_deposits_count > 1 ? 's' : ''}`}
                {stats.pending_deposits_count > 0 && stats.pending_withdrawals_count > 0 && ' and '}
                {stats.pending_withdrawals_count > 0 && `${stats.pending_withdrawals_count} pending withdrawal request${stats.pending_withdrawals_count > 1 ? 's' : ''}`} awaiting administrative review.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stats.pending_deposits_count > 0 && (
              <Link
                to="/admin/deposits"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Review Deposits ({stats.pending_deposits_count})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {stats.pending_withdrawals_count > 0 && (
              <Link
                to="/admin/withdrawals"
                className="px-3.5 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-gold-300 border border-gold-500/30 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Review Payouts ({stats.pending_withdrawals_count})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards (All Clickable to their Respective Management Desks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/admin/users" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/40 transition-all space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Registered Accounts</span>
            <Users className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-display font-bold text-white group-hover:text-gold-300 transition-colors">
            {loading ? '—' : stats?.total_users || 0}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{stats?.active_users || 0} active in network</span>
            <span className="text-gold-400 group-hover:translate-x-0.5 transition-transform">Manage &rarr;</span>
          </div>
        </Link>

        <Link 
          to="/admin/deposits" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/40 transition-all space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Confirmed Deposits</span>
            <Wallet className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-display font-bold text-gold-gradient">
            {loading ? '—' : (stats ? formatMoney(stats.total_deposits_usd * 100) : '$0.00')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {stats?.pending_deposits_count || 0} pending review
            </span>
            <span className="text-gold-400 group-hover:translate-x-0.5 transition-transform">Desk &rarr;</span>
          </div>
        </Link>

        <Link 
          to="/admin/rules" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/40 transition-all space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Commissions Distributed</span>
            <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-display font-bold text-emerald-400">
            {loading ? '—' : (stats ? formatMoney(stats.total_commissions_usd * 100) : '$0.00')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Direct (5%) + 10-Tiers (80%)</span>
            <span className="text-gold-400 group-hover:translate-x-0.5 transition-transform">Rules &rarr;</span>
          </div>
        </Link>

        <Link 
          to="/admin/withdrawals" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/40 transition-all space-y-2 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider">Pending Withdrawals</span>
            <ArrowUpRight className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-display font-bold text-amber-400">
            {loading ? '—' : (stats ? formatMoney(stats.pending_withdrawals_usd * 100) : '$0.00')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>{stats?.pending_withdrawals_count || 0} requests awaiting review</span>
            <span className="text-gold-400 group-hover:translate-x-0.5 transition-transform">Review &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module: User Management */}
        <Link 
          to="/admin/users" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>User Accounts & Tree</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Search users by name, email, or code. Toggle active/suspended status, and manage client network tree structures.
          </p>
        </Link>

        {/* Module: Deposit Approval */}
        <Link 
          to="/admin/deposits" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>Deposit Review Desk</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review incoming wire deposits. Confirming a deposit instantly executes the 10-level commission cascade atomically.
          </p>
        </Link>

        {/* Module: Withdrawal Desk */}
        <Link 
          to="/admin/withdrawals" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>Withdrawal State Machine</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Approve or reject customer payout requests. Approvals atomically deduct prioritized wallet buckets in the ledger.
          </p>
        </Link>

        {/* Module: Commission Rules */}
        <Link 
          to="/admin/rules" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 group-hover:scale-105 transition-transform">
            <Sliders className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>Commission & Simulation Rules</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Customize direct bonus %, 10-level cascade percentages, monthly ROI %, monthly principal %, and deposit limits.
          </p>
        </Link>

        {/* Module: Monthly Cycle History */}
        <Link 
          to="/admin/monthly-cycles" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>Monthly Cycle Simulator</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trigger and audit historical executions of the 5% monthly ROI and 5% principal credit simulation with idempotency verification.
          </p>
        </Link>

        {/* Module: Audit Logs */}
        <Link 
          to="/admin/audit" 
          className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-3 group"
        >
          <div className="p-3 w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors flex items-center justify-between">
            <span>Security & Audit Trail</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect all administrative actions, deposits, status updates, rule modifications, and system events.
          </p>
        </Link>
      </div>

    </AdminLayout>
  );
};
