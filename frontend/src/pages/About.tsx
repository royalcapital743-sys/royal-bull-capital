import React from 'react';
import { Shield, Target, Award, Users, Globe, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-gold-400 text-xs uppercase font-bold tracking-widest">Institutional Philosophy</span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
          About Royal Bull Capital
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
          Founded on principles of algorithmic discipline, financial transparency, and mutual network growth. Discover our institutional architecture and long-term vision.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-gold-500/20 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            To engineer a resilient, mathematically sound multi-tier infrastructure that empowers capital allocators and network partners to collaborate seamlessly. We remove opaque commissions and replace them with an auditable, server-authoritative double-entry ledger.
          </p>
          <div className="pt-2 text-xs text-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span>Trade · Grow · Together</span>
          </div>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-gold-500/20 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Institutional Vision</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            We envision an ecosystem where algorithmic forex strategies and multi-generational affiliate networks operate with institutional confidence, protected by rigorous qualification criteria, strict idempotency, and server-side compliance governance.
          </p>
          <div className="pt-2 text-xs text-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span>Next-Generation FinTech Engineering</span>
          </div>
        </div>
      </div>

      {/* Brand Values */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center">Core Pillars of Excellence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-obsidian-900/60 p-6 rounded-2xl border border-white/5 space-y-3">
            <Shield className="w-8 h-8 text-gold-400" />
            <h3 className="text-lg font-bold text-white">Server-Authoritative Trust</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never rely on client-side state. Every balance, qualification tier, and commission calculation is executed with ACID transactions and fixed decimal precision.
            </p>
          </div>
          <div className="bg-obsidian-900/60 p-6 rounded-2xl border border-white/5 space-y-3">
            <Award className="w-8 h-8 text-gold-400" />
            <h3 className="text-lg font-bold text-white">Equitable 85% Distribution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our 10-tier compensation cascade allocates up to 80% across ancestral generations plus a 5% direct sponsor reward, incentivizing sustained team growth.
            </p>
          </div>
          <div className="bg-obsidian-900/60 p-6 rounded-2xl border border-white/5 space-y-3">
            <Globe className="w-8 h-8 text-gold-400" />
            <h3 className="text-lg font-bold text-white">Institutional Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Robust operational controls, immutable audit trails, and strict risk mitigation ensure comprehensive auditability and governance.
            </p>
          </div>
        </div>
      </div>

      {/* Callout */}
      <div className="bg-obsidian-850 p-8 sm:p-12 rounded-3xl border border-gold-500/30 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Experience Institutional USD Wealth Management</h2>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto">
          Access premier USD ECN liquidity, dedicated private client desks, and our audited 10-Tier USD capital expansion architecture.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-8 py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all text-sm"
        >
          <span>Open Institutional USD Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
