import React, { useState, useEffect } from 'react';
import { api, formatDateTime } from '../../api/client';
import { Notification as NotificationType } from '../../types';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" /> Event Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time updates regarding deposits, referral bonuses, commission cascades, and cycle runs.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 bg-obsidian-850 hover:bg-obsidian-800 text-xs font-semibold text-gold-400 border border-gold-500/30 px-4 py-2 rounded-xl transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="glass-panel rounded-3xl border border-white/5 divide-y divide-white/5 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No notifications on record.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`p-6 transition-colors flex items-start gap-4 cursor-pointer ${
                n.is_read ? 'hover:bg-white/[0.01]' : 'bg-gold-500/[0.03] hover:bg-gold-500/[0.06]'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-obsidian-900 border border-white/10 text-gold-400 shrink-0 mt-0.5">
                {n.notif_type === 'commission' && <Layers className="w-5 h-5" />}
                {n.notif_type === 'deposit' && <Wallet className="w-5 h-5" />}
                {n.notif_type === 'cycle' && <TrendingUp className="w-5 h-5" />}
                {n.notif_type !== 'commission' && n.notif_type !== 'deposit' && n.notif_type !== 'cycle' && (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${n.is_read ? 'text-slate-300' : 'text-white'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatDateTime(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
              </div>

              {!n.is_read && (
                <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 shrink-0 shadow-gold-glow" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
