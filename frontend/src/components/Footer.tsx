import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Award, Globe, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-obsidian-950 border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-850 p-1 border border-amber-300/80 dark:border-gold-500/30 flex items-center justify-center shadow-sm">
                <img src="/royal_bull_logo.png" alt="Royal Bull Capital" className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(217,119,6,0.25)]" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-gold-gradient tracking-wider block">
                  ROYAL BULL CAPITAL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
                  AI ALGO TRADING · FOREX FINANCIAL TECHNOLOGY
                </span>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Royal Bull Capital provides institutional-grade AI algorithmic trading, forex automation, automated trade monitoring, and a server-authoritative 10-tier referral network.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-amber-600 dark:text-gold-500" /> Double-Entry Ledger</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-600 dark:text-gold-500" /> Enterprise Security</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-600 dark:text-gold-500" /> 10-Tier Cascade</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-4 text-amber-700 dark:text-gold-400">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Platform Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/referral-program" className="hover:text-slate-900 dark:hover:text-white transition-colors">10-Tier Commission Plan</Link></li>
              <li><Link to="/faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-4 text-amber-700 dark:text-gold-400">Client Portal</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Client Login</Link></li>
              <li><Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors">Open Client Account</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Institutional Inquiries</Link></li>
              <li><Link to="/support" className="hover:text-slate-900 dark:hover:text-white transition-colors">Support Ticket Center</Link></li>
              <li><Link to="/admin" className="text-amber-700 dark:text-amber-500/80 hover:text-amber-800 dark:hover:text-amber-400 transition-colors font-medium">Admin Console</Link></li>
            </ul>
          </div>

          {/* Regulatory & Legal */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase mb-4 text-amber-700 dark:text-gold-400">Compliance & Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/risk-disclosure" className="hover:text-slate-900 dark:hover:text-white transition-colors">Risk Disclosure Notice</Link></li>
              <li><Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Risk Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 space-y-4">
          <div className="bg-white dark:bg-obsidian-900/60 p-4 rounded-xl border border-slate-200 dark:border-white/5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-500 shadow-sm">
            <strong className="text-slate-800 dark:text-slate-300 block mb-1">FINANCIAL & ALGORITHMIC RISK DISCLOSURE:</strong>
            Foreign exchange and algorithmic trading involve significant risk to capital, including the possible loss of principal. The platform does not offer guaranteed profits, fixed returns, or capital guarantees. Multi-tier commissions, double-entry wallet accounting, and monthly cycle executions operate strictly in accordance with configured platform governance rules.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ROYAL BULL CAPITAL PLATFORM. ALL RIGHTS RESERVED.</p>
            <p className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-gold-500" />
              <span>Global Technology Headquarters · Enterprise Security</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
