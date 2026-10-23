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
  Building2,
  DollarSign,
  Lock,
  Globe2,
  Cpu,
  Activity,
  Database,
  Gauge,
  Scale,
  Binary,
  Radio,
  Share2,
  Compass,
  AlertTriangle
} from 'lucide-react';

export const Home: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    api.get<PublicStats>('/public/stats')
      .then(setStats)
      .catch((err) => console.warn('Could not fetch stats:', err));
  }, []);

  return (
    <div className="space-y-28 pb-20 relative overflow-hidden">
      
      {/* Dynamic Animated Ambient Background Glows */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[400px] bg-gradient-to-r from-amber-400/10 to-yellow-400/10 dark:from-amber-500/10 dark:to-gold-500/10 rounded-full blur-[130px] pointer-events-none animate-orb-float" />
      <div className="absolute top-96 right-1/4 w-[500px] h-[350px] bg-gradient-to-l from-amber-500/10 to-yellow-300/10 dark:from-amber-600/10 dark:to-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-orb-float-reverse" />

      {/* 1. HERO SECTION (Adapted from Finway PPT Page 1 & 2) */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-28 overflow-hidden">
        
        {/* Subtle Luxury Backdrop Overlay */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 opacity-15 dark:opacity-20 pointer-events-none overflow-hidden rounded-3xl">
          <img 
            src="/usd_wealth_money_vault.jpg" 
            alt="Royal Bull Capital Algorithmic Trading & Forex Network" 
            className="w-full h-full object-cover filter blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95 dark:from-[#0A0B0E]/95 dark:via-[#0A0B0E]/80 dark:to-[#0A0B0E]/95" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Live Platform Status Radar Bar */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 dark:bg-obsidian-850/95 border border-amber-300/80 dark:border-gold-500/30 text-xs font-semibold tracking-wider mb-8 shadow-md hover:border-amber-400 transition-all backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">AI Algo Trading</span>
            <span className="text-amber-400/60 dark:text-gold-500/40">|</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">24/5 Forex Wealth Ecosystem</span>
            <span className="text-amber-400/60 dark:text-gold-500/40">|</span>
            <span className="text-amber-700 dark:text-gold-400 uppercase text-[10px] tracking-widest font-mono font-bold">10-Tier Commission Engine</span>
          </div>

          {/* Central Logo Asset Display - 3D Gold Emblem */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-8 group">
            <div className="absolute inset-0 rounded-3xl bg-amber-400/25 dark:bg-gold-500/30 blur-2xl group-hover:bg-amber-400/50 dark:group-hover:bg-gold-500/50 transition-all duration-500 pointer-events-none animate-gold-glow" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white/95 dark:bg-obsidian-900 border-2 border-amber-300/90 dark:border-gold-500/40 p-3 shadow-2xl group-hover:scale-105 group-hover:border-amber-500 transition-all duration-300 flex items-center justify-center backdrop-blur-md">
              <img 
                src="/royal_bull_logo.png" 
                alt="Royal Bull Capital Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.35)]" 
              />
            </div>
          </div>

          {/* Main Headings */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] font-mono font-bold text-amber-700 dark:text-gold-400 block">
              THE FUTURE OF AI-POWERED WEALTH CREATION
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
              TRADE. GROW. TOGETHER. <br className="hidden sm:inline" />
              <span className="text-gold-gradient">AI ALGO TRADING & FOREX NETWORK</span>
            </h1>
          </div>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Experience next-generation financial technology uniting quantitative AI algorithmic trading, deep interbank forex liquidity, automated trade monitoring, and a server-authoritative 10-tier collaborative referral network.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-4 rounded-xl shadow-gold-glow btn-shimmer hover:brightness-110 active:scale-95 transition-all text-base"
            >
              <Cpu className="w-5 h-5" />
              <span>Get Started With AI Trading</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/features" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-white font-semibold px-8 py-4 rounded-xl border border-amber-300/80 dark:border-gold-500/30 hover:border-gold-400 transition-all text-base shadow-sm"
            >
              <span>Explore Platform Architecture</span>
            </Link>
          </div>

          {/* 4 Trust Pillars */}
          <div className="mt-14 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <Binary className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Algo Trading</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">24/5 Quantitative Models</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Automated Monitoring</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Drawdown & Risk Controls</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">10-Tier Cascade</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">80% Total + 5% Direct Bonus</p>
              </div>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Double-Entry Ledger</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Exact Integer-Cent Math</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM & OUR SOLUTION (Adapted from Finway PPT Pages 3 & 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* The Problem */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/20 dark:border-red-500/20 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest font-mono text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                THE PROBLEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                Why Traditional Retail Trading Fails
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Modern financial markets move with high volatility. Retail market participants often struggle with structural challenges:
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Traditional Investing Limitations</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Conventional platforms are often slow, fragmented, and lack transparent real-time ledger accounting.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Manual Trading Risks & Emotional Bias</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Human emotions, fear of missing out, and delayed manual trade execution frequently lead to inconsistent outcomes.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">24/5 Market Volatility Challenges</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Currencies trade continuously across global time zones, making comprehensive manual monitoring practically impossible.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <span>Solution Required: Quantitative AI automation & disciplined risk management.</span>
            </div>
          </div>

          {/* Our Solution */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-300/80 dark:border-gold-500/30 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest font-mono text-amber-700 dark:text-gold-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                OUR SOLUTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                Advanced Technology Solving Financial Challenges
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Royal Bull Capital delivers an integrated financial technology infrastructure:
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  AI Algorithmic Trading
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Automated models analyze real-time market order flow and execute positions with precision and mathematical discipline.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  24/5 Forex Automation System
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  An automated execution framework operating continuously across international trading sessions without manual fatigue.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Risk Management Technology
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Automated stop-losses, drawdown limits, and exposure controls engineered to safeguard capital and mitigate sharp drawdowns.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-amber-700 dark:text-gold-400 flex items-center gap-1.5">
              <span>Result: Server-authoritative execution, transparent accounting, and structured growth.</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. AI ALGO TRADING — 24/5 AUTOMATED TRADING LIFECYCLE (Adapted from Finway PPT Page 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 dark:bg-obsidian-900/60 p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
              QUANTITATIVE EXECUTION SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
              What is AI Algo Trading?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Our 24/5 Automated Trading Lifecycle: from continuous data ingestion to active trade monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1: Data Ingestion */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 relative group hover:border-gold-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-gold-gradient text-obsidian-950 font-bold font-mono flex items-center justify-center shadow-gold-glow">
                  01
                </span>
                <Database className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Ingestion</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time collection of global market data: order flow ticks, macroeconomic news releases, and interbank liquidity signals.
              </p>
              <div className="text-[11px] text-amber-700 dark:text-gold-400 font-mono space-y-0.5 pt-2 border-t border-slate-200 dark:border-white/5">
                <div>• Market Ticks & Order Flow</div>
                <div>• Macroeconomic Indicators</div>
                <div>• Liquidity Signals</div>
              </div>
            </div>

            {/* Step 2: Signal Generation */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 relative group hover:border-gold-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                  02
                </span>
                <Cpu className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Signal Generation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Quantitative algorithms evaluate historical probability matrices, technical chart structures, and market volatility regimes.
              </p>
              <div className="text-[11px] text-amber-700 dark:text-gold-400 font-mono space-y-0.5 pt-2 border-t border-slate-200 dark:border-white/5">
                <div>• Machine Learning Models</div>
                <div>• Pattern Recognition</div>
                <div>• Volatility & Momentum Analysis</div>
              </div>
            </div>

            {/* Step 3: Execution */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 relative group hover:border-gold-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                  03
                </span>
                <Zap className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Precision Execution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Low-latency execution via smart order routing (SOR) with active slippage controls to achieve optimal fill prices across venues.
              </p>
              <div className="text-[11px] text-amber-700 dark:text-gold-400 font-mono space-y-0.5 pt-2 border-t border-slate-200 dark:border-white/5">
                <div>• Smart Order Routing</div>
                <div>• Slippage Control</div>
                <div>• Millisecond Execution Latency</div>
              </div>
            </div>

            {/* Step 4: Monitoring */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 relative group hover:border-gold-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                  04
                </span>
                <Gauge className="w-5 h-5 text-amber-600 dark:text-gold-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Continuous Monitoring</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                24/5 automated surveillance enforcing stop-loss discipline, maximum drawdown limits, and real-time risk mitigation.
              </p>
              <div className="text-[11px] text-amber-700 dark:text-gold-400 font-mono space-y-0.5 pt-2 border-t border-slate-200 dark:border-white/5">
                <div>• Automated Risk Limits & Stops</div>
                <div>• Dynamic Drawdown Controls</div>
                <div>• Real-time Risk Anomaly Alerts</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE FOREX TRADING OPPORTUNITY (Adapted from Finway PPT Page 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            GLOBAL MARKET OPPORTUNITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-2">
            The World's Largest Financial Market
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Foreign exchange boasts over $7.5 Trillion in daily turnover (Bank for International Settlements), providing continuous 24/5 liquidity for algorithmic execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Deep Liquidity</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unrivaled order book depth across major global currencies, enabling tight spreads and instantaneous order fills without market disruption.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">24/5 Operation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Continuous trading from Monday morning in Sydney through Friday evening in New York across all major overlapping financial sessions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Multi-Instrument Access</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Algorithmic strategy deployment across major pairs (EUR/USD, GBP/USD, USD/JPY), cross pairs, and strategic currency hedges.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Institutional Grade</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct market access bridging to tier-1 institutional liquidity venues, operating under the same market standards as international banks.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW THE BUSINESS MODEL WORKS (Adapted from Finway PPT Page 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 dark:bg-obsidian-900/60 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
              SUSTAINABLE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              How the Business Model Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              Sustainable platform economics powered strictly by verified commercial revenue streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Algorithmic Trading Profits</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Revenues generated from proprietary quantitative strategies executed systematically across global currency price movements.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Forex Spread Optimization</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Spread differentials captured through smart order routing and institutional execution across prime brokerage liquidity pools.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Liquidity Volume Rebates</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Volume-based fee rebates and market-making liquidity allowances earned by routing order volume to top-tier execution venues.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Platform Technology Services</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Software tooling, multi-tier commission ledger infrastructure, and automated risk monitoring provided to our global client base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM KPI STATS SECTION */}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Active Network Participants</p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Verified Ledger Deposits</p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Direct & 10-Tier Cascades</p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">80% 10-Tiers + 5% Direct Bonus</p>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE COMMISSION CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommissionCalculator />
      </section>

      {/* 8. ARCHITECTURAL SUPERIORITY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            ARCHITECTURAL SUPERIORITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-2">
            Built for Scalable Forex Capital
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
              When any qualified referral funds a deposit, commissions immediately propagate up through 10 ancestor generations based on verified tree lineage.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Tier 1: 20% down to Tier 10: 2% (80% Total)</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Strict anti-circular traversal protection</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Qualification gating: 2 funded active directs ($100 min)</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 interactive-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Immutable Double-Entry Ledger</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every deposit, referral credit, monthly ROI adjustment, and withdrawal is posted as an immutable ledger transaction with unique idempotency keys.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Exact integer cents & Decimal precision</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Complete cryptographic audit trail</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Segregated balance buckets for total clarity</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 interactive-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated Monthly Cycle Execution</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Programmatic 5% monthly return cycle and 5% principal credit expansion with strict monthly idempotency and 3-month tenure thresholds.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 pt-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> 5% Monthly Returns + 5% Principal Credits</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Duplicate-run prevention per calendar month</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Direct-to-ledger ledger audit trail</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. HOW THE PLATFORM WORKS WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-obsidian-900/50 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">STREAMLINED FLOW</span>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">How Royal Bull Capital Operates</h2>
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
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Fund Deposit</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit a deposit ($100 USD minimum). Upon verification, your sponsor receives a 5% direct sponsor bonus credited to their wallet.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              03
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Unlock 10-Tier Cascades</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Introduce 2 direct active referrals who complete funded deposits ($100 min) to unlock the full 10-level commission cascade.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-white/5 transition-colors">
            <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center font-bold font-mono text-base shadow-sm">
              04
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Monthly ROI & Yield</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track 5% monthly ROI and principal credits. Submit withdrawal requests (1 per calendar month, $20 min) with administrative review.
            </p>
          </div>
        </div>
      </section>

      {/* 10. WHY CHOOSE ROYAL BULL CAPITAL (Adapted from Finway PPT Page 17) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            WHY JOIN ROYAL BULL CAPITAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-2">
            Four Pillars of Your Financial Success
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Combining algorithmic precision, transparent rewards, and enterprise-grade ledger integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Growth Potential</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Leverage automated systems designed to work around the clock, removing manual emotion and pursuing consistent trading execution.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Binary className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">AI Trading & Automation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Institutional-grade quantitative models executing across global market sessions with automated stop-loss governance.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Global Community</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Join an international partner network with turnkey duplication tools, transparent calculators, and responsive institutional support.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Scalable Business Model</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Build a sustainable business with our comprehensive 10-tier compensation plan, direct referral bonuses, and verified ledger payouts.
            </p>
          </div>
        </div>
      </section>

      {/* 11. REGULATORY RISK NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 text-xs text-slate-700 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-800 dark:text-gold-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Important Financial & Technology Risk Disclosure</span>
          </div>
          <p className="leading-relaxed">
            Foreign exchange and algorithmic trading involve substantial risk to capital, including the possible loss of principal. Royal Bull Capital does not provide guaranteed returns, risk-free profit promises, or capital guarantees. Monthly simulation cycles and performance examples are programmatic execution models governed by system rules. Review our full Risk Disclosure and Terms & Conditions before participating.
          </p>
        </div>
      </section>

      {/* 12. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-amber-950/60 dark:via-obsidian-900 dark:to-amber-950/60 p-8 sm:p-14 rounded-3xl border border-amber-300/80 dark:border-gold-500/30 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-xs uppercase font-bold tracking-[0.25em] font-mono text-amber-700 dark:text-gold-400">
              ALGORITHMIC FINTECH ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
              Ready to Experience AI-Driven Algorithmic Trading?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
              Create your account in under 30 seconds and experience the industry's most transparent algorithmic forex and 10-tier referral architecture.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow btn-shimmer hover:brightness-110 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
              >
                <Cpu className="w-5 h-5" />
                <span>Open Client Account</span>
              </Link>
              <Link 
                to="/contact" 
                className="w-full sm:w-auto bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-white font-semibold px-8 py-3.5 rounded-xl border border-amber-300/80 dark:border-white/10 hover:border-gold-500/30 transition-all shadow-sm"
              >
                Contact Institutional Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
