import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, CreditCard, FileText, FlaskConical, HeartPulse, RefreshCw } from 'lucide-react';
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

const safeNumber = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);

const computeWellnessScore = (vitals) => {
  if (!vitals.length) return 0;
  const latest = vitals[vitals.length - 1];
  let score = 100;
  if (safeNumber(latest.systolic) > 140 || safeNumber(latest.diastolic) > 90) score -= 20;
  if (safeNumber(latest.glucose) > 140) score -= 15;
  if (safeNumber(latest.heartRate) > 100 || safeNumber(latest.heartRate) < 55) score -= 10;
  return Math.max(45, Math.min(98, Math.round(score)));
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB');
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const PatientDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [patientProfile, setPatientProfile] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [billing, setBilling] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (isRefresh = false) => {
    if (!user?._id) return;

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const headers = await getAuthHeaders();
      const profile = await apiRequest(`/api/patients/${user._id}`, { headers }).catch(() => null);
      setPatientProfile(profile || null);

      const patientEmail = profile?.userId?.email || user?.email || '';
      const patientId = profile?._id;

      const [prescriptionsRes, labResultsRes, billingRes, notificationsRes, appointmentsRes, vitalsRes] = await Promise.all([
        apiRequest(`/api/patients/${user._id}/prescriptions`, { headers }).catch(() => []),
        apiRequest(`/api/patients/${user._id}/lab-results`, { headers }).catch(() => []),
        apiRequest(`/api/patients/${user._id}/billing`, { headers }).catch(() => []),
        apiRequest(`/api/patients/${user._id}/notifications`, { headers }).catch(() => []),
        patientEmail
          ? apiRequest(`/api/appointments/history?patientEmail=${encodeURIComponent(patientEmail)}`, { headers }).catch(() => ({ items: [] }))
          : Promise.resolve({ items: [] }),
        patientId ? apiRequest(`/api/vitals/patient/${patientId}`, { headers }).catch(() => []) : Promise.resolve([]),
      ]);

      setPrescriptions(Array.isArray(prescriptionsRes) ? prescriptionsRes : []);
      setLabReports(Array.isArray(labResultsRes) ? labResultsRes : []);
      setBilling(Array.isArray(billingRes) ? billingRes : []);
      setNotifications(Array.isArray(notificationsRes) ? notificationsRes : []);
      setAppointments(Array.isArray(appointmentsRes?.items) ? appointmentsRes.items : Array.isArray(appointmentsRes) ? appointmentsRes : []);

      const normalizedVitals = (Array.isArray(vitalsRes) ? vitalsRes : [])
        .map((item) => ({
          date: formatDate(item.recordedAt || item.date),
          rawDate: item.recordedAt || item.date,
          systolic: item.bloodPressure?.systolic ?? item.systolic ?? 0,
          diastolic: item.bloodPressure?.diastolic ?? item.diastolic ?? 0,
          glucose: item.bloodSugar ?? item.glucose ?? 0,
          heartRate: item.heartRate ?? item.hr ?? 0,
        }))
        .filter((item) => item.rawDate)
        .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
        .map(({ rawDate, ...rest }) => rest);
      setVitals(normalizedVitals);
    } catch (err) {
      console.error('Failed to load patient dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?._id]);

  const patientName = patientProfile?.userId?.name || user?.name || 'Patient';
  const nextAppointment = appointments[0];
  const paidTotal = billing.filter((bill) => bill.paymentStatus === 'Paid').reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const outstanding = billing.filter((bill) => bill.paymentStatus !== 'Paid').reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const wellnessScore = useMemo(() => computeWellnessScore(vitals), [vitals]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-400">Loading patient dashboard...</div>
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
                Patient Portal
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">{patientName}</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Review appointments, vitals, prescriptions, lab outcomes, and billing without the noisy demo widgets.
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
            { label: 'Wellness score', value: `${wellnessScore}%`, icon: HeartPulse },
            { label: 'Appointments', value: appointments.length, icon: CalendarDays },
            { label: 'Lab reports', value: labReports.length, icon: FlaskConical },
            { label: 'Outstanding', value: formatCurrency(outstanding), icon: CreditCard },
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
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Vitals trend</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Clinical summary</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitals}>
                  <defs>
                    <linearGradient id="patientVitalsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="systolic" stroke="#38bdf8" fill="url(#patientVitalsFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="glucose" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next appointment</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {nextAppointment?.doctor || nextAppointment?.doctorName || 'No upcoming appointment'}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {nextAppointment
                  ? `${formatDate(nextAppointment.slot || nextAppointment.date || nextAppointment.appointmentDate)} ${nextAppointment.time || nextAppointment.appointmentTime || ''}`
                  : 'Book your next visit to populate this area.'}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Paid to date</p>
                <p className="mt-2 text-xl font-semibold text-emerald-300">{formatCurrency(paidTotal)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Notifications</p>
                <p className="mt-2 text-xl font-semibold text-white">{notifications.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Prescriptions</p>
                <p className="mt-2 text-xl font-semibold text-white">{prescriptions.length}</p>
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Panel>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Appointments</h2>
            </div>
            <div className="mt-5 space-y-3">
              {appointments.slice(0, 4).map((appointment, index) => (
                <div key={appointment.id || appointment._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-medium text-white">{appointment.doctor || appointment.doctorName || 'Doctor'}</p>
                  <p className="mt-2 text-sm text-slate-300">{formatDate(appointment.slot || appointment.date || appointment.appointmentDate)}</p>
                </div>
              ))}
              {!appointments.length && <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No appointments found.</div>}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Prescriptions</h2>
            </div>
            <div className="mt-5 space-y-3">
              {prescriptions.slice(0, 4).map((prescription, index) => (
                <div key={prescription.id || prescription._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-medium text-white">{prescription.medication || prescription.name || 'Medication'}</p>
                  <p className="mt-2 text-sm text-slate-300">{prescription.dosage || 'Dosage unavailable'}</p>
                </div>
              ))}
              {!prescriptions.length && <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No prescriptions found.</div>}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-cyan-300" />
              <h2 className="text-xl font-semibold text-white">Lab reports</h2>
            </div>
            <div className="mt-5 space-y-3">
              {labReports.slice(0, 4).map((report, index) => (
                <div key={report.id || report._id || index} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-medium text-white">{report.testName || report.title || 'Lab report'}</p>
                  <p className="mt-2 text-sm text-slate-300">{report.result || report.status || 'Pending'}</p>
                </div>
              ))}
              {!labReports.length && <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">No lab reports found.</div>}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
