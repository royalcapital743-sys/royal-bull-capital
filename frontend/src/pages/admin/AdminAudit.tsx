import React, { useEffect, useState } from 'react';
import { api, formatDateTime } from '../../api/client';
import { AuditLog } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.get<AuditLog[]>('/admin/audit-logs')
      .then(setLogs)
      .catch((err) => console.warn('Could not load audit logs:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-2 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          System Security & Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Immutable event log tracking administrative interventions, approvals, registrations, and ledger events.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Operator ID</th>
                  <th className="py-3 px-3">Entity Type</th>
                  <th className="py-3 px-3">Entity ID</th>
                  <th className="py-3 px-3">Event Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-obsidian-900 border border-white/10 text-gold-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{log.admin_id || 'System'}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{log.entity_type}</td>
                    <td className="py-3 px-3 text-slate-500">{log.entity_id}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans max-w-md truncate">{log.detail || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
