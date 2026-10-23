import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDate } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ReferralNetworkResponse, Commission } from '../../types';
import { CustomerLayout } from '../../components/CustomerLayout';
import { 
  Share2, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Layers, 
  Award,
  History,
  TrendingUp,
  Info
} from 'lucide-react';

export const Referrals: React.FC = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState<ReferralNetworkResponse | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ReferralNetworkResponse>('/customer/referrals'),
      api.get<Commission[]>('/customer/commissions')
    ])
      .then(([netData, commData]) => {
        setNetwork(netData);
        setCommissions(commData);
      })
      .catch((err) => console.warn('Could not load referral data:', err))
      .finally(() => setLoading(false));
  }, []);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.referral_code}` : '';

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalRoiCommissionsCents = commissions
    .filter((c) => c.commission_type === 'roi_level_commission' && c.status === 'credited')
    .reduce((acc, c) => acc + c.amount_cents, 0);

  const totalDirectBonusCents = commissions
    .filter((c) => c.commission_type === 'direct_bonus' && c.status === 'credited')
    .reduce((acc, c) => acc + c.amount_cents, 0);

  return (
    <CustomerLayout
      title="Referral Network & Lineage"
      subtitle="Track your direct partners and multi-generational downline across all 10 compensation tiers."
    >
      {/* Top Referral Link & Qualification Status Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-xl relative space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-amber-700 dark:text-gold-400 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" /> 10-Tier Monthly ROI Partner Network
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              Instant Partner Onboarding
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Share your personal link to recruit partners. Earn 5% instant Direct Sponsor Bonus on deposits plus up to 80% 10-level commissions on downline Monthly ROI.
            </p>
          </div>

          {/* Copy Box */}
          <div className="bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-gold-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 shadow-sm">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Your Unique Sponsor Code</span>
              <span className="text-xl font-mono font-bold text-amber-700 dark:text-gold-300">{user?.referral_code}</span>
            </div>
            <button
              onClick={copyReferralLink}
              className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-4 py-2.5 rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>

        {/* Qualification Bar with Option A Incremental Threshold Details */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
          (network?.qualified_direct_count || 0) >= 1
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300' 
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            {(network?.qualified_direct_count || 0) >= 1 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <span className="font-extrabold uppercase tracking-wider block text-slate-900 dark:text-white">
                Option A Incremental Direct Qualification: {network?.qualified_direct_count || 0} Verified Funded Directs
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Each level L independently requires at least L funded direct referrals (≥ $100 min deposit). Unqualified levels pay $0 without tree compression.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="font-mono font-bold px-3 py-1.5 rounded-xl bg-white/80 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">
              Total Directs: {network?.total_direct_count || 0}
            </div>
            <div className="font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              Funded Directs: {network?.qualified_direct_count || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Commission Totals KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Monthly ROI Commissions</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {formatMoney(totalRoiCommissionsCents)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Earned from downline monthly ROI cycles (80% 10-level pool)
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Direct Sponsor Bonus</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-gold-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-gold-400">
            {formatMoney(totalDirectBonusCents)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            5% upfront bonus on confirmed direct referral deposits
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="uppercase font-bold tracking-wider">Total Referral Payouts</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatMoney(totalRoiCommissionsCents + totalDirectBonusCents)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Combined credited affiliate earnings recorded on ledger
          </p>
        </div>
      </div>

      {/* 10-Tier Cascade Breakdown Table with Option A Qualification */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600 dark:text-gold-400" /> 10-Tier Level Qualification & Performance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Commissions are calculated from each downline member's finalized monthly ROI based on independent level qualification.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/20 text-[11px] text-amber-700 dark:text-gold-400 font-semibold">
            <Info className="w-3.5 h-3.5" /> Total Pool: 80.00% across 10 Levels
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Generation Tier</th>
                <th className="py-3 px-3">ROI Commission Rate</th>
                <th className="py-3 px-3 text-center">Required Directs</th>
                <th className="py-3 px-3 text-center">Your Funded Directs</th>
                <th className="py-3 px-3 text-center">Level Status</th>
                <th className="py-3 px-3 text-center">Total Members</th>
                <th className="py-3 px-3 text-center">Funded Members</th>
                <th className="py-3 px-3 text-right">Commissions Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {network?.levels_summary.map((lvl) => {
                const reqDirects = lvl.required_directs || lvl.level;
                const yourDirects = lvl.your_directs ?? (network?.qualified_direct_count || 0);
                const isQualified = lvl.is_level_qualified ?? (yourDirects >= reqDirects);

                return (
                  <tr key={lvl.level} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-obsidian-900 border border-amber-300 dark:border-gold-500/20 text-amber-700 dark:text-gold-400 flex items-center justify-center font-bold text-xs">
                        {lvl.level}
                      </span>
                      <span>Level {lvl.level}</span>
                    </td>
                    <td className="py-3.5 px-3 text-amber-700 dark:text-gold-400 font-bold">{lvl.rate_percent.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">{reqDirects}</td>
                    <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">{yourDirects}</td>
                    <td className="py-3.5 px-3 text-center font-sans">
                      {isQualified ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Qualified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Requires {reqDirects} Directs
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300 font-bold">{lvl.members_count}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        lvl.funded_members_count > 0 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'text-slate-400'
                      }`}>
                        {lvl.funded_members_count}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatMoney(lvl.total_commissions_cents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Ledger History (Monthly ROI & Direct Sponsor Bonus) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600 dark:text-gold-400" /> Commission History & Payout Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete server-verified ledger of your monthly ROI commissions and direct sponsor rewards.
          </p>
        </div>

        {commissions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No referral commissions recorded yet. When your downline generates monthly ROI or confirms deposits, payouts will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Cycle / Period</th>
                  <th className="py-3 px-3">Commission Type</th>
                  <th className="py-3 px-3">Tier / Level</th>
                  <th className="py-3 px-3">Source Member</th>
                  <th className="py-3 px-3">Rate</th>
                  <th className="py-3 px-3 text-right">Base Amount</th>
                  <th className="py-3 px-3 text-right">Commission Payout</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold">
                      {c.month_key || 'Deposit Event'}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.commission_type === 'roi_level_commission'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-gold-400 border border-gold-500/20'
                      }`}>
                        {c.commission_type === 'roi_level_commission' ? 'Monthly ROI Cascade' : 'Direct Sponsor Bonus'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      {c.level === 0 ? 'Direct Bonus' : `Level ${c.level}`}
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                      {c.source_user_name || 'Member'}
                    </td>
                    <td className="py-3 px-3 text-amber-700 dark:text-gold-400 font-bold">
                      {c.rate_percent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                      {formatMoney(c.base_cents)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatMoney(c.amount_cents)}
                    </td>
                    <td className="py-3 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Downline Members Directory */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600 dark:text-gold-400" /> Downline Team Members ({network?.members.length || 0})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            List of users registered under your sponsor code across all 10 generations.
          </p>
        </div>

        {network?.members.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No downline members registered yet. Share your referral link above to build your team.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Referral Code</th>
                  <th className="py-3 px-3">Funded Status</th>
                  <th className="py-3 px-3 text-right">Funded Amount</th>
                  <th className="py-3 px-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                {network?.members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-obsidian-900 border border-amber-300 dark:border-gold-500/20 text-amber-700 dark:text-gold-400 text-xs font-bold">
                        Tier {m.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white font-sans">{m.name}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans">{m.email}</td>
                    <td className="py-3 px-3 text-amber-700 dark:text-gold-300 font-bold">{m.referral_code}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.has_funded_deposit 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {m.has_funded_deposit ? '✓ Funded' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatMoney(m.funded_amount_cents)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
