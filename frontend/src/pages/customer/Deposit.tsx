import React, { useState, useEffect } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Deposit as DepositType } from '../../types';
import { CustomerLayout } from '../../components/CustomerLayout';
import { 
  Wallet, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldAlert, 
  Info,
  DollarSign
} from 'lucide-react';

export const Deposit: React.FC = () => {
  const { refreshProfile } = useAuth();
  const [amountUsd, setAmountUsd] = useState<number>(500);
  const [note, setNote] = useState('');
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchDeposits = () => {
    api.get<DepositType[]>('/customer/deposits')
      .then(setDeposits)
      .catch((err) => console.warn('Could not fetch deposits:', err));
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (amountUsd < 100) {
      setError('Minimum deposit is $100.00 USD.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/customer/deposits', {
        amount_usd: amountUsd,
        note: note.trim() || undefined,
      });
      setSuccess(`Deposit request of $${amountUsd.toFixed(2)} USD created successfully. Awaiting compliance review.`);
      setNote('');
      fetchDeposits();
      refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Deposit submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout
      title="Deposit USD Funds"
      subtitle="Submit an incoming institutional deposit ($100 minimum) to fund your wallet and activate network tiers."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deposit Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-xl relative">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600 dark:text-gold-400" /> New Deposit Request
          </h2>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Deposit Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  min="100"
                  step="10"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-gold-500"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[100, 500, 1000, 5000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmountUsd(quick)}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-obsidian-900 hover:bg-slate-200 dark:hover:bg-obsidian-800 border border-slate-200 dark:border-white/5 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold transition-colors"
                  >
                    ${quick}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Reference / Transaction Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Wire Transfer Ref #RB-7890"
                className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
              <p className="font-semibold text-amber-700 dark:text-gold-400">DEPOSIT POLICY:</p>
              <p>Minimum deposit is $100.00. Deposits initially appear as "Pending" until approved and verified by administrators.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-gradient text-obsidian-950 font-bold py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Submitting...' : 'Submit Deposit Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Deposit Flow Instructions & Wire Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600 dark:text-gold-400" /> Wire & Settlement Instructions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Institutional wire transfers and settlement requests are reviewed by platform administrators for compliance and ledger crediting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Beneficiary Name</span>
                <span className="text-slate-900 dark:text-white font-bold">Royal Bull Capital Ltd</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Routing / SWIFT Code</span>
                <span className="text-amber-700 dark:text-gold-400 font-bold">RBCALXXXXXX</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Min Deposit Threshold</span>
                <span className="text-slate-900 dark:text-white font-bold">$100.00 USD</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification Method</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Administrative Review</span>
              </div>
            </div>
          </div>

          {/* History of Deposits Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Deposit Request History</h3>

            {deposits.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No deposit requests submitted yet. Submit your first deposit using the form.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Deposit ID</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Confirmed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                    {deposits.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{formatDateTime(d.created_at)}</td>
                        <td className="py-2.5 px-3 text-slate-800 dark:text-slate-300 font-semibold">{d.id?.slice(0, 8)}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-700 dark:text-gold-300">{formatMoney(d.amount_cents)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            d.status === 'confirmed' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : d.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                          }`}>
                            {d.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                            {d.status === 'pending' && <Clock className="w-3 h-3" />}
                            {d.status === 'failed' && <XCircle className="w-3 h-3" />}
                            <span>{d.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{d.confirmed_at ? formatDateTime(d.confirmed_at) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
