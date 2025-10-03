import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Building2,
  CalendarClock,
  Clock3,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Radiation,
  Stethoscope,
  Syringe,
  Thermometer,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Star,
  StarHalf,
  BadgeCheck,
  Activity,
  Phone,
  MapPin,
  Users,
  Sparkles,
  Settings2,
  Moon,
  Sun,
  Info,
  X,
  Plus,
  Minus,
  Layers,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ------------------------------
// Mock + Live-ready Department Data
// ------------------------------
const BASE_DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: <HeartPulse className="w-6 h-6" />,
    head: "Dr. Ahsan Malik",
    description:
      "Comprehensive heart care including ECG, angiography, cath lab & cardiac surgery.",
    timings: "Mon–Sat: 9:00–17:00",
    phone: "+92 21 111 900 100",
    location: "Tower A, Level 4",
    category: "Inpatient",
    services: [
      "ECG & Echo",
      "Angiography",
      "Angioplasty",
      "Cardiac Rehab",
    ],
    rating: 4.8,
    reviews: 238,
    badges: ["Most Visited", "24/7 Triage"],
    occupancy: 0.72, // 72%
    waitMins: 18,
    doctors: [
      { name: "Dr. Zara Khan", role: "Interventional Cardiologist", slots: ["10:30", "11:15", "15:00"] },
      { name: "Dr. Usman Ali", role: "Cardiac Surgeon", slots: ["12:00", "16:30"] },
    ],
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: <Brain className="w-6 h-6" />,
    head: "Dr. Sara Khan",
    description:
      "Diagnosis & treatment of brain, spine and nerve disorders including stroke & epilepsy.",
    timings: "Mon–Fri: 10:00–16:00",
    phone: "+92 21 111 900 200",
    location: "Tower B, Level 3",
    category: "Outpatient",
    services: ["EEG", "Stroke Clinic", "Neuromuscular Clinic"],
    rating: 4.7,
    reviews: 154,
    badges: ["Stroke Ready"],
    occupancy: 0.61,
    waitMins: 25,
    doctors: [
      { name: "Dr. Imran Noor", role: "Neurologist", slots: ["09:30", "13:00"] },
      { name: "Dr. Maryam J.", role: "Neurosurgeon", slots: ["11:45", "15:15"] },
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: <Baby className="w-6 h-6" />,
    head: "Dr. Imran Siddiqui",
    description:
      "Comprehensive child care: immunizations, growth monitoring & pediatric emergencies.",
    timings: "Daily: 08:00–18:00",
    phone: "+92 21 111 900 300",
    location: "Children's Wing",
    category: "Outpatient",
    services: ["Well-baby Clinic", "NICU Consult", "Vaccine Center"],
    rating: 4.6,
    reviews: 310,
    badges: ["Family Friendly"],
    occupancy: 0.58,
    waitMins: 12,
    doctors: [
      { name: "Dr. Hiba Farooq", role: "Pediatrician", slots: ["10:15", "12:45", "16:00"] },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: <Radiation className="w-6 h-6" />,
    head: "Dr. Nida Ahmed",
    description:
      "Advanced imaging: Digital X-ray, MRI, CT scan & Ultrasound — 24/7 reporting.",
    timings: "Mon–Sat: 08:00–20:00",
    phone: "+92 21 111 900 400",
    location: "Diagnostics Block",
    category: "Diagnostics",
    services: ["MRI", "CT", "Ultrasound", "X-ray"],
    rating: 4.5,
    reviews: 192,
    badges: ["Fast Reports"],
    occupancy: 0.81,
    waitMins: 30,
    doctors: [
      { name: "Dr. Hamza Qureshi", role: "Radiologist", slots: ["09:00", "14:30"] },
    ],
  },
  {
    id: "oncology",
    name: "Oncology",
    icon: <Syringe className="w-6 h-6" />,
    head: "Dr. Faisal Raza",
    description:
      "Cancer diagnosis, chemotherapy, radiation therapy & palliative care.",
    timings: "Mon–Fri: 09:00–15:00",
    phone: "+92 21 111 900 500",
    location: "Tower C, Level 2",
    category: "Inpatient",
    services: ["Chemo Suite", "Radiation", "Tumor Board"],
    rating: 4.7,
    reviews: 121,
    badges: ["Tumor Board"],
    occupancy: 0.69,
    waitMins: 20,
    doctors: [
      { name: "Dr. Hira Sajid", role: "Oncologist", slots: ["10:45", "12:30"] },
    ],
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: <Bone className="w-6 h-6" />,
    head: "Dr. Rabia Shah",
    description:
      "Bone & joint care: fractures, arthritis, arthroscopy & joint replacement.",
    timings: "Mon–Sat: 10:00–18:00",
    phone: "+92 21 111 900 600",
    location: "Surgical Block",
    category: "Surgery",
    services: ["Fracture Clinic", "Sports Injury", "Joint Replacement"],
    rating: 4.6,
    reviews: 176,
    badges: ["Rehab Linked"],
    occupancy: 0.55,
    waitMins: 22,
    doctors: [
      { name: "Dr. Danish R.", role: "Orthopedic Surgeon", slots: ["11:00", "12:15", "17:30"] },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Inpatient", label: "Inpatient" },
  { id: "Outpatient", label: "Outpatient" },
  { id: "Diagnostics", label: "Diagnostics" },
  { id: "Surgery", label: "Surgery" },
];

// Utility: Simple fuzzy match
const fuzzyIncludes = (text, query) => {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    ti = t.indexOf(ch, ti);
    if (ti === -1) return false;
    ti++;
  }
  return true;
};

// Persisted dark mode
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme.dark");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme.dark", JSON.stringify(dark)); } catch { /* ignore */ }
  }, [dark]);
  return [dark, setDark];
};

