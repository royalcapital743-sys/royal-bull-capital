import React, { useState, useEffect } from 'react';
import { api, formatDateTime } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { SupportTicket as SupportTicketType } from '../../types';
import { 
  HeadphonesIcon, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle,
  X
} from 'lucide-react';

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicketType[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicketType | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = () => {
    api.get<SupportTicketType[]>('/customer/tickets')
      .then((data) => {
        setTickets(data);
        if (data.length > 0 && !activeTicket) {
          setActiveTicket(data[0]);
        } else if (activeTicket) {
          const updated = data.find((t) => t.id === activeTicket.id);
          if (updated) setActiveTicket(updated);
        }
      })
      .catch((err) => console.warn('Could not fetch tickets:', err));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.post<SupportTicketType>('/customer/tickets', {
        subject,
        category,
        priority,
        initial_message: message,
      });
      setShowModal(false);
      setSubject('');
      setMessage('');
      fetchTickets();
      setActiveTicket(created);
    } catch (err: any) {
      alert(err.message || 'Failed to open ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    try {
      await api.post(`/customer/tickets/${activeTicket.id}/messages`, {
        message: replyText.trim(),
      });
      setReplyText('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <HeadphonesIcon className="w-3.5 h-3.5" /> Support Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Client Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit inquiries regarding simulated deposits, referral attribution, or system settings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-gold-gradient text-obsidian-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Main Grid: Ticket List + Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket List */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400">Your Tickets ({tickets.length})</h2>

          {tickets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No support tickets found. Click "Open Support Ticket" to start an inquiry.
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-obsidian-850 border-gold-500/40 shadow-gold-glow' 
                        : 'bg-obsidian-900 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gold-400 uppercase font-bold">{t.category}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'open' 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : t.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-2">{formatDateTime(t.updated_at)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[500px]">
          {activeTicket ? (
            <div className="flex flex-col h-full justify-between space-y-6">
              
              {/* Ticket Meta Header */}
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeTicket.subject}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Ticket ID: <span className="font-mono text-slate-300">{activeTicket.id}</span></span>
                    <span>·</span>
                    <span>Status: <strong className="uppercase text-gold-400">{activeTicket.status}</strong></span>
                  </div>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] pr-2">
                {activeTicket.messages.map((m) => {
                  const isMe = m.sender_id === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">{m.sender_name || (isMe ? 'You' : 'Support Desk')}</span>
                        <span>·</span>
                        <span className="font-mono">{formatDateTime(m.created_at)}</span>
                      </div>
                      <div
                        className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed ${
                          isMe
                            ? 'bg-gold-500/15 border border-gold-500/30 text-white rounded-tr-none'
                            : 'bg-obsidian-900 border border-white/10 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 flex gap-3">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a response to this inquiry..."
                  className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  className="bg-gold-gradient text-obsidian-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <p className="text-xs text-slate-400">Select a ticket from the left to view the conversation history.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Create New Support Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your question"
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="general">General</option>
                    <option value="deposit">Deposit Simulation</option>
                    <option value="withdrawal">Withdrawal Request</option>
                    <option value="referral">Referral Lineage</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Initial Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or inquiry in detail..."
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold-gradient text-obsidian-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
