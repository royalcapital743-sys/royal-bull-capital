import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Award, 
  Globe2, 
  Compass, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Lock, 
  TrendingUp, 
  Users, 
  Zap,
  CheckCircle,
  BarChart2,
  Layers,
  Scale,
  MapPin,
  Building2,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* 1. Header / Hero */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-gold-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>The Future of AI-Powered Wealth Creation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Royal Bull Capital
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
          Royal Bull Capital is a financial technology platform integrating AI algorithmic trading, deep forex liquidity access, automated risk governance, and a mathematically auditable 10-tier referral network.
        </p>
      </div>

      {/* 2. Four Foundations of Our Ecosystem (Adapted from Finway PPT Page 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI-Driven Platform</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            Quantitative algorithmic models analyze continuous live market data, calculate statistical probabilities, and execute orders with millisecond discipline.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated Ecosystem</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            Operating seamlessly in the background, our automation suite handles market surveillance, order execution, and real-time risk controls to eliminate emotional bias.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Global Opportunity</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            Direct market access to the world’s deepest financial marketplace—foreign exchange—spanning international trading sessions from Tokyo to New York.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collaborative Growth</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            A transparent 10-tier compensation architecture that rewards community leadership and team development backed by server-verified qualification criteria.
          </p>
        </div>
      </div>

      {/* 3. Vision & Mission Section (Adapted from Finway PPT Pages 14 & 15) */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            STRATEGIC DIRECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Vision & Mission Statement
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Guiding our commitment to technological excellence, transparency, and sustainable financial expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-300/80 dark:border-gold-500/20 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Institutional Vision</h3>
                <p className="text-xs text-amber-700 dark:text-gold-400 font-mono uppercase tracking-wider">Building the Future of Digital Finance</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Democratize Global Trading
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Making institutional-grade algorithmic models and global forex liquidity accessible through automated financial technology.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Financial Independence
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Building scalable, structured income models and multi-generational affiliate cascades designed for long-term growth.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  AI-Powered Wealth Creation
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Deploying quantitative strategies to achieve emotion-free trade execution and structured portfolio progression.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-300/80 dark:border-gold-500/20 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
                <p className="text-xs text-amber-700 dark:text-gold-400 font-mono uppercase tracking-wider">Empowering Financial Growth Through Innovation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Simplify Investing
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Removing complexity from advanced quantitative strategies through automated execution, user-friendly portals, and transparent ledger accounts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Tech-Driven Income
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Creating sustainable income streams through automated trading routines and a verified 10-tier commission distribution model.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600 dark:text-gold-400" />
                  Scalable Community
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Building a resilient global partner network supported by clear qualification rules, comprehensive documentation, and mutual accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Executive Leadership & Strategy (Dubai Hub) */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            EXECUTIVE GOVERNANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Executive Leadership & Strategy
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Spearheaded from our executive hub in Dubai, driving institutional algorithmic trading, quantitative engineering, and transparent affiliate governance.
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-300/80 dark:border-gold-500/20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-obsidian-900 dark:via-obsidian-850 dark:to-amber-950/20 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* CEO Profile Left Badge */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-amber-400/30 to-amber-600/10 border-2 border-amber-400 dark:border-gold-500/50 flex items-center justify-center p-2 shadow-gold-glow">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 dark:text-gold-400">
                    <UserCheck className="w-14 h-14" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-amber-500 text-obsidian-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  CEO
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Tariq Al-Mansoor
                </h3>
                <p className="text-xs text-amber-700 dark:text-gold-400 font-mono font-semibold uppercase tracking-wider">
                  Founder & Chief Executive Officer
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold text-amber-800 dark:text-gold-400">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" />
                <span>Executive Office · Dubai, UAE</span>
              </div>
            </div>

            {/* Leadership Statement & Highlights */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative pl-6 border-l-2 border-amber-400 dark:border-gold-500/40 space-y-3">
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base italic leading-relaxed">
                  "Our mandate at Royal Bull Capital is to bridge the gap between high-frequency quantitative execution and community empowerment. Operating from Dubai—the global epicenter of financial technology and digital innovation—we enforce disciplined risk parameters, verifiable algorithmic automation, and a transparent double-entry financial ledger for every market participant."
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  — Tariq Al-Mansoor, Founder & CEO (Dubai, UAE)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-gold-400 text-xs font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>Dubai Hub</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Strategic leadership and international partnership coordination centered in Dubai, UAE.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-gold-400 text-xs font-bold">
                    <Scale className="w-4 h-4" />
                    <span>Risk Governance</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Strict volatility thresholds, automated drawdown protection, and zero discretionary bias.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-obsidian-900/80 border border-slate-200 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-gold-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Auditable Ledger</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Immutable double-entry book-keeping with segregated wallets and transparent payouts.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 5. Technology & Security Infrastructure (Adapted from Finway PPT Page 16) */}
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            ENTERPRISE GOVERNANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Technology & Security Infrastructure
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Enterprise-grade engineering designed to safeguard assets, prevent execution anomalies, and maintain auditable accounting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">AI Risk Management</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Continuous market exposure analysis that dynamically configures stop-loss thresholds, position sizing, and volatility limits to protect investor capital.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Automated Trade Monitoring</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              24/5 intelligent surveillance monitoring execution quality, detecting market anomalies, and ensuring trading algorithms operate within preset risk boundaries.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Double-Entry Accounting</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every deposit, referral commission, and withdrawal is posted with immutable idempotency keys and balanced debits and credits with zero client-side manipulation.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Data Protection & Security</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Salted Argon2id cryptographic hashing, short-lived JWT authorization tokens, HTTPS transport security, and strict session governance protocols.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Why Choose Royal Bull Capital (Adapted from Finway PPT Page 17) */}
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            CORE DIFFERENTIATORS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Why Choose Royal Bull Capital
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Four pillars that define our transparent, disciplined, and technology-centered approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Disciplined AI Trading & Automation</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Access algorithmic trading strategies that operate with mathematical consistency across global market sessions, systematically removing subjective emotion from execution.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Scalable 10-Tier Compensation</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Benefit from our transparent multi-tier commission architecture allocating up to 80% across 10 generations plus a 5% direct sponsor bonus, governed by clear qualification standards.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Community Network & Mentorship</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Join an international community of traders and network partners. Access clear documentation, transparent calculators, and responsive institutional support.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-gold-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Verified Accounting & Security</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every account balance and commission payout is backed by a server-authoritative double-entry ledger. Zero hidden deductions or unverified figures.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Legal & Risk Notice */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 text-xs text-slate-700 dark:text-amber-200 space-y-2">
        <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-gold-400">
          Transparency & Risk Disclosure
        </span>
        <p className="leading-relaxed">
          Royal Bull Capital provides automated software tools and referral compensation management systems. Foreign exchange and algorithmic trading involve significant risk to capital and may not be suitable for all participants. The platform does not guarantee trading returns, capital preservation, or risk-free profits. All participants must review our official Risk Disclosure and Terms & Conditions before participating.
        </p>
      </div>

      {/* 7. Callout CTA */}
      <div className="bg-slate-50 dark:bg-obsidian-850 p-8 sm:p-12 rounded-3xl border border-amber-300/80 dark:border-gold-500/30 text-center space-y-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
          Experience Next-Generation Financial Technology
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl mx-auto">
          Explore our algorithmic trading lifecycle, transparent 10-tier compensation cascade, and bank-grade double-entry ledger.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/register" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <span>Create Client Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/features" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-obsidian-800 text-slate-800 dark:text-white font-semibold px-8 py-3.5 rounded-xl border border-amber-300/80 dark:border-gold-500/30 hover:border-gold-400 transition-all text-sm shadow-sm"
          >
            <span>Explore Platform Features</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
