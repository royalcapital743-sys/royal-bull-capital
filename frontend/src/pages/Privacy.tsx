import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Data Protection</span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last revised: October 2026 · Royal Bull Capital
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect account registration details (such as your full name, email address, encrypted password hash, and assigned referral relationships) and server telemetry (such as IP addresses, login timestamps, and audit event logs).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Password & Credential Security</h2>
          <p>
            We do not store passwords in plaintext. All customer and administrator credentials are cryptographically hashed using salted Argon2id/bcrypt algorithms before storage. We use industry-standard HTTPS and JSON Web Tokens (JWT) for secure authentication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. How Information is Used</h2>
          <p>
            Collected information is used exclusively to operate the application, accurately attribute multi-tier referral commissions, maintain user wallet balances, and enforce role-based security permissions. We do not sell or monetize personal data to third parties.
          </p>
        </section>
      </div>
    </div>
  );
};
