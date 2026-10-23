import React from 'react';
import { CommissionCalculator } from '../components/CommissionCalculator';
import { 
  Award, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Users,
  TrendingUp,
  Share2,
  Lock,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReferralProgram: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* 1. Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-gold-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Institutional Compensation Plan</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          10-Tier Commission Plan
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
          Royal Bull Capital's 80% multi-tier distribution and 5% direct sponsor bonus provide an institutional affiliate architecture designed for network longevity, team duplication, and server-authoritative integrity.
        </p>
      </div>

      {/* 2. Community & Growth Opportunity (Adapted from Finway PPT Page 18) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            COLLABORATIVE EXPANSION
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Community & Growth Opportunity
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Empowering partners through transparent compensation, leadership depth, and turnkey network tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Structured Team Growth</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Expand your network across 10 generations of ancestral depth. Our Directed Acyclic Graph (DAG) referral engine accurately credits commissions throughout your tree.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Systems & Duplication</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Equip team members with turnkey referral links, real-time qualification badges, interactive calculators, and an auditable wallet portal.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authoritative Accountability</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              All commission payouts and qualification states are computed server-side and recorded in an immutable ledger with unique idempotency hashes.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Calculator */}
      <CommissionCalculator />

      {/* 4. Deep-Dive Tier Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Tier Hierarchy Table */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-gold-400 border border-amber-300 dark:border-gold-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">10-Level Rate Hierarchy</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">80.00% total pool allocated across verified downline lineage</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 1 (Direct Network)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">20.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 2 (Second Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">15.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 3 (Third Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">10.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 4 (Fourth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">8.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 5 (Fifth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">7.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 6 (Sixth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">6.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 7 (Seventh Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">5.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 8 (Eighth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">4.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 9 (Ninth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">3.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 font-mono">
              <span className="text-slate-900 dark:text-white font-semibold">Tier 10 (Tenth Generation)</span>
              <span className="text-amber-700 dark:text-gold-400 font-bold text-sm">2.00%</span>
            </div>
          </div>
        </div>

        {/* Qualification & Sponsor Reward Details */}
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-gold-400 border border-amber-300 dark:border-gold-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Direct Sponsor Bonus (5.00%)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Immediate reward for every directly introduced deposit</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In addition to the 80% multi-tier cascade, Royal Bull Capital credits an immediate 5.00% sponsor reward upon deposit confirmation. This bonus does not require tier qualification and is deposited instantly to your wallet.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-amber-300 dark:border-gold-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">The Qualification Standard</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Server-enforced proof of active participation</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To unlock Level 1 through Level 10 multi-tier commissions, an account must sponsor at least two (2) direct active referrals who have completed funded deposits ($100 USD minimum).
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Protects the commission pool against empty accounts, dormant structures, and circular loops.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Compliance Notice */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 flex items-start gap-3 text-xs text-slate-700 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-gold-400">
            Important Program Governance Notice:
          </span>
          <p className="leading-relaxed">
            Commissions are paid solely from actual, verified deposit activity across 10 ancestor tiers. Payouts require maintaining active qualification (at least two direct funded referrals). No guaranteed income, fixed commissions, or passive yields are promised or implied. All participation is governed by platform terms and compliance reviews.
          </p>
        </div>
      </div>

    </div>
  );
};
