import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Particles } from "@tsparticles/react";
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ErrorBoundary from "../../components/ErrorBoundary";
import { apiRequest } from "../../services/api";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FlaskConical,
  CreditCard,
  FileText,
  Bell,
  Download,
  Smartphone,
  Clock,
  Phone,
  Search,
  Scale,
  Activity,
  Moon,
  Video,
  Droplet,
  Scan,
  Heart,
  Eye,
  X,
  Folder,
  FolderOpen,
  Diamond
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

// ------------------------- Utilities -------------------------
const safeNumber = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);
const toTitle = (value = "") => value
  .toString()
  .replace(/[_-]+/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\b\w/g, (match) => match.toUpperCase());

const formatDate = (value, locale = "en-GB") => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale);
};

const formatTime = (value, locale = "en-GB") => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};

const computeWellnessScore = (vitals) => {
  if (!vitals.length) return 0;
  const latest = vitals[vitals.length - 1];
  const systolic = safeNumber(latest.systolic, 0);
  const diastolic = safeNumber(latest.diastolic, 0);
  const glucose = safeNumber(latest.glucose, 0);
  const heartRate = safeNumber(latest.heartRate, 0);

  let score = 100;
  if (systolic > 140 || diastolic > 90) score -= 20;
  if (systolic > 160 || diastolic > 100) score -= 15;
  if (glucose > 140) score -= 15;
  if (glucose > 180) score -= 10;
  if (heartRate > 100 || heartRate < 55) score -= 10;
  return Math.max(45, Math.min(98, Math.round(score)));
};

const buildApptTrend = (appointments) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toISOString().split("T")[0];
    return {
      key,
      day: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      scheduled: 0,
      attended: 0
    };
  });
  const byKey = new Map(days.map((item) => [item.key, item]));
  appointments.forEach((appt) => {
    const rawDate = appt.slot || appt.date || appt.appointmentDate || appt.createdAt;
    if (!rawDate) return;
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().split("T")[0];
    const bucket = byKey.get(key);
    if (!bucket) return;
    const status = (appt.status || "").toString().toLowerCase();
    bucket.scheduled += 1;
    if (["completed", "attended"].includes(status)) bucket.attended += 1;
  });
  return days;
};

const mapNotificationLevel = (notification) => {
  const severity = (notification?.severity || "").toLowerCase();
  if (["high", "critical"].includes(severity)) return "critical";
  if (["medium"].includes(severity)) return "reminder";
  return "info";
};

const buildAuditLogs = (notifications) => notifications.map((item) => ({
  time: item.timestamp || new Date().toISOString(),
  event: item.title || "Notification",
  actor: toTitle(item.type || "system")
}));

const getInitials = (value = "") => {
  const parts = value.split(" ").filter(Boolean);
  if (!parts.length) return "DR";
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
};

