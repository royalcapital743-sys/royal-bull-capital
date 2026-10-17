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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Platform Capabilities</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          Engineered for Enterprise Performance
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          Explore the technical features that power Royal Bull Capital's referral engine, wallet ledger, monthly simulations, and administrative governance.
        </p>
      </div>

      {/* Feature Deep Dives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Feature 1 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">10-Tier Commission Engine</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Multi-tier DAG algorithm traverses up to 10 ancestral levels dynamically upon deposit confirmation:
          </p>
          <div className="p-3 bg-obsidian-900 rounded-xl border border-white/5 text-xs font-mono text-gold-300 space-y-1">
            <div>Tier 1: 20% · Tier 2: 15% · Tier 3: 10%</div>
            <div>Tier 4: 8% · Tier 5: 7% · Tier 6: 6%</div>
            <div>Tier 7: 5% · Tier 8: 4% · Tier 9: 3% · Tier 10: 2%</div>
            <div className="text-slate-400 pt-1 font-sans text-[11px]">+ 5% Direct Sponsor Bonus</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Strict Qualification Gate</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Eliminates free-riding and abuse. In order to receive Level 1-10 network commissions, an account must introduce at least 2 direct referrals who have confirmed deposits.
          </p>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Auto-evaluated on the server during each event</li>
            <li>✓ Transparent qualification badge in client portal</li>
            <li>✓ Direct 5% bonus paid regardless of tier status</li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Segmented Wallet Buckets</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Client balances are tracked in segregated server-side buckets rather than an untyped lump sum:
          </p>
          <div className="p-3 bg-obsidian-900 rounded-xl border border-white/5 text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between"><span>Original Principal:</span> <span className="text-gold-400 font-mono">Deposited funds</span></div>
            <div className="flex justify-between"><span>Principal Credits:</span> <span className="text-gold-400 font-mono">5% monthly growth</span></div>
            <div className="flex justify-between"><span>ROI Balance:</span> <span className="text-gold-400 font-mono">5% monthly yield</span></div>
            <div className="flex justify-between"><span>Direct Bonus:</span> <span className="text-gold-400 font-mono">5% sponsor credits</span></div>
            <div className="flex justify-between"><span>Level Commissions:</span> <span className="text-gold-400 font-mono">Tier 1-10 cascades</span></div>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Monthly Allocation Engine</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Programmatically simulates monthly portfolio growth with 5% ROI and 5% principal credit expansion. Runs with unique calendar-month idempotency keys.
          </p>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Strict duplicate-run prevention per month</li>
            <li>✓ 3-month account threshold for early withdrawal</li>
            <li>✓ Full historical audit records</li>
          </ul>
        </div>

        {/* Feature 5 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Withdrawal State Machine</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Withdrawal workflow validates available balance, enforces the 1-per-month calendar policy, and requires administrative approval before wallet deduction.
          </p>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Available balance pre-flight validation</li>
            <li>✓ Rejection reasons logged immutably</li>
            <li>✓ Simulated wire and payout options</li>
          </ul>
        </div>

        {/* Feature 6 */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold-500/30 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Admin Command Center</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            A comprehensive, role-protected admin panel with user search, deposit approvals, withdrawal reviews, rule customization, and system auditing.
          </p>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Live deposit and payout approval queues</li>
            <li>✓ Adjustable commission percentage rules</li>
            <li>✓ Complete cryptographic audit logging & export</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
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
