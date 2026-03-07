import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Clock3,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Search,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "operations", label: "Operations", icon: Activity },
  { id: "pharmacy", label: "Pharmacy", icon: Pill },
];

const overviewStats = [
  { id: "occupancy", label: "Bed occupancy", value: "82%", delta: "+4%", icon: Building2 },
  { id: "er", label: "ER queue", value: "14", delta: "-2", icon: Ambulance },
  { id: "surgeries", label: "Surgeries today", value: "9", delta: "+1", icon: Stethoscope },
  { id: "revenue", label: "Daily revenue", value: "$184K", delta: "+8%", icon: TrendingUp },
];

const admissionTrend = [
  { name: "06:00", value: 18 },
  { name: "09:00", value: 28 },
  { name: "12:00", value: 34 },
  { name: "15:00", value: 42 },
  { name: "18:00", value: 31 },
  { name: "21:00", value: 24 },
];

const departmentLoad = [
  { name: "Cardiology", value: 82 },
  { name: "Neurology", value: 68 },
  { name: "Orthopedics", value: 74 },
  { name: "Emergency", value: 91 },
  { name: "Pediatrics", value: 63 },
];

const payerMix = [
  { name: "Private", value: 46, color: "#f4b942" },
  { name: "Insurance", value: 34, color: "#16a34a" },
  { name: "Corporate", value: 12, color: "#2563eb" },
  { name: "Other", value: 8, color: "#ef4444" },
];

const liveAlerts = [
  { title: "ICU nearing threshold", detail: "Occupancy reached 89%. Overflow protocol on standby.", level: "high" },
  { title: "Ambulance ETA updated", detail: "Unit A12 arriving in 6 minutes with trauma case.", level: "medium" },
  { title: "Pharmacy restock required", detail: "Critical antibiotic inventory below reorder point.", level: "medium" },
];

const patientRoster = [
  { id: "PAT-442", name: "James Carter", status: "Stable", ward: "Ward A", doctor: "Dr. H. Malik" },
  { id: "PAT-517", name: "Sara Rehman", status: "Critical", ward: "ICU", doctor: "Dr. N. Ahmed" },
  { id: "PAT-588", name: "Daniel Moss", status: "Recovery", ward: "Ward C", doctor: "Dr. F. Khan" },
  { id: "PAT-602", name: "Amna Tariq", status: "Observation", ward: "ER", doctor: "Dr. S. Noor" },
];

const operationsFeed = [
  { title: "Operating room 2", value: "Cardiac bypass in progress", meta: "1h 20m remaining" },
  { title: "Diagnostic imaging", value: "7 scans pending validation", meta: "Priority queue active" },
  { title: "Staff roster", value: "28 specialists on active shift", meta: "3 pending handovers" },
];

const pharmacyItems = [
  { name: "Meropenem", stock: "Low", eta: "Restock 2h", status: "warning" },
  { name: "Atorvastatin", stock: "Healthy", eta: "On schedule", status: "ok" },
  { name: "Insulin", stock: "Critical", eta: "Courier dispatched", status: "critical" },
  { name: "Contrast dye", stock: "Healthy", eta: "On schedule", status: "ok" },
];

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

