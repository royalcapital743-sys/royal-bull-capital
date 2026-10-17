import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { 
  Sliders, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Play, 
  Share2, 
  Layers, 
  ShieldAlert,
  HeadphonesIcon
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" /> Platform Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Administrator Command Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            System-wide operational controls, deposit approvals, cycle simulations, and compliance oversight.
          </p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleRunMonthlyCycle}
            disabled={cycleLoading}
            className="inline-flex items-center gap-2 bg-obsidian-850 hover:bg-obsidian-800 text-gold-400 border border-gold-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{cycleLoading ? 'Running Simulation...' : 'Run Monthly 5% ROI Cycle'}</span>
          </button>

          <button
            onClick={handlePurgeTestData}
            disabled={resetLoading}
            className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{resetLoading ? 'Purging...' : 'Purge All Test Data'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Registered Accounts</span>
            <Users className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-3xl font-display font-bold text-white">
            {stats?.total_users || 0}
          </div>
          <p className="text-[11px] text-slate-400">
            {stats?.active_users || 0} accounts active in network
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Confirmed Deposits</span>
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-display font-bold text-gold-gradient">
            {stats ? formatMoney(stats.total_deposits_usd * 100) : '$0.00'}
          </div>
          <p className="text-[11px] text-amber-400">
            {stats?.pending_deposits_count || 0} deposits pending verification
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Commissions Distributed</span>
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-display font-bold text-emerald-400">
            {stats ? formatMoney(stats.total_commissions_usd * 100) : '$0.00'}
          </div>
          <p className="text-[11px] text-slate-400">
            Direct (5%) + 10-tier cascades (80%)
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Pending Withdrawals</span>
            <ArrowUpRight className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-bold text-amber-400">
            {stats ? formatMoney(stats.pending_withdrawals_usd * 100) : '$0.00'}
          </div>
          <p className="text-[11px] text-slate-400">
            {stats?.pending_withdrawals_count || 0} requests awaiting review
          </p>
        </div>
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            User Accounts & Tree Lineage
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Search users, toggle active/suspended status, and manage client accounts and network tree structures.
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            Deposit Review & Approvals
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review incoming simulated wire transfers. Confirming a deposit automatically executes the 10-level commission cascade.
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            Withdrawal State Machine
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            Commission & Simulation Rules
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            Monthly Cycle Simulator
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
          <h3 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
            Security & Audit Trail
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect all administrative actions, deposits, status updates, rule modifications, and system events.
          </p>
        </Link>
      </div>

    </div>
  );
};
