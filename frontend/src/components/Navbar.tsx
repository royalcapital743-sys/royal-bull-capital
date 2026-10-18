import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatMoney } from '../api/client';
import { 
  Shield, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  Wallet as WalletIcon, 
  Share2, 
  LayoutDashboard, 
  Sliders, 
  Bell, 
  HeadphonesIcon,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, wallet, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0A0B0E]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 pr-4">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white dark:bg-obsidian-850 p-1 border border-amber-300/80 dark:border-gold-500/30 group-hover:border-amber-500 dark:group-hover:border-gold-400 transition-colors shadow-sm flex items-center justify-center">
              <img 
                src="/royal_bull_logo.png" 
                alt="Royal Bull Capital" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(217,119,6,0.25)]" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-gold-gradient leading-tight whitespace-nowrap">
                ROYAL BULL
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.22em] text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors whitespace-nowrap">
                CAPITAL · USD WEALTH
              </span>
            </div>
          </Link>

          {/* Institutional Corporate Website Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0">
            {user && (
              <Link
                to="/dashboard"
                className={`text-xs xl:text-sm font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                  location.pathname.startsWith('/dashboard') ||
                  location.pathname.startsWith('/deposit') ||
                  location.pathname.startsWith('/referrals') ||
                  location.pathname.startsWith('/wallet') ||
                  location.pathname.startsWith('/withdrawals') ||
                  location.pathname.startsWith('/notifications') ||
                  location.pathname.startsWith('/support') ||
                  location.pathname.startsWith('/settings')
                    ? 'bg-gradient-to-r from-amber-500/20 to-gold-500/20 text-amber-800 dark:text-gold-300 border border-gold-500/40 shadow-gold-glow'
                    : 'bg-gold-gradient text-obsidian-950 font-bold hover:brightness-110 active:scale-95'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Client Portal</span>
              </Link>
            )}

            <Link 
              to="/" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/about') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              About
            </Link>
            <Link 
              to="/referral-program" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/referral-program') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              10-Tier Model
            </Link>
            <Link 
              to="/features" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/features') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              Prime Forex
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/how-it-works') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/faq" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/faq') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`text-xs xl:text-sm font-semibold transition-all relative py-1.5 whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-amber-600 dark:after:bg-gold-500 after:transition-all after:duration-300 ${
                isActive('/contact') 
                  ? 'text-amber-700 dark:text-gold-400 after:w-full' 
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white after:w-0 hover:after:w-full'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Header Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="group p-2 xl:p-2.5 rounded-xl bg-white dark:bg-obsidian-850 hover:bg-slate-100 dark:hover:bg-obsidian-800 border border-amber-300/80 dark:border-gold-500/30 hover:border-amber-500 dark:hover:border-gold-400 text-amber-600 dark:text-gold-400 transition-all duration-300 flex items-center justify-center shadow-sm active:scale-90 shrink-0"
              title={theme === 'light' ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700 group-hover:text-amber-600 group-hover:rotate-45 transition-all duration-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 group-hover:text-amber-300 group-hover:rotate-90 transition-all duration-500" />
              )}
            </button>

            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="text-xs xl:text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2.5 xl:px-3.5 py-2 rounded-lg transition-colors border border-transparent hover:border-amber-300/60 whitespace-nowrap"
                >
                  Client Portal
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gold-gradient text-obsidian-950 font-bold text-xs xl:text-sm px-4 xl:px-5 py-2 xl:py-2.5 rounded-xl shadow-gold-glow btn-shimmer hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Open USD Account</span>
                  <ArrowRight className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-gold-gradient text-obsidian-950 font-extrabold shadow-gold-glow'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </Link>
                )}

                {/* User Portal Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 border border-amber-300/80 dark:border-gold-500/30 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gold-gradient text-obsidian-950 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight max-w-[120px] truncate">{user.name}</span>
                      <span className="text-[10px] text-amber-700 dark:text-gold-400 uppercase tracking-wider font-mono font-bold">Client Account</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Backdrop overlay for quick dismissal */}
                  {userDropdownOpen && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                  )}

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-gold-500/30 shadow-2xl py-2 z-50 divide-y divide-slate-100 dark:divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Account Summary Header */}
                      <div className="px-4 py-3 bg-slate-50/70 dark:bg-obsidian-950/60">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Signed In As</p>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-gold-400 font-bold">
                            {user.referral_code}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{user.email}</p>
                        {wallet && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Available Balance:</span>
                            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                              {formatMoney(wallet.total_balance_cents)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Financial Navigation Group */}
                      <div className="py-1.5">
                        <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">Finances & Downline</div>
                        <Link 
                          to="/dashboard" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-gold-500" /> 
                          <span>Client Overview</span>
                        </Link>
                        <Link 
                          to="/deposit" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <WalletIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 
                          <span>USD Deposit Desk</span>
                        </Link>
                        <Link 
                          to="/referrals" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-amber-600 dark:text-gold-500" /> 
                          <span>10-Tier Partner Network</span>
                        </Link>
                        <Link 
                          to="/wallet" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 
                          <span>Wallet & Ledger Explorer</span>
                        </Link>
                        <Link 
                          to="/withdrawals" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 
                          <span>USD Withdrawals</span>
                        </Link>
                      </div>

                      {/* Account & Help Group */}
                      <div className="py-1.5">
                        <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">Account & Help</div>
                        <Link 
                          to="/notifications" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 
                          <span>Notifications Center</span>
                        </Link>
                        <Link 
                          to="/support" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <HeadphonesIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> 
                          <span>Support Help Desk</span>
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-gold-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                        >
                          <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" /> 
                          <span>Profile & Security</span>
                        </Link>
                      </div>

                      {isAdmin && (
                        <div className="py-1.5">
                          <Link 
                            to="/admin" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          >
                            <Sliders className="w-4 h-4 text-amber-600" /> 
                            <span>Admin Console</span>
                          </Link>
                        </div>
                      )}

                      {/* Sign Out Button */}
                      <div className="pt-1">
                        <button 
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> 
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-obsidian-900 border-b border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-3">
          {/* If user logged in, put client portal links directly at top of drawer */}
          {user && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</span>
                {wallet && (
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-gold-400">
                    {formatMoney(wallet.total_balance_cents)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 text-center"
                >
                  Overview
                </Link>
                <Link
                  to="/deposit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-gold-gradient text-obsidian-950 text-xs font-bold text-center"
                >
                  Deposit USD
                </Link>
                <Link
                  to="/referrals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 text-center"
                >
                  10-Tier Tree
                </Link>
                <Link
                  to="/withdrawals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 text-center"
                >
                  Withdrawals
                </Link>
                <Link
                  to="/wallet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 text-center"
                >
                  Wallet Ledger
                </Link>
                <Link
                  to="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 text-center"
                >
                  Support Desk
                </Link>
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-white/10 pt-2 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-1">Navigation</span>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">About</Link>
            <Link to="/referral-program" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">10-Tier Model</Link>
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">Prime Forex</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">How It Works</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">FAQ</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 px-2 text-slate-700 dark:text-slate-300 hover:text-amber-700 text-sm font-medium">Contact</Link>
          </div>

          <div className="pt-2 pb-1 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
            <span className="text-xs text-slate-500 font-medium">Appearance</span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-850 border border-amber-300 dark:border-gold-500/30 text-xs font-semibold"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-slate-800">Day Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">Night Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-sm font-medium">Client Portal</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-gold-gradient text-obsidian-950 font-bold text-sm btn-shimmer shadow-gold-glow">Open USD Account</Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-full text-center py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2 mb-1"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Open Admin Console</span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-center py-2 text-red-600 dark:text-red-400 text-sm font-semibold"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
