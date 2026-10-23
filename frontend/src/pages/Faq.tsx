import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Cpu, ShieldCheck, DollarSign, Layers } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  cat: string;
}

const FAQ_DATA: FaqItem[] = [
  // 1. Platform & AI Algo Trading
  {
    cat: 'AI Algo Trading',
    q: 'What is AI Algo Trading and how does it operate?',
    a: 'AI Algo Trading refers to automated, quantitative trading systems that analyze real-time market data, identify statistical price discrepancies, and execute trades according to pre-programmed algorithms. It operates 24/5 across global forex sessions, eliminating human emotional bias and executing orders with millisecond discipline.'
  },
  {
    cat: 'AI Algo Trading',
    q: 'What are the four stages of Royal Bull Capital’s 24/5 Automated Trading Lifecycle?',
    a: 'The trading lifecycle consists of: (1) Data Ingestion — continuous collection of market ticks, order flow, macroeconomic data, and liquidity signals; (2) Signal Generation — quantitative models calculating high-probability trade setups; (3) Execution — low-latency order routing with smart slippage control; and (4) Monitoring — 24/5 continuous risk surveillance, dynamic stop-loss governance, and drawdown limits.'
  },
  {
    cat: 'Forex Market',
    q: 'What makes Forex the world’s premier trading opportunity?',
    a: 'With over $7.5 Trillion in daily global turnover (as reported by the Bank for International Settlements), the foreign exchange market is the most liquid financial asset class in the world. It operates 24 hours a day, 5 days a week across major financial centers (Sydney, Tokyo, London, and New York), providing deep order book depth, minimal slippage, and diverse currency pairs.'
  },
  // 2. Business Model & Revenue
  {
    cat: 'Business Model',
    q: 'How does Royal Bull Capital generate revenue?',
    a: 'Royal Bull Capital’s sustainable business model is built on verified commercial streams: (1) Algorithmic trading margins captured across global forex market volatility; (2) Forex spread differentials and volume rebates through institutional liquidity partnerships; and (3) Platform technology management fees for maintaining ledger infrastructure, security, and administrative governance.'
  },
  {
    cat: 'Business Model',
    q: 'Are returns or capital protection guaranteed?',
    a: 'No. Royal Bull Capital does not advertise or promise guaranteed returns, risk-free trading, or capital guarantees. Foreign exchange and algorithmic trading involve real market risk, including the possible loss of capital. Monthly simulation cycles and performance allocations reflect programmatic model rules rather than guaranteed historical results.'
  },
  // 3. Referral & Commission Hierarchy
  {
    cat: '10-Tier Referral Program',
    q: 'What is the breakdown of the 10-tier commission cascade?',
    a: 'The 10-tier commission hierarchy allocates 80.00% across downline depth: Tier 1: 20%, Tier 2: 15%, Tier 3: 10%, Tier 4: 8%, Tier 5: 7%, Tier 6: 6%, Tier 7: 5%, Tier 8: 4%, Tier 9: 3%, Tier 10: 2%. In addition, an immediate 5.00% Direct Sponsor Bonus is credited on every directly introduced deposit, bringing the total distribution pool to 85.00%.'
  },
  {
    cat: '10-Tier Referral Program',
    q: 'What is required to become "Qualified" for 10-tier commissions?',
    a: 'To receive commissions from Tiers 1 through 10, an account must have at least two (2) direct active referrals who have funded confirmed deposits of at least $100 USD. The 5.00% direct sponsor bonus, however, is credited immediately without requiring tier qualification.'
  },
  {
    cat: '10-Tier Referral Program',
    q: 'Can referral qualification or commission calculations be manipulated in the browser?',
    a: 'No. Royal Bull Capital operates under a strict server-authoritative architecture. The backend validates tree lineage, deposit confirmations, and qualification status dynamically for every event using an immutable double-entry ledger. Modifying browser state has zero effect on account balances or commission eligibility.'
  },
  // 4. Monthly Cycles & Withdrawals
  {
    cat: 'Monthly Performance',
    q: 'How does the monthly ROI and principal credit simulation function?',
    a: 'Eligible deposits receive programmatic allocations of 5% monthly ROI and 5% principal credit expansion. Each cycle execution is locked by a unique idempotency key (depositId_monthKey) to mathematically prevent duplicate credits per calendar month. Accounts are subject to a 3-month tenure threshold for early principal withdrawal.'
  },
  {
    cat: 'Withdrawals & Rules',
    q: 'What are the platform’s withdrawal rules and limits?',
    a: 'Withdrawals have a $20 USD minimum and a $50,000 USD maximum per request. Each client account is permitted one (1) withdrawal submission per calendar month. All requests undergo administrative review and compliance checks before ledger deduction and wire disbursement.'
  },
  // 5. Security & Technology
  {
    cat: 'Security & Governance',
    q: 'How are client assets, accounts, and credentials protected?',
    a: 'User passwords are encrypted with salted Argon2id/bcrypt cryptographic hashing before database persistence. Sessions use short-lived JWT access tokens and secure rotatable refresh tokens. Every financial transaction is tracked with cryptographic idempotency hashes, balanced ledger journal entries, and comprehensive administrative audit logs.'
  }
];

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'AI Algo Trading', 'Forex Market', 'Business Model', '10-Tier Referral Program', 'Monthly Performance', 'Withdrawals & Rules', 'Security & Governance'];

  const filteredFaqs = selectedCat === 'All' 
    ? FAQ_DATA 
    : FAQ_DATA.filter((item) => item.cat === selectedCat);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-gold-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Platform Reference</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          Clear, transparent answers regarding our AI algo trading lifecycle, forex market access, 10-tier compensation plan, revenue model, and operational rules.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCat(cat);
              setOpenIdx(null);
            }}
            className={`text-xs px-4 py-2 rounded-xl transition-all font-semibold ${
              selectedCat === cat
                ? 'bg-amber-500 dark:bg-gold-500 text-obsidian-950 shadow-sm'
                : 'bg-slate-100 dark:bg-obsidian-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-850 border border-slate-200 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors hover:border-gold-500/25 shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-gold-400 shrink-0 w-fit">
                    {item.cat}
                  </span>
                  <span>{item.q}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-amber-600 dark:text-gold-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-white/5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-obsidian-900/40">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transparent Disclaimer */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 text-xs text-slate-700 dark:text-amber-200 space-y-2">
        <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-gold-400">
          Legal Risk Notice
        </span>
        <p className="leading-relaxed">
          The information contained in this FAQ is provided for informational and platform operational clarity. Trading foreign exchange and participating in algorithmic systems involves financial risk, including the possible loss of capital. Before using the platform, participants should thoroughly review our Risk Disclosure and Terms & Conditions.
        </p>
      </div>

    </div>
  );
};
