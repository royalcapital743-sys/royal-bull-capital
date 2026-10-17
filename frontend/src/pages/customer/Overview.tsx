import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, formatMoney, formatDate, formatDateTime } from '../../api/client';
import { LedgerEntry } from '../../types';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  Share2, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  AlertCircle, 
  Award, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Overview: React.FC = () => {
  const { user, wallet, profile, refreshProfile } = useAuth();
  const [recentLedger, setRecentLedger] = useState<LedgerEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshProfile();
    api.get<LedgerEntry[]>('/customer/ledger')
      .then((data) => setRecentLedger(data.slice(0, 5)))
      .catch((err) => console.warn('Could not load ledger:', err));
  }, []);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.referral_code}` : '';

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Mock performance progression data based on wallet metrics
  const chartData = [
    { name: 'Month 1', balance: (wallet?.original_principal_cents || 0) / 100 },
    { name: 'Month 2', balance: ((wallet?.original_principal_cents || 0) + (wallet?.direct_bonus_cents || 0)) / 100 },
    { name: 'Month 3', balance: ((wallet?.original_principal_cents || 0) + (wallet?.direct_bonus_cents || 0) + (wallet?.level_commission_cents || 0)) / 100 },
    { name: 'Month 4', balance: (wallet?.total_balance_cents || 0) / 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Welcome & Referral Link Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 font-bold">
              Account ID: {user?.id}
            </span>
            <span className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full border ${
              profile?.is_qualified 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {profile?.is_qualified ? '✓ Qualified Leader' : 'Pending 2 Directs Qualification'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor your simulated portfolio, 10-tier commissions, and ledger entries in real time.
          </p>
        </div>

        {/* Copy Referral Link Box */}
        <div className="bg-obsidian-900 border border-white/10 p-3.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Your Sponsor Referral Code</span>
            <span className="text-sm font-mono font-bold text-gold-300">{user?.referral_code}</span>
          </div>
          <button
            onClick={copyReferralLink}
            className="inline-flex items-center justify-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Available Balance */}
        <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 relative overflow-hidden group shadow-gold-glow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Total Available Balance</span>
            <WalletIcon className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-3xl font-display font-black text-gold-gradient">
            {formatMoney(wallet?.total_balance_cents)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Authoritative double-entry ledger balance</span>
          </p>
        </div>

        {/* Original Principal Deposited */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Original Principal</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatMoney(wallet?.original_principal_cents)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            + {formatMoney(wallet?.principal_credits_cents)} in monthly principal credits
          </p>
        </div>

        {/* 10-Tier Commissions Earned */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">10-Tier Cascades</span>
            <Layers className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatMoney(wallet?.level_commission_cents)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Across your multi-generational downline
          </p>
        </div>

        {/* Direct Bonus & Monthly ROI */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Direct Bonus & ROI</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatMoney((wallet?.direct_bonus_cents || 0) + (wallet?.roi_balance_cents || 0))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Direct: {formatMoney(wallet?.direct_bonus_cents)} · ROI: {formatMoney(wallet?.roi_balance_cents)}
          </p>
        </div>
      </div>

      {/* Network Qualification & Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Referral Network Status Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gold-400" /> Network Status
            </h3>
            <Link to="/referrals" className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1">
              <span>View Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Direct Referrals</span>
                <span className="text-xl font-bold font-mono text-white">{profile?.direct_referrals_count || 0}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Funded & Active</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{profile?.qualified_referrals_count || 0}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total 10-Tier Downline</span>
                <span className="text-xl font-bold font-mono text-gold-400">{profile?.total_network_count || 0}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Qualification</span>
                <span className={`text-xs font-bold ${profile?.is_qualified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile?.is_qualified ? 'ACTIVE (Unlocked)' : 'NEEDS 2 FUNDED DIRECTS'}
                </span>
              </div>
            </div>

            {!profile?.is_qualified && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Introduce <strong>{Math.max(0, 2 - (profile?.qualified_referrals_count || 0))} more direct funded member(s)</strong> to unlock passive network commissions across all 10 tiers.
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <Link 
              to="/deposit" 
              className="flex-1 bg-gold-gradient text-obsidian-950 font-bold py-2.5 rounded-xl text-center text-xs shadow-gold-glow hover:brightness-110 transition-all"
            >
              + New Deposit
            </Link>
            <Link 
              to="/withdrawals" 
              className="flex-1 bg-obsidian-850 hover:bg-obsidian-800 text-white font-semibold py-2.5 rounded-xl text-center text-xs border border-white/10 transition-all"
            >
              Withdraw Funds
            </Link>
          </div>
        </div>

        {/* Portfolio Growth Chart */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" /> Growth Trajectory
              </h3>
              <p className="text-xs text-slate-400">Illustrating principal growth, 5% monthly returns, and network earnings</p>
            </div>
            <span className="text-xs font-mono text-gold-400 font-bold bg-obsidian-900 px-3 py-1 rounded-lg border border-gold-500/20">
              Performance
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0B0E', borderColor: 'rgba(217,119,6,0.3)', borderRadius: '12px' }}
                  formatter={(val: number) => [`$${val.toFixed(2)} USD`, 'Projected Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Ledger Transactions</h3>
            <p className="text-xs text-slate-400">Server-authoritative immutable double-entry history</p>
          </div>
          <Link to="/wallet" className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1">
            <span>Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLedger.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No transaction records found yet. Fund a deposit to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {recentLedger.map((item) => {
                  const isCredit = item.amount_cents >= 0;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDate(item.created_at)}</td>
                      <td className="py-3 px-3">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-obsidian-900 border border-white/10 text-slate-300">
                          {item.entry_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{item.description}</td>
                      <td className={`py-3 px-3 text-right font-bold ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : ''}{formatMoney(item.amount_cents)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">
                        {formatMoney(item.balance_after_cents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
