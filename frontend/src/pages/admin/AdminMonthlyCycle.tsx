import React, { useEffect, useState } from 'react';
import { api, formatDateTime, formatMoney } from '../../api/client';
import { MonthlyCycleRun } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  Calendar, 
  RefreshCw, 
  Clock, 
  ShieldCheck,
  Info 
} from 'lucide-react';

export const AdminMonthlyCycle: React.FC = () => {
  const [runs, setRuns] = useState<MonthlyCycleRun[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchRuns = () => {
    setFetching(true);
    api.get<MonthlyCycleRun[]>('/admin/monthly-cycles')
      .then(setRuns)
      .catch((err) => console.warn('Could not load monthly cycles:', err))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    fetchRuns();
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`Execute simulated monthly cycle for ${selectedMonth}? This will distribute 5% ROI and credit 5% principal to all qualified active deposits.`)) return;

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

  const headerActions = (
    <button
      onClick={fetchRuns}
      title="Refresh cycle execution history"
      className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin text-gold-400' : ''}`} />
    </button>
  );

  return (
    <AdminLayout
      title="Monthly Cycle Allocation Simulator"
      subtitle="Trigger and audit monthly 5% ROI distributions and 5% principal growth simulations across all confirmed deposits."
      actions={headerActions}
    >
      {/* Simulation Trigger Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <span>Simulate Periodic Interest & Principal Growth</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Idempotent monthly cycle runner: checks whether the specified month has already run, credits 5% return to wallets, and expands initial principal by 5%.
            </p>
          </div>

          <form onSubmit={handleRun} className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="month"
                required
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gold-gradient text-obsidian-950 font-bold px-5 py-2.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{loading ? 'Simulating...' : 'Execute Cycle'}</span>
            </button>
          </form>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-emerald-400/70 hover:text-emerald-300 font-bold">&times;</button>
          </div>
        )}
      </div>

      {/* Cycle History Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Historical Cycle Executions ({runs.length})</span>
        </h3>

        {fetching ? (
          <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading cycle records...</span>
          </div>
        ) : runs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No monthly cycles have been executed yet. Select a month and click 'Execute Cycle' above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Run Timestamp</th>
                  <th className="py-3 px-3">Month Key</th>
                  <th className="py-3 px-3 text-right">Deposits Evaluated</th>
                  <th className="py-3 px-3 text-right">Total ROI Credited</th>
                  <th className="py-3 px-3 text-right">Principal Added</th>
                  <th className="py-3 px-3 text-right">Execution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(r.executed_at)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-gold-500/20 text-gold-300 font-bold">
                        {r.month_key}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {r.total_eligible_deposits} active deposits
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono text-sm">
                      ${r.total_roi_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gold-300 font-mono text-sm">
                      ${r.total_principal_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
