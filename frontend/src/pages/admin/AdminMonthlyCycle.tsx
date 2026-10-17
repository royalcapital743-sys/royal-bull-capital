import React, { useEffect, useState } from 'react';
import { api, formatDateTime } from '../../api/client';
import { MonthlyCycleRun } from '../../types';
import { TrendingUp, Play, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminMonthlyCycle: React.FC = () => {
  const [runs, setRuns] = useState<MonthlyCycleRun[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchRuns = () => {
    api.get<MonthlyCycleRun[]>('/admin/monthly-cycles')
      .then(setRuns)
      .catch((err) => console.warn('Could not load monthly cycles:', err));
  };

  useEffect(() => {
    fetchRuns();
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`Execute simulated monthly cycle for ${selectedMonth}?`)) return;

    setLoading(true);
    setActionMessage(null);
    try {
      const res = await api.post<{ message: string }>('/admin/monthly-cycle', {
        month_key: selectedMonth || undefined,
      });
      setActionMessage(res.message);
      fetchRuns();
    } catch (err: any) {
      alert(err.message || 'Execution failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-2 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Monthly Allocation Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Simulate monthly 5% ROI and 5% principal credit expansion for all active confirmed deposits.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Trigger Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-gold-400" /> Execute Simulation Run
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The monthly simulation traverses all confirmed deposits. For each deposit, it credits 5% ROI and 5% principal credit, posting individual immutable ledger records. Idempotency guarantees that duplicate runs within the same calendar month will not double-credit accounts.
        </p>

        <form onSubmit={handleRun} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="YYYY-MM (e.g. 2026-10)"
              className="bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-gold-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gold-gradient text-obsidian-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Simulating Run...' : 'Execute Monthly Cycle Run'}
          </button>
        </form>
      </div>

      {/* Historical Execution Log */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white">Historical Cycle Execution Logs</h2>

        {runs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No cycle executions on record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Execution Time</th>
                  <th className="py-3 px-3">Month Key</th>
                  <th className="py-3 px-3 text-center">Deposits Processed</th>
                  <th className="py-3 px-3 text-right">Total ROI Credited</th>
                  <th className="py-3 px-3 text-right">Total Principal Credited</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(r.executed_at)}</td>
                    <td className="py-3 px-3 text-gold-400 font-bold">{r.month_key}</td>
                    <td className="py-3 px-3 text-center text-white font-bold">{r.total_eligible_deposits}</td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">${r.total_roi_usd.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-gold-300 font-bold">${r.total_principal_usd.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
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
