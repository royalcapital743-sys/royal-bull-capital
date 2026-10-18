import React, { useEffect, useState } from 'react';
import { api, formatMoney, formatDateTime } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { LedgerEntry } from '../../types';
import { CustomerLayout } from '../../components/CustomerLayout';
import { 
  Shield, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search,
  Layers,
  Award,
  TrendingUp,
  Download
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const { wallet, refreshProfile } = useAuth();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    refreshProfile();
    api.get<LedgerEntry[]>('/customer/ledger')
      .then(setLedger)
      .catch((err) => console.warn('Could not fetch ledger:', err));
  }, []);

  const filtered = ledger.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.entry_type.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.entry_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <CustomerLayout
      title="Wallet Accounts & Ledger Explorer"
      subtitle="Inspect your segregated wallet balance buckets and auditable transaction history."
    >
      {/* Segregated Wallet Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 relative overflow-hidden shadow-lg">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Total Available Balance</span>
          <span className="text-3xl font-display font-black text-amber-700 dark:text-gold-gradient mt-1 block">
            {formatMoney(wallet?.total_balance_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 block">Combined withdrawable funds</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Original Principal</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block">
            {formatMoney(wallet?.original_principal_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Funds from verified deposits</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Principal Growth Credits</span>
          <span className="text-2xl font-bold font-mono text-amber-700 dark:text-gold-300 block">
            {formatMoney(wallet?.principal_credits_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">5% monthly simulated addition</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Monthly ROI Yield</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
            {formatMoney(wallet?.roi_balance_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">5% monthly return on deposit</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Direct Sponsor Bonus</span>
          <span className="text-2xl font-bold font-mono text-amber-700 dark:text-gold-400 block">
            {formatMoney(wallet?.direct_bonus_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">5% on direct referrals</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-1 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">10-Tier Network Commissions</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300 block">
            {formatMoney(wallet?.level_commission_cents)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Cascading downline earnings</span>
        </div>
      </div>

      {/* Ledger Explorer */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Transaction Ledger</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Chronological immutable transaction stream</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search description..."
                className="bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Entry Types</option>
              <option value="deposit">Deposits</option>
              <option value="direct_bonus">Direct Bonus</option>
              <option value="level_commission">Level Commissions</option>
              <option value="roi_credit">ROI Credits</option>
              <option value="principal_credit">Principal Credits</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No ledger entries matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                {filtered.map((item) => {
                  const isCredit = item.amount_cents >= 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDateTime(item.created_at)}</td>
                      <td className="py-3 px-3 text-slate-500 font-bold">{item.id?.slice(0, 8)}</td>
                      <td className="py-3 px-3">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                          {item.entry_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-300 font-sans">{item.description}</td>
                      <td className={`py-3 px-3 text-right font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isCredit ? '+' : ''}{formatMoney(item.amount_cents)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-bold">
                        {formatMoney(item.balance_after_cents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