// ------------------------------
// Main Component
// ------------------------------
export default function Departments() {
  const [dark, setDark] = useDarkMode();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selected, setSelected] = useState([]); // for comparison (ids)
  const [expanded, setExpanded] = useState(null); // which card is expanded
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [departments, setDepartments] = useState(BASE_DEPARTMENTS);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loadingLive, setLoadingLive] = useState(false);
  const [useLive, setUseLive] = useState(false); // toggle live vs mock

  const searchRef = useRef(null);

  // Simulate live updates for wait times / occupancy
  useEffect(() => {
    const t = setInterval(() => {
      setDepartments((prev) =>
        prev.map((d) => ({
          ...d,
          waitMins: Math.max(5, Math.min(45, Math.round(d.waitMins + (Math.random() * 6 - 3)))),
          occupancy: Math.max(0.3, Math.min(0.95, +(d.occupancy + (Math.random() * 0.06 - 0.03)).toFixed(2))),
        }))
      );
      setLastUpdated(new Date());
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // Optional: Load real data (placeholder)
  useEffect(() => {
    const fetchLive = async () => {
      if (!useLive) return;
      setLoadingLive(true);
      try {
        // Example endpoint (replace with your MIS/HIS)
        // const res = await fetch('/api/departments');
        // const json = await res.json();
        // setDepartments(json);
        await new Promise((r) => setTimeout(r, 800)); // simulate
        toast.success("Connected to live data (demo)");
      } catch {
        toast.error("Live data unavailable – using demo data");
        setUseLive(false);
      } finally {
        setLoadingLive(false);
      }
    };
    fetchLive();
  }, [useLive]);

  // Autosuggest for search
  useEffect(() => {
    const q = query.trim();
    if (!q) return setSuggestions([]);
    const pool = departments.map((d) => d.name);
    setSuggestions(pool.filter((n) => fuzzyIncludes(n, q)).slice(0, 6));
  }, [query, departments]);

  // Filters
  const filtered = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const isOpen = (t) => {
      // very simple "open" checker based on range in 24h
      const range = (t || "").match(/(\d{1,2}):(\d{2}).*(\d{1,2}):(\d{2})/);
      if (!range) return true; // if unknown, treat as open
      const openH = +range[1];
      const closeH = +range[3];
      return hour >= openH && hour <= closeH;
    };
    return departments
      .filter((d) => (category === "all" ? true : d.category === category))
      .filter((d) => d.rating >= minRating)
      .filter((d) => fuzzyIncludes(`${d.name} ${d.description} ${d.services.join(" ")}`, query))
      .filter((d) => (openNowOnly ? isOpen(d.timings) : true));
  }, [departments, category, minRating, query, openNowOnly]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const selectedDepartments = departments.filter((d) => selected.includes(d.id));

  const categoryStats = useMemo(() => {
    const map = {};
    departments.forEach((d) => (map[d.category] = (map[d.category] || 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [departments]);

  const waitTimeSeries = useMemo(() => {
    // build a small series per department (mock trend)
    return departments.map((d) => ({ name: d.name, wait: d.waitMins }));
  }, [departments]);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]; // for pie

  const RatingStars = ({ value }) => {
    const full = Math.floor(value);
    const half = value - full >= 0.4;
    return (
      <div className="flex items-center gap-0.5" aria-label={`Rating ${value.toFixed(1)} out of 5`}>
        {Array.from({ length: full }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {half && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
          <Star key={`o-${i}`} className="w-4 h-4 text-yellow-400" />
        ))}
        <span className="ml-1 text-xs text-gray-500 dark:text-gray-300">{value.toFixed(1)}</span>
      </div>
    );
  };

  const Badge = ({ children }) => (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300/40">
      {children}
    </span>
  );

  const DeptCard = ({ d }) => (
    <motion.article
      layout
      className="group relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-gray-800 shadow hover:shadow-lg transition overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {d.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-tight flex items-center gap-2">
                {d.name}
                {d.badges?.slice(0, 1).map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {d.location}</span>
                <span className="flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> {d.timings}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleSelect(d.id)}
            className={`text-xs px-2 py-1 rounded-md border transition ${
              selected.includes(d.id)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            }`}
            aria-pressed={selected.includes(d.id)}
          >
            {selected.includes(d.id) ? <Minus className="w-3.5 h-3.5 inline mr-1"/> : <Plus className="w-3.5 h-3.5 inline mr-1"/>}
            Compare
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{d.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">Head of Dept</div>
            <div className="font-medium mt-0.5">{d.head}</div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">Phone</div>
            <div className="font-medium mt-0.5 flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> {d.phone}</div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">Category</div>
            <div className="font-medium mt-0.5">{d.category}</div>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-[11px] text-gray-500 dark:text-gray-400">Patients Now</div>
            <div className="font-medium mt-0.5 flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {(d.occupancy*100).toFixed(0)}%</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <RatingStars value={d.rating} />
          <span className="text-xs text-gray-500 dark:text-gray-400">({d.reviews} reviews)</span>
          <span className="ml-auto text-xs flex items-center gap-1 font-medium"><Activity className="w-4 h-4 text-emerald-600"/> Wait ~ {d.waitMins} min</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {d.services.slice(0, 4).map((s) => (
            <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60">{s}</span>
          ))}
          {d.badges?.slice(1).map((b) => (
            <span key={b} className="text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/60">{b}</span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setExpanded(expanded === d.id ? null : d.id)}
            className="text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1"
            aria-expanded={expanded === d.id}
          >
            {expanded === d.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} Details
          </button>
          <button
            onClick={() => toast("Booking flow coming soon — selecting available slot", { icon: "🗓️" })}
            className="text-sm px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Book Appointment
          </button>
          <a href="#contact" className="text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">Contact</a>
        </div>
      </div>

      <AnimatePresence>
        {expanded === d.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1"><Info className="w-4 h-4"/> Department Info</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Head: {d.head}</li>
                  <li>Location: {d.location}</li>
                  <li>Phone: {d.phone}</li>
                  <li>Timings: {d.timings}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Available Doctors</h4>
                <ul className="space-y-1">
                  {d.doctors.map((doc) => (
                    <li key={doc.name} className="flex items-center justify-between">
                      <span>{doc.name} — <span className="text-xs text-gray-500">{doc.role}</span></span>
                      <div className="flex gap-1">
                        {doc.slots.map((s) => (
                          <button
                            key={s}
                            onClick={() => toast.success(`Reserved slot ${s} with ${doc.name} (demo)`)}
                            className="px-2 py-0.5 rounded border text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                          >{s}</button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">FAQs</h4>
                <details className="p-2 rounded border">
                  <summary className="cursor-pointer">Do I need referral?</summary>
                  <div className="mt-1 text-gray-600 dark:text-gray-300">Not mandatory for OPD; required for procedures.</div>
                </details>
                <details className="p-2 rounded border mt-2">
                  <summary className="cursor-pointer">Insurance accepted?</summary>
                  <div className="mt-1 text-gray-600 dark:text-gray-300">Yes, most major providers are supported.</div>
                </details>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );

  return (
    <div className="w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="max-w-screen-xl mx-auto px-4 pt-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li className="opacity-60">/</li>
          <li className="font-medium text-gray-700 dark:text-gray-200">Departments</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 opacity-10" />
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                Explore Departments
                <Badge><Sparkles className="w-3.5 h-3.5 inline mr-1"/>Live</Badge>
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
                Find the right specialty, check live wait times, and book a slot instantly. Data auto-refreshes every few seconds.
              </p>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark((d) => !d)}
                className="px-3 py-2 rounded-lg border text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                {dark ? "Light" : "Dark"} Mode
              </button>
              <button
                onClick={() => setUseLive((v) => !v)}
                className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${useLive ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                aria-pressed={useLive}
              >
                <Settings2 className="w-4 h-4"/> {useLive ? "Live On" : "Live Off"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 p-2 pl-3 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700">
              <Search className="w-4 h-4 text-gray-500"/>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search departments, services, conditions…"
                aria-label="Search departments"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute z-20 mt-1 w-full rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow"
                  role="listbox"
                >
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      role="option"
                      onMouseDown={() => setQuery(s)}
                      className="px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >{s}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4"/>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-2 py-2 rounded border bg-white dark:bg-gray-900 dark:border-gray-700"
                aria-label="Filter by category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="opacity-70">Min Rating</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(+e.target.value)}
                className="px-2 py-2 rounded border bg-white dark:bg-gray-900 dark:border-gray-700"
                aria-label="Filter by rating"
              >
                {[0,3,4,4.5].map((r) => (
                  <option key={r} value={r}>{r === 0 ? "Any" : `${r}+`}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={openNowOnly} onChange={(e) => setOpenNowOnly(e.target.checked)} className="accent-emerald-600" />
              Open now
            </label>
          </div>
        </div>
      </section>

      {/* Quick Links Sidebar (anchor list) */}
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 self-start">
          <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
            <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              {departments.map((d) => (
                <li key={d.id}>
                  <a href={`#${d.id}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5"/> {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-4 mt-4">
            <h3 className="text-sm font-semibold mb-2">Category Mix</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryStats} dataKey="value" nameKey="name" outerRadius={60}>
                    {categoryStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>

        {/* Department Grid */}
        <main className="lg:col-span-9">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-sm px-3 py-1.5 rounded-full border transition ${
                  category === c.id ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loadingLive && (
            <div className="mb-4 text-sm text-amber-600">Fetching live data…</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
            {filtered.map((d) => (
              <div id={d.id} key={d.id}>
                <DeptCard d={d} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-sm text-gray-500">No departments match your filters.</div>
          )}
        </main>
      </div>

      {/* Analytics: Wait Times Overview */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-3">Live Wait Times Overview</h3>
          <div className="h-64 rounded-xl border bg-white dark:bg-gray-950 dark:border-gray-800 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} />
                <YAxis unit=" min" />
                <ReTooltip />
                <Bar dataKey="wait" fill="#60a5fa" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Compare Drawer */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-0 right-0 z-40"
          >
            <div className="max-w-screen-xl mx-auto px-4">
              <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold flex items-center gap-2"><BadgeCheck className="w-4 h-4"/> Compare Departments</div>
                  <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSelected([])} aria-label="Clear compare"><X className="w-4 h-4"/></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="py-2 pr-6">Metric</th>
                        {selectedDepartments.map((d) => (
                          <th key={d.id} className="py-2 pr-6">{d.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 pr-6">Head</td>
                        {selectedDepartments.map((d) => (<td key={d.id} className="py-2 pr-6">{d.head}</td>))}
                      </tr>
                      <tr>
                        <td className="py-2 pr-6">Category</td>
                        {selectedDepartments.map((d) => (<td key={d.id} className="py-2 pr-6">{d.category}</td>))}
                      </tr>
                      <tr>
                        <td className="py-2 pr-6">Timings</td>
                        {selectedDepartments.map((d) => (<td key={d.id} className="py-2 pr-6">{d.timings}</td>))}
                      </tr>
                      <tr>
                        <td className="py-2 pr-6">Wait (avg)</td>
                        {selectedDepartments.map((d) => (<td key={d.id} className="py-2 pr-6">{d.waitMins} min</td>))}
                      </tr>
                      <tr>
                        <td className="py-2 pr-6">Occupancy</td>
                        {selectedDepartments.map((d) => (<td key={d.id} className="py-2 pr-6">{(d.occupancy*100).toFixed(0)}%</td>))}
                      </tr>
                      <tr>
                        <td className="py-2 pr-6">Top Services</td>
                        {selectedDepartments.map((d) => (
                          <td key={d.id} className="py-2 pr-6">
                            <div className="flex flex-wrap gap-1">
                              {d.services.slice(0,3).map((s) => (<span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">{s}</span>))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <footer id="contact" className="mt-12 bg-emerald-700 text-white text-center py-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <p className="text-sm">Need help choosing a department? Our care team can guide you.</p>
          <div className="mt-3">
            <a href="tel:+9221111900100" className="inline-block text-black bg-white text-emerald-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition shadow">Call +92 21 111 900 100</a>
          </div>
          <p className="text-xs mt-4 opacity-90">© Medicore Health — Departments Portal</p>
        </div>
      </footer>
    </div>
  );
}
