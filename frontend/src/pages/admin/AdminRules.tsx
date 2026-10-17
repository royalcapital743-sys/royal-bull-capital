import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { SystemRules } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Percent,
  DollarSign
} from 'lucide-react';

export const AdminRules: React.FC = () => {
  const [directBonus, setDirectBonus] = useState<number>(5);
  const [rates, setRates] = useState<number[]>([20, 15, 10, 8, 7, 6, 5, 4, 3, 2]);
  const [monthlyRoi, setMonthlyRoi] = useState<number>(5);
  const [monthlyPrincipal, setMonthlyPrincipal] = useState<number>(5);
  const [minDeposit, setMinDeposit] = useState<number>(100);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRules = () => {
    setFetching(true);
    api.get<SystemRules>('/admin/rules')
      .then((data) => {
        setDirectBonus(data.direct_bonus);
        setRates(data.level_rates);
        setMonthlyRoi(data.monthly_roi);
        setMonthlyPrincipal(data.monthly_principal);
        setMinDeposit(data.minimum_deposit);
        setMinWithdrawal(data.min_withdrawal);
      })
      .catch((err) => console.warn('Could not load rules:', err))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleRateChange = (index: number, val: number) => {
    const updated = [...rates];
    updated[index] = val;
    setRates(updated);
  };

  const totalRates = rates.reduce((sum, r) => sum + Number(r || 0), 0);

  const applyPreset = (presetRates: number[]) => {
    setRates([...presetRates]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      await api.post('/admin/rules', {
        direct_bonus: directBonus,
        level_rates: rates,
        monthly_roi: monthlyRoi,
        monthly_principal: monthlyPrincipal,
        minimum_deposit: minDeposit,
        min_withdrawal: minWithdrawal,
      });
      setSuccess('Commission and simulation rules updated successfully and persisted to database.');
    } catch (err: any) {
      alert(err.message || 'Failed to update rules.');
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <button
      onClick={fetchRules}
      title="Reset to current stored values"
      className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin text-gold-400' : ''}`} />
    </button>
  );

  return (
    <AdminLayout
      title="Commission & System Rule Configuration"
      subtitle="Configure direct referral rewards, 10-tier cascade distribution percentages, and deposit thresholds."
      actions={headerActions}
    >
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400/70 hover:text-emerald-300 font-bold">&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Tier Cascade Distribution (Weights must total 100%) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-gold-400" />
                <span>10-Tier Commission Cascade Distribution</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                80% of confirmed deposits fund the cascade pool. These weights determine each tier's share.
              </p>
            </div>

            {/* Live Total Indicator */}
            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono flex items-center gap-2 ${
              Math.abs(totalRates - 100) < 0.01 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
            }`}>
              <span>Total Weight:</span>
              <span className="text-sm">{totalRates}%</span>
              {Math.abs(totalRates - 100) < 0.01 ? (
                <span className="text-[10px] uppercase font-sans font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">Balanced (100%)</span>
              ) : (
                <span className="text-[10px] uppercase font-sans font-extrabold bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">Recommend 100%</span>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Quick Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset([20, 15, 10, 8, 7, 6, 5, 4, 3, 2])}
              className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            >
              Standard (20/15/10/8/7/6/5/4/3/2)
            </button>
            <button
              type="button"
              onClick={() => applyPreset([25, 20, 15, 10, 8, 6, 5, 4, 4, 3])}
              className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            >
              Top-Heavy (25/20/15/...)
            </button>
            <button
              type="button"
              onClick={() => applyPreset([10, 10, 10, 10, 10, 10, 10, 10, 10, 10])}
              className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors"
            >
              Equal Flat (10% each)
            </button>
          </div>

          {/* 10 Level Rate Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {rates.map((rate, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-obsidian-900/60 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold font-mono">Tier {idx + 1}</span>
                  <span className="text-[10px] text-gold-400 uppercase font-semibold">L{idx + 1}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={rate}
                    onChange={(e) => handleRateChange(idx, parseFloat(e.target.value) || 0)}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white text-right pr-7 focus:outline-none focus:border-gold-500 font-mono"
                  />
                  <span className="absolute right-2.5 top-2 text-slate-400 text-xs font-bold">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Rates & Thresholds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Direct Reward & Simulation Parameters</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Direct Sponsor Bonus Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={directBonus}
                    onChange={(e) => setDirectBonus(parseFloat(e.target.value) || 0)}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500">Credited directly to the immediate sponsor on deposit approval.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Monthly ROI Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={monthlyRoi}
                      onChange={(e) => setMonthlyRoi(parseFloat(e.target.value) || 0)}
                      className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                    <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">%</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Principal Addition (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={monthlyPrincipal}
                      onChange={(e) => setMonthlyPrincipal(parseFloat(e.target.value) || 0)}
                      className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                    <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gold-400" />
              <span>Transaction Limits & Thresholds</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Minimum Deposit (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    value={minDeposit}
                    onChange={(e) => setMinDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Minimum allowed wire deposit during client onboarding ($100 standard).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Minimum Withdrawal (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    value={minWithdrawal}
                    onChange={(e) => setMinWithdrawal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Minimum requested amount for payout processing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-2xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Rules...' : 'Save Configuration Changes'}</span>
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};
