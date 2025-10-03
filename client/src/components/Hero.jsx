// Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { faker } from "@faker-js/faker";
import io from 'socket.io-client';
import {
  Search,
  Moon,
  Sun,
  MessageSquare,
  ArrowUp,
  Phone,
  MapPin,
  ShieldCheck,
  PlayCircle,
  User,
  Users,
  Clock,
  Bell,
  Heart,
  Star,
  Zap,
  CheckCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { commonAPI } from "../services/dataService";
import { apiRequest } from "../services/api";
import { useAuth } from '../context/AuthContext';

/**
 * Single-file, feature-rich Hospital front page
 * - Tailwind classes assumed available
 * - Mock data via faker
 * - Many features are demo/mocked; see TODOs to integrate real systems
 *
 * To run:
 * npm i @faker-js/faker lucide-react react-hot-toast
 *
 * Notes:
 * - Replace mocks & placeholders with real API calls (Auth, Booking, Payments, Push)
 * - This file intentionally contains many internal subcomponents for a single-file deliverable
 */

// -------------------- Mock & Helpers --------------------
const makeDoctors = (n = 12) =>
  Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    title: `${faker.animal.type()} Specialist`, // playful placeholder
    specialty: faker.helpers.arrayElement([
      "Cardiology",
      "Radiology",
      "Pediatrics",
      "Orthopedics",
      "Neurology",
      "Gynecology",
      "ENT",
      "Dermatology",
    ]),
    avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    years: faker.number.int({ min: 2, max: 35 }),
    languages: faker.helpers.arrayElements(["English", "Urdu", "Arabic", "Chinese"], faker.number.int({ min: 1, max: 3 })),
    nextAvailable: faker.date.soon({ days: faker.number.int({ min: 1, max: 14 }) }).toISOString().slice(0, 10),
    bio: faker.lorem.paragraph(),
    reviews: Array.from({ length: 3 }).map(() => ({
      text: faker.lorem.sentences(2),
      author: faker.person.fullName(),
      rating: faker.number.int({ min: 3, max: 5 }),
    })),
  }));

const mockArticles = Array.from({ length: 6 }).map((_, i) => ({
  id: `art-${i}`,
  title: faker.lorem.sentence(6),
  excerpt: faker.lorem.sentences(2),
  author: faker.person.fullName(),
  readMinutes: faker.number.int({ min: 2, max: 8 }),
}));

const mockTestimonials = Array.from({ length: 5 }).map((_, i) => ({
  id: `t-${i}`,
  name: faker.person.fullName(),
  quote: faker.lorem.sentences(2),
  sentiment: "positive",
}));

const defaultServices = [
  { key: "radiology", title: "Radiology", desc: "MRI, CT, Digital X-Ray" },
  { key: "cardiology", title: "Cardiology", desc: "Consultations, Angioplasty, Rehab" },
  { key: "diagnostics", title: "Diagnostics", desc: "Pathology & Urgent Lab Tests" },
  { key: "pediatrics", title: "Pediatrics", desc: "Child care & vaccination" },
  { key: "telemedicine", title: "Telemedicine", desc: "Remote consultations & prescriptions" },
];

// Simple utility: parse 'book cardiology tomorrow 10am' -> {specialty, date, time}
function parseNaturalBooking(text = "") {
  const lower = text.toLowerCase();
  const specialty = defaultServices.find((s) => lower.includes(s.title.toLowerCase()))?.title ?? null;
  const timeMatch = lower.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b/);
  const dateMatch = lower.match(/\btoday\b|\btomorrow\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  const date =
    dateMatch?.[0] ??
    (lower.includes("tomorrow") ? "tomorrow" : lower.includes("today") ? "today" : null);
  return { specialty, date, time: timeMatch?.[0] ?? null };
}

// Speech helpers
const ttsSpeak = (text) => {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

// -------------------- Internal Subcomponents --------------------

// Small UI bits (Badge, Avatar)
const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10">{children}</span>
);
const SmallAvatar = ({ src, alt }) => <img src={src} alt={alt} className="w-10 h-10 rounded-full object-cover" />;

// Skeleton component
const Skeleton = ({ className = "h-6 bg-gray-200/60 animate-pulse rounded" }) => <div className={className} role="status" aria-hidden="true" />;