function StatCard({ item }) {
  const Icon = item.icon;
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          <p className="mt-1 text-sm text-emerald-300">{item.delta}</p>
        </div>
        <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Panel>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredPatients = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return patientRoster;
    return patientRoster.filter((patient) =>
      `${patient.id} ${patient.name} ${patient.ward} ${patient.doctor}`.toLowerCase().includes(value)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/15 to-charcoal-950 text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 shrink-0 xl:block">
          <Panel className="sticky top-24">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Medicore Command</p>
                <p className="text-sm text-slate-400">Executive operations console</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                      activeTab === item.id
                        ? "bg-accent-500 text-charcoal-950"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-300" />
                <div>
                  <p className="font-medium text-white">Critical notices</p>
                  <p className="mt-1 text-sm text-slate-300">3 active alerts require administrative review.</p>
                </div>
              </div>
            </div>
          </Panel>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <Panel className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Hospital command center</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Executive Overview</h1>
                <p className="mt-2 text-sm text-slate-400">
                  {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-slate-300">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search patients or wards"
                    className="w-56 bg-transparent text-white outline-none placeholder:text-slate-500"
                  />
                </div>
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <Bell className="mr-2 inline h-4 w-4" />
                  Alerts
                </button>
              </div>
            </div>
          </Panel>

          {activeTab === "overview" && (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((item) => (
                  <StatCard key={item.id} item={item} />
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Panel>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admissions trend</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Patient flow over the day</h2>
                    </div>
                  </div>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={admissionTrend}>
                        <defs>
                          <linearGradient id="admissionsFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f4b942" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#f4b942" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#f4b942" fill="url(#admissionsFill)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <Panel>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live alerts</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Priority events</h2>
                  <div className="mt-6 space-y-4">
                    {liveAlerts.map((alert) => (
                      <div key={alert.title} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{alert.title}</p>
                            <p className="mt-2 text-sm text-slate-300">{alert.detail}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              alert.level === "high"
                                ? "bg-red-500/15 text-red-300"
                                : "bg-amber-500/15 text-amber-300"
                            }`}
                          >
                            {alert.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </section>

              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Panel>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Department load</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Capacity by unit</h2>
                  <div className="mt-6 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentLoad}>
                        <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>

                <Panel>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payer mix</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Revenue composition</h2>
                  <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={payerMix} innerRadius={70} outerRadius={110} dataKey="value" paddingAngle={4}>
                            {payerMix.map((item) => (
                              <Cell key={item.name} fill={item.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {payerMix.map((item) => (
                        <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-950/40 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-200">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium text-white">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </section>
            </>
          )}

          {activeTab === "patients" && (
            <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient roster</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Current admissions</h2>
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10 text-sm">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Patient</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Ward</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Doctor</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="bg-charcoal-950/30">
                          <td className="px-4 py-3 text-slate-300">{patient.id}</td>
                          <td className="px-4 py-3 text-white">{patient.name}</td>
                          <td className="px-4 py-3 text-slate-300">{patient.ward}</td>
                          <td className="px-4 py-3 text-slate-300">{patient.doctor}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              patient.status === "Critical"
                                ? "bg-red-500/15 text-red-300"
                                : patient.status === "Observation"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-emerald-500/15 text-emerald-300"
                            }`}>
                              {patient.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Throughput</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Admissions vs discharges</h2>
                <div className="mt-6 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: "Mon", admissions: 34, discharges: 26 },
                        { day: "Tue", admissions: 39, discharges: 28 },
                        { day: "Wed", admissions: 41, discharges: 33 },
                        { day: "Thu", admissions: 37, discharges: 29 },
                        { day: "Fri", admissions: 46, discharges: 38 },
                      ]}
                    >
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Line type="monotone" dataKey="admissions" stroke="#f4b942" strokeWidth={3} />
                      <Line type="monotone" dataKey="discharges" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </section>
          )}

          {activeTab === "operations" && (
            <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operational feed</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">High-attention workflows</h2>
                <div className="mt-6 space-y-4">
                  {operationsFeed.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-300">{item.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{item.meta}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Response timing</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Emergency dispatch performance</h2>
                <div className="mt-6 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { hour: "08", eta: 11 },
                        { hour: "10", eta: 9 },
                        { hour: "12", eta: 13 },
                        { hour: "14", eta: 8 },
                        { hour: "16", eta: 7 },
                        { hour: "18", eta: 10 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="dispatchFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                      <XAxis dataKey="hour" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="eta" stroke="#ef4444" fill="url(#dispatchFill)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </section>
          )}

          {activeTab === "pharmacy" && (
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pharmacy stock</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Critical inventory state</h2>
                <div className="mt-6 space-y-3">
                  {pharmacyItems.map((item) => (
                    <div key={item.name} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{item.eta}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.status === "critical"
                              ? "bg-red-500/15 text-red-300"
                              : item.status === "warning"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Consumption forecast</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Seven-day demand trend</h2>
                <div className="mt-6 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { day: "Mon", units: 120 },
                        { day: "Tue", units: 132 },
                        { day: "Wed", units: 128 },
                        { day: "Thu", units: 141 },
                        { day: "Fri", units: 156 },
                        { day: "Sat", units: 149 },
                        { day: "Sun", units: 138 },
                      ]}
                    >
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="units" radius={[8, 8, 0, 0]} fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
