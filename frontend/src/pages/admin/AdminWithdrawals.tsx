import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { Withdrawal as WithdrawalType } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle,
  Info 
} from 'lucide-react';

export const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDetailId, setCopiedDetailId] = useState<string | null>(null);

  const handleCopyDetails = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDetailId(id);
    setTimeout(() => setCopiedDetailId(null), 2000);
  };

  const fetchWithdrawals = () => {
    setLoading(true);
    api.get<WithdrawalType[]>(`/admin/withdrawals${statusFilter !== 'all' ? `?status_filter=${statusFilter}` : ''}`)
      .then(setWithdrawals)
      .catch((err) => console.warn('Could not load withdrawals:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const handleReview = async (id: string, approve: boolean) => {
    let reason: string | undefined = undefined;
    if (!approve) {
      const inputReason = window.prompt('Enter rejection reason for customer notification:');
      if (inputReason === null) return;
      reason = inputReason.trim() || 'Declined during compliance check.';
    } else {
      if (!window.confirm('Approve this withdrawal? The specified amount will be permanently deducted from the client ledger buckets.')) return;
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.id.toLowerCase().includes(q) ||
      w.user_name?.toLowerCase().includes(q) ||
      w.payout_method?.toLowerCase().includes(q) ||
      w.payout_details?.toLowerCase().includes(q)
    );
  });

  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by ID, name, destination..."
          className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
          >
            &times;
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-obsidian-900/60 p-1 rounded-xl border border-white/10">
        {['pending', 'approved', 'rejected', 'all'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
              statusFilter === st
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <button
        onClick={fetchWithdrawals}
        title="Refresh withdrawals"
        className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-400' : ''}`} />
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Withdrawal Request Desk"
      subtitle="Review client payout requests. Approvals atomically deduct prioritized wallet buckets in the ledger."
      actions={headerActions}
    >
      {/* Compliance Note */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Early Withdrawal Notice:</strong> Principal withdrawals on accounts younger than 3 months are subject to administrative review. Wallet deductions prioritize ROI and commission profits before touching principal.
        </span>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400/70 hover:text-emerald-300 font-bold">&times;</button>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
          <span>Displaying <strong>{filteredWithdrawals.length}</strong> withdrawal request{filteredWithdrawals.length === 1 ? '' : 's'}</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading withdrawal requests...</span>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No withdrawal requests found for filter "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date Requested</th>
                  <th className="py-3 px-3">Withdrawal ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3 text-right">Requested USD</th>
                  <th className="py-3 px-3">Method & Destination</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(w.created_at)}</td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-obsidian-900 border border-white/10">
                        <span className="text-slate-300 font-bold">{w.id}</span>
                        <button
                          onClick={() => handleCopyId(w.id)}
                          title="Copy Withdrawal ID"
                          className="text-slate-500 hover:text-gold-400 transition-colors"
                        >
                          {copiedId === w.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-white">
                      {w.user_name || 'Client Account'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300 font-mono text-sm">
                      {formatMoney(w.amount_cents)}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {w.payout_method === 'BINANCE_PAY' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30">
                            🟡 Binance Pay
                          </span>
                        ) : (
                          <span className="text-slate-200 font-semibold uppercase text-[11px]">{w.payout_method}</span>
                        )}
                      </div>

                      {w.payout_details ? (
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          {w.payout_details.startsWith('http://') || w.payout_details.startsWith('https://') ? (
                            <a
                              href={w.payout_details}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-gradient text-obsidian-950 font-black text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-sm"
                              title="Open client's Binance Pay link directly to pay"
                            >
                              <span>Pay on Binance</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-300 font-mono bg-obsidian-900 px-2 py-0.5 rounded border border-white/5 max-w-[200px] truncate block">
                              {w.payout_details}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopyDetails(w.id, w.payout_details!)}
                            title="Copy payment link / ID"
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-gold-400 transition-colors"
                          >
                            {copiedDetailId === w.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 mt-1">—</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 border ${
                        w.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : w.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {w.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {w.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                        {w.status === 'rejected' && <XCircle className="w-3 h-3 text-red-400" />}
                        <span>{w.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleReview(w.id, true)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm active:scale-95"
                          >
                            Approve Payout
                          </button>
                          <button
                            onClick={() => handleReview(w.id, false)}
                            className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans font-semibold">Resolved</span>
                      )}
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
