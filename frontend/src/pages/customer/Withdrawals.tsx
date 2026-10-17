import React, { useState, useEffect } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Withdrawal as WithdrawalType } from '../../types';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const Withdrawals: React.FC = () => {
  const { wallet, refreshProfile } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [payoutMethod, setPayoutMethod] = useState('SWIFT_WIRE');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchWithdrawals = () => {
    api.get<WithdrawalType[]>('/customer/withdrawals')
      .then(setWithdrawals)
      .catch((err) => console.warn('Could not fetch withdrawals:', err));
  };

  useEffect(() => {
    fetchWithdrawals();
    refreshProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const available = (wallet?.total_balance_cents || 0) / 100;
    if (amountUsd > available) {
      setError(`Insufficient balance. You have $${available.toFixed(2)} available.`);
      return;
    }

    setLoading(true);
    try {
      await api.post('/customer/withdrawals', {
        amount_usd: amountUsd,
        payout_method: payoutMethod,
        payout_details: payoutDetails.trim() || undefined,
      });
      setSuccess(`Withdrawal request of $${amountUsd.toFixed(2)} submitted for review.`);
      setPayoutDetails('');
      fetchWithdrawals();
      refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Withdrawal submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider">
          <ArrowUpRight className="w-3.5 h-3.5" /> Payout Request Workflow
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          Withdrawal Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Request payouts against your available balance. Each calendar month permits one active withdrawal request.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Withdrawal Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Available Balance</span>
              <span className="text-2xl font-display font-bold text-gold-gradient">
                {formatMoney(wallet?.total_balance_cents)}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">USD</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Withdrawal Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  min="20"
                  max="50000"
                  step="10"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Payout Rail
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="SWIFT_WIRE">USD International Fedwire / SWIFT</option>
                <option value="USD_DIGITAL_CUSTODY">USD Digital Reserve Settlement (1:1 USD)</option>
                <option value="BANK_CLEARING">USD Prime Bank Clearing Desk (ACH / Domestic)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                USD Destination Details
              </label>
              <textarea
                rows={2}
                required
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                placeholder="Beneficiary USD Account Number / ABA Routing / Fedwire Bank Details"
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 resize-none font-mono"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>MONTHLY LIMIT POLICY:</span>
              </div>
              <p>Clients may submit one active request per calendar month. Requests require admin approval before debiting your ledger.</p>
            </div>

            <button
              type="submit"
              disabled={loading || (wallet?.total_balance_cents || 0) < 2000}
              className="w-full bg-gold-gradient text-obsidian-950 font-bold py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Submitting Request...' : 'Submit Withdrawal Request'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Withdrawal State Machine & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" /> State Machine Governance
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every withdrawal request triggers strict server-side validation. Approved requests deduct balances in prioritized order: Direct Bonus → Level Commissions → Monthly ROI → Principal Credits → Original Principal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">1. Pending Review</span>
                <p className="text-slate-300 mt-1">Submitted & queued for administrator approval.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">2. Approved</span>
                <p className="text-slate-300 mt-1">Debited from ledger with immutable audit reference.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">3. Rejected</span>
                <p className="text-slate-300 mt-1">Declined with recorded reason; balance intact.</p>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white">Withdrawal History & Audits</h3>

            {withdrawals.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No withdrawal requests on record.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Rail</th>
                      <th className="py-2.5 px-3">Review Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 text-slate-400">{formatDateTime(w.created_at)}</td>
                        <td className="py-2.5 px-3 text-slate-300">{w.month_key}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{formatMoney(w.amount_cents)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : w.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {w.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {w.status === 'pending' && <Clock className="w-3 h-3" />}
                            {w.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            <span>{w.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">{w.payout_method}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">
                          {w.rejection_reason || (w.reviewed_at ? `Approved ${formatDateTime(w.reviewed_at)}` : 'Awaiting review')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
