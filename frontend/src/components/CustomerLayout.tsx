import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, formatMoney } from '../api/client';
import { 
  LayoutDashboard, 
  Wallet, 
  Share2, 
  Layers, 
  ArrowUpRight, 
  Bell, 
  HeadphonesIcon, 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles,
  Sliders
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions,
  badge
}) => {
  const { user, wallet, profile, isAdmin } = useAuth();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  useEffect(() => {
    // Check unread notifications count
    api.get<any[]>('/customer/notifications')
      .then((data) => {
        if (Array.isArray(data)) {
          const unread = data.filter((n) => !n.is_read).length;
          setUnreadNotifsCount(unread);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.referral_code}` : '';

  const copyReferralLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
      badge: null
    },
    {
      to: '/deposit',
      label: 'Deposit USD',
      icon: Wallet,
      badge: null
    },
    {
      to: '/referrals',
      label: '10-Tier Network',
      icon: Share2,
      badge: null
    },
    {
      to: '/wallet',
      label: 'Wallet & Ledger',
      icon: Layers,
      badge: null
    },
    {
      to: '/withdrawals',
      label: 'Withdrawals',
      icon: ArrowUpRight,
      badge: null
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30'
    },
    {
      to: '/support',
      label: 'Support Desk',
      icon: HeadphonesIcon,
      badge: null
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Top Unified Client Portal Command Subnav */}
      <div className="bg-white/95 dark:bg-[#07080A]/95 backdrop-blur-md border-b border-slate-200 dark:border-gold-500/20 sticky top-20 z-40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Identity, Live Balance & Quick Actions */}
          <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5">
            {/* Identity & Status */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Client Portal</span>
              </div>

              {/* Status Pill */}
              <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                profile?.is_qualified
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{profile?.is_qualified ? 'Qualified Leader (Tiers 1-10)' : 'Tier 1 Active (2 Directs to unlock all)'}</span>
              </div>

              {/* Balance Badge */}
              {wallet && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-obsidian-850 border border-slate-200 dark:border-gold-500/30 text-xs font-mono font-bold text-slate-800 dark:text-gold-300">
                  <span className="text-[10px] uppercase text-slate-500 font-sans font-bold">Balance:</span>
                  <span className="text-amber-700 dark:text-gold-400">{formatMoney(wallet.total_balance_cents)}</span>
                </div>
              )}
            </div>

            {/* Quick Actions & Sponsor Code */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Sponsor Code Copy */}
              {user?.referral_code && (
                <button
                  onClick={copyReferralLink}
                  title="Click to copy your unique referral signup link"
                  className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all"
                >
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Sponsor:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-gold-400">{user.referral_code}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              )}

              {/* Quick Deposit Link */}
              <Link
                to="/deposit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gold-gradient text-obsidian-950 hover:brightness-110 active:scale-95 transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deposit</span>
              </Link>

              {/* Quick Withdraw Link */}
              <Link
                to="/withdrawals"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all shadow-sm"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </Link>

              {/* Admin Console shortcut if user is admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* View Public Website */}
              <Link
                to="/"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all"
                title="View Public Homepage"
              >
                <span className="hidden sm:inline">Website</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Subnav Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.exact 
                ? location.pathname === item.to 
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0
                    ${(item.exact ? isActive : isCurrent)
                      ? 'bg-amber-500/15 dark:bg-gradient-to-r dark:from-amber-500/20 dark:to-gold-500/20 text-amber-800 dark:text-gold-300 border border-amber-500/40 dark:border-gold-500/40 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${(item.exact ? location.pathname === item.to : isCurrent) ? 'text-amber-600 dark:text-gold-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.badgeColor || 'bg-amber-500/20 text-amber-700 dark:text-gold-400 border-amber-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Main Client Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {(title || actions || badge) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              {badge && <div className="mb-2">{badge}</div>}
              {title && (
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {actions}
              </div>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
