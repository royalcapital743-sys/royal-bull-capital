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
  DollarSign,
  QrCode,
  Download,
  Maximize2,
  Copy,
  Check,
  Building,
  Sparkles
} from 'lucide-react';

export const Deposit: React.FC = () => {
  const { refreshProfile } = useAuth();
  const [amountUsd, setAmountUsd] = useState<number>(500);
  const [note, setNote] = useState('');
  const [deposits, setDeposits] = useState<DepositType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'wire'>('qr');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

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
      setSuccess(`Deposit request of $${amountUsd.toFixed(2)} USD submitted successfully. Once your payment verification is confirmed by the compliance desk, funds will be posted to your ledger.`);
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
      subtitle="Fund your investment wallet via instant USDT / Binance Pay QR code or institutional bank wire ($100 minimum)."
    >
      <div className="space-y-8">
        
        {/* Payment Method Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-obsidian-900/80 rounded-2xl border border-slate-200 dark:border-white/10 max-w-xl">
          <button
            type="button"
            onClick={() => setPaymentMethod('qr')}
            className={`flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-xs font-bold transition-all ${
              paymentMethod === 'qr'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-glow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>USDT / Binance Pay QR (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('wire')}
            className={`flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-xs font-bold transition-all ${
              paymentMethod === 'wire'
                ? 'bg-gold-gradient text-obsidian-950 shadow-gold-glow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Institutional Bank Wire</span>
          </button>
        </div>

        {/* Main Payment & Deposit Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: QR Code / Wire Info Panel (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            {paymentMethod === 'qr' ? (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300/80 dark:border-gold-500/30 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-amber-50/20 dark:from-obsidian-900 dark:via-obsidian-850 dark:to-obsidian-900 shadow-xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-[10px] font-bold text-amber-800 dark:text-gold-400 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-gold-400" />
                      <span>Instant Settlement QR</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                      Binance Pay / USDT
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">Transfer Amount</span>
                    <span className="text-lg font-mono font-black text-amber-700 dark:text-gold-300">
                      ${amountUsd.toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                {/* QR Code Presentation Box */}
                <div className="relative group text-center py-2">
                  <div className="inline-block p-4 rounded-3xl bg-white dark:bg-white border-4 border-amber-400 dark:border-gold-500 shadow-2xl shadow-amber-500/10 dark:shadow-gold-500/20">
                    <img 
                      src="/payment_qr.jpeg" 
                      alt="Binance Pay USDT QR Code" 
                      className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() => setShowQrModal(true)}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-4">
                    <a
                      href="/payment_qr.jpeg"
                      download="RoyalBull_Payment_QR.jpeg"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-800 hover:bg-slate-200 dark:hover:bg-obsidian-750 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                      <span>Save QR Code</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-800 hover:bg-slate-200 dark:hover:bg-obsidian-750 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                      <span>Enlarge View</span>
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Payment Instructions */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-300/80 dark:border-gold-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-gold-400 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                    How to Pay & Confirm Deposit:
                  </h4>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed font-sans">
                    <li>
                      <strong>Scan QR:</strong> Open your <strong>Binance App</strong> or crypto wallet and scan the QR code above.
                    </li>
                    <li>
                      <strong>Send Amount:</strong> Pay exactly <strong>${amountUsd.toFixed(2)} USDT</strong> (Minimum $100.00).
                    </li>
                    <li>
                      <strong>Once Payment is Complete:</strong> Copy your <strong>Binance Order ID / TxHash</strong> from your transfer receipt.
                    </li>
                    <li>
                      <strong>Confirm Request:</strong> Paste your TxID into the <strong>"Transaction ID / Note"</strong> box on the right and submit.
                    </li>
                  </ol>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-600 dark:text-gold-400" />
                    Institutional Wire Settlement
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Direct wire transfers are processed through institutional bank clearing desks and verified within standard banking hours.
                  </p>
                </div>

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
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Executive Jurisdiction</span>
                    <span className="text-slate-900 dark:text-white font-bold">Dubai, UAE</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification Method</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Compliance Desk</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <p>
                    <strong>Note:</strong> Once your wire transfer is initiated from your financial institution, submit your wire confirmation number in the form on the right.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Deposit Confirmation Form (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-xl relative">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-gold-400" /> 
                  Confirm Deposit Request
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Submit your deposit details after sending payment to initiate ledger verification.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Deposit Submitted!</span>
                    <span className="leading-relaxed block">{success}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Deposit Amount (USD / USDT)
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
                        className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono font-semibold transition-all ${
                          amountUsd === quick
                            ? 'bg-amber-500/20 border-amber-400 dark:border-gold-500 text-amber-800 dark:text-gold-400 font-bold'
                            : 'bg-slate-100 dark:bg-obsidian-900 hover:bg-slate-200 dark:hover:bg-obsidian-800 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        ${quick}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      {paymentMethod === 'qr' ? 'Transaction Hash / TxID / Order ID' : 'Wire Reference / Remittance ID'}
                    </label>
                    <span className="text-[10px] text-amber-700 dark:text-gold-400 font-medium">Once payment sent</span>
                  </div>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={paymentMethod === 'qr' ? 'e.g. Binance Order # or 0x4f92... TxID' : 'e.g. Wire Ref #RB-7890'}
                    className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Once payment is sent via {paymentMethod === 'qr' ? 'Binance QR code' : 'bank wire'}, enter your transaction reference above so administrators can verify and approve it immediately.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-obsidian-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                  <p className="font-semibold text-amber-700 dark:text-gold-400 uppercase tracking-wider">
                    Institutional Governance:
                  </p>
                  <p>
                    All deposits undergo strict double-entry verification. Once approved by administrators, your 5% monthly ROI tracking activates and referral commissions flow up to 10 ancestor generations.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-gradient text-obsidian-950 font-bold py-4 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Submitting...' : `Submit Deposit Request ($${amountUsd.toFixed(2)})`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Deposit Request History Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Deposit Request History
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Track status across pending review, approval, and ledger posting
            </span>
          </div>

          {deposits.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
              <p>No deposit requests submitted yet. Use the QR code or wire details above to fund your account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Deposit ID</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Reference / TxID</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Confirmed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                  {deposits.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{formatDateTime(d.created_at)}</td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-300 font-semibold">{d.id?.slice(0, 8)}</td>
                      <td className="py-3 px-3 font-bold text-amber-700 dark:text-gold-300">{formatMoney(d.amount_cents)}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">{d.note || '—'}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
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
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{d.confirmed_at ? formatDateTime(d.confirmed_at) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen QR Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white dark:bg-obsidian-900 border border-amber-400 dark:border-gold-500/50 p-6 sm:p-8 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 transition-all text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Scan to Pay USDT
            </h3>
            <div className="p-3 bg-white rounded-2xl border-2 border-amber-300 dark:border-gold-500 shadow-md inline-block">
              <img 
                src="/payment_qr.jpeg" 
                alt="Enlarged Binance Pay QR Code" 
                className="w-72 h-72 object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open your Binance App or crypto wallet to scan and complete payment.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-xs shadow-gold-glow"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </CustomerLayout>
  );
};
