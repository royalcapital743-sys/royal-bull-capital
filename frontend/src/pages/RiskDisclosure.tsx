import React from 'react';
import { AlertTriangle, ShieldAlert, Scale, Info, CheckCircle2, XCircle } from 'lucide-react';

export const RiskDisclosure: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" /> Risk Disclosure Notice
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
          Risk Disclosure Notice & Operating Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last revised: October 2026 · Royal Bull Capital Compliance & Risk Oversight Office
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
        
        {/* Callout Alert */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-gold-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-900 dark:text-gold-400">
              Crucial Notice Concerning Capital Risk:
            </span>
            <p className="text-xs leading-relaxed">
              Trading foreign exchange (Forex) and participating in automated algorithmic trading systems involves a high degree of risk to capital. You should not fund accounts or deploy capital that you cannot afford to lose.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">1.</span> Foreign Exchange (Forex) Market Risks
          </h2>
          <p>
            Foreign exchange trading involves volatile currency movements influenced by global macroeconomic releases, interest rate changes, geopolitical tensions, and central bank policy decisions. Leveraged trading carries asymmetric risk: leverage can magnify losses just as it can magnify gains. Market liquidity may contract sharply during major news events or weekend session rollovers, resulting in significant execution slippage.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">2.</span> Algorithmic & Quantitative Execution Risks
          </h2>
          <p>
            Algorithmic and quantitative trading models depend on historical data, mathematical probabilities, and technical pattern recognition. While algorithmic automation eliminates emotional bias, automated trading systems remain vulnerable to unpredictable market regimes, statistical anomalies, liquidity voids, and technological failure. Neither algorithmic trading nor automated trade monitoring can guarantee against portfolio drawdowns or capital loss.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">3.</span> Absence of Guaranteed Returns or Capital Protection
          </h2>
          <p>
            Royal Bull Capital strictly prohibits any representation that trading outcomes or affiliate incomes are guaranteed, risk-free, or backed by guaranteed capital protection. Any monthly return allocations (such as 5.00% monthly ROI or 5.00% principal growth) described on the website or in platform settings represent programmatic execution models subject to system rules, rather than guaranteed fixed income. Past performance or simulated results do not guarantee future performance.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">4.</span> Multi-Tier Referral Compensation Governance
          </h2>
          <p>
            The 10-tier commission hierarchy (80.00% across 10 generations plus 5.00% direct sponsor bonus) is an incentive compensation structure paid exclusively upon verified deposits made by qualified downstream network members. Participation does not constitute an investment contract or guarantee of passive wealth. Earning multi-tier commissions requires maintaining active qualification (at least two direct funded referrals) and compliance with anti-fraud policies.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">5.</span> Technology, Network & Operational Risks
          </h2>
          <p>
            Platform operations rely on internet telecommunications, server infrastructure, cloud hosting facilities, and third-party liquidity providers. Interruptions in connectivity, hardware failure, power outages, software bugs, or network congestion may cause delays in deposit processing, trade execution, or ledger updates. Royal Bull Capital employs enterprise security and double-entry accounting to protect against state corruption, but cannot guarantee uninterrupted or error-free continuous service.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">6.</span> Independent Financial & Legal Advice
          </h2>
          <p>
            Royal Bull Capital does not provide personal financial, investment, legal, or tax advice. No information on this website or in promotional materials should be construed as financial advice or an offer to solicit investments. Before deploying capital or engaging in network expansion, participants should seek advice from independent, licensed financial, tax, and legal professionals.
          </p>
        </section>

      </div>
    </div>
  );
};
