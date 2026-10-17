import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const RiskDisclosure: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" /> Regulatory Notice
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Risk Disclosure & Operating Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last revised: October 2026 · Royal Bull Capital Compliance Office
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-gold-400" /> 1. Capital Risk & Operations
          </h2>
          <p>
            Royal Bull Capital operates under an immutable ledger infrastructure. All deposits, commissions, returns, and withdrawals are subject to authoritative administrative verification, KYC validation, and governance thresholds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Forex Trading & High-Risk Nature</h2>
          <p>
            Trading foreign exchange (Forex) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange or participate in any commercial implementation of this software, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Performance & Monthly Return Rules</h2>
          <p>
            The 5.00% monthly return and 5.00% additional principal credit functions provided within this application are programmatic execution models governed by system rules. They are subject to administrative cycle execution and strict monthly idempotency locks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Multi-Tier Referral Compensation Governance</h2>
          <p>
            The 10-level commission hierarchy (80% multi-tier distribution + 5% direct bonus) represents an active institutional compensation model. Participation requires maintaining active qualification (at least 2 funded direct referrals) and adhering to platform compliance standards.
          </p>
        </section>
      </div>
    </div>
  );
};
