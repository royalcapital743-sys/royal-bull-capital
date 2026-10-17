import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  Sliders, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Play
} from 'lucide-react';

interface QuickCounts {
  pending_deposits_count: number;
  pending_withdrawals_count: number;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  actions 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [counts, setCounts] = useState<QuickCounts>({ pending_deposits_count: 0, pending_withdrawals_count: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQuickCounts = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.get<any>('/admin/overview');
      setCounts({
        pending_deposits_count: data.pending_deposits_count || 0,
        pending_withdrawals_count: data.pending_withdrawals_count || 0,
      });
    } catch (err) {
      // quiet fail for counts
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuickCounts();
    // Poll counts every 30 seconds for live admin awareness
    const interval = setInterval(fetchQuickCounts, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navItems = [
    {
      to: '/admin',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
      badge: null
    },
    {
      to: '/admin/users',
      label: 'Users & Tree',
      icon: Users,
      badge: null
    },
    {
      to: '/admin/deposits',
      label: 'Deposits',
      icon: Wallet,
      badge: counts.pending_deposits_count > 0 ? counts.pending_deposits_count : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      to: '/admin/withdrawals',
      label: 'Withdrawals',
      icon: ArrowUpRight,
      badge: counts.pending_withdrawals_count > 0 ? counts.pending_withdrawals_count : null,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    {
      to: '/admin/rules',
      label: 'Commission Rules',
      icon: Sliders,
      badge: null
    },
    {
      to: '/admin/monthly-cycles',
      label: 'Monthly Simulator',
      icon: TrendingUp,
      badge: null
    },
    {
      to: '/admin/audit',
      label: 'Audit Trail',
      icon: ShieldAlert,
      badge: null
    },
  ];

  const totalPending = counts.pending_deposits_count + counts.pending_withdrawals_count;

  return (
    <div className="min-h-screen pb-16">
      {/* Top Unified Admin Command Banner */}
      <div className="bg-obsidian-950/80 dark:bg-[#07080A]/95 backdrop-blur-md border-b border-amber-500/20 sticky top-20 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Identity & Quick System Switchers */}
          <div className="py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Console</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-semibold text-white">{user?.name || 'Administrator'}</span>
                <span className="text-slate-500">({user?.email})</span>
                <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-gold-500/10 text-gold-400 border border-gold-500/20 font-bold">
                  {user?.role || 'admin'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Alert Pill if pending actions */}
              {totalPending > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{totalPending} Pending {totalPending === 1 ? 'Action' : 'Actions'}</span>
                </div>
              )}

              {/* Refresh Live Counts */}
              <button 
                onClick={fetchQuickCounts}
                title="Refresh stats and pending counts"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-gold-400' : ''}`} />
              </button>

              {/* Quick Jump to Customer View */}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-sm"
              >
                <span>Client View</span>
                <ExternalLink className="w-3 h-3 text-gold-400" />
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
                      ? 'bg-gradient-to-r from-amber-500/20 to-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm shadow-gold-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${(item.exact ? location.pathname === item.to : isCurrent) ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.badgeColor || 'bg-gold-500/20 text-gold-400 border-gold-500/30'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Main Admin Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
