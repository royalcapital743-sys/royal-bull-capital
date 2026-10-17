import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { Deposit as DepositType } from '../../types';
import { Wallet, CheckCircle2, XCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchDeposits = () => {
    setLoading(true);
    api.get<DepositType[]>(`/admin/deposits${statusFilter !== 'all' ? `?status_filter=${statusFilter}` : ''}`)
      .then(setDeposits)
      .catch((err) => console.warn('Could not fetch deposits:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const handleReview = async (depositId: string, success: boolean) => {
    const promptText = success 
      ? 'Confirm this deposit? This will credit the depositor and automatically trigger 10-tier referral commissions.' 
      : 'Reject this deposit as failed?';
    if (!window.confirm(promptText)) return;

    try {
      const res = await api.post<{ message: string; commissions_count?: number }>(`/admin/deposits/${depositId}/review`, {
        success,
        rejection_reason: success ? undefined : 'Declined during administrative verification.',
      });
      setActionMessage(res.message);
      fetchDeposits();
    } catch (err: any) {
      alert(err.message || 'Review action failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-2 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Deposit Review & Commission Trigger Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review incoming simulated deposits. Approvals immediately execute the 10-level commission cascade.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {['pending', 'confirmed', 'failed', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                statusFilter === st
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                  : 'bg-obsidian-900 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        {deposits.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No deposits found for filter "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Deposit ID</th>
                  <th className="py-3 px-3">Depositor Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reference / Note</th>
                  <th className="py-3 px-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {deposits.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(d.created_at)}</td>
                    <td className="py-3 px-3 text-slate-400 font-bold">{d.id}</td>
                    <td className="py-3 px-3 font-semibold text-white font-sans">{d.user_name}</td>
                    <td className="py-3 px-3 text-slate-400 font-sans">{d.user_email}</td>
                    <td className="py-3 px-3 text-right font-bold text-gold-300">{formatMoney(d.amount_cents)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        d.status === 'confirmed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : d.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {d.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                        {d.status === 'pending' && <Clock className="w-3 h-3" />}
                        {d.status === 'failed' && <XCircle className="w-3 h-3" />}
                        <span>{d.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">{d.note || '—'}</td>
                    <td className="py-3 px-3 text-right">
                      {d.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleReview(d.id, true)}
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                          >
                            Confirm Deposit
                          </button>
                          <button
                            onClick={() => handleReview(d.id, false)}
                            className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans">Resolved</span>
                      )}
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
