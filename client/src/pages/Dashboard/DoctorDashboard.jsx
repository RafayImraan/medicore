import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CalendarDays, Clock3, FlaskConical, RefreshCw, Stethoscope, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiRequest } from '../../services/api';

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

const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 'N/A';
  return Math.max(0, Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [vitalsLive, setVitalsLive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?._id || parsedUser?.id;

      let profile = null;
      if (userId) {
        profile = await apiRequest(`/api/doctors/${userId}`).catch(() => null);
        setDoctorProfile(profile);
      }

      const [patientsData, notificationsData, vitalsData] = await Promise.all([
        apiRequest('/api/patients'),
        apiRequest('/api/notifications'),
        apiRequest('/api/vitals/live'),
      ]);

      const appointmentsData = profile?._id ? await apiRequest(`/api/appointments/doctor/${profile._id}`).catch(() => []) : [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      setVitalsLive(Array.isArray(vitalsData) ? vitalsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const patientCards = useMemo(() => {
    return patients.slice(0, 6).map((patient) => {
      const age = getAge(patient.dateOfBirth);
      const history = patient.medicalHistory || [];
      const riskScore = Math.min(100, Math.max(0, (age || 0) + history.length * 8));
      return {
        id: patient._id,
        name: patient.userId?.name || 'Unknown Patient',
        condition: history[0]?.condition || 'General care',
        age,
        risk: riskScore,
      };
    });
  }, [patients]);

  const todayAppointments = useMemo(() => {
    return appointments.slice(0, 6).map((appointment) => ({
      id: appointment._id,
      patient: appointment.patient?.name || 'Unknown Patient',
      reason: appointment.reason || 'Consultation',
      status: appointment.status || 'pending',
      time: appointment.appointmentTime || '',
    }));
  }, [appointments]);

  const vitalsTrend = useMemo(() => {
    return vitalsLive.slice(0, 8).map((entry, index) => ({
      index: index + 1,
      heartRate: entry.heartRate ?? entry.hr ?? 0,
      oxygen: entry.oxygenSaturation ?? entry.o2 ?? 0,
    }));
  }, [vitalsLive]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-400">Loading doctor dashboard...</div>
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
                Physician Workspace
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">
                  {doctorProfile?.userId?.name ? `Dr. ${doctorProfile.userId.name}` : 'Doctor Dashboard'}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Review today’s clinic load, patient risk, and live physiological signals without the old widget clutter.
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
                Refresh
              </button>
            </div>
          </div>
        </Panel>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Assigned patients', value: patients.length, icon: Users },
            { label: 'Today appointments', value: appointments.length, icon: CalendarDays },
            { label: 'Unread alerts', value: notifications.length, icon: Activity },
            { label: 'Specialty', value: doctorProfile?.specialization || 'General', icon: Stethoscope },
          ].map((card) => {
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

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live vitals</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Physiology watch</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitalsTrend}>
                  <defs>
                    <linearGradient id="doctorVitalsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                  <XAxis dataKey="index" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="heartRate" stroke="#38bdf8" fill="url(#doctorVitalsFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="oxygen" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick access</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Clinical shortcuts</h2>
            <div className="mt-6 grid gap-3">
              {[
                { label: 'Schedule', path: '/doctor/schedule', icon: CalendarDays },
                { label: 'Lab results', path: '/doctor/lab-results', icon: FlaskConical },
                { label: 'Patients', path: '/doctor/patients', icon: Users },
                { label: 'Billing', path: '/doctor/billing', icon: Clock3 },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-4 text-left transition hover:border-white/20 hover:bg-slate-950/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-white">{action.label}</span>
                    </div>
                    <span className="text-sm text-slate-500">Open</span>
                  </button>
                );
              })}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient list</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Risk review</h2>
            <div className="mt-5 space-y-3">
              {patientCards.length ? (
                patientCards.map((patient) => (
                  <div key={patient.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{patient.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {patient.condition} · {patient.age} years
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                        Risk {patient.risk}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No patients assigned yet.</div>
              )}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Clinic agenda</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Upcoming appointments</h2>
            <div className="mt-5 space-y-3">
              {todayAppointments.length ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{appointment.patient}</p>
                        <p className="mt-1 text-sm text-slate-400">{appointment.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{appointment.time || 'TBD'}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{appointment.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No appointments scheduled.</div>
              )}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
