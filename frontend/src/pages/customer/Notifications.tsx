import React, { useState, useEffect } from 'react';
import { api, formatDateTime } from '../../api/client';
import { Notification as NotificationType } from '../../types';
import { CustomerLayout } from '../../components/CustomerLayout';
import { Bell, CheckCheck, Circle, Info, Layers, Wallet, TrendingUp } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get<NotificationType[]>('/customer/notifications')
      .then(setNotifications)
      .catch((err) => console.warn('Could not load notifications:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.post(`/customer/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/customer/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn(err);
    }
  };

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <CustomerLayout
      title="Notifications Center"
      subtitle="Real-time updates regarding deposits, referral bonuses, commission cascades, and cycle runs."
      actions={
        hasUnread ? (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 text-xs font-semibold text-amber-700 dark:text-gold-400 border border-slate-200 dark:border-gold-500/30 px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        ) : undefined
      }
    >
      <div className="glass-panel rounded-3xl border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No notifications on record.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`p-6 transition-colors flex items-start gap-4 cursor-pointer ${
                n.is_read 
                  ? 'hover:bg-slate-50 dark:hover:bg-white/[0.01]' 
                  : 'bg-amber-50/50 dark:bg-gold-500/[0.03] hover:bg-amber-50 dark:hover:bg-gold-500/[0.06]'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-amber-600 dark:text-gold-400 shrink-0 mt-0.5">
                {n.notif_type === 'commission' && <Layers className="w-5 h-5" />}
                {n.notif_type === 'deposit' && <Wallet className="w-5 h-5" />}
                {n.notif_type === 'cycle' && <TrendingUp className="w-5 h-5" />}
                {n.notif_type !== 'commission' && n.notif_type !== 'deposit' && n.notif_type !== 'cycle' && (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${n.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {formatDateTime(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
              </div>

              {!n.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-gold-400 mt-2 shrink-0 shadow-sm" />
              )}
            </div>
          ))
        )}
      </div>
    </CustomerLayout>
  );
};
