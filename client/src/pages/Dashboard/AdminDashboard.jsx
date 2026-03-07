import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  ClipboardList,
  Database,
  RefreshCw,
  Server,
  Shield,
  Siren,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiRequest } from '../../services/api';

const fallbackKpis = {
  appointmentsToday: 148,
  doctorsAvailable: 42,
  openBeds: 27,
  revenueToday: 184000,
  patientSatisfaction: 96,
  averageWaitTime: 14,
};

const Panel = ({ children, className = '' }) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(4,10,28,0.45)] backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

const tooltipStyle = {
  contentStyle: {
    background: '#071424',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    color: '#f8fafc',
  },
  labelStyle: { color: '#cbd5e1' },
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      const response = await apiRequest('/api/admin/dashboard');
      setDashboard(response || {});
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load live admin dashboard data. Showing fallback operational summary.');
      setDashboard({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const kpis = { ...fallbackKpis, ...(dashboard?.kpis || {}) };
  const trend = useMemo(() => {
    if (Array.isArray(dashboard?.trend) && dashboard.trend.length) return dashboard.trend;
    return [
      { label: 'Mon', revenue: 160000, visits: 112 },
      { label: 'Tue', revenue: 172000, visits: 120 },
      { label: 'Wed', revenue: 168000, visits: 118 },
      { label: 'Thu', revenue: 181000, visits: 130 },
      { label: 'Fri', revenue: 184000, visits: 148 },
    ];
  }, [dashboard?.trend]);

  const incidents = Array.isArray(dashboard?.incidents) ? dashboard.incidents.slice(0, 5) : [];
  const tasks = Array.isArray(dashboard?.tasks) ? dashboard.tasks.slice(0, 5) : [];
  const notifications = Array.isArray(dashboard?.notifications) ? dashboard.notifications.slice(0, 5) : [];
  const accessLogs = Array.isArray(dashboard?.accessLogs) ? dashboard.accessLogs.slice(0, 6) : [];
  const systemHealth = dashboard?.serverHealth || dashboard?.systemHealth || {};
  const cpu = systemHealth.cpu?.usagePercent ?? systemHealth.cpu ?? 34;
  const memory = systemHealth.memory?.usagePercent ?? systemHealth.mem ?? 58;
  const apiLatency = systemHealth.apiLatency ?? 124;

  const statCards = [
    { label: 'Appointments today', value: kpis.appointmentsToday, icon: Activity },
    { label: 'Doctors available', value: kpis.doctorsAvailable, icon: Stethoscope },
    { label: 'Open beds', value: kpis.openBeds, icon: Users },
    { label: 'Revenue today', value: formatCurrency(kpis.revenueToday), icon: Database },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Panel className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Executive Command
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Admin Dashboard</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor hospital throughput, revenue pressure, incident flow, and infrastructure health from a single control layer.
                </p>
              </div>
            </div>

            <div className="flex items-start justify-end">
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
            </div>
          </div>
        </Panel>

        {error && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Panel key={card.label} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Panel>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenue + Throughput</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Five-day trend</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#adminRevenueFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="visits" stroke="#38bdf8" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Infrastructure</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">System health</h2>
            </div>
            {[
              { label: 'CPU usage', value: `${cpu}%`, icon: Server },
              { label: 'Memory usage', value: `${memory}%`, icon: Activity },
              { label: 'API latency', value: `${apiLatency} ms`, icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel>
            <div className="flex items-center gap-3">
              <Siren className="h-5 w-5 text-rose-300" />
              <h2 className="text-xl font-semibold text-white">Incidents</h2>
            </div>
            <div className="mt-5 space-y-3">
              {incidents.length ? (
                incidents.map((incident, index) => (
                  <div key={incident.id || incident._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="font-medium text-white">{incident.title || incident.type || 'Operational incident'}</p>
                    <p className="mt-2 text-sm text-slate-300">{incident.description || incident.location || 'Awaiting more detail.'}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No active incidents reported.</div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Task board</h2>
            </div>
            <div className="mt-5 space-y-3">
              {tasks.length ? (
                tasks.map((task, index) => (
                  <div key={task.id || task._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="font-medium text-white">{task.title || 'Operational task'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{task.status || 'Open'}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No open tasks in the current queue.</div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-amber-300" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="mt-5 space-y-3">
              {notifications.length ? (
                notifications.map((note, index) => (
                  <div key={note.id || note._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <p className="font-medium text-white">{note.title || note.text || 'Notification'}</p>
                    <p className="mt-2 text-sm text-slate-300">{note.message || note.description || 'No message body provided.'}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No unread notifications.</div>
              )}
            </div>
          </Panel>
        </section>

        <Panel>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold text-white">Recent access activity</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {accessLogs.length ? (
              accessLogs.map((entry, index) => (
                <div key={entry.id || entry._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-medium text-white">{entry.user || entry.actor || 'System user'}</p>
                  <p className="mt-2 text-sm text-slate-300">{entry.action || entry.event || 'Accessed dashboard'}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Timestamp unavailable'}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No recent access logs available.</div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboard;
