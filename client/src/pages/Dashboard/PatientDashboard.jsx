import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { faker } from "@faker-js/faker";
import { Particles } from "@tsparticles/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import axios from "axios";
import {
  CalendarDays,
  FlaskConical,
  CreditCard,
  FileText,
  Bell,
  Download,
  Smartphone,
  Clock,
  Phone
} from "lucide-react";

/*
  PatientDashboardPro.jsx
  - Single-file enterprise-grade patient dashboard (mock + real placeholders)
  - Features implemented:
    * Dark/Light theme
    * Responsive layout with Tailwind classes
    * Charts (Recharts) for vitals/trends and appointments
    * Framer Motion micro-interactions
    * Mock real-time updates (sockets placeholder)
    * Notifications panel & audit log (mock)
    * Live Chat placeholder for telemedicine
    * Natural language AI insights (mocked suggestions)
    * Downloadable visit summary (print-friendly / PDF placeholder)
    * Wearable integration demo (mock)
    * Emergency quick-actions
    * Secure placeholders for auth / EHR API integration

  TO CONNECT REAL SYSTEMS
  - Replace faker/mock sections with API calls (React Query / fetch / axios)
  - Replace mock "aiInsight" functions with your model or OpenAI calls
  - Add WebSocket/Socket.IO to push real-time stats and notifications
*/

// ------------------------- Utilities / Mock data -------------------------
const makeVitalsHistory = (days = 7) => {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      systolic: faker.number.int({ min: 110, max: 150 }),
      diastolic: faker.number.int({ min: 70, max: 95 }),
      glucose: faker.number.int({ min: 80, max: 140 })
    };
  });
};

const makeAppointmentsTrend = () =>
  Array.from({ length: 7 }).map((_, i) => ({
    day: `D${i + 1}`,
    scheduled: faker.number.int({ min: 0, max: 8 }),
    attended: faker.number.int({ min: 0, max: 8 })
  }));

const generateAuditLogs = () =>
  Array.from({ length: 6 }).map(() => ({
    time: new Date().toLocaleString(),
    event: faker.helpers.arrayElement(["Viewed lab report", "Downloaded prescription", "Updated contact details", "Viewed bill"]),
    actor: faker.person.fullName()
  }));

