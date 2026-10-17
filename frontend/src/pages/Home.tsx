import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatMoney } from '../api/client';
import { PublicStats } from '../types';
import { CommissionCalculator } from '../components/CommissionCalculator';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  Zap,
  PieChart,
  BarChart3,
  Vault,
  Building2,
  DollarSign,
  Lock,
  Globe2
} from 'lucide-react';

export const Home: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    api.get<PublicStats>('/public/stats')
      .then(setStats)
      .catch((err) => console.warn('Could not fetch stats:', err));
  }, []);

  return (
    <div className="space-y-24 pb-20 relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[400px] bg-gradient-to-r from-amber-400/10 to-yellow-400/10 dark:from-amber-500/10 dark:to-gold-500/10 rounded-full blur-[130px] pointer-events-none animate-orb-float" />
      <div className="absolute top-96 right-1/4 w-[500px] h-[350px] bg-gradient-to-l from-amber-500/10 to-yellow-300/10 dark:from-amber-600/10 dark:to-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-orb-float-reverse" />

      {/* Hero Section with Wealth Theme Backdrop */}
      <section className="relative pt-8 pb-20 md:pt-16 md:pb-32 overflow-hidden">
        
        {/* Subtle Luxury USD Vault & Money Backdrop Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 opacity-20 dark:opacity-25 pointer-events-none overflow-hidden rounded-3xl">
          <img 
            src="/usd_wealth_money_vault.jpg" 
            alt="Royal Bull Capital USD Wealth & Bullion Vault" 
            className="w-full h-full object-cover filter blur-[1.5px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/95 dark:from-[#0A0B0E]/90 dark:via-[#0A0B0E]/75 dark:to-[#0A0B0E]/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Live Platform Status Radar Bar */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 dark:bg-obsidian-850/95 border border-amber-300/80 dark:border-gold-500/30 text-xs font-semibold tracking-wider mb-8 shadow-md hover:border-amber-400 transition-all backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Realtime USD Institutional Liquidity</span>
            <span className="text-amber-400/60 dark:text-gold-500/40">|</span>
            <span className="text-amber-700 dark:text-gold-400 uppercase text-[10px] tracking-widest font-mono font-bold">10-Tier USD Yield</span>
          </div>

          {/* Central Logo Asset Display - Clean Transparent 3D Gold Emblem */}
          <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-8 group">
            {/* Ambient gold glow halo */}
            <div className="absolute inset-0 rounded-3xl bg-amber-400/25 dark:bg-gold-500/30 blur-2xl group-hover:bg-amber-400/50 dark:group-hover:bg-gold-500/50 transition-all duration-500 pointer-events-none animate-gold-glow" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white/95 dark:bg-obsidian-900 border-2 border-amber-300/90 dark:border-gold-500/40 p-3 shadow-2xl group-hover:scale-105 group-hover:border-amber-500 transition-all duration-300 flex items-center justify-center backdrop-blur-md">
              <img 
                src="/royal_bull_logo.png" 
                alt="Royal Bull Capital" 
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.35)]" 
              />
            </div>
          </div>

          {/* Main Wealth Headings */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-mono font-bold text-amber-700 dark:text-gold-400 block">
              INSTITUTIONAL USD WEALTH ARCHITECTURE
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
              TRADE. GROW. <br className="hidden sm:inline" />
              <span className="text-gold-gradient">TOGETHER IN USD.</span>
            </h1>
          </div>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            The premier multi-tier private wealth and automated forex network. Grow institutional USD capital through 10 ancestor generations, 5% monthly return expansion, and bank-grade double-entry accounting.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-4 rounded-xl shadow-gold-glow btn-shimmer hover:brightness-110 active:scale-95 transition-all text-base"
            >
              <DollarSign className="w-5 h-5" />
              <span>Open Institutional USD Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/referral-program" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-white font-semibold px-8 py-4 rounded-xl border border-amber-300/80 dark:border-gold-500/30 hover:border-gold-400 transition-all text-base shadow-sm"
            >
              <span>Explore 10-Tier USD Model</span>
            </Link>
          </div>

          {/* Trust Pillars in USD */}
          <div className="mt-14 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">10 Network Tiers</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">80% Total USD Cascade</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">5% Direct USD Bonus</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Instant Sponsor Credit</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">5% Monthly USD Returns</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Automated Growth Model</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Authoritative USD Ledger</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Exact Integer Cent Math</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wealth Showcase Visual Gallery (Penthouse Trading & Swiss Vault) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            GLOBAL WEALTH RESERVES & HIGH-FREQUENCY INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-2">
            The Pinnacle of Private Forex Wealth
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Royal Bull Capital unites multi-million USD bank-grade STP liquidity with automated 10-tier commission distribution, engineered exclusively for serious capital allocators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: USD Vault & 100 Dollar Briefcases */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-amber-300/80 dark:border-gold-500/30 interactive-card group flex flex-col">
            <div className="relative h-60 overflow-hidden">
              <img 
                src="/usd_wealth_money_vault.jpg" 
                alt="Institutional USD Cash Vault and Gold Reserves" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/40 text-[11px] font-mono text-gold-300 flex items-center gap-1.5 shadow-lg">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Reserve Custody</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-bold block">
                  Federal Reserve Custody
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  $100,000,000 USD Vaults
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Segregated Tier-1 bank vault holding crisp physical 100 USD currency, physical 999.9 gold bullion, and institutional Fedwire liquidity settlement lines.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-gold-400 border-t border-slate-100 dark:border-white/5">
                <span>Fedwire Settlement: T+0</span>
                <span>Denomination: $ USD Only</span>
              </div>
            </div>
          </div>

          {/* Card 2: Swiss Gold Bullion Reserves */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-amber-300/80 dark:border-gold-500/30 interactive-card group flex flex-col">
            <div className="relative h-60 overflow-hidden">
              <img 
                src="/wealth_vault.jpg" 
                alt="Swiss Bullion Gold Reserves & USD Forex Desk" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/40 text-[11px] font-mono text-gold-300 flex items-center gap-1.5 shadow-lg">
                <Vault className="w-3.5 h-3.5 text-gold-400" />
                <span>Precious Metals & USD</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gold-400 font-bold block">
                  Interbank ECN Depth
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  $25,000,000 USD Depth
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Direct market bridge to London and New York interbank currency desks. Instantaneous order fills with tightest spreads on gold and USD pairs.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-gold-400 border-t border-slate-100 dark:border-white/5">
                <span>STP Speed: &lt; 12ms</span>
                <span>Audit: Big-4 Verified</span>
              </div>
            </div>
          </div>

          {/* Card 3: Executive Trading Suite */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-amber-300/80 dark:border-gold-500/30 interactive-card group flex flex-col">
            <div className="relative h-60 overflow-hidden">
              <img 
                src="/wealth_penthouse.jpg" 
                alt="Executive Private Wealth Suite" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-500/40 text-[11px] font-mono text-gold-300 flex items-center gap-1.5 shadow-lg">
                <Building2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Private Wealth Network</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gold-400 font-bold block">
                  10-Tier Cascade
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  85.00% Combined USD
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                An institutional 10-level ancestor cascade allocating 80% total commissions down to Tier 10, plus an upfront 5% sponsor direct credit on every USD deposit.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-gold-400 border-t border-slate-100 dark:border-white/5">
                <span>Direct Gate: 2 Qualified</span>
                <span>No Circular Loops</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Live Platform KPI Stats Section strictly in USD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden interactive-card group shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Registered Accounts</span>
              <div className="p-2 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <Users className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
              {stats ? stats.total_registered_users.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Global Traders & Partners</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden interactive-card group shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Total Volume Funded (USD)</span>
              <div className="p-2 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-gold-gradient mt-1">
              {stats ? formatMoney((stats.total_deposits_usd ?? stats.total_demo_deposits_usd) * 100) : '$0.00 USD'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Confirmed USD Deposit Volume</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden interactive-card group shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Commissions Distributed</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <PieChart className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats ? formatMoney((stats.total_commissions_usd ?? stats.total_demo_commissions_usd) * 100) : '$0.00 USD'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Direct & 10-Tier USD Cascades</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden interactive-card group shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Maximum Payout Pool</span>
              <div className="p-2 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
              85.00%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">80% Tiers + 5% Direct USD Bonus</p>
          </div>
        </div>
      </section>

      {/* Interactive Commission Calculator in USD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommissionCalculator />
      </section>

      {/* Architectural Superiority Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            ARCHITECTURAL SUPERIORITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-2">
            Built For High-Volume USD Forex Capital
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Royal Bull Capital delivers uncompromising institutional reliability with real server-side validation, immutable transaction ledgers, and zero browser-based figure manipulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 interactive-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Multi-Tier Ancestor Cascade</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              When any qualified referral funds a USD deposit, commissions immediately propagate up through 10 ancestor generations based on verified tree lineage.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Tier 1: 20% down to Tier 10: 2%</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Strict anti-circular traversal protection</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Qualification gating: 2 funded directs in USD</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 interactive-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Immutable Double-Entry Ledger</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every USD deposit, referral credit, monthly ROI adjustment, and withdrawal is posted as an immutable ledger transaction with unique idempotency keys.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Exact integer cents & Decimal precision</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Complete cryptographic audit trail</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Reversals logged as separate records</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 interactive-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated Monthly Cycle Execution</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Programmatic 5% monthly return cycle and 5% principal credit expansion in USD with strict monthly idempotency and 3-month early-withdrawal logic.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> 5% Monthly Returns + 5% Principal in USD</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Duplicate-run prevention per calendar month</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Direct-to-ledger ledger audit trail</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Workflow strictly in USD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-obsidian-900/50 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">STREAMLINED FLOW</span>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">How Royal Bull Capital Operates in USD</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-gold-gradient text-obsidian-950 flex items-center justify-center font-bold font-mono text-base shadow-gold-glow">
              01
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Open Account</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Register seamlessly with or without a sponsor referral code. You receive your own unique referral link immediately.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              02
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Fund Deposit in USD</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit a deposit ($100 USD minimum). Upon verification, your sponsor receives a 5% direct USD bonus credited to their wallet.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              03
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Unlock 10-Tier Cascades</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Introduce 2 direct active referrals who complete funded USD deposits to unlock the full 10-level commission cascade.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              04
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Monthly USD ROI & Yield</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track 5% monthly ROI and principal credits in USD. Submit withdrawal requests with 1-per-month state machine review.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-amber-950/60 dark:via-obsidian-900 dark:to-amber-950/60 p-8 sm:p-14 rounded-3xl border border-amber-300/80 dark:border-gold-500/30 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-xs uppercase font-bold tracking-[0.25em] font-mono text-amber-700 dark:text-gold-400">
              PRIVATE WEALTH ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
              Ready to Experience Institutional USD Forex Wealth?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
              Create your institutional account in under 30 seconds and experience the industry's most sophisticated forex referral commission architecture in USD.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow btn-shimmer hover:brightness-110 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Open Institutional USD Account</span>
              </Link>
              <Link 
                to="/contact" 
                className="w-full sm:w-auto bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-white font-semibold px-8 py-3.5 rounded-xl border border-amber-300/80 dark:border-white/10 hover:border-gold-500/30 transition-all shadow-sm"
              >
                Contact Private Wealth Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
