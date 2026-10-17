import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { Withdrawal as WithdrawalType } from '../../types';
import { ArrowUpRight, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchWithdrawals = () => {
    api.get<WithdrawalType[]>(`/admin/withdrawals${statusFilter !== 'all' ? `?status_filter=${statusFilter}` : ''}`)
      .then(setWithdrawals)
      .catch((err) => console.warn('Could not load withdrawals:', err));
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const handleReview = async (id: string, approve: boolean) => {
    let reason: string | undefined = undefined;
    if (!approve) {
      const inputReason = window.prompt('Enter rejection reason:');
      if (inputReason === null) return;
      reason = inputReason.trim() || 'Declined during compliance check.';
    } else {
      if (!window.confirm('Approve this withdrawal? The amount will be deducted from the client ledger.')) return;
    }

    try {
      const res = await api.post<{ message: string }>(`/admin/withdrawals/${id}/review`, {
        approve,
        rejection_reason: reason,
      });
      setActionMessage(res.message);
      fetchWithdrawals();
    } catch (err: any) {
      alert(err.message || 'Review failed.');
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
            Withdrawal Request Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review and approve customer payout requests. Approvals atomically update client ledgers.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((st) => (
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
        {withdrawals.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No withdrawals found for status "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Payout Destination</th>
                  <th className="py-3 px-3">Audit / Rejection</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(w.created_at)}</td>
                    <td className="py-3 px-3 font-semibold text-white font-sans">{w.user_name}</td>
                    <td className="py-3 px-3 text-slate-300">{w.month_key}</td>
                    <td className="py-3 px-3 text-right font-bold text-white">${w.amount_usd.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
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
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {w.payout_details || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                      {w.rejection_reason || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleReview(w.id, true)}
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(w.id, false)}
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
