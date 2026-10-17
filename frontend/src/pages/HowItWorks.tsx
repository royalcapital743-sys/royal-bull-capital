import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Wallet, Share2, Award, TrendingUp, CreditCard, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Registration & Sponsor Linking',
      desc: 'Create an account using an active partner’s referral link (or direct). Your account is assigned an encrypted unique referral code and an individual wallet account immediately.'
    },
    {
      num: '02',
      icon: Wallet,
      title: 'Institutional Deposit Funding',
      desc: 'Submit a deposit request ($100 minimum). Your wire is reviewed and confirmed by an administrator, immediately crediting your balance in the immutable ledger.'
    },
    {
      num: '03',
      icon: Award,
      title: 'Direct Referral Bonus Payout',
      desc: 'Whenever anyone you directly introduce completes a funded deposit, you receive an immediate 5.00% direct sponsor bonus credited straight into your wallet ledger.'
    },
    {
      num: '04',
      icon: Share2,
      title: 'Unlock 10-Tier Qualification',
      desc: 'Once two (2) of your direct referrals complete successful funded deposits, your account achieves "Qualified" status, unlocking passive commissions across all 10 network tiers below you.'
    },
    {
      num: '05',
      icon: TrendingUp,
      title: 'Monthly ROI & Principal Growth',
      desc: 'Every month, simulated allocations of 5% monthly ROI and 5% principal credit expansion are credited to eligible deposits with strict duplicate-run prevention.'
    },
    {
      num: '06',
      icon: CreditCard,
      title: 'Request Simulated Payout',
      desc: 'Submit withdrawal requests against your available balance (once per calendar month). The administrator reviews and approves the payout, updating the authoritative ledger.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Step-By-Step Architecture</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          How Royal Bull Capital Operates
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          From registration to 10-tier multi-level network qualification and monthly cycle performance, here is the complete operational journey.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-gold-500/30 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-display font-black text-slate-700 group-hover:text-gold-500/40 transition-colors font-mono">
                  {s.num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Qualification Explainer Card */}
      <div className="bg-obsidian-900 border border-gold-500/30 p-8 sm:p-12 rounded-3xl max-w-4xl mx-auto space-y-6 shadow-2xl">
        <h3 className="text-2xl font-display font-bold text-white text-center">
          The Qualification Rule Explained
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-center max-w-2xl mx-auto">
          To ensure sustainable ecosystem integrity, Level 1 through Level 10 network commissions are only distributed to members who maintain an active qualification threshold.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/5 space-y-2">
            <span className="text-gold-400 font-bold text-sm block">Direct Referral Bonus (5%)</span>
            <p className="text-xs text-slate-400">
              Always unlocked! You receive 5% immediately on every direct referral's confirmed deposit regardless of your qualification tier.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-obsidian-850 border border-gold-500/20 space-y-2">
            <span className="text-gold-400 font-bold text-sm block">10-Tier Network Pool (80%)</span>
            <p className="text-xs text-slate-400">
              Requires 2 active direct referrals with verified deposits. Once met, all qualifying commissions from up to 10 ancestor generations flow into your ledger.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm"
        >
          <span>Open An Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
