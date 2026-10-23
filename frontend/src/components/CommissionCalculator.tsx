import React, { useState } from 'react';
import { formatMoney } from '../api/client';
import { Calculator, Award, Sparkles, CheckCircle, SlidersHorizontal, Info } from 'lucide-react';

const LEVEL_RATES = [
  { level: 1, rate: 20, desc: 'Direct Sub-referrals', requiredDirects: 1 },
  { level: 2, rate: 15, desc: 'Tier 2 Network', requiredDirects: 2 },
  { level: 3, rate: 10, desc: 'Tier 3 Network', requiredDirects: 3 },
  { level: 4, rate: 8, desc: 'Tier 4 Expansion', requiredDirects: 4 },
  { level: 5, rate: 7, desc: 'Tier 5 Expansion', requiredDirects: 5 },
  { level: 6, rate: 6, desc: 'Tier 6 Volume', requiredDirects: 6 },
  { level: 7, rate: 5, desc: 'Tier 7 Volume', requiredDirects: 7 },
  { level: 8, rate: 4, desc: 'Tier 8 Depth', requiredDirects: 8 },
  { level: 9, rate: 3, desc: 'Tier 9 Depth', requiredDirects: 9 },
  { level: 10, rate: 2, desc: 'Tier 10 Depth', requiredDirects: 10 },
];

const PRESETS = [100, 500, 1000, 2500, 5000];

export const CommissionCalculator: React.FC = () => {
  const [roiAmount, setRoiAmount] = useState<number>(100);

  const totalCascade = LEVEL_RATES.reduce((sum, item) => sum + (roiAmount * (item.rate / 100)), 0);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300/80 dark:border-gold-500/25 relative overflow-hidden shadow-xl interactive-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-amber-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Monthly ROI Commission Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
            Calculate 10-Level ROI Referral Payouts
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Commissions are calculated from each referred member's <strong className="text-slate-800 dark:text-slate-200">finalized monthly ROI</strong>, not deposit principal.
          </p>
        </div>

        {/* Total stats card */}
        <div className="bg-white dark:bg-obsidian-900 border border-amber-300 dark:border-gold-500/30 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-sm dark:shadow-gold-glow hover:border-amber-400 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Max 10-Tier Allocation</span>
            <span className="text-2xl font-display font-extrabold text-gold-gradient">
              {formatMoney(totalCascade * 100)}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-gold-400 font-semibold block">80.00% of Downline Monthly ROI</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-gold-400 animate-float-slow">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Preset Quick Select Buttons */}
      <div className="pt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Downline Monthly ROI:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setRoiAmount(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              roiAmount === preset 
                ? 'bg-gold-gradient text-obsidian-950 font-bold shadow-gold-glow scale-105' 
                : 'bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-amber-300 dark:hover:border-gold-500/30 shadow-sm'
            }`}
          >
            ${preset.toLocaleString()} ROI
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="py-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
            Downline Finalized Monthly ROI:
          </label>
          <span className="text-xl font-bold font-mono text-amber-700 dark:text-gold-300 bg-white dark:bg-obsidian-900 px-3.5 py-1 rounded-xl border border-amber-300 dark:border-gold-500/30 shadow-sm">
            ${roiAmount.toLocaleString()} USD
          </span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="5000" 
          step="50"
          value={roiAmount} 
          onChange={(e) => setRoiAmount(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-gold-500 focus:outline-none transition-all"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Min: $50 ROI</span>
          <span>$1,000 ROI</span>
          <span>$2,500 ROI</span>
          <span>Max: $5,000 ROI</span>
        </div>
      </div>

      {/* Isolation notice for Direct Sponsor Bonus */}
      <div className="bg-amber-50/80 dark:bg-gold-500/10 border border-amber-300/80 dark:border-gold-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-gold-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct Sponsor Bonus (5.00%) — Separate from 10-Level ROI</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Calculated and credited independently upon confirmed direct deposit. Does not trigger the 10-level cascade.</p>
          </div>
        </div>
        <div className="text-right sm:shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Qualification Basis</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Direct Deposit Event</span>
        </div>
      </div>

      {/* 10-Tier Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-2.5 px-3">Generation Level</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">ROI Commission Rate</th>
              <th className="py-2.5 px-3 text-right">Commission Payout</th>
              <th className="py-2.5 px-3 text-center">Option A Qualification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {LEVEL_RATES.map((item) => {
              const amount = roiAmount * (item.rate / 100);
              return (
                <tr key={item.level} className="hover:bg-amber-50/50 dark:hover:bg-gold-500/5 transition-colors font-mono">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-obsidian-800 border border-amber-300 dark:border-gold-500/20 flex items-center justify-center text-[11px] text-amber-700 dark:text-gold-400 font-bold">
                      {item.level}
                    </span>
                    <span>Level {item.level}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans">{item.desc}</td>
                  <td className="py-2.5 px-3 text-amber-700 dark:text-gold-400 font-bold">{item.rate.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">{formatMoney(amount * 100)}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> ≥ {item.requiredDirects} Funded Direct{item.requiredDirects > 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-600 dark:text-gold-400 shrink-0" />
        <span>
          <strong>Oracle Verification:</strong> A $100 downline monthly ROI produces exactly $20 (L1), $15 (L2), $10 (L3), $8 (L4), $7 (L5), $6 (L6), $5 (L7), $4 (L8), $3 (L9), $2 (L10) totaling exactly $80.00 (80%) when all ancestors qualify. Non-compression strictly applies.
        </span>
      </div>
    </div>
  );
};
