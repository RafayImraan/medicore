import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_DEPARTMENTS = ['Radiology', 'Emergency', 'ICU', 'Admin', 'Pharmacy', 'Cardiology', 'Pediatrics'];
const DEFAULT_ROLES = ['Doctor', 'Nurse', 'Lab Tech', 'Receptionist', 'Admin', 'Pharmacist'];

const toTitle = (value = '') =>
  value
    .toString()
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const getInitials = (value = '') => {
  const parts = value.split(' ').filter(Boolean);
  if (!parts.length) return 'ST';
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

const Panel = ({ children, className = '' }) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(4,10,28,0.45)] backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

const formatTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StaffChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiRequest('/api/staff-chat?limit=200');
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load staff chat:', err);
        setError('Failed to load staff chat messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(messages.map((message) => message.role).filter(Boolean))];
    return roles.length ? roles : DEFAULT_ROLES;
  }, [messages]);

  const uniqueDepartments = useMemo(() => {
    const departments = [...new Set(messages.map((message) => message.department).filter(Boolean))];
    return departments.length ? departments : DEFAULT_DEPARTMENTS;
  }, [messages]);

  const filtered = useMemo(() => {
    return messages.filter((message) => {
      const matchesRole = filterRole === 'All' || message.role === filterRole;
      const matchesDept = filterDept === 'All' || message.department === filterDept;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        message.senderName?.toLowerCase().includes(searchLower) || message.message?.toLowerCase().includes(searchLower);
      return matchesRole && matchesDept && matchesSearch;
    });
  }, [filterDept, filterRole, messages, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      const leftTime = new Date(left.createdAt || left.updatedAt || 0);
      const rightTime = new Date(right.createdAt || right.updatedAt || 0);
      return sortOrder === 'recent' ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [filtered, sortOrder]);

  const urgentCount = messages.filter((message) => {
    const body = (message.message || '').toLowerCase();
    return body.includes('urgent') || body.includes('code red');
  }).length;

  const latestActivity = messages[0]?.createdAt || messages[0]?.updatedAt || null;

  const handleSendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);
      const payload = {
        senderName: user?.name || 'Staff Member',
        role: toTitle(user?.role || 'Staff'),
        department: user?.department || 'General',
        message: trimmed,
      };
      const created = await apiRequest('/api/staff-chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMessages((current) => [created, ...current]);
      setDraft('');
      setError('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const controlClass =
    'w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#102d52_0%,#09111f_45%,#030712_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Panel className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Staff Coordination
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Clinical Messaging Hub</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Keep departments synchronized on urgent escalations, staffing updates, and shift-critical operational
                  changes without sacrificing readability or response speed.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Messages</p>
                <p className="mt-2 text-3xl font-semibold text-white">{messages.length}</p>
                <p className="mt-2 text-sm text-slate-400">Total messages in the live staff feed.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Urgent Flags</p>
                <p className="mt-2 text-3xl font-semibold text-rose-300">{urgentCount}</p>
                <p className="mt-2 text-sm text-slate-400">Messages containing urgent escalation language.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Latest Activity</p>
                <p className="mt-2 text-lg font-semibold text-white">{latestActivity ? formatTime(latestActivity) : 'N/A'}</p>
                <p className="mt-2 text-sm text-slate-400">{uniqueDepartments.length} active departments in stream.</p>
              </div>
            </div>
          </div>
        </Panel>

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Message Filters</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Routing Lens</h2>
              <p className="mt-2 text-sm text-slate-400">Cut the feed by role, department, and urgency before triaging the thread.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Search</label>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search messages or senders"
                  className={controlClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Role</label>
                <select value={filterRole} onChange={(event) => setFilterRole(event.target.value)} className={controlClass}>
                  <option>All</option>
                  {uniqueRoles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Department</label>
                <select value={filterDept} onChange={(event) => setFilterDept(event.target.value)} className={controlClass}>
                  <option>All</option>
                  {uniqueDepartments.map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sort</label>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className={controlClass}>
                  <option value="recent">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel>
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Feed</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Department Thread</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                  {sorted.length} matching messages
                </div>
              </div>

              <div className="mt-5 max-h-[620px] space-y-4 overflow-y-auto pr-1">
                {loading && <div className="py-16 text-center text-sm text-slate-400">Loading messages...</div>}
                {!loading && sorted.length === 0 && (
                  <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl text-slate-300">
                      !
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">No messages matched the current view.</p>
                      <p className="mt-2 text-sm text-slate-400">Relax the filters or search a different department.</p>
                    </div>
                  </div>
                )}

                {sorted.map((message) => {
                  const body = (message.message || '').toLowerCase();
                  const isUrgent = body.includes('urgent') || body.includes('code red');
                  return (
                    <article
                      key={message._id || message.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 transition hover:border-white/15 hover:bg-slate-950/60"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-bold text-slate-950">
                          {getInitials(message.senderName || 'Staff')}
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-semibold text-white">{message.senderName || 'Staff'}</p>
                                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
                                  {message.role || 'Staff'}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                                  {message.department || 'General'}
                                </span>
                                {isUrgent && (
                                  <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Message ID {(message._id || message.id || '').toString().slice(-6)}
                              </p>
                            </div>

                            <div className="text-xs text-slate-400">{formatTime(message.createdAt || message.updatedAt)}</div>
                          </div>

                          <p className="text-sm leading-7 text-slate-200">{message.message}</p>

                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span>Status: {message.status || 'Sent'}</span>
                            <span>Channel: Internal staff feed</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Panel>

            <Panel className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Composer</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Send Update</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {toTitle(user?.role || 'Staff')} / {user?.department || 'General'}
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-bold text-slate-950">
                  {getInitials(user?.name || 'Me')}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={4}
                    placeholder="Share a patient handoff note, staffing update, or urgent request..."
                    className={`${controlClass} resize-none`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">Press Enter to send. Use Shift+Enter for a new line.</p>
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!draft.trim() || sending}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffChat;