// ------------------------- Main Component -------------------------
function PatientDashboardPro() {
  const { user, getAuthHeaders } = useAuth();

  // Theme
  const [dark, setDark] = useState(false);
  // Language demo (EN/UR)
  const [lang, setLang] = useState("en");

  // Patient data from auth context
  const patient = useMemo(() => ({
    name: user?.name || "Guest",
    id: user?.id || "N/A",
    email: user?.email || "",
    role: user?.role || "patient",
    dob: "1988-04-12", // Default or fetch from profile
    gender: "Male", // Default or fetch from profile
  }), [user]);

  // Mock real-time stats and health metrics
  const [vitals] = useState(() => makeVitalsHistory(10));
  const [apptTrend] = useState(() => makeAppointmentsTrend());
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState(generateAuditLogs());
  const [liveStats, setLiveStats] = useState({ beds: 42, doctors: 18, erWait: 15 });

  // Loading toggles represent if real data is active
  const [useRealData, setUseRealData] = useState(false); // toggle to switch to real API when available

  // Chat widget
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hello — I can help with appointments, test results, and medication queries." }]);

  // Real data states
  const [realPrescriptions, setRealPrescriptions] = useState([]);
  const [realAppointments, setRealAppointments] = useState([]);
  const [realLabReports, setRealLabReports] = useState([]);
  const [realBilling, setRealBilling] = useState([]);

  // Mock prescriptions / appointments / billing
  const [prescriptions] = useState(() => [
    { id: faker.string.uuid(), name: "Amlodipine 10mg", status: "Active", dosage: "Once daily", duration: "30 days" },
    { id: faker.string.uuid(), name: "Metformin 500mg", status: "Active", dosage: "Twice daily", duration: "90 days" }
  ]);

  const [appointments] = useState(() => Array.from({ length: 3 }).map(() => ({
    id: faker.string.uuid(),
    date: faker.date.soon(14).toLocaleDateString("en-GB"),
    time: faker.helpers.arrayElement(["09:00", "10:30", "14:00"]),
    doctor: `Dr. ${faker.person.lastName()}`,
    dept: faker.helpers.arrayElement(["Cardiology", "Endocrinology", "Radiology"]),
    status: faker.helpers.arrayElement(["Confirmed", "Pending"]) }
  )));

  const [labReports] = useState(() => Array.from({ length: 4 }).map(() => ({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement(["CBC", "Lipid Panel", "HbA1c", "Chest X-Ray"]),
    date: faker.date.past(0.3).toLocaleDateString("en-GB"),
    status: faker.helpers.arrayElement(["Ready", "Pending", "Reviewed"]) }
  )));

  const [billing] = useState(() => Array.from({ length: 3 }).map(() => ({
    invoice: `INV-${faker.number.int({ min: 3000, max: 9999 })}`,
    amount: `Rs. ${faker.number.int({ min: 800, max: 6500 })}`,
    status: faker.helpers.arrayElement(["Paid", "Unpaid"]),
    date: faker.date.past(0.8).toLocaleDateString("en-GB")
  })));

  // Mock wearable feed (e.g., step count) — rotates
  const [wearable, setWearable] = useState({ steps: faker.number.int({ min: 2000, max: 12000 }), hr: faker.number.int({ min: 60, max: 110 }) });
  useEffect(() => {
    const id = setInterval(() => {
      setWearable({ steps: wearable.steps + faker.number.int({ min: 0, max: 200 }), hr: faker.number.int({ min: 60, max: 110 }) });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // Fetch real notifications
  useEffect(() => {
    if (!user || !user._id) return;
    const fetchNotifications = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await axios.get(`/api/patients/${user._id}/notifications`, { headers });
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, [user, getAuthHeaders]);

  // Fetch real data when useRealData is enabled
  useEffect(() => {
    if (!useRealData || !user || !user._id) return;

    const fetchRealData = async () => {
      try {
        const headers = await getAuthHeaders();
        const [prescriptionsRes, labResultsRes, billingRes, appointmentsRes] = await Promise.all([
          axios.get(`/api/patients/${user._id}/prescriptions`, { headers }),
          axios.get(`/api/patients/${user._id}/lab-results`, { headers }),
          axios.get(`/api/patients/${user._id}/billing`, { headers }),
          axios.get(`/api/patients/${user._id}/appointments`, { headers })
        ]);

        setRealPrescriptions(prescriptionsRes.data);
        setRealLabReports(labResultsRes.data);
        setRealBilling(billingRes.data);
        setRealAppointments(appointmentsRes.data);
      } catch (err) {
        console.error("Failed to fetch real data:", err);
      }
    };

    fetchRealData();
  }, [useRealData, user, getAuthHeaders]);

  // Mock notifications arriving (like real-time) - keep for demo
  useEffect(() => {
    const id = setInterval(() => {
      setNotifications((n) => {
        const next = [
          { id: faker.string.uuid(), text: "New lab result available: HbA1c", level: "info" },
          { id: faker.string.uuid(), text: "Appointment reminder: Cardiology tomorrow 10:00", level: "reminder" },
          { id: faker.string.uuid(), text: "Payment received: INV-", level: "info" }
        ];
        const pick = faker.number.int({ min: 0, max: next.length - 1 });
        return [next[pick], ...n].slice(0, 6);
      });
      // append to audit log
      setAuditLogs((a) => [{ time: new Date().toLocaleString(), event: "Notification pushed", actor: "System" }, ...a].slice(0, 20));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Simple AI insight (mock) - replace with call to model
  const aiInsight = useMemo(() => {
    // naive rule: if latest systolic > 140 give advice
    const latest = vitals[vitals.length - 1];
    if (latest.systolic > 140) return { level: "warning", text: "Your recent BP readings are elevated. Consider a nurse tele-check or medication review." };
    if (latest.glucose > 130) return { level: "info", text: "Glucose trending slightly high — keep monitoring and consult nutritionist." };
    return { level: "ok", text: "Vitals are within expected ranges. Keep current plan." };
  }, [vitals]);

  // Download / Print visit summary (simple printable area)
  const printRef = useRef();
  const handleDownloadSummary = () => {
    // For demo: open print dialog for the summary area. In production use server-side PDF generation or jsPDF/html2pdf.
    window.print();
  };

  // Emulate real-time websocket connection placeholder
  useEffect(() => {
    if (!useRealData) return;
    // TODO: connect to WebSocket or Socket.IO to receive live updates
    // const socket = io('https://your-realtime-endpoint');
    // socket.on('live-stats', setLiveStats);
    // return () => socket.disconnect();
  }, [useRealData]);

  // Micro animation variants
  const cardVariant = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}> 
      {/* Background particles */}
      <div className="absolute inset-0 -z-10">
        <Particles options={{ background: { color: "#00000000" }, particles: { number: { value: 40 }, color: { value: dark ? "#60A5FA" : "#0ea5e9" }, move: { speed: 0.8 } } }} />
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white px-2 py-1 rounded">Medicore</div>
            <div className="font-semibold">Patient Portal</div>
            <div className="text-xs text-gray-500 ml-3">{patient.name} • {patient.id}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setUseRealData((s) => !s)} className="px-3 py-1 rounded border text-sm">{useRealData ? "Using Live APIs" : "Demo Mode"}</button>
            <button onClick={() => setDark((d) => !d)} className="p-2 rounded border" title="Toggle theme">{dark ? <SunIcon /> : <MoonIcon />}</button>
            <button onClick={() => setLang((l) => (l === "en" ? "ur" : "en"))} className="px-3 py-1 rounded border text-sm">{lang === "en" ? "UR" : "EN"}</button>
            <button className="relative p-2 rounded" onClick={() => setNotifications((n) => [])}><Bell className="w-5 h-5" /></button>
            <button onClick={() => handleDownloadSummary()} className="p-2 rounded bg-green-600 text-white"><Download className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Main hero + quick stats */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={cardVariant} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Welcome back, {patient.name}</h2>
                <p className="text-xs text-gray-500">Personalized summary</p>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold">Wellness Score</div>
                <div className="text-2xl text-green-600">{faker.number.int({ min: 70, max: 98 })}%</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm"><span>Next Appointment</span><strong>{appointments[0].date} • {appointments[0].time}</strong></div>
              <div className="flex items-center justify-between text-sm"><span>Active Prescriptions</span><strong>{prescriptions.length}</strong></div>
              <div className="flex items-center justify-between text-sm"><span>Unread Notifications</span><strong>{notifications.length}</strong></div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link to="/appointment-history" className="px-3 py-2 bg-green-600 text-white rounded">Manage Appointments</Link>
              <button onClick={() => setChatOpen(true)} className="px-3 py-2 border rounded">Start Chat</button>
            </div>
          </motion.div>

          {/* Vitals chart */}
          <motion.div variants={cardVariant} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold">Vitals Trend (Last 10 days)</h3>
                <p className="text-xs text-gray-500">Systolic / Diastolic / Glucose</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded">BP</div>
                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Glucose</div>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="diastolic" stroke="#06B6D4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="glucose" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI insight */}
            <div className={`mt-4 p-3 rounded ${aiInsight.level === "warning" ? "bg-red-50 text-red-700" : aiInsight.level === "info" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
              <div className="flex items-center gap-2"><strong>AI Insight:</strong> <span className="text-sm">{aiInsight.text}</span></div>
            </div>
          </motion.div>
        </div>

        {/* Appointments / Lab / Prescriptions row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card title="Appointments" icon={<CalendarDays />}>
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{a.date} • {a.time}</div>
                  <div className="text-xs text-gray-500">{a.doctor} • {a.dept}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${a.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{a.status}</div>
              </div>
            ))}
            <div className="mt-3"><Link to="/appointment-history" className="text-green-600 underline">View all</Link></div>
          </Card>

          <Card title="Lab Reports" icon={<FlaskConical />}>
            {(useRealData ? realLabReports : labReports).slice(0, 3).map((r) => (
              <div key={r._id || r.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{r.testName || r.title}</div>
                  <div className="text-xs text-gray-500">
                    {r.date ? new Date(r.date).toLocaleDateString("en-GB") : r.date}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${r.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</div>
              </div>
            ))}
            <div className="mt-3"><Link to="/patient/lab-results" className="text-green-600 underline">Go to reports</Link></div>
          </Card>

          <Card title="Prescriptions" icon={<FileText />}>
            {(useRealData ? realPrescriptions : prescriptions).slice(0, 3).map((p) => (
              <div key={p._id || p.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{p.medicationName || p.name}</div>
                  <div className="text-xs text-gray-500">{p.dosage} • {p.duration}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{p.status}</div>
              </div>
            ))}
            <div className="mt-3"><Link to="/patient/prescriptions" className="text-green-600 underline">View prescriptions</Link></div>
          </Card>
        </div>

        {/* Billing + wearable + appointment trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card title="Billing" icon={<CreditCard />}>
            {(useRealData ? realBilling : billing).slice(0, 3).map((b) => (
              <div key={b._id || b.invoice} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{b.invoiceNumber || b.invoice}</div>
                  <div className="text-xs text-gray-500">
                    {b.date ? new Date(b.date).toLocaleDateString("en-GB") : b.date} • Rs. {b.amount}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${b.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{b.status}</div>
              </div>
            ))}
            <div className="mt-3"><Link to="/patient/billing" className="text-green-600 underline">Billing center</Link></div>
          </Card>

          <Card title="Wearable" icon={<Smartphone />}>
            <div className="text-sm">
              <div className="flex justify-between"><span>Steps</span><strong>{wearable.steps}</strong></div>
              <div className="flex justify-between"><span>Heart Rate</span><strong>{wearable.hr} bpm</strong></div>
              <div className="mt-3 text-xs text-gray-500">Mock wearable integration. Replace with HealthKit / Google Fit sync.</div>
            </div>
          </Card>

          <Card title="Appointment Trend" icon={<Clock />}>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apptTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scheduled" fill="#8884d8" />
                  <Bar dataKey="attended" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Notifications + Audit log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div variants={cardVariant} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="text-xs text-gray-500">{notifications.length} unread</div>
            </div>
            <div className="mt-3 space-y-2 max-h-48 overflow-auto">
              {notifications.length === 0 && <div className="text-sm text-gray-500">No new notifications</div>}
              {notifications.map((n) => (
                <div key={n.id} className="p-2 border rounded flex items-center justify-between">
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-gray-400">{n.level}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardVariant} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Audit Log</h3>
              <button onClick={() => setAuditLogs(generateAuditLogs())} className="text-xs px-2 py-1 border rounded">Refresh</button>
            </div>
            <div className="mt-3 text-xs max-h-48 overflow-auto space-y-2">
              {auditLogs.map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>{a.time} — {a.event}</div>
                  <div className="text-gray-400">{a.actor}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Chat / Telemedicine */}
        {chatOpen && (
          <div className="fixed right-6 bottom-6 z-50 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white p-3 flex items-center justify-between">
              <div className="font-semibold">Medicore Assistant</div>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className="p-3 h-64 overflow-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded ${m.from === "bot" ? "bg-gray-100 dark:bg-gray-700 text-gray-800" : "bg-green-50 text-green-800 text-right"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input className="flex-1 px-3 py-2 rounded" placeholder="Type your message..." onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMessages((ms) => [...ms, { from: "user", text: e.target.value }]);
                  // mock AI reply
                  setTimeout(() => setMessages((ms) => [...ms, { from: "bot", text: "(AI) I recommend scheduling a nurse tele-check." }]), 800);
                  e.target.value = "";
                }
              }} />
              <button className="px-3 py-2 bg-green-600 text-white rounded">Send</button>
            </div>
          </div>
        )}

        {/* Emergency / quick actions */}
        <div className="fixed left-6 bottom-6 z-40 flex flex-col gap-3">
          <a href="tel:+922111234567" className="bg-red-600 text-white px-4 py-3 rounded-full shadow flex items-center gap-2"><Phone className="w-4 h-4" />Emergency</a>
          <button onClick={() => alert('Mock: trigger emergency alert to your caregivers')} className="bg-yellow-500 text-white px-3 py-2 rounded-full shadow">Raise Alert</button>
        </div>

        {/* Printable summary area (simple demo) */}
        <div className="hidden print:block">
          <div ref={printRef} className="p-6">
            <h1>Visit Summary - {patient.name}</h1>
            <p>Generated on {new Date().toLocaleString()}</p>
            {/* In production, format detailed records and generate PDF server-side or via jsPDF/html2pdf */}
          </div>
        </div>

      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Medicore — Patient Portal</footer>
    </div>
  );
}

// ------------------------- Helper subcomponents -------------------------
function Card({ title, icon, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-green-600">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-sm">{children}</div>
    </motion.div>
  );
}

// Small icons adapted to avoid additional imports in header
function SunIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.22a1 1 0 011 1V6a1 1 0 11-2 0V4.22a1 1 0 011-1zM15.66 5.34a1 1 0 011.41.2l.9 1.56a1 1 0 01-1.7 1.02l-.9-1.56a1 1 0 01.29-1.22zM16.78 10a1 1 0 011 1v.5a1 1 0 11-2 0V11a1 1 0 011-1zM14.07 14.66a1 1 0 01.2 1.41l-1.56.9a1 1 0 01-1.02-1.7l1.56-.9a1 1 0 011.82.29zM10 16.78a1 1 0 011 1V19a1 1 0 11-2 0v-1.22a1 1 0 011-1zM5.34 15.66a1 1 0 01.2-1.41l1.56-.9a1 1 0 011.02 1.7l-1.56.9a1 1 0 01-1.22-.29zM3.22 10a1 1 0 011-1H5.5a1 1 0 110 2H4.22a1 1 0 01-1-1zM5.34 4.34a1 1 0 011.41-.2l1.56.9a1 1 0 11-1.02 1.7l-1.56-.9a1 1 0 01-.39-1.48zM10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>); }
function MoonIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z"/></svg>); }

export default function PatientDashboard() {
  return (
    <ErrorBoundary>
      <PatientDashboardPro />
    </ErrorBoundary>
  );
}
