import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { SystemRules } from '../../types';
import { Sliders, Save, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminRules: React.FC = () => {
  const [directBonus, setDirectBonus] = useState<number>(5);
  const [rates, setRates] = useState<number[]>([20, 15, 10, 8, 7, 6, 5, 4, 3, 2]);
  const [monthlyRoi, setMonthlyRoi] = useState<number>(5);
  const [monthlyPrincipal, setMonthlyPrincipal] = useState<number>(5);
  const [minDeposit, setMinDeposit] = useState<number>(100);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.get<SystemRules>('/admin/rules')
      .then((data) => {
        setDirectBonus(data.direct_bonus);
        setRates(data.level_rates);
        setMonthlyRoi(data.monthly_roi);
        setMonthlyPrincipal(data.monthly_principal);
        setMinDeposit(data.minimum_deposit);
        setMinWithdrawal(data.min_withdrawal);
      })
      .catch((err) => console.warn('Could not load rules:', err));
  }, []);

  const handleRateChange = (index: number, val: number) => {
    const updated = [...rates];
    updated[index] = val;
    setRates(updated);
  };

  const totalRates = rates.reduce((sum, r) => sum + Number(r || 0), 0);

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
      setSuccess('Commission and simulation rules updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-2 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Commission & Simulation Rule Parameters
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure multi-tier percentage allocations, deposit thresholds, and monthly cycle rates.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Direct Bonus & Monthly Cycle Rates */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gold-400" /> Core Percentage Rates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Direct Referral Bonus (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={directBonus}
                onChange={(e) => setDirectBonus(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-gold-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Monthly ROI Simulation (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={monthlyRoi}
                onChange={(e) => setMonthlyRoi(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Monthly Principal Credit (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={monthlyPrincipal}
                onChange={(e) => setMonthlyPrincipal(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-gold-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* 10-Tier Grid */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">10-Tier Network Commission Rates</h2>
              <p className="text-xs text-slate-400">Configure percentage allocation for each downline level</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">10-Tier Total</span>
              <span className="text-xl font-bold font-mono text-gold-400">{totalRates.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {rates.map((rate, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Level {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={rate}
                    onChange={(e) => handleRateChange(idx, Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold font-mono text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limits */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-lg font-bold text-white">Deposit & Withdrawal Boundaries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Minimum Deposit (USD)</label>
              <input
                type="number"
                min="10"
                value={minDeposit}
                onChange={(e) => setMinDeposit(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Minimum Withdrawal (USD)</label>
              <input
                type="number"
                min="5"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Save Configuration Parameters'}</span>
        </button>
      </form>
    </div>
  );
};
