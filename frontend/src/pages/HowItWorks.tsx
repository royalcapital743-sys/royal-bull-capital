import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Wallet, 
  Share2, 
  Award, 
  TrendingUp, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  BarChart3,
  DollarSign,
  Layers,
  Cpu
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Registration & Onboarding',
      desc: 'Create your account using a sponsor’s referral link (or direct). Your profile receives an encrypted unique referral code and an individual wallet account immediately.'
    },
    {
      num: '02',
      icon: Wallet,
      title: 'Institutional Deposit Funding',
      desc: 'Submit a deposit ($100 USD minimum). Upon administrative verification, funds are recorded in the authoritative double-entry ledger under your Original Principal bucket.'
    },
    {
      num: '03',
      icon: Award,
      title: 'Immediate Direct Sponsor Reward',
      desc: 'When anyone you directly sponsor completes a funded deposit, you receive an immediate 5.00% direct sponsor bonus credited directly into your wallet ledger.'
    },
    {
      num: '04',
      icon: Share2,
      title: '10-Tier Qualification Gate',
      desc: 'Introduce two (2) direct referrals who complete verified deposits to achieve "Qualified" status. This unlocks passive commission cascades across 10 network generations below you.'
    },
    {
      num: '05',
      icon: TrendingUp,
      title: 'Monthly Allocation Cycles',
      desc: 'Programmatically simulated 5% monthly return and 5% principal credit allocations are credited to active deposits with strict calendar-month duplicate prevention.'
    },
    {
      num: '06',
      icon: CreditCard,
      title: 'Scheduled Payout Processing',
      desc: 'Submit withdrawal requests against your available balance (1 per calendar month, $20 min). Administrators review and approve requests before ledger disbursement.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-gold-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>Verified Operational Lifecycle</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          How It Works — Platform Operations
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
          A transparent, step-by-step breakdown of how client accounts, deposit funding, 10-tier commission cascades, and monthly allocation cycles operate on Royal Bull Capital.
        </p>
      </div>

      {/* 2. Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div 
              key={s.num} 
              className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-gold-500/30 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-gold-400 border border-amber-300 dark:border-gold-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-display font-black text-slate-300 dark:text-slate-700 group-hover:text-amber-500 dark:group-hover:text-gold-500/40 transition-colors font-mono">
                  {s.num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Sustainable Business Model & Revenue Architecture (Adapted from Finway PPT Page 7) */}
      <div className="space-y-10 bg-slate-50/80 dark:bg-obsidian-900/60 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            REVENUE TRANSPARENCY
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            How the Business Model Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Sustainable revenue architecture derived strictly from verified commercial sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Algorithmic Trading Profits</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Core operating revenue generated from quantitative algorithmic models executing systematic trading strategies across global currency markets.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Forex Spreads & Execution</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Revenue captured through spread differentials and optimized trade execution routing through institutional liquidity venues and ECN bridges.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Liquidity Volume Rebates</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Volume-based rebates and strategic liquidity routing allowances earned through prime brokerage execution lines and clearing relationships.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center font-bold">
              04
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Platform Technology Services</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Software tooling, multi-tier referral tracking infrastructure, automated ledger operations, and administrative risk management facilities.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Qualification Explainer Card */}
      <div className="bg-slate-50 dark:bg-obsidian-900 border border-amber-300 dark:border-gold-500/30 p-8 sm:p-12 rounded-3xl max-w-4xl mx-auto space-y-6 shadow-xl">
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white text-center">
          The Qualification Rule Explained
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-center max-w-2xl mx-auto">
          To ensure economic sustainability and prevent dormant tree abuse, Level 1 through Level 10 network commissions are unlocked only when an account achieves verified qualification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-white/5 space-y-2">
            <span className="text-amber-700 dark:text-gold-400 font-bold text-sm block">
              Direct Referral Bonus (5.00%)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Always unlocked! You receive 5% immediately on every direct referral’s verified deposit, regardless of your qualification tier.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-obsidian-850 border border-amber-300 dark:border-gold-500/20 space-y-2">
            <span className="text-amber-700 dark:text-gold-400 font-bold text-sm block">
              10-Tier Network Pool (80.00%)
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Requires two (2) active direct referrals with verified deposits ($100 min). Once met, all commissions from up to 10 generations below you flow directly into your ledger.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Legal & Risk Notice */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 text-xs text-slate-700 dark:text-amber-200 space-y-2">
        <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-gold-400">
          Operational Risk Notice
        </span>
        <p className="leading-relaxed">
          The workflow outlined above reflects the active software rules in effect on Royal Bull Capital. Algorithmic and currency trading carry market risk, including possible loss of capital. Monthly performance simulations and referral incentives depend on verified network activity and market conditions. Past performance does not guarantee future results.
        </p>
      </div>

      {/* 6. CTA */}
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
