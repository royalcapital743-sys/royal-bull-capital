import React, { useState } from 'react';
import { formatMoney } from '../api/client';
import { Calculator, Award, TrendingUp, Sparkles, CheckCircle, SlidersHorizontal } from 'lucide-react';

const LEVEL_RATES = [
  { level: 1, rate: 20, desc: 'Direct Sub-referrals' },
  { level: 2, rate: 15, desc: 'Tier 2 Network' },
  { level: 3, rate: 10, desc: 'Tier 3 Network' },
  { level: 4, rate: 8, desc: 'Tier 4 Expansion' },
  { level: 5, rate: 7, desc: 'Tier 5 Expansion' },
  { level: 6, rate: 6, desc: 'Tier 6 Volume' },
  { level: 7, rate: 5, desc: 'Tier 7 Volume' },
  { level: 8, rate: 4, desc: 'Tier 8 Depth' },
  { level: 9, rate: 3, desc: 'Tier 9 Depth' },
  { level: 10, rate: 2, desc: 'Tier 10 Depth' },
];

const PRESETS = [500, 1000, 2500, 5000, 10000];

export const CommissionCalculator: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState<number>(1000);

  const directBonus = depositAmount * 0.05;
  const totalCascade = LEVEL_RATES.reduce((sum, item) => sum + (depositAmount * (item.rate / 100)), 0);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300/80 dark:border-gold-500/25 relative overflow-hidden shadow-xl interactive-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-amber-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Interactive 10-Tier Commission Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
            Calculate Referral Payouts & Cascades
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            See how Royal Bull Capital's 80% multi-tier distribution + 5% direct referral bonus allocates per qualifying deposit.
          </p>
        </div>

        {/* Total stats card */}
        <div className="bg-white dark:bg-obsidian-900 border border-amber-300 dark:border-gold-500/30 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-sm dark:shadow-gold-glow hover:border-amber-400 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">Max Total Allocation</span>
            <span className="text-2xl font-display font-extrabold text-gold-gradient">
              {formatMoney((totalCascade + directBonus) * 100)}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-gold-400 font-semibold block">85.00% Combined Pool</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-gold-400 animate-float-slow">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Preset Quick Select Buttons */}
      <div className="pt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Quick Amount:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setDepositAmount(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              depositAmount === preset 
                ? 'bg-gold-gradient text-obsidian-950 font-bold shadow-gold-glow scale-105' 
                : 'bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-amber-300 dark:hover:border-gold-500/30 shadow-sm'
            }`}
          >
            ${preset.toLocaleString()} USD
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="py-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
            Custom Deposit Volume:
          </label>
          <span className="text-xl font-bold font-mono text-amber-700 dark:text-gold-300 bg-white dark:bg-obsidian-900 px-3.5 py-1 rounded-xl border border-amber-300 dark:border-gold-500/30 shadow-sm">
            ${depositAmount.toLocaleString()} USD
          </span>
        </div>
        <input 
          type="range" 
          min="100" 
          max="25000" 
          step="100"
          value={depositAmount} 
          onChange={(e) => setDepositAmount(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-gold-500 focus:outline-none transition-all"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Min: $100 USD</span>
          <span>$5,000 USD</span>
          <span>$10,000 USD</span>
          <span>$15,000 USD</span>
          <span>Max: $25,000 USD</span>
        </div>
      </div>

      {/* Direct Bonus Callout */}
      <div className="bg-amber-50/80 dark:bg-gold-500/10 border border-amber-300/80 dark:border-gold-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-gold-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct Sponsor Bonus (5.00%)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Paid directly to the immediate referring sponsor upon deposit confirmation.</p>
          </div>
        </div>
        <div className="text-right sm:shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Bonus Amount</span>
          <span className="text-lg font-bold font-mono text-amber-700 dark:text-gold-300">{formatMoney(directBonus * 100)}</span>
        </div>
      </div>

      {/* 10-Tier Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-2.5 px-3">Network Level</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Commission Rate</th>
              <th className="py-2.5 px-3 text-right">Commission Payout</th>
              <th className="py-2.5 px-3 text-center">Required Qualification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {LEVEL_RATES.map((item) => {
              const amount = depositAmount * (item.rate / 100);
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
                      <CheckCircle className="w-3 h-3" /> 2 Funded Directs
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
