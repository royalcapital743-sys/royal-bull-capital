import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, formatDateTime } from '../../api/client';
import { CustomerLayout } from '../../components/CustomerLayout';
import { User, Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess('Your password has been securely updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout
      title="Profile & Security Settings"
      subtitle="Review your account lineage, verification status, and manage your access credentials."
    >
      {/* Profile Overview Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-600 dark:text-gold-400" /> Account Profile Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Client Full Name</span>
            <span className="text-slate-900 dark:text-white font-bold">{user?.name}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Verified Email Address</span>
            <span className="text-slate-900 dark:text-white font-bold">{user?.email}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Assigned Referral Code</span>
            <span className="text-amber-700 dark:text-gold-400 font-bold">{user?.referral_code}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Platform Role</span>
            <span className="text-slate-900 dark:text-white font-bold uppercase">{user?.role}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Account Identifier (ID)</span>
            <span className="text-slate-600 dark:text-slate-400 font-bold text-[11px] truncate">{user?.id}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans block">Member Since</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{user?.created_at ? formatDateTime(user.created_at) : '—'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600 dark:text-gold-400" /> Update Password Credentials
        </h2>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gold-gradient text-obsidian-950 font-bold px-6 py-3 rounded-xl text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
};