// ------------------------- Custom Components -------------------------
const CustomDot = ({ cx, cy, payload, color, dataKey, vitals }) => {
  // Check if this is the latest data point by comparing with the last vitals entry
  const isLatest = payload && payload.date === vitals[vitals.length - 1]?.date;
  if (isLatest) {
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-semibold text-sm mb-2">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="capitalize">{entry.dataKey}:</span>
            <span className="font-medium">{entry.value}</span>
            {entry.dataKey === 'systolic' && <span className="text-xs text-gray-500">mmHg</span>}
            {entry.dataKey === 'diastolic' && <span className="text-xs text-gray-500">mmHg</span>}
            {entry.dataKey === 'glucose' && <span className="text-xs text-gray-500">mg/dL</span>}
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

// ------------------------- Main Component -------------------------
function PatientDashboardPro() {
  const { user, getAuthHeaders } = useAuth();

  // Theme
  const [dark, setDark] = useState(false);
  // Language demo (EN/UR)
  const [lang, setLang] = useState("en");

  const [patientProfile, setPatientProfile] = useState(null);

  // Patient data from auth context + profile
  const patient = useMemo(() => ({
    name: patientProfile?.userId?.name || user?.name || "Guest",
    id: patientProfile?._id || user?._id || "N/A",
    email: patientProfile?.userId?.email || user?.email || "",
    role: user?.role || "patient",
    dob: patientProfile?.dateOfBirth || "",
    gender: patientProfile?.gender ? toTitle(patientProfile.gender) : ""
  }), [patientProfile, user]);

  const handleRaiseAlert = async () => {
    if (!patient.email) {
      toast.error("Please login to send an alert");
      return;
    }

    const message = `Emergency alert from ${patient.name} (ID: ${patient.id}). Please contact immediately.`;
    try {
      await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: patient.name,
          email: patient.email,
          message
        })
      });
      toast.success("Alert sent to care team");
    } catch (error) {
      toast.error("Failed to send alert");
    }
  };

  // Real stats + health metrics
  const [vitals, setVitals] = useState([]);
  const [apptTrend, setApptTrend] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [liveStats, setLiveStats] = useState({ beds: 0, doctors: 0, erWait: 0 });

  // Appointment trend view mode
  const [apptViewMode, setApptViewMode] = useState("both"); // "both", "scheduled", "attended"

  // Chat widget
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hello — I can help with appointments, test results, and medication queries." }]);
  const [isTyping, setIsTyping] = useState(false);

  // Header enhancements
  const [headerShadow, setHeaderShadow] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Lab report preview
  const [selectedReport, setSelectedReport] = useState(null);

  // Wellness score animation
  const [wellnessScore, setWellnessScore] = useState(0);
  const [microChips, setMicroChips] = useState({ weight: 0, activity: 0, sleep: 0 });
  const wellnessTarget = useMemo(() => computeWellnessScore(vitals), [vitals]);

  // Animate wellness score on load and updates
  useEffect(() => {
    const increment = Math.max(Math.floor(wellnessTarget / 50), 1);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= wellnessTarget) {
        setWellnessScore(wellnessTarget);
        clearInterval(timer);
      } else {
        setWellnessScore(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [wellnessTarget]);

  // Scroll effect for header shadow and glass reflections
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHeaderShadow(y > 10);
      setScrollY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data collections
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [billing, setBilling] = useState([]);
  const nextAppointment = appointments[0] || { date: "No upcoming appointment", time: "" };

const getSpecialtyColor = (dept) => {
  const colors = {
    Cardiology: 'bg-red-500',
    Endocrinology: 'bg-blue-500',
    Radiology: 'bg-purple-500',
  };
  return colors[dept] || 'bg-gray-500';
};

const isWithin24Hours = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;
  const parts = dateStr.split('/');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const apptDate = new Date(year, month, day, hours, minutes);
  const now = new Date();
  const diff = apptDate - now;
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
};

const getLabIcon = (title) => {
  const iconMap = {
    "CBC": <Droplet className="w-4 h-4 text-red-500" />,
    "Lipid Panel": <Droplet className="w-4 h-4 text-yellow-500" />,
    "HbA1c": <Droplet className="w-4 h-4 text-blue-500" />,
    "Chest X-Ray": <Scan className="w-4 h-4 text-purple-500" />
  };
  return iconMap[title] || <FlaskConical className="w-4 h-4 text-gray-500" />;
};

const getPillIcon = (type) => {
  const iconMap = {
    "Tablet": <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">T</div>,
    "Capsule": <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">C</div>,
    "Injection": <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">I</div>
  };
  return iconMap[type] || <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">P</div>;
};

const getBadgeColor = (badge) => {
  const colorMap = {
    "New": "bg-blue-100 text-blue-800",
    "Expiring": "bg-yellow-100 text-yellow-800",
    "Critical": "bg-red-100 text-red-800"
  };
  return colorMap[badge] || "bg-gray-100 text-gray-800";
};

const getReportResults = (report) => {
  if (!report) return [{ name: "Result", value: "Pending", unit: "", range: "" }];
  if (report.result) {
    return [{
      name: report.testName || report.title || "Result",
      value: report.result,
      unit: "",
      range: report.referenceRange || ""
    }];
  }
  if (report.notes) {
    return [{ name: "Notes", value: report.notes, unit: "", range: "" }];
  }
  return [{ name: "Result", value: "Pending", unit: "", range: "" }];
};

  // Wearable feed (derived from vitals when available)
  const [wearable, setWearable] = useState({ steps: 0, hr: 0 });
  const [prevSteps, setPrevSteps] = useState(0);

  // Load patient dashboard data
  useEffect(() => {
    if (!user || !user._id) return;
    let active = true;

    const loadDashboard = async () => {
      try {
        const headers = await getAuthHeaders();
        const profile = await apiRequest(`/api/patients/${user._id}`, { headers }).catch(() => null);
        if (!active) return;
        setPatientProfile(profile || null);

        const patientEmail = profile?.userId?.email || user?.email || "";
        const patientId = profile?._id;

        const [prescriptionsRes, labResultsRes, billingRes, notificationsRes, appointmentsRes, vitalsRes, doctorsRes] = await Promise.all([
          apiRequest(`/api/patients/${user._id}/prescriptions`, { headers }),
          apiRequest(`/api/patients/${user._id}/lab-results`, { headers }),
          apiRequest(`/api/patients/${user._id}/billing`, { headers }),
          apiRequest(`/api/patients/${user._id}/notifications`, { headers }),
          patientEmail
            ? apiRequest(`/api/appointments/history?patientEmail=${encodeURIComponent(patientEmail)}`, { headers })
            : Promise.resolve({ items: [] }),
          patientId
            ? apiRequest(`/api/vitals/patient/${patientId}`, { headers })
            : Promise.resolve([]),
          apiRequest('/api/public/doctors-directory')
        ]);

        if (!active) return;

        const prescriptionsData = Array.isArray(prescriptionsRes) ? prescriptionsRes : [];
        setPrescriptions(prescriptionsData.map((item) => {
          const prescriptionDate = item.date ? new Date(item.date) : null;
          const ageDays = prescriptionDate ? (Date.now() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24) : null;
          const refillProgress = ageDays === null
            ? 0
            : Math.max(0, Math.min(100, Math.round((1 - ageDays / 30) * 100)));
          return {
            id: item._id || item.id,
            name: item.medication || item.name || 'Medication',
            status: toTitle(item.status || 'Active'),
            dosage: item.dosage || '',
            duration: item.frequency || '',
            type: 'Tablet',
            refillProgress,
            badges: [toTitle(item.status || 'Active')]
          };
        }));

        const labData = Array.isArray(labResultsRes) ? labResultsRes : [];
        setLabReports(labData.map((item) => ({
          id: item._id || item.id,
          title: item.testName || item.title || 'Lab Result',
          testName: item.testName,
          date: item.date,
          status: toTitle(item.status || 'Pending'),
          confidence: item.severity
            ? (item.severity === 'High' ? 92 : item.severity === 'Moderate' ? 86 : 80)
            : 85,
          result: item.result,
          notes: item.notes,
          referenceRange: item.referenceRange
        })));

        const billingData = Array.isArray(billingRes) ? billingRes : [];
        setBilling(billingData.map((item, index) => ({
          id: item._id || item.id,
          invoice: item._id ? `BILL-${String(item._id).slice(-6).toUpperCase()}` : `BILL-${index + 1}`,
          amount: item.totalAmount || item.amount || 0,
          status: toTitle(item.paymentStatus || item.status || 'Pending'),
          date: item.createdAt || item.date
        })));

        const notificationData = Array.isArray(notificationsRes) ? notificationsRes : [];
        setNotifications(notificationData.map((item) => ({
          id: item._id || item.id,
          text: item.description || item.title || 'Notification',
          level: mapNotificationLevel(item),
          timestamp: item.timestamp,
          title: item.title,
          type: item.type,
          severity: item.severity
        })));
        setAuditLogs(buildAuditLogs(notificationData));

        const apptItems = Array.isArray(appointmentsRes?.items)
          ? appointmentsRes.items
          : Array.isArray(appointmentsRes)
            ? appointmentsRes
            : [];

        setAppointments(apptItems.map((item) => ({
          id: item.id || item._id,
          date: formatDate(item.slot || item.date || item.appointmentDate),
          time: item.time || formatTime(item.slot) || item.appointmentTime || '',
          doctor: item.doctor || item.doctorName || item.doctor?.name || 'Doctor',
          dept: item.specialty || item.dept || item.department || 'General',
          status: toTitle(item.status || 'Pending'),
          slot: item.slot || item.appointmentDate
        })));

        setApptTrend(buildApptTrend(apptItems));

        const vitalsData = Array.isArray(vitalsRes) ? vitalsRes : [];
        const normalizedVitals = vitalsData
          .map((item) => ({
            date: formatDate(item.recordedAt || item.date),
            rawDate: item.recordedAt || item.date,
            systolic: item.bloodPressure?.systolic ?? item.systolic ?? 0,
            diastolic: item.bloodPressure?.diastolic ?? item.diastolic ?? 0,
            glucose: item.bloodSugar ?? item.glucose ?? 0,
            heartRate: item.heartRate ?? item.hr ?? 0,
            temperature: item.temperature ?? 0,
            weight: item.weight ?? 0
          }))
          .filter((item) => item.rawDate)
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
          .map(({ rawDate, ...rest }) => rest);
        setVitals(normalizedVitals);

        const doctorsCount = Array.isArray(doctorsRes) ? doctorsRes.length : 0;
        setLiveStats((prev) => ({ ...prev, doctors: doctorsCount }));
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      }
    };

    loadDashboard();
    return () => { active = false; };
  }, [user, getAuthHeaders]);

  useEffect(() => {
    const latest = vitals[vitals.length - 1];
    if (!latest) return;
    const nextSteps = 0;
    setPrevSteps(nextSteps);
    setWearable({ steps: nextSteps, hr: latest.heartRate || 0 });
    setMicroChips((prev) => ({ ...prev, weight: latest.weight || 0, activity: nextSteps }));
  }, [vitals]);

  // Simple AI insight (mock) - replace with call to model
  const aiInsight = useMemo(() => {
    // naive rule: if latest systolic > 140 give advice
    const latest = vitals[vitals.length - 1];
    if (!latest) return { level: "ok", text: "No vitals on file yet. Add measurements to unlock insights." };
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

  // Micro animation variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen ${dark ? "bg-[#0D0D0D] text-gray-100" : "bg-gradient-to-br from-teal-200 via-mint-100 to-emerald-300 text-gray-900"} soft-radial-glow subtle-grain`}>

      {/* Header */}
      <header className={`relative z-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur sticky top-0 rounded-b-xl transition-shadow duration-300 ${headerShadow ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white px-2 py-1 rounded">Medicore</div>
            <div className="text-white font-semibold">Patient Portal</div>
            <div className="text-xs text-gray-500 ml-3">{patient.name} • {patient.id}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded border" title="Search"><Search className="w-5 h-5" /></button>
            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${aiInsight.level === "warning" ? "bg-red-500" : aiInsight.level === "info" ? "bg-yellow-500" : "bg-green-500"}`}></span>
              {aiInsight.level === "warning" ? "Check BP" : aiInsight.level === "info" ? "Monitor Glucose" : "Stable vitals"}
            </div>
            <span className="text-white px-3 py-1 rounded border text-sm">Live API</span>
            <button onClick={() => setDark((d) => !d)} className="p-2 rounded border" title="Toggle theme">{dark ? <SunIcon /> : <MoonIcon />}</button>
            <button onClick={() => setLang((l) => (l === "en" ? "ur" : "en"))} className="text-white px-3 py-1 rounded border text-sm">{lang === "en" ? "UR" : "EN"}</button>
            <button className="relative p-2 rounded" onClick={() => setNotifications((n) => [])}><Bell className="w-5 h-5" /></button>
            <button onClick={() => handleDownloadSummary()} className="p-2 rounded bg-green-600 text-white"><Download className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Main hero + quick stats */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 py-12">
        {/* Emotional Touch Daily Badge */}
        <motion.div
          className="fixed top-24 right-6 z-30 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="text-sm font-medium">
            🌿 Your day looks good. Hydration score: High.
          </div>
        </motion.div>

        <div className="relative">
          {/* Glass reflections shifting on scroll */}
          <div
            className="absolute inset-0 -z-5 pointer-events-none"
            style={{
              background: `linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)`,
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: 0.3
            }}
          />
          <div
            className="absolute inset-0 -z-5 pointer-events-none"
            style={{
              background: `linear-gradient(-45deg, rgba(0,255,136,0.05) 0%, transparent 50%, rgba(0,255,136,0.05) 100%)`,
              transform: `translateY(${scrollY * -0.3}px)`,
              opacity: 0.2
            }}
          />
          <div className="absolute inset-0 -z-10">
            <Particles options={{ background: { color: "#00000000" }, particles: { number: { value: 40 }, color: { value: dark ? "#00FF88" : "#0ea5e9" }, move: { speed: 0.8 } } }} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Identity Card */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="show"
            className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden"
          >
            <div className="text-center">
              {/* Patient Avatar */}
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Medical ID Barcode (Mock SVG) */}
              <div className="mb-3">
                <svg width="120" height="30" viewBox="0 0 120 30" className="mx-auto">
                  <rect x="0" y="0" width="2" height="25" fill="black"/>
                  <rect x="3" y="0" width="1" height="25" fill="black"/>
                  <rect x="5" y="0" width="3" height="25" fill="black"/>
                  <rect x="9" y="0" width="1" height="25" fill="black"/>
                  <rect x="11" y="0" width="2" height="25" fill="black"/>
                  <rect x="14" y="0" width="1" height="25" fill="black"/>
                  <rect x="16" y="0" width="3" height="25" fill="black"/>
                  <rect x="20" y="0" width="1" height="25" fill="black"/>
                  <rect x="22" y="0" width="2" height="25" fill="black"/>
                  <rect x="25" y="0" width="1" height="25" fill="black"/>
                  <rect x="27" y="0" width="3" height="25" fill="black"/>
                  <rect x="31" y="0" width="1" height="25" fill="black"/>
                  <rect x="33" y="0" width="2" height="25" fill="black"/>
                  <rect x="36" y="0" width="1" height="25" fill="black"/>
                  <rect x="38" y="0" width="3" height="25" fill="black"/>
                  <rect x="42" y="0" width="1" height="25" fill="black"/>
                  <rect x="44" y="0" width="2" height="25" fill="black"/>
                  <rect x="47" y="0" width="1" height="25" fill="black"/>
                  <rect x="49" y="0" width="3" height="25" fill="black"/>
                  <rect x="53" y="0" width="1" height="25" fill="black"/>
                  <rect x="55" y="0" width="2" height="25" fill="black"/>
                  <rect x="58" y="0" width="1" height="25" fill="black"/>
                  <rect x="60" y="0" width="3" height="25" fill="black"/>
                  <rect x="64" y="0" width="1" height="25" fill="black"/>
                  <rect x="66" y="0" width="2" height="25" fill="black"/>
                  <rect x="69" y="0" width="1" height="25" fill="black"/>
                  <rect x="71" y="0" width="3" height="25" fill="black"/>
                  <rect x="75" y="0" width="1" height="25" fill="black"/>
                  <rect x="77" y="0" width="2" height="25" fill="black"/>
                  <rect x="80" y="0" width="1" height="25" fill="black"/>
                  <rect x="82" y="0" width="3" height="25" fill="black"/>
                  <rect x="86" y="0" width="1" height="25" fill="black"/>
                  <rect x="88" y="0" width="2" height="25" fill="black"/>
                  <rect x="91" y="0" width="1" height="25" fill="black"/>
                  <rect x="93" y="0" width="3" height="25" fill="black"/>
                  <rect x="97" y="0" width="1" height="25" fill="black"/>
                  <rect x="99" y="0" width="2" height="25" fill="black"/>
                  <rect x="102" y="0" width="1" height="25" fill="black"/>
                  <rect x="104" y="0" width="3" height="25" fill="black"/>
                  <rect x="108" y="0" width="1" height="25" fill="black"/>
                  <rect x="110" y="0" width="2" height="25" fill="black"/>
                  <rect x="113" y="0" width="1" height="25" fill="black"/>
                  <rect x="115" y="0" width="3" height="25" fill="black"/>
                  <text x="60" y="28" textAnchor="middle" fontSize="8" fill="black">{patient.id}</text>
                </svg>
              </div>

              {/* Blood Group Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  🩸 O+
                </span>
              </div>

              {/* Quick Emergency Info */}
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>Allergies: None</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="show"
            className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden lg:col-span-3"
          >
            {/* Floating green aurora behind hero card */}
            <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-teal-300/15 to-green-400/20"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.15) 50%, rgba(34, 197, 94, 0.2) 100%)",
                    "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(20, 184, 166, 0.2) 100%)",
                    "linear-gradient(225deg, rgba(20, 184, 166, 0.2) 0%, rgba(34, 197, 94, 0.15) 50%, rgba(16, 185, 129, 0.2) 100%)",
                    "linear-gradient(315deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.15) 50%, rgba(34, 197, 94, 0.2) 100%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Faint gradient line across the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-50"></div>

            {/* Subtle edge glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/10 to-blue-500/10 pointer-events-none"></div>

            <div className="text-white relative z-10">
              <div className="text-white flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white-900 dark:text-white">Welcome back, {patient.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Personalized summary</p>
                </div>
                <div className="relative flex items-center justify-center">
                  {/* Semi-circular progress ring */}
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(wellnessScore / 100) * 100}, 100`}
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{wellnessScore}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Wellness</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-chips beneath the score */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-700/50 rounded-full px-3 py-1 shadow-sm">
                  <Scale className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">{microChips.weight}kg</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-700/50 rounded-full px-3 py-1 shadow-sm">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">{microChips.activity} steps</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-700/50 rounded-full px-3 py-1 shadow-sm">
                  <Moon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">{microChips.sleep}h sleep</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Next Appointment</span>
                  <strong className="text-gray-900 dark:text-white">
                    {nextAppointment.date}{nextAppointment.time ? ` • ${nextAppointment.time}` : ""}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Active Prescriptions</span>
                  <strong className="text-gray-900 dark:text-white">{prescriptions.length}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">Unread Notifications</span>
                  <strong className="text-gray-900 dark:text-white">{notifications.length}</strong>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/appointment-history" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
                  Manage Appointments
                </Link>
                <button onClick={() => setChatOpen(true)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Rhythm animation - subtle pulsing effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/5 to-blue-500/5 animate-pulse pointer-events-none"></div>
          </motion.div>

          {/* Vitals chart */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="show"
            className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow lg:col-span-1 overflow-hidden"
          >
            {/* Breathing animation border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-600/20 animate-pulse"></div>
            <div className="relative z-10">
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
                  <ComposedChart data={vitals}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Gradients under lines */}
                    <defs>
                      <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="systolic" stroke="#10B981" fill="url(#systolicGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="diastolic" stroke="#06B6D4" fill="url(#diastolicGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="glucose" stroke="#F59E0B" fill="url(#glucoseGradient)" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={(props) => <CustomDot {...props} color="#10B981" vitals={vitals} />}
                      activeDot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#06B6D4"
                      strokeWidth={3}
                      dot={(props) => <CustomDot {...props} color="#06B6D4" vitals={vitals} />}
                      activeDot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={(props) => <CustomDot {...props} color="#F59E0B" vitals={vitals} />}
                      activeDot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced AI insight */}
              <motion.div
                className={`mt-4 p-3 rounded-lg border-l-4 relative overflow-hidden ${
                  aiInsight.level === "warning"
                    ? "bg-red-50 text-red-700 border-red-500"
                    : aiInsight.level === "info"
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-green-50 text-green-700 border-green-500"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      aiInsight.level === "warning" ? "bg-red-500" : aiInsight.level === "info" ? "bg-blue-500" : "bg-green-500"
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                  <strong>AI Insight:</strong>
                  <motion.span
                    className="text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {aiInsight.text}
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Appointments / Lab / Prescriptions row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="stagger-load">
            <Card title="Appointments" icon={<CalendarDays />} dark={dark}>
              {appointments.map((a) => (
                <div key={a.id} className="relative flex items-center py-2 border-b last:border-b-0">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${getSpecialtyColor(a.dept)} rounded-r`}></div>
                  <div className="flex items-center gap-3 flex-1 ml-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold">
                      {getInitials(a.doctor)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{a.date} • {a.time}</div>
                      <div className="text-xs text-gray-500">{a.doctor} • {a.dept}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${a.status === "Confirmed" ? "from-green-400 to-green-600 text-white" : "from-yellow-400 to-yellow-600 text-white"} shadow-md`}>{a.status}</div>
                      {isWithin24Hours(a.date, a.time) && (
                        <motion.button
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Video className="w-3 h-3" />
                          Join call
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3"><Link to="/appointment-history" className="text-green-600 underline">View all</Link></div>
            </Card>
          </div>

          <div className="stagger-load">
            <Card title="Lab Reports" icon={<FlaskConical />} dark={dark}>
              {labReports.slice(0, 3).map((r) => (
                <div key={r._id || r.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    {getLabIcon(r.testName || r.title)}
                    <div>
                      <div className="font-medium">{r.testName || r.title}</div>
                      <div className="text-xs text-gray-500">
                        {r.date ? new Date(r.date).toLocaleDateString("en-GB") : r.date}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-gray-400">AI Confidence:</div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${r.confidence || 85}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium">{r.confidence || 85}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-xs px-2 py-1 rounded ${r.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</div>
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="View report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="stagger-load">
            <Card title="Prescriptions" icon={<FileText />} dark={dark}>
              {prescriptions.slice(0, 3).map((p) => (
                <div key={p._id || p.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    {getPillIcon(p.type)}
                    <div>
                      <div className="font-medium">{p.medicationName || p.name}</div>
                      <div className="text-xs text-gray-500">{p.dosage} • {p.duration}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${p.refillProgress || 75}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-medium">{p.refillProgress || 75}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.badges && p.badges.map((badge, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(badge)}`}>
                        {badge}
                      </span>
                    ))}
                    <div className={`text-xs px-2 py-1 rounded ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{p.status}</div>
                  </div>
                </div>
              ))}
              <div className="mt-3"><Link to="/patient/prescriptions" className="text-green-600 underline">View prescriptions</Link></div>
            </Card>
          </div>
        </div>

        {/* Billing + wearable + appointment trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card title="Billing" icon={<CreditCard />}>
            {/* Mini bar chart for past 3 bills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Past 3 Bills Comparison</h4>
              <div style={{ height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billing.slice(0, 3).map((b, i) => ({ name: `Bill ${i + 1}`, amount: b.amount || b.amount }))}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip formatter={(value) => [`Rs. ${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Animated invoice thumbnails */}
            <div className="space-y-2">
              {billing.slice(0, 3).map((b, index) => (
                <motion.div
                  key={b._id || b.invoice}
                  className="relative flex items-center justify-between py-2 border-b last:border-b-0 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Folder-like thumbnail */}
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ rotateY: 0 }}
                    whileHover={{ rotateY: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="relative w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm shadow-md"
                      whileHover={{ rotateY: -15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Folder tab */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-yellow-300 rounded-t-sm"></div>
                      {/* Diamond shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <Diamond className="w-3 h-3 text-yellow-500" />
                        Rs. {b.amount || b.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {b.date ? new Date(b.date).toLocaleDateString("en-GB") : b.date}
                      </div>
                    </div>
                  </motion.div>
                  <div className={`text-xs px-2 py-1 rounded ${b.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{b.status}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3"><Link to="/patient/billing" className="text-green-600 underline">Billing center</Link></div>
          </Card>

          <Card title="Wearable" icon={<Smartphone />}>
            <div className="text-sm space-y-3">
              <div className="flex justify-between items-center">
                <span>Steps</span>
                <div className="flex items-center gap-2">
                  {/* Mini trend line */}
                  <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((wearable.steps / 10000) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <motion.strong
                    animate={wearable.steps > prevSteps ? { scale: [1, 1.2, 1], textShadow: ["0 0 0px #10B981", "0 0 10px #10B981", "0 0 0px #10B981"] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {wearable.steps}
                  </motion.strong>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Heart Rate</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </motion.div>
                  <strong>{wearable.hr} bpm</strong>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Wearable integration pending. Connect HealthKit or Google Fit to populate activity.</div>
            </div>
          </Card>

          <Card title="Appointment Trend" icon={<Clock />}>
            <div className="flex justify-center gap-2 mb-2">
              <button
                onClick={() => setApptViewMode("both")}
                className={`px-2 py-1 text-xs rounded ${apptViewMode === "both" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Both
              </button>
              <button
                onClick={() => setApptViewMode("scheduled")}
                className={`px-2 py-1 text-xs rounded ${apptViewMode === "scheduled" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setApptViewMode("attended")}
                className={`px-2 py-1 text-xs rounded ${apptViewMode === "attended" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Attended
              </button>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apptTrend}>
                  <defs>
                    <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="attendedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const aiNote = data.attended > data.scheduled * 0.8
                          ? "Excellent attendance rate! Keep up the good work."
                          : data.scheduled > data.attended * 1.5
                          ? "Many scheduled appointments. Consider workload management."
                          : "Balanced appointment scheduling.";
                        return (
                          <motion.div
                            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="font-semibold text-sm mb-1">{`Day: ${label}`}</p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="capitalize">{entry.dataKey}:</span>
                                <span className="font-medium">{entry.value}</span>
                              </div>
                            ))}
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">AI Note: {aiNote}</p>
                            </div>
                          </motion.div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {(apptViewMode === "both" || apptViewMode === "scheduled") && (
                    <Bar
                      dataKey="scheduled"
                      fill="url(#scheduledGradient)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={1000}
                    />
                  )}
                  {(apptViewMode === "both" || apptViewMode === "attended") && (
                    <Bar
                      dataKey="attended"
                      fill="url(#attendedGradient)"
                      radius={[4, 4, 0, 0]}
                      animationBegin={apptViewMode === "both" ? 200 : 0}
                      animationDuration={1000}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Notifications + Audit log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="stagger-load">
            <Card title="Notifications" icon={<Bell />} dark={dark}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">{notifications.length} unread</div>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-auto custom-scrollbar">
                {notifications.length === 0 && (
                  <motion.div
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No new notifications</div>
                  </motion.div>
                )}
                {notifications.map((n, index) => {
                  const getNotificationIcon = (text) => {
                    const normalized = (text || "").toLowerCase();
                    if (normalized.includes("lab")) return <FlaskConical className="w-5 h-5 text-blue-500" />;
                    if (normalized.includes("appointment")) return <CalendarDays className="w-5 h-5 text-green-500" />;
                    if (normalized.includes("payment") || normalized.includes("bill")) return <CreditCard className="w-5 h-5 text-purple-500" />;
                    return <Bell className="w-5 h-5 text-gray-500" />;
                  };
                  const getLevelBadge = (level) => {
                    const styles = {
                      info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                      reminder: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                      critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    };
                    return styles[level] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
                  };
                  return (
                    <motion.div
                      key={n.id}
                      className="relative bg-gradient-to-r from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                      whileHover={{ y: -2, scale: 1.02 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(n.text)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                            {n.text}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelBadge(n.level)}`}>
                              {n.level}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(n.timestamp ? new Date(n.timestamp) : new Date()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          className={`w-3 h-3 rounded-full ${n.level === "info" ? "bg-blue-500" : n.level === "reminder" ? "bg-yellow-500" : "bg-red-500"} shadow-lg`}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                      {/* Subtle glow effect */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${n.level === "info" ? "from-blue-400/5 to-transparent" : n.level === "reminder" ? "from-yellow-400/5 to-transparent" : "from-red-400/5 to-transparent"} pointer-events-none`} />
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="stagger-load">
            <Card title="Audit Log" icon={<Activity />} dark={dark}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setAuditLogs(buildAuditLogs(notifications))} className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg">Refresh</button>
              </div>
              <div className="max-h-64 overflow-auto relative custom-scrollbar">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-500 opacity-50"></div>
                {auditLogs.map((a, i) => {
                  const eventIcon = a.event.includes("Viewed") ? <Eye className="w-4 h-4 text-blue-500" /> : a.event.includes("Downloaded") ? <Download className="w-4 h-4 text-green-500" /> : a.event.includes("Updated") ? <FileText className="w-4 h-4 text-purple-500" /> : <Activity className="w-4 h-4 text-gray-500" />;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 mb-4 relative bg-gradient-to-r from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-800/20 backdrop-blur-sm rounded-lg p-3 border border-white/10 dark:border-gray-700/10 shadow-sm hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ x: 2, scale: 1.02 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white z-10 shadow-lg">
                        {eventIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {new Date(a.time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                          {a.event}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          by {a.actor}
                        </div>
                      </div>
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Chat / Telemedicine */}
        <motion.div
          className="fixed right-6 bottom-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {!chatOpen ? (
            <motion.button
              onClick={() => setChatOpen(true)}
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              💬
            </motion.button>
          ) : (
            <motion.div
              className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg border border-white/20 dark:border-gray-700/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 flex items-center justify-between">
                <div className="font-semibold">Medicore Assistant</div>
                <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200">✕</button>
              </div>
              <div className="p-3 h-64 overflow-auto space-y-3">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      m.from === "user"
                        ? "bg-gradient-to-br from-green-400/80 to-green-500/80 text-white backdrop-blur-sm border border-green-300/50"
                        : "bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-white/50 dark:border-gray-600/50 shadow-lg"
                    }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div className="flex justify-start">
                    <div className="bg-white/80 dark:bg-gray-700/80 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/50 dark:border-gray-600/50 shadow-lg">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      const userMessage = e.target.value.trim();
                      setMessages((ms) => [...ms, { from: "user", text: userMessage }]);
                      setIsTyping(true);
                      e.target.value = "";
                      // mock AI reply
                      setTimeout(() => {
                        setMessages((ms) => [...ms, { from: "bot", text: "(AI) I recommend scheduling a nurse tele-check." }]);
                        setIsTyping(false);
                      }, 2000);
                    }
                  }}
                />
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Send</button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-lg"
                    placeholder="Search appointments, labs, doctors..."
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="font-medium">Book Appointment</div>
                        <div className="text-sm text-gray-500">Schedule a new visit</div>
                      </button>
                      <button className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="font-medium">View Lab Results</div>
                        <div className="text-sm text-gray-500">Check recent tests</div>
                      </button>
                      <button className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="font-medium">Find Doctors</div>
                        <div className="text-sm text-gray-500">Browse specialists</div>
                      </button>
                      <button className="p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="font-medium">Emergency</div>
                        <div className="text-sm text-gray-500">Quick access</div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Recent</h4>
                    <div className="space-y-2">
                      {appointments.slice(0, 3).map((a) => (
                        <div key={a.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="font-medium">{a.doctor}</div>
                          <div className="text-sm text-gray-500">{a.date} • {a.dept}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency / quick actions */}
        <div className="fixed left-6 bottom-6 z-40 flex flex-col gap-3">
          <a href="tel:+922111234567" className="bg-red-600 text-white px-4 py-3 rounded-full shadow flex items-center gap-2"><Phone className="w-4 h-4" />Emergency</a>
          <button onClick={handleRaiseAlert} className="bg-yellow-500 text-white px-3 py-2 rounded-full shadow">Raise Alert</button>
        </div>

        {/* Printable summary area (simple demo) */}
        <div className="hidden print:block">
          <div ref={printRef} className="p-6">
            <h1>Visit Summary - {patient.name}</h1>
            <p>Generated on {new Date().toLocaleString()}</p>
            {/* In production, format detailed records and generate PDF server-side or via jsPDF/html2pdf */}
          </div>
        </div>

      </div>

      </main>

      {/* Lab Report Preview Panel */}
      {selectedReport && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Lab Report Preview</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getLabIcon(selectedReport.testName || selectedReport.title)}
                <div>
                  <h3 className="text-lg font-semibold">{selectedReport.testName || selectedReport.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString("en-GB") : selectedReport.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm ${selectedReport.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {selectedReport.status}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI Confidence:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${selectedReport.confidence || 85}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{selectedReport.confidence || 85}%</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Test Results</h4>
                <div className="space-y-2">
                  {getReportResults(selectedReport).map((result, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="text-sm">{result.name}</span>
                      <div className="text-right">
                        <span className="font-medium">{result.value}</span>
                        <span className="text-xs text-gray-500 ml-1">{result.unit}</span>
                        {result.range && <div className="text-xs text-gray-400">{result.range}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Download PDF
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Share with Doctor
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <footer className="mt-12 py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} Medicore — Patient Portal</footer>
    </div>
  );
}

// ------------------------- Helper subcomponents -------------------------
function Card({ title, icon, children, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden ${dark ? "layered-glass-dark" : "layered-glass"} rounded-xl p-6 bg-gradient-to-b from-white/10 to-transparent`}
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          whileHover={{ rotate: 12 }}
          transition={{ duration: 0.2 }}
          className="text-green-600"
        >
          {icon}
        </motion.div>
        <div className="font-bold text-lg tracking-wide">{title}</div>
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
