import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { Deposit as DepositType } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  Check, 
  Copy, 
  Info,
  DollarSign
} from 'lucide-react';

export const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      ? 'Confirm this USD deposit? This will credit the user wallet and 5% direct sponsor bonus. 10-tier referral commissions are calculated on monthly ROI cycles.' 
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDeposits = deposits.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.id.toLowerCase().includes(q) ||
      d.user_name?.toLowerCase().includes(q) ||
      d.user_email?.toLowerCase().includes(q) ||
      d.note?.toLowerCase().includes(q)
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
          placeholder="Filter by ID, name, email..."
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
        {['pending', 'confirmed', 'failed', 'all'].map((st) => (
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
        onClick={fetchDeposits}
        title="Refresh deposits"
        className="p-2 rounded-xl bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold-400' : ''}`} />
      </button>
    </div>
  );

  return (
    <AdminLayout
      title="Deposit Review & Commission Desk"
      subtitle="Verify client deposit receipts. Confirming a deposit credits principal and 5% direct sponsor bonus."
      actions={headerActions}
    >
      {/* Notice Card */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-3">
        <Info className="w-4 h-4 shrink-0 text-blue-400" />
        <span>
          <strong>Automated Engine:</strong> When you confirm a deposit, the system atomically updates the investor's balance and credits the 5% direct sponsor bonus. The 10-tier referral commissions are calculated separately during the monthly cycle based on finalized downline ROI.
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
          <span>Displaying <strong>{filteredDeposits.length}</strong> deposit record{filteredDeposits.length === 1 ? '' : 's'} (Filter: <span className="uppercase text-gold-400 font-bold">{statusFilter}</span>)</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading deposit requests...</span>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No deposits found for filter "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Deposit ID</th>
                  <th className="py-3 px-3">Depositor</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Payment Note</th>
                  <th className="py-3 px-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(d.created_at)}</td>
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-obsidian-900 border border-white/10">
                        <span className="text-slate-300 font-bold">{d.id}</span>
                        <button
                          onClick={() => handleCopyId(d.id)}
                          title="Copy Deposit ID"
                          className="text-slate-500 hover:text-gold-400 transition-colors"
                        >
                          {copiedId === d.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-white">{d.user_name}</div>
                      <div className="text-[11px] text-slate-400">{d.user_email}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gold-300 font-mono text-sm">
                      {formatMoney(d.amount_cents)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 border ${
                        d.status === 'confirmed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : d.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {d.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {d.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                        {d.status === 'failed' && <XCircle className="w-3 h-3 text-red-400" />}
                        <span>{d.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans text-[11px] max-w-[200px] truncate">
                      {d.note || 'Simulated Wire / ACH'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {d.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2 font-sans">
                          <button
                            onClick={() => handleReview(d.id, true)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm active:scale-95"
                          >
                            Confirm Deposit
                          </button>
                          <button
                            onClick={() => handleReview(d.id, false)}
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
