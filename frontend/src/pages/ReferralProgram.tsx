import React from 'react';
import { CommissionCalculator } from '../components/CommissionCalculator';
import { Award, Layers, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReferralProgram: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Institutional Compensation Plan</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          10-Tier Referral Program
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          Royal Bull Capital's 80% multi-tier distribution + 5% direct bonus is an elite referral model designed for institutional transparency and network longevity.
        </p>
      </div>

      {/* Interactive Calculator */}
      <CommissionCalculator />

      {/* Deep-Dive Tier Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-400 border border-gold-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">10-Level Rate Hierarchy</h2>
              <p className="text-xs text-slate-400">Totaling 80.00% allocated across downline depth</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 1 (Direct Network)</span>
              <span className="text-gold-400 font-bold text-sm">20.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 2 (Second Generation)</span>
              <span className="text-gold-400 font-bold text-sm">15.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 3 (Third Generation)</span>
              <span className="text-gold-400 font-bold text-sm">10.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 4 (Fourth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">8.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 5 (Fifth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">7.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 6 (Sixth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">6.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 7 (Seventh Generation)</span>
              <span className="text-gold-400 font-bold text-sm">5.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 8 (Eighth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">4.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 9 (Ninth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">3.00%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-obsidian-900 border border-white/5 font-mono">
              <span className="text-white font-semibold">Tier 10 (Tenth Generation)</span>
              <span className="text-gold-400 font-bold text-sm">2.00%</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-400 border border-gold-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Direct Sponsor Bonus (5%)</h3>
                <p className="text-xs text-slate-400">Guaranteed reward for every sponsored member</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In addition to the 80% multi-tier pool, Royal Bull Capital awards an immediate 5.00% bonus to the direct sponsor upon deposit confirmation. This bonus does not require qualification and is credited instantly to the ledger.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-gold-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Qualification Standard</h3>
                <p className="text-xs text-slate-400">Server-enforced proof of activity</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A member must introduce at least two (2) direct active referrals who have funded confirmed deposits to receive Level 1-10 network commissions. Pending, failed, or cancelled deposits do not count towards qualification.
            </p>
            <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Protects the commission pool against dormant accounts and empty trees.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block">Important Program Governance:</span>
          <p className="leading-relaxed">
            The commission rates described above reflect the current active platform parameters configured in the system rules. Payouts require maintaining active qualification (at least two direct funded referrals) and are subject to platform terms and compliance review.
          </p>
        </div>
      </div>
    </div>
  );
};
