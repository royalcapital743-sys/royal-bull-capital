import React from 'react';
import { ShieldCheck, FileText, AlertTriangle, Scale, Lock, DollarSign } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-amber-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Terms of Service & Operational Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
          Terms of Service & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last revised: October 2026 · Royal Bull Capital Compliance & Governance Office
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">1.</span> Acceptance of Terms & Eligibility
          </h2>
          <p>
            By registering an account, accessing, or using the Royal Bull Capital platform, you affirm that you are at least 18 years of age (or the legal age of majority in your jurisdiction), legally competent to enter into binding agreements, and not located in any restricted or sanctioned territory. If you do not agree to every provision contained herein, you must immediately cease all access and use of the platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">2.</span> Investment & Deposit Rules
          </h2>
          <p>
            The platform enforces a minimum deposit requirement of <strong>$100.00 USD</strong>. All incoming deposit requests are subject to administrative review and verification before funds are credited to the user's ledger under the Original Principal bucket. Deposits are denominated and tracked in USD integer cents with exact decimal precision. The platform does not accept anonymous or third-party funding.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">3.</span> 10-Tier Commission Plan & Qualification Rules
          </h2>
          <p>
            Royal Bull Capital operates an institutional 10-tier commission distribution hierarchy plus an upfront Direct Sponsor Bonus:
          </p>
          <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-700 dark:text-slate-300">
            <li><strong>Direct Sponsor Bonus (5.00%):</strong> Credited immediately to the direct sponsor upon deposit confirmation, with no tier qualification required.</li>
            <li><strong>10-Tier Network Pool (80.00% Total):</strong> Distributed across ancestral lineage (Tier 1: 20%, Tier 2: 15%, Tier 3: 10%, Tier 4: 8%, Tier 5: 7%, Tier 6: 6%, Tier 7: 5%, Tier 8: 4%, Tier 9: 3%, Tier 10: 2%).</li>
            <li><strong>Qualification Standard:</strong> To receive commissions from Tiers 1 through 10, an account must maintain at least <strong>two (2) active direct referrals</strong> with verified deposits of at least $100 USD. Sponsoring dormant, unfunded, or circular accounts does not confer qualification.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">4.</span> Monthly Allocation Cycles & Account Thresholds
          </h2>
          <p>
            Active deposits are eligible for programmatic monthly simulation cycles providing 5.00% monthly ROI and 5.00% principal credit expansion. Each cycle execution is governed by a unique calendar-month idempotency key to prevent duplicate allocations. Deposits are subject to a <strong>3-month tenure threshold</strong> for early principal withdrawal in accordance with system liquidity governance.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">5.</span> Withdrawal Rules, Schedule & Administrative Review
          </h2>
          <p>
            Platform withdrawals are governed by strict operational guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-700 dark:text-slate-300">
            <li><strong>Minimum Withdrawal:</strong> $20.00 USD per request.</li>
            <li><strong>Maximum Withdrawal:</strong> $50,000.00 USD per request.</li>
            <li><strong>Withdrawal Schedule:</strong> Each client account is permitted <strong>one (1) withdrawal submission per calendar month</strong>.</li>
            <li><strong>Approval Process:</strong> All withdrawal submissions require administrative verification, KYC confirmation, and compliance review prior to ledger deduction and wire payout.</li>
            <li><strong>Administrative & Processing Charges:</strong> Applicable bank wire, network transfer, or administrative processing fees may be deducted from the gross payout as specified at the time of request.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">6.</span> Prohibited Conduct & Anti-Abuse Controls
          </h2>
          <p>
            Users agree not to: (a) create fictitious, duplicate, or circular accounts to exploit the referral tree; (b) attempt automated exploit scripts, SQL injection, or server parameter manipulation; (c) misrepresent expected returns or market guarantees to third parties; or (d) violate applicable anti-money laundering (AML) or sanctions laws. Accounts found engaging in abusive conduct will be permanently suspended and subject to commission forfeiture.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">7.</span> Absence of Financial Guarantees & Risk Notice
          </h2>
          <p>
            Royal Bull Capital provides software infrastructure and referral management tools. Foreign exchange (Forex) and algorithmic trading carry high levels of risk, including potential loss of invested capital. The platform does not offer guaranteed profits, fixed returns, or risk-free investment outcomes. All performance examples and calculators are illustrative simulations governed by configurable platform rules.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="font-mono text-amber-700 dark:text-gold-400">8.</span> Amendments & Governance
          </h2>
          <p>
            Royal Bull Capital reserves the right to modify these Terms and Conditions, platform parameters, and commission structures as required by legal, regulatory, or technical necessity. Continued use of the platform following any modifications constitutes full acceptance of the updated terms.
          </p>
        </section>

      </div>
    </div>
  );
};
