import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last revised: October 2026 · Royal Bull Capital
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or creating an account on the Royal Bull Capital platform, you agree to be bound by these Terms and Conditions. If you disagree with any portion of these terms, you must not use or access this platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Scope of Service & Platform Architecture</h2>
          <p>
            Royal Bull Capital provides software managing multi-generational commission attribution, deposit lifecycle, and server-side balance ledger management. All balance updates, transactions, and commission cascades are recorded in an authoritative ledger subject to administrative oversight and verification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. User Conduct & Prohibited Activities</h2>
          <p>
            Users agree not to: (a) attempt to reverse engineer, decompile, or attack the server infrastructure; (b) exploit race conditions or manipulate transaction tokens; (c) attempt self-referral or circular referral networks designed to abuse commission distribution algorithms; (d) misrepresent account balances or breach applicable trade regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Administrative Governance</h2>
          <p>
            Platform administrators reserve the right to review, suspend, or terminate accounts in violation of platform rules, adjust governance parameters, and maintain audit records.
          </p>
        </section>
      </div>
    </div>
  );
};