// -------------------- Main Component --------------------
export default function Home() {
  // Theme + accessibility + language
  const [dark, setDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("base"); // base | lg | xl
  const [lang, setLang] = useState("en"); // en | ur | ar | zh

  // Role & auth mock
  const [jwtMock, setJwtMock] = useState(null);

  // Data
  const doctors = useMemo(() => makeDoctors(12), []);
  const [featuredDoctor, setFeaturedDoctor] = useState(null);
  const [services] = useState(defaultServices);
  const [articles] = useState(mockArticles);
  const [testimonials] = useState(mockTestimonials);
  const [liveStats, setLiveStats] = useState({
    beds: 42,
    doctorsOnline: 18,
    erWait: 12,
    surgeries: 2,
    alerts: 0,
  });

  // Booking slots
  const [slots, setSlots] = useState(
    Array.from({ length: 8 }).map((_, i) => ({ id: i, time: `${9 + i}:00`, free: Math.random() > 0.4 }))
  );

  // Search & AI suggestions
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Natural language booking
  const [nlInput, setNlInput] = useState("");
  const [nlParse, setNlParse] = useState(null);

  // Chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hello 👋 I'm Medicore assistant — ask me anything." }]);
  const chatRef = useRef(null);

  // Notifications (mock)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Flu vaccine available this week", type: "info" },
  ]);

  const navigate = useNavigate();

  // Points / gamification
  const { user, token, points, setPoints, setUser } = useAuth();

  // Loading state for heavy sections
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Predictive insights data
  const [insights, setInsights] = useState(null);

  // Speech-to-text for search (browser dependent)
  const speechRecRef = useRef(null);
  function startSpeechSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Speech Recognition not supported in this browser");
    if (speechRecRef.current) {
      speechRecRef.current.stop();
      speechRecRef.current = null;
      return;
    }
    const sr = new SpeechRecognition();
    sr.continuous = false;
    sr.lang = lang === "en" ? "en-US" : lang === "ur" ? "ur-PK" : "en-US";
    sr.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setSearchQ(t);
      runSearch(t);
    };
    sr.onerror = (e) => toast.error("Speech recognition error");
    sr.start();
    speechRecRef.current = sr;
    toast("Listening...");
  }

  // Accessibility: focus outline for keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Tab") document.documentElement.classList.add("using-keyboard");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Real-time live stats updates via WebSocket
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('liveStatsUpdate', (data) => {
      setLiveStats(prev => ({ ...prev, beds: data.beds, doctorsOnline: data.doctorsOnline }));
    });
    return () => socket.off('liveStatsUpdate');
  }, []);

  // Rotate available slots
  useEffect(() => {
    const id = setInterval(() => {
      setSlots((s) => s.map((slot) => ({ ...slot, free: Math.random() > 0.4 })));
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, chatOpen]);

  // Fetch featured doctor
  useEffect(() => {
    const fetchFeaturedDoctor = async () => {
      try {
        const response = await commonAPI.getFeaturedDoctor();
        setFeaturedDoctor(response);
      } catch (error) {
        console.error('Error fetching featured doctor:', error);
        // Fallback to first doctor if API fails
        setFeaturedDoctor(doctors[0]);
      }
    };
    fetchFeaturedDoctor();
  }, [doctors]);

  // Fetch user points on mount if logged in and in real mode
  useEffect(() => {
    const fetchPoints = async () => {
      if (user && token && (import.meta.env.VITE_POINTS_MODE === 'real' || !import.meta.env.VITE_POINTS_MODE)) {
        try {
          const response = await apiRequest('/api/user/points', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPoints(response.points);
        } catch (error) {
          console.error('Failed to fetch user points:', error);
        }
      }
    };
    fetchPoints();
  }, [user, token]);

  // Search runner (mock AI)
  function runSearch(q) {
    setSearchQ(q);
    if (!q) return setSearchResults([]);
    const ql = q.toLowerCase();
    const res = [];
    if (ql.includes("cardio") || ql.includes("heart")) res.push({ type: "doctor", title: "Top Cardiologists", hint: `${doctors.filter(d => d.specialty.toLowerCase().includes('cardio')).slice(0,2).map(d=>d.name).join(', ')}` });
    if (ql.includes("x-ray") || ql.includes("radi")) res.push({ type: "service", title: "Radiology Services", hint: "Book imaging & get reports same-day" });
    if (ql.includes("fever") || ql.includes("cough")) res.push({ type: "article", title: "Common symptoms guide", hint: "Self-care & when to see a doctor" });
    if (!res.length) res.push({ type: "article", title: "Health tips", hint: "Read latest health guidance" });
    setSearchResults(res);
  }

  // Simple NLP booking parse
  function handleParseNL() {
    const parsed = parseNaturalBooking(nlInput);
    setNlParse(parsed);
    toast.success("Parsed booking intent (demo)");
  }

  // Mock booking function
  async function bookSlot(slot) {
    if (!slot.free) return toast.error("Slot already booked");
    // Replace with real booking API integration
    setSlots((s) => s.map((sl) => (sl.id === slot.id ? { ...sl, free: false } : sl)));
    toast.success(`Booked appointment at ${slot.time} (demo)`);

    // Update points locally and on server if logged in
    if (user && token) {
      try {
        const newPoints = points + 5;
        setPoints(newPoints);
        await apiRequest('/user/points', {
          method: 'PUT',
          body: JSON.stringify({ points: newPoints }),
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Failed to update points:', error);
      }
    } else {
      setPoints((p) => p + 5);
    }
  }

  // Chatbot send
  function sendMessage(text) {
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setMessages((m) => [...m, { from: "bot", text: "..." }]);
    setTimeout(() => {
      let reply = "Sorry, I didn't get that. Can you rephrase?";
      const q = text.toLowerCase();
      if (q.includes("book") || q.includes("appointment")) reply = "I can assist booking — which specialty and date do you prefer? (e.g., Cardiology tomorrow 10am)";
      if (q.includes("nearest") || q.includes("near me")) reply = "Showing nearest branches — please allow location or enter your city.";
      if (q.includes("symptom") || q.includes("fever")) reply = "Based on symptoms I recommend a tele-nurse check. Shall I schedule?";
      if (q.includes("doctor") || q.includes("cardio")) reply = `I recommend ${doctors[0].name} (${doctors[0].specialty}). Next: ${doctors[0].nextAvailable}`;
      setMessages((m) => m.slice(0, -1).concat({ from: "bot", text: reply }));
      ttsSpeak(reply);
    }, 900);
  }

  // Quick mock login (creates a fake JWT & user role)
  function mockLogin(role = "patient") {
    const token = `fake-jwt-${Date.now()}`;
    setJwtMock(token);
    setUser({ name: faker.person.fullName(), role });
    toast.success(`Logged in as ${role} (demo)`);
  }

  // Mock payment flow (demo)
  function mockPay(amount = 100) {
    // TODO: integrate Stripe/EasyPaisa/JazzCash
    toast.promise(
      new Promise((res) => setTimeout(res, 1200)),
      {
        loading: `Processing payment of ${amount}`,
        success: `Payment ${amount} PKR successful (demo)`,
        error: "Payment failed (demo)",
      }
    );
  }

  // Predictive insights loader
  async function loadInsights() {
    setLoadingInsights(true);
    try {
      const data = await commonAPI.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      // Fallback to mock data
      setInsights({
        erWaitForecast: [12, 10, 15, 18, 16, 13, 12],
        bedOccupancyTrend: [60, 62, 65, 63, 67, 70, 68],
        readmissionRisk: 6
      });
    }
    setLoadingInsights(false);
    toast.success("Predictive insights updated");
  }

  // Quick keyboard shortcut: press 'b' to open booking
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "b" && e.altKey) {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // -------------------- Render --------------------
  return (
    <div className={`min-h-screen ${dark ? "dark" : ""} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Toaster position="top-right" />

      {/* ---------- Header / Navbar ---------- */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2 rounded-md shadow"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <div className="font-bold text-lg">Medicore Hospital</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">24/7 Emergency & Telehealth</div>
            </div>
          </div>

          <div className="flex-1 mx-4 hidden md:block">
            <div className="flex items-center gap-3 max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/50 border rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input value={searchQ} onChange={(e) => runSearch(e.target.value)} aria-label="Search doctors, services, articles" placeholder="Search doctors, services, articles..." className="flex-1 bg-transparent outline-none text-sm" />
              <button onClick={startSpeechSearch} title="Voice search" className="px-2 py-1 rounded hover:bg-white/10">🎙</button>
            </div>
            {/* Search dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow p-3 max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-2">
                  {searchResults.map((r, i) => (
                    <div key={i} className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-gray-500">{r.hint}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark((d) => !d)} aria-pressed={dark} className="p-2 rounded-md border">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button onClick={() => setFontSize((f) => (f === "base" ? "lg" : f === "lg" ? "xl" : "base"))} className="px-2 py-1 border rounded-md">A{fontSize === "base" ? "" : fontSize === "lg" ? "+" : "++"}</button>

            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => setLang((l) => (l === "en" ? "ur" : l === "ur" ? "ar" : l === "ar" ? "zh" : "en"))} className="px-2 py-1 border rounded-md text-sm">
                {lang.toUpperCase()}
              </button>
              <button onClick={() => setHighContrast((c) => !c)} className="px-2 py-1 border rounded-md text-sm">Contrast</button>
            </div>

            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <button onClick={() => mockLogin("patient")} className="px-3 py-2 rounded-md border">Login (demo)</button>
                  <button onClick={() => mockLogin("doctor")} className="px-3 py-2 rounded-md bg-green-600 text-white">Login as Doctor</button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-sm">{user.name}</div>
                  <div className="px-2 py-1 rounded bg-white/10 text-xs">{user.role}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <main className="pt-6 pb-12">
        <section className="bg-gradient-to-br from-green-700 to-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">Compassionate Care. Intelligent Support.</h1>
              <p className="max-w-xl opacity-90 mb-4">Live availability, AI assistant, predictive insights — all designed to make healthcare accessible and personal.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => navigate('/book-appointment')} className="bg-white text-green-800 px-5 py-3 rounded-md font-semibold">Book Appointment</button>
                <button onClick={() => { loadInsights(); }} className="bg-white/20 px-5 py-3 rounded-md">Predictive Insights</button>
                <button onClick={() => ttsSpeak("Welcome to Medicore Hospital, how can I help you today?")} className="px-4 py-3 border rounded-md">🔊 Read Tip</button>
              </div>

              <div className="mt-6 flex gap-3 flex-wrap text-xs">
                <Badge>ISO 9001</Badge>
                <Badge>NABH</Badge>
                <Badge>SehatCard</Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xs">Beds Available</div>
                  <div className="text-2xl font-bold">{liveStats.beds}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-xs">Doctors Online</div>
                  <div className="text-2xl font-bold">{liveStats.doctorsOnline}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black rounded-2xl p-4 shadow max-w-md">
                <div className="flex items-center gap-3">
                  <img src={(featuredDoctor || doctors[0]).avatar} className="w-16 h-16 rounded-full object-cover" alt={(featuredDoctor || doctors[0]).name} />
                  <div>
                    <div className="font-semibold">{(featuredDoctor || doctors[0]).name}</div>
                    <div className="text-xs text-gray-200">{(featuredDoctor || doctors[0]).specialty} • {(featuredDoctor || doctors[0]).years} yrs</div>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Star className="w-4 h-4" /> <div>{typeof (featuredDoctor || doctors[0]).rating === 'object' ? (featuredDoctor || doctors[0]).rating.average : (featuredDoctor || doctors[0]).rating} • Next {(featuredDoctor || doctors[0]).nextAvailable}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => navigate(`/doctor/${(featuredDoctor || doctors[0]).id}`)} className="py-2 rounded-md bg-green-600 text-white">View Profile</button>
                  <button onClick={() => navigate('/book-appointment', { state: { doctor: featuredDoctor || doctors[0] } })} className="py-2 rounded-md border">Book</button>
                </div>

                <div className="mt-3 text-xs text-gray-200">Points: <strong>{typeof points === 'object' ? points?.average ?? points?.count ?? 0 : points}</strong></div>
              </div>

              {/* mini sparkline placeholder */}
              <div className="absolute -bottom-10 right-0 bg-black dark:bg-gray-800 p-3 rounded-2xl shadow w-44 text-sm">
                <div className="text-xs text-gray-500">Bed Occupancy (7d)</div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-6 w-5 bg-green-400/60" />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Live Stats Row ---------- */}
        <section className="-mt-8 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-xs text-gray-500">Beds Available</div>
            <div className="text-2xl font-bold text-green-700">{liveStats.beds}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-xs text-gray-500">Doctors Online</div>
            <div className="text-2xl font-bold text-blue-600">{liveStats.doctorsOnline}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-xs text-gray-500">ER Wait Time</div>
            <div className="text-2xl font-bold text-yellow-600">{liveStats.erWait} mins</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-xs text-gray-500">Ongoing Surgeries</div>
            <div className="text-2xl font-bold text-red-600">{liveStats.surgeries}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-xs text-gray-500">Active Alerts</div>
            <div className="text-2xl font-bold text-red-700">{liveStats.alerts}</div>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section className="py-10 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Our Core Services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((s) => (
              <article key={s.key} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-lg"><StethoscopeIcon /></div>
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.desc}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <button onClick={() => toast(`Opening ${s.title} service details (demo)`)} className="text-green-600 underline">Learn more</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Appointment Booking (NL Parser + Live Slots) ---------- */}
        <section id="booking" className="py-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Smart Booking</h3>
              <p className="text-sm text-gray-600 mb-3">Book using the form or type natural language like "Book Cardiology tomorrow 10am".</p>

              <div className="grid gap-3">
                <input value={nlInput} onChange={(e) => setNlInput(e.target.value)} placeholder='e.g., "Book Cardiology tomorrow 10am"' className="w-full px-4 py-2 rounded-md border bg-white/80 dark:bg-gray-800/80" />
                <div className="flex gap-2">
                  <button onClick={handleParseNL} className="bg-green-600 text-white px-4 py-2 rounded-md">Parse</button>
                  <button onClick={() => { setNlInput(""); setNlParse(null); }} className="px-4 py-2 rounded-md border">Reset</button>
                </div>

                {nlParse && (
                  <div className="mt-2 p-3 border rounded-md bg-white dark:bg-gray-800">
                    <div><strong>Specialty:</strong> {nlParse.specialty ?? "—"}</div>
                    <div><strong>Date:</strong> {nlParse.date ?? "—"}</div>
                    <div><strong>Time:</strong> {nlParse.time ?? "—"}</div>
                    <div className="mt-2 text-xs text-gray-500">Note: Demo parser — replace with an NLP model for production.</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Live Appointment Slots</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {slots.map((s) => (
                  <div key={s.id} className={`p-4 rounded-xl shadow text-center ${s.free ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-900/60 text-gray-400"}`}>
                    <div className="font-semibold">{s.time}</div>
                    <div className="text-sm mt-2">{s.free ? "Available" : "Booked"}</div>
                    <button disabled={!s.free} onClick={() => bookSlot(s)} className={`mt-3 w-full py-2 rounded-md ${s.free ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>{s.free ? "Book" : "Notify me"}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Predictive Insights ---------- */}
        <section className="py-10 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Predictive Insights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm">ER Wait Forecast</div>
                <div className="text-xs text-gray-500">Next 24h</div>
              </div>
              <div className="mt-3">
                {loadingInsights ? <Skeleton /> : <MiniSpark data={[12, 10, 15, 18, 16, 13, 12]} />}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="text-sm">Bed Occupancy Trend</div>
              <div className="mt-3">
                {loadingInsights ? <Skeleton /> : <MiniSpark data={insights?.bedOccupancyTrend || [60, 62, 65, 63, 67, 70, 68]} />}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="text-sm">Predictive Readmission Risk</div>
              <div className="mt-4 text-2xl font-bold text-red-600">{insights?.readmissionRisk?.average ?? insights?.readmissionRisk ?? 6}%</div>
              <div className="text-xs text-gray-500">Low risk cohort</div>
            </div>
          </div>
        </section>

        {/* ---------- Doctor Directory ---------- */}
        <section className="py-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {doctors.map((d) => (
                <div key={d.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                  <div className="flex items-center gap-3">
                    <img src={d.avatar} alt={d.name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.specialty} • {d.years} yrs</div>
                      <div className="text-xs text-yellow-400 mt-1">⭐ {d.rating}</div>
                    </div>
                    <div>
                      <button onClick={() => navigate(`/doctor/${d.id}`)} className="px-3 py-1 rounded-md border">Profile</button>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="text-xs text-gray-500">Languages: {d.languages.join(", ")}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => navigate('/book-appointment', { state: { doctor: d } })} className="flex-1 py-2 rounded-md bg-green-600 text-white">Book</button>
                      <button onClick={() => navigate('/chat', { state: { doctor: d } })} className="py-2 rounded-md border">Chat</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Testimonials & Articles ---------- */}
        <section className="py-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Patient Stories</h3>
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <SmallAvatar src={`https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 60)}`} alt={t.name} />
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-gray-500">Sentiment: <span className="text-green-600">Positive</span></div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm italic">“{t.quote}”</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Health Articles</h3>
            <div className="space-y-3">
              {articles.map((a) => (
                <article key={a.id} className="p-3 border rounded hover:shadow">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-gray-500">By {a.author} • {a.readMinutes} min read</div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{a.excerpt}</p>
                  <div className="mt-2">
                    <button onClick={() => toast('Open article (demo)')} className="text-green-600 underline">Read more</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Multimedia & Map ---------- */}
        <section className="py-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Take a Quick Tour</h3>
            <p className="text-sm text-gray-500 mb-3">Video / VR placeholders — integrate YouTube/Vimeo or 360° viewer here.</p>
            <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
              <video controls className="w-full h-full object-cover">
                <source src={null} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Visit Us</h3>
            <p className="text-sm text-gray-600 mb-3">Parking, accessible entrances, and public transport nearby.</p>
            <div className="w-full h-56 rounded overflow-hidden border">
              <iframe title="map" src="https://maps.google.com/maps?q=Stadium%20Road,%20Karachi,%20Pakistan&output=embed" className="w-full h-full border-0" loading="lazy"></iframe>
            </div>
            <div className="mt-3 flex gap-3 items-center">
              <div className="p-3 bg-green-50 rounded-xl"><Phone className="w-4 h-4 text-green-700" /></div>
              <div>
                <div className="font-semibold">+92 21 01 98 11 10</div>
                <div className="text-xs text-gray-500">Emergency hotline (24/7)</div>
              </div>
            </div>
          </div>
        </section>

        

        {/* ---------- Floating Chat Widget ---------- */}
        {chatOpen && (
          <div className="fixed right-6 bottom-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-3 bg-green-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Hospital Bot</div>
              <div className="flex items-center gap-2">
                <button onClick={() => { ttsSpeak("Goodbye"); setChatOpen(false); }} className="text-white">✕</button>
              </div>
            </div>
            <div ref={chatRef} className="p-3 h-64 overflow-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-md ${m.from === "bot" ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100" : "bg-green-50 text-green-800"}`}>
                  <div className="text-sm">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <ChatInput onSend={(t) => sendMessage(t)} />
            </div>
          </div>
        )}

        {/* ---------- Floating quick actions ---------- */}
        <div className="fixed left-6 bottom-6 z-40 flex flex-col gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow"><ArrowUp className="w-4 h-4" /></button>
          <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="bg-green-600 text-white px-3 py-2 rounded-full shadow">🩺</button>
          <button onClick={() => setChatOpen((c) => !c)} className="bg-purple-600 text-white px-3 py-2 rounded-full shadow">💬</button>
        </div>
      </main>
    </div>
  );
}

// -------------------- Small additional subcomponents used above --------------------
function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about symptoms, booking..." className="flex-1 px-3 py-2 rounded-md border bg-white/80 dark:bg-gray-900/80" />
      <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-md">Send</button>
    </form>
  );
}

function MiniSpark({ data = [] }) {
  if (!data.length) return null;
  const w = 200, h = 50;
  const max = Math.max(...data), min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
      <polyline fill="none" stroke="#10B981" strokeWidth="2" points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// lightweight inline icon to avoid heavy imports in multiple places
// lightweight inline icon to avoid heavy imports in multiple places
// lightweight inline icon to avoid heavy imports in multiple places
function StethoscopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-green-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 14v7a2 2 0 0 1-4 0v-7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 14a6 6 0 0 0 12 0V5m-6 9V5"
      />
    </svg>
  );
}

