import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  RotateCcw, 
  Cpu, 
  FileCheck2, 
  Users, 
  Wallet,
  ArrowRight,
  Activity,
  Globe2,
  LineChart,
  Sliders,
  CheckCircle,
  Database,
  Binary,
  Radio,
  Gauge,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-gold-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>Advanced Technology Solving Modern Financial Challenges</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for Enterprise Performance
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-3xl mx-auto">
          Explore the institutional engineering behind Royal Bull Capital—combining 24/5 AI algorithmic execution, automated risk controls, segregated ledger accounting, and an auditable 10-tier referral cascade.
        </p>
      </div>

      {/* 2. Our Solution: 4 Strategic Pillars (Adapted from Finway PPT Page 4) */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            CORE FOUNDATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            Our Solution
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Disciplined automation engineered to eliminate emotional bias and maximize execution efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 hover:border-gold-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Binary className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Algorithmic Trading</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Proprietary trading strategies evaluate live order flow, market ticks, and technical indicators to execute positions automatically with precision and consistency.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 hover:border-gold-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Forex Automation System</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              A 24/5 automated execution infrastructure operating across global forex market sessions from Tokyo open to New York close without human delay.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 hover:border-gold-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Risk Management Tech</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Continuous algorithmic exposure monitoring, dynamic stop-loss allocation, and drawdown controls designed to protect capital and mitigate volatility spikes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3 hover:border-gold-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collaborative Growth Model</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              An intelligent multi-tier reward architecture combining monthly performance allocations with an 80% 10-level commission cascade and 5% direct bonus.
            </p>
          </div>
        </div>
      </div>

      {/* 3. AI Algo Trading: 4-Stage Lifecycle (Adapted from Finway PPT Page 5) */}
      <div className="space-y-12 bg-slate-50/80 dark:bg-obsidian-900/60 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            AUTOMATED EXECUTION ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            What is AI Algo Trading?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            The 24/5 Automated Trading Lifecycle: from real-time data ingestion to algorithmic risk monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 relative group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-gold-gradient text-obsidian-950 font-bold font-mono flex items-center justify-center shadow-gold-glow">
                01
              </span>
              <Database className="w-5 h-5 text-amber-600 dark:text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Ingestion</h3>
              <p className="text-xs text-amber-700 dark:text-gold-400 font-mono mt-0.5">Real-time global market data</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Aggregates continuous high-frequency tick data, interbank order flow, macroeconomic calendar events, and liquidity signals across major currencies.
            </p>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
              <li>• Market Ticks & Order Flow</li>
              <li>• Macroeconomic Indicators</li>
              <li>• Multi-Venue Liquidity Signals</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 relative group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                02
              </span>
              <Cpu className="w-5 h-5 text-amber-600 dark:text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Signal Generation</h3>
              <p className="text-xs text-amber-700 dark:text-gold-400 font-mono mt-0.5">Probability modeling</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Quantitative algorithms and pattern recognition evaluate market structures, calculating high-probability statistical trade setups with defined risk limits.
            </p>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
              <li>• Quantitative Algorithmic Models</li>
              <li>• Technical Pattern Recognition</li>
              <li>• Trend & Mean-Reversion Signals</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 relative group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                03
              </span>
              <Zap className="w-5 h-5 text-amber-600 dark:text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Execution</h3>
              <p className="text-xs text-amber-700 dark:text-gold-400 font-mono mt-0.5">Low-latency order routing</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Orders are routed to institutional liquidity pools with millisecond execution speed, intelligent slippage control, and minimal market impact.
            </p>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
              <li>• Smart Order Routing (SOR)</li>
              <li>• Slippage Control Algorithms</li>
              <li>• Deep Institutional ECN Access</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 relative group hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 text-amber-700 dark:text-gold-400 border border-amber-300 dark:border-gold-500/30 font-bold font-mono flex items-center justify-center shadow-sm">
                04
              </span>
              <Gauge className="w-5 h-5 text-amber-600 dark:text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monitoring</h3>
              <p className="text-xs text-amber-700 dark:text-gold-400 font-mono mt-0.5">Real-time risk protection</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Active trades are continuously monitored by risk routines. Pre-configured stop-losses and equity drawdown limits safeguard portfolio assets 24/5.
            </p>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-white/5">
              <li>• Automated Stop-Loss Governance</li>
              <li>• Maximum Drawdown Protection</li>
              <li>• Real-Time Risk Anomaly Alerts</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Forex Market Advantages (Adapted from Finway PPT Page 6) */}
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            MARKET DYNAMICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            The Forex Trading Opportunity
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Operating in the world’s largest and most liquid financial market with over $7.5 Trillion in daily global turnover (Bank for International Settlements).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Deep Liquidity</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unmatched liquidity across global currency markets ensures rapid trade execution, tight bid-ask spreads, and minimal market impact for automated strategies.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">24/5 Operation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Continuous trading from Monday morning in Sydney through Friday evening in New York, offering algorithmic opportunities across all major market sessions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Multi-Instrument Access</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Algorithmic coverage across major currency pairs (EUR/USD, GBP/USD, USD/JPY), cross-currency pairs, and strategic commodity hedges.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Institutional Standards</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Built on the same market access technologies utilized by multinational financial institutions and high-frequency quantitative desks.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Platform Architecture Grid: 10 Tiers, Wallets, Governance */}
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-amber-700 dark:text-gold-400 text-xs uppercase font-bold tracking-widest font-mono">
            TECHNICAL SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Core Ledger & Governance Engine
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Key software modules powering Royal Bull Capital's referral network, wallet ledger, and administrative controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">10-Tier Commission Engine</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Directed Acyclic Graph (DAG) algorithm traverses up to 10 ancestral generations dynamically upon verified deposit confirmation:
            </p>
            <div className="p-3 bg-slate-50 dark:bg-obsidian-900 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-mono text-amber-800 dark:text-gold-300 space-y-1">
              <div>Tier 1: 20% · Tier 2: 15% · Tier 3: 10%</div>
              <div>Tier 4: 8% · Tier 5: 7% · Tier 6: 6%</div>
              <div>Tier 7: 5% · Tier 8: 4% · Tier 9: 3% · Tier 10: 2%</div>
              <div className="text-slate-500 dark:text-slate-400 pt-1 font-sans text-[11px] font-bold">+ 5% Direct Sponsor Bonus (85% Total Pool)</div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strict Qualification Gate</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Eliminates dormant tree abuse. To receive commissions from Tiers 1 through 10, an account must maintain at least two (2) direct active referrals with confirmed deposits.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Server-authoritative tree evaluation</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Direct 5% bonus paid regardless of tier status</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Prevents circular referral loop manipulation</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Segregated Wallet Buckets</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Client balances are stored in segregated integer-cent database fields for complete bookkeeping transparency:
            </p>
            <div className="p-3 bg-slate-50 dark:bg-obsidian-900 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-mono">
              <div className="flex justify-between"><span>Original Principal:</span> <span className="text-amber-700 dark:text-gold-400">Deposited capital</span></div>
              <div className="flex justify-between"><span>Principal Credits:</span> <span className="text-amber-700 dark:text-gold-400">5% monthly growth</span></div>
              <div className="flex justify-between"><span>ROI Balance:</span> <span className="text-amber-700 dark:text-gold-400">5% monthly yield</span></div>
              <div className="flex justify-between"><span>Direct Bonus:</span> <span className="text-amber-700 dark:text-gold-400">5% sponsor credits</span></div>
              <div className="flex justify-between"><span>Level Commissions:</span> <span className="text-amber-700 dark:text-gold-400">10-tier cascades</span></div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Allocation Engine</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Programmatically executes monthly portfolio allocations with 5% ROI and 5% principal credit growth locked by unique calendar-month idempotency keys.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Idempotent execution (prevents double credits)</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> 3-month threshold for early withdrawal policy</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Full historical cycle audit logs</li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Withdrawal State Machine</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Controlled withdrawal workflow validating available balance, enforcing the 1-per-month policy, and requiring administrative review before disbursement.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Minimum $20 · Maximum $50,000 per request</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> One withdrawal per calendar month</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Rejections logged with audit reason</li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-gold-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-gold-500/30 flex items-center justify-center text-amber-600 dark:text-gold-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Command Center</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Role-protected administrative portal providing user oversight, deposit confirmation, withdrawal approvals, rule customization, and system auditing.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Real-time deposit and withdrawal queues</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Dynamic rule management (rates, limits)</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-gold-400" /> Cryptographic audit trail & journal records</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 6. Legal & Risk Notice */}
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-gold-500/30 text-xs text-slate-700 dark:text-amber-200 space-y-2">
        <span className="font-bold uppercase tracking-wider block text-amber-800 dark:text-gold-400">
          Trading & Technology Risk Disclosure
        </span>
        <p className="leading-relaxed">
          The quantitative algorithms and execution frameworks described above are automated software tools. While designed with risk controls, algorithmic and forex trading involves exposure to sudden market volatility, execution slippage, latency, and potential loss of capital. No simulation or automated system can eliminate trading risk entirely.
        </p>
      </div>

      {/* 7. CTA */}
      <div className="text-center pt-4">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm"
        >
          <span>Create Account to Test All Features</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
