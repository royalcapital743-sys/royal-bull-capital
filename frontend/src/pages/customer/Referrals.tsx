import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDate } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { ReferralNetworkResponse } from '../../types';
import { 
  Share2, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Layers, 
  Award,
  Sparkles
} from 'lucide-react';

export const Referrals: React.FC = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState<ReferralNetworkResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ReferralNetworkResponse>('/customer/referrals')
      .then(setNetwork)
      .catch((err) => console.warn('Could not load referral network:', err))
      .finally(() => setLoading(false));
  }, []);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.referral_code}` : '';

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Link Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-2xl relative space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" /> 10-Tier Partner Network
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Referral Network & Lineage
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track your direct partners and multi-generational downline across all 10 compensation tiers.
            </p>
          </div>

          {/* Copy Box */}
          <div className="bg-obsidian-900 border border-gold-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 shadow-gold-glow">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Your Unique Sponsor Code</span>
              <span className="text-xl font-mono font-bold text-gold-300">{user?.referral_code}</span>
            </div>
            <button
              onClick={copyReferralLink}
              className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-4 py-2.5 rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>

        {/* Qualification Bar */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          network?.is_qualified 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            {network?.is_qualified ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold uppercase tracking-wider block">
                {network?.is_qualified ? 'Status: Qualified Leader (Tier 1-10 Commissions Unlocked)' : 'Status: Pending Qualification'}
              </span>
              <p className="text-slate-300 mt-0.5">
                {network?.is_qualified 
                  ? `You have met the qualification criteria with ${network.qualified_direct_count} funded direct referrals.`
                  : `You have ${network?.qualified_direct_count || 0} / 2 funded direct referrals needed to unlock 10-tier commissions.`}
              </p>
            </div>
          </div>
          <div className="shrink-0 font-mono font-bold">
            Directs: {network?.total_direct_count || 0} (Funded: {network?.qualified_direct_count || 0})
          </div>
        </div>
      </div>

      {/* 10-Tier Cascade Breakdown Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-400" /> 10-Tier Level Summary
          </h2>
          <p className="text-xs text-slate-400">
            Real-time aggregated metrics across each ancestral generation in your referral tree.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Generation Tier</th>
                <th className="py-3 px-3">Commission Rate</th>
                <th className="py-3 px-3 text-center">Total Members</th>
                <th className="py-3 px-3 text-center">Funded Members</th>
                <th className="py-3 px-3 text-right">Commissions Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {network?.levels_summary.map((lvl) => (
                <tr key={lvl.level} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-white font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-obsidian-900 border border-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs">
                      {lvl.level}
                    </span>
                    <span>Level {lvl.level}</span>
                  </td>
                  <td className="py-3 px-3 text-gold-400 font-bold">{lvl.rate_percent.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-center text-slate-300 font-bold">{lvl.members_count}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      lvl.funded_members_count > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500'
                    }`}>
                      {lvl.funded_members_count}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {formatMoney(lvl.total_commissions_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downline Members Directory */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" /> Downline Team Members ({network?.members.length || 0})
          </h2>
          <p className="text-xs text-slate-400">
            List of users registered under your sponsor code across all 10 generations.
          </p>
        </div>

        {network?.members.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No downline members registered yet. Share your referral link to build your team.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">Member Name</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Referral Code</th>
                  <th className="py-3 px-3">Funded Status</th>
                  <th className="py-3 px-3 text-right">Funded Amount</th>
                  <th className="py-3 px-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {network?.members.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-obsidian-900 border border-gold-500/20 text-gold-400 text-xs font-bold">
                        Tier {m.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white font-sans">{m.name}</td>
                    <td className="py-3 px-3 text-slate-400 font-sans">{m.email}</td>
                    <td className="py-3 px-3 text-gold-300 font-bold">{m.referral_code}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.has_funded_deposit 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.has_funded_deposit ? '✓ Funded' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {formatMoney(m.funded_amount_cents)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
