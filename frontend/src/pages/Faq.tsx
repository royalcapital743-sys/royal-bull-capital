import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  cat: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    cat: 'Platform Overview',
    q: 'How does Royal Bull Capital manage funds and commissions?',
    a: 'Royal Bull Capital utilizes an immutable double-entry ledger system. All deposit events, 10-level commission splits, and monthly return cycles are computed server-side with cryptographic transaction hashes.'
  },
  {
    cat: 'Referral & Commission',
    q: 'What is the breakdown of the 10-tier commission plan?',
    a: 'Level 1: 20%, Level 2: 15%, Level 3: 10%, Level 4: 8%, Level 5: 7%, Level 6: 6%, Level 7: 5%, Level 8: 4%, Level 9: 3%, Level 10: 2%. The sum of these 10 tiers is 80%. An additional 5% is allocated as a direct sponsor bonus, bringing the total allocation pool to 85%.'
  },
  {
    cat: 'Referral & Commission',
    q: 'What is required to become "Qualified" for 10-level commissions?',
    a: 'A user must have at least two (2) direct active referrals who have completed confirmed deposits of at least $100. Once qualified, the user automatically receives commissions whenever downline members down to 10 generations make qualifying deposits.'
  },
  {
    cat: 'Referral & Commission',
    q: 'Can a user manipulate or fake their qualification in the browser?',
    a: 'No. The platform is completely server-authoritative. The backend validates the downline DAG tree and confirmed deposit status dynamically during every event. Changing browser storage or client state has zero effect on calculations.'
  },
  {
    cat: 'Monthly Performance',
    q: 'How does the monthly ROI and principal credit simulation work?',
    a: 'The system includes a monthly allocation engine configured for 5% monthly ROI and 5% principal credit growth. Each deposit is uniquely hashed per calendar month (depositId_monthKey) to guarantee that running the cycle multiple times cannot duplicate credits.'
  },
  {
    cat: 'Withdrawals',
    q: 'What are the withdrawal rules on the platform?',
    a: 'Withdrawals have a $20 minimum and a $50,000 maximum. Each client is allowed one withdrawal request per calendar month. Requests require administrator review and approval before funds are debited from the ledger.'
  },
  {
    cat: 'Account & Security',
    q: 'How are passwords and credentials protected?',
    a: 'Passwords are encrypted using Argon2id/bcrypt cryptographic hashing with salts before database persistence. Sessions are secured via short-lived JWT access tokens and rotatable refresh tokens.'
  }
];

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Knowledge Base</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-light">
          Everything you need to know about Royal Bull Capital's referral engine, accounting logic, and simulation rules.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-gold-500/25"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-mono px-2.5 py-1 rounded-md bg-obsidian-900 border border-white/5 text-gold-400 shrink-0">
                    {item.cat}
                  </span>
                  <span>{item.q}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-gold-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed bg-obsidian-900/40">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
