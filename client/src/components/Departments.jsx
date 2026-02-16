
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Activity,
  Bell,
  CalendarClock,
  Crown,
  Filter,
  Heart,
  HeartPulse,
  Map as MapIcon,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Users
} from "lucide-react";
import { apiRequest } from "../services/api";

const ICON_MAP = {
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  CalendarClock: <CalendarClock className="w-6 h-6" />
};

const DEMO_DEPARTMENTS = [
  {
    id: "cardiology",
    slug: "cardiology",
    name: "Cardiology",
    iconKey: "HeartPulse",
    head: "Dr. Ahsan Malik",
    description: "Comprehensive heart care including ECG, angiography, cath lab & cardiac surgery.",
    timings: "Mon-Sat: 09:00-17:00",
    phone: "+1 (212) 555-0101",
    location: "Tower A, Level 4",
    category: "Inpatient",
    services: ["ECG & Echo", "Angiography", "Angioplasty", "Cardiac Rehab"],
    rating: 4.8,
    reviews: 238,
    badges: ["Most Visited", "24/7 Triage"],
    occupancy: 0.72,
    waitMins: 18,
    doctors: [
      { name: "Dr. Zara Khan", role: "Interventional Cardiologist", slots: ["10:30", "11:15", "15:00"] }
    ]
  },
  {
    id: "neurology",
    slug: "neurology",
    name: "Neurology",
    iconKey: "Stethoscope",
    head: "Dr. Sara Khan",
    description: "Diagnosis & treatment of brain, spine and nerve disorders including stroke & epilepsy.",
    timings: "Mon-Fri: 10:00-16:00",
    phone: "+1 (212) 555-0102",
    location: "Tower B, Level 3",
    category: "Outpatient",
    services: ["EEG", "Stroke Clinic", "Neuromuscular Clinic"],
    rating: 4.7,
    reviews: 154,
    badges: ["Stroke Ready"],
    occupancy: 0.61,
    waitMins: 25,
    doctors: [{ name: "Dr. Imran Noor", role: "Neurologist", slots: ["09:30", "13:00"] }]
  },
  {
    id: "pediatrics",
    slug: "pediatrics",
    name: "Pediatrics",
    iconKey: "Stethoscope",
    head: "Dr. Imran Siddiqui",
    description: "Comprehensive child care: immunizations, growth monitoring & pediatric emergencies.",
    timings: "Daily: 08:00-18:00",
    phone: "+1 (212) 555-0103",
    location: "Children's Wing",
    category: "Outpatient",
    services: ["Well-baby Clinic", "NICU Consult", "Vaccine Center"],
    rating: 4.6,
    reviews: 310,
    badges: ["Family Friendly"],
    occupancy: 0.58,
    waitMins: 12,
    doctors: [{ name: "Dr. Hiba Farooq", role: "Pediatrician", slots: ["10:15", "12:45", "16:00"] }]
  },
  {
    id: "radiology",
    slug: "radiology",
    name: "Radiology",
    iconKey: "Activity",
    head: "Dr. Nida Ahmed",
    description: "Advanced imaging: Digital X-ray, MRI, CT scan & Ultrasound - 24/7 reporting.",
    timings: "Mon-Sat: 08:00-20:00",
    phone: "+1 (212) 555-0104",
    location: "Diagnostics Block",
    category: "Diagnostics",
    services: ["MRI", "CT", "Ultrasound", "X-ray"],
    rating: 4.5,
    reviews: 192,
    badges: ["Fast Reports"],
    occupancy: 0.81,
    waitMins: 30,
    doctors: [{ name: "Dr. Hamza Qureshi", role: "Radiologist", slots: ["09:00", "14:30"] }]
  },
  {
    id: "oncology",
    slug: "oncology",
    name: "Oncology",
    iconKey: "HeartPulse",
    head: "Dr. Faisal Raza",
    description: "Cancer diagnosis, chemotherapy, radiation therapy & palliative care.",
    timings: "Mon-Fri: 09:00-15:00",
    phone: "+1 (212) 555-0105",
    location: "Tower C, Level 2",
    category: "Inpatient",
    services: ["Chemo Suite", "Radiation", "Tumor Board"],
    rating: 4.7,
    reviews: 121,
    badges: ["Tumor Board"],
    occupancy: 0.69,
    waitMins: 20,
    doctors: [{ name: "Dr. Hira Sajid", role: "Oncologist", slots: ["10:45", "12:30"] }]
  },
  {
    id: "orthopedics",
    slug: "orthopedics",
    name: "Orthopedics",
    iconKey: "Stethoscope",
    head: "Dr. Rabia Shah",
    description: "Bone & joint care: fractures, arthritis, arthroscopy & joint replacement.",
    timings: "Mon-Sat: 10:00-18:00",
    phone: "+1 (212) 555-0106",
    location: "Surgical Block",
    category: "Surgery",
    services: ["Fracture Clinic", "Sports Injury", "Joint Replacement"],
    rating: 4.6,
    reviews: 176,
    badges: ["Rehab Linked"],
    occupancy: 0.55,
    waitMins: 22,
    doctors: [{ name: "Dr. Danish R.", role: "Orthopedic Surgeon", slots: ["11:00", "12:15", "17:30"] }]
  }
];
const DEMO_EXTRAS = {
  announcements: [
    { title: "Concierge Access", message: "Priority scheduling and private lounges now available." },
    { title: "Extended Hours", message: "Select departments have premium evening availability." }
  ],
  highlights: [
    { label: "Patient Satisfaction", value: "96%", delta: "+2%" },
    { label: "Avg Wait", value: "18 min", delta: "-3 min" },
    { label: "Specialists On Duty", value: "28", delta: "+4" },
    { label: "Priority Slots", value: "140", delta: "steady" }
  ],
  recommendations: [
    { id: "rec-1", title: "Cardiology Executive Track", reason: "High demand with priority triage slots.", tags: ["concierge", "priority"] },
    { id: "rec-2", title: "Radiology Elite Imaging", reason: "Same-day MRI & rapid reads.", tags: ["imaging", "express"] }
  ],
  insurers: [
    { insurerId: "aetna-1", name: "Aetna", plan: "Platinum", network: "In-Network", coverage: "85-90% coverage", copay: "$35", preAuthRequired: true, phone: "+1 (800) 555-0199", notes: "Concierge desk assists with prior authorizations." }
  ],
  reviews: [
    { id: "rev-1", departmentId: "cardiology", name: "Amelia", rating: 4.8, comment: "Exceptional coordination and concierge-level care throughout the visit." },
    { id: "rev-2", departmentId: "pediatrics", name: "Liam", rating: 4.6, comment: "Premium facilities with clear communication and fast triage." }
  ],
  heatmap: [
    { zone: "Tower A", occupancy: 0.72, wait: 18 },
    { zone: "Diagnostics", occupancy: 0.81, wait: 30 }
  ]
};

const useSafeLocalStorage = (key, fallback) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
};

const RatingStars = ({ value }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.4;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${value.toFixed(1)} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {half && <Star className="w-4 h-4 fill-amber-300 text-amber-300" />}
      {Array.from({ length: Math.max(0, 5 - full - (half ? 1 : 0)) }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-white/45" />
      ))}
    </div>
  );
};

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <div className="mb-6">
    {eyebrow && <div className="text-[11px] uppercase tracking-[0.45em] text-amber-200/70">{eyebrow}</div>}
    <h2 className="mt-2 text-2xl md:text-3xl font-semibold font-['Playfair_Display'] text-amber-50">
      {title}
    </h2>
    {subtitle && <p className="mt-2 text-sm text-white/75 max-w-2xl">{subtitle}</p>}
  </div>
);
export default function Departments() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [departments, setDepartments] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [mode, setMode] = useState("live");
  const [favorites, setFavorites] = useSafeLocalStorage("dept.favorites", []);
  const [announcements, setAnnouncements] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [insurers, setInsurers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [insuranceModal, setInsuranceModal] = useState(null);
  const [insuranceSearch, setInsuranceSearch] = useState("");
  const searchRef = useRef(null);

  const attachIcons = (items) =>
    items.map((d) => {
      const rawId = d.slug || d.id || d._id;
      return {
        ...d,
        id: rawId ? String(rawId) : undefined,
        icon: ICON_MAP[d.iconKey] || ICON_MAP.Stethoscope
      };
    });

  const postDepartmentEngagement = async (endpoint, payload, successMessage) => {
    try {
      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (successMessage) toast.success(successMessage);
      return true;
    } catch {
      return false;
    }
  };

  const buildSlotISO = (timeString) => {
    const now = new Date();
    const [hRaw, mRaw = "0"] = (timeString || "09:00").split(":");
    const hour = parseInt(hRaw, 10);
    const minute = parseInt(mRaw, 10);
    const slot = new Date();
    slot.setHours(Number.isNaN(hour) ? 9 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0);
    if (slot <= now) slot.setDate(slot.getDate() + 1);
    return slot.toISOString();
  };

  const handleQuickBook = async (department) => {
    const doc = department.doctors?.[0];
    const time = doc?.slots?.[0] || "09:00";
    if (!doc) {
      toast.error("No doctors available for booking");
      navigate("/book-appointment");
      return;
    }
    const slot = buildSlotISO(time);
    await postDepartmentEngagement("/api/department-engagements/booking", {
      departmentId: department._id || department.id,
      meta: { slot }
    });
    navigate("/book-appointment", {
      state: {
        department: { id: department.id, name: department.name },
        doctor: {
          id: `${department.id}-${doc.name}`.replace(/\s+/g, "-").toLowerCase(),
          name: doc.name,
          specialization: department.name,
          experience: 0,
          rating: department.rating || 0,
          fee: 500,
          languages: ["English"],
          clinic: department.location || "",
          slots: [
            {
              date: new Date(slot).toISOString().split("T")[0],
              times: [{ iso: slot, taken: false }]
            }
          ]
        },
        slot
      }
    });
  };

  const toggleFavorite = async (department) => {
    const deptId = String(department.id ?? department._id ?? "");
    if (!deptId) return;
    const willAdd = !favorites.includes(deptId);
    setFavorites((prev) => (willAdd ? [...prev, deptId] : prev.filter((id) => id !== deptId)));
    if (willAdd) {
      await postDepartmentEngagement(
        "/api/department-engagements/favorite",
        { departmentId: department._id || department.id },
        "Saved to favorites"
      );
    } else {
      toast("Removed from favorites");
    }
  };

  const loadDepartments = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await apiRequest("/api/public/departments");
      if (Array.isArray(data) && data.length > 0) {
        setDepartments(attachIcons(data));
        setMode("live");
        setLastUpdated(new Date());
        return;
      }
      throw new Error("No live data");
    } catch {
      const demo = attachIcons(DEMO_DEPARTMENTS);
      setDepartments(demo);
      setMode("demo");
      setLoadError("Live data unavailable. Showing curated demo from seed profiles.");
    } finally {
      setLoading(false);
    }
  };

  const loadExtras = async () => {
    const calls = [
      apiRequest("/api/public/departments/announcements"),
      apiRequest("/api/public/departments/highlights"),
      apiRequest("/api/public/departments/insurers"),
      apiRequest("/api/public/departments/recommendations"),
      apiRequest("/api/public/departments/reviews"),
      apiRequest("/api/public/departments/heatmap")
    ];

    const [ann, high, ins, recs, revs, heat] = await Promise.allSettled(calls);

    setAnnouncements(ann.status === "fulfilled" ? ann.value : DEMO_EXTRAS.announcements);
    setHighlights(high.status === "fulfilled" ? high.value : DEMO_EXTRAS.highlights);
    setInsurers(ins.status === "fulfilled" ? ins.value : DEMO_EXTRAS.insurers);
    setRecommendations(recs.status === "fulfilled" ? recs.value : DEMO_EXTRAS.recommendations);
    setReviews(revs.status === "fulfilled" ? revs.value : DEMO_EXTRAS.reviews);
    setHeatmap(heat.status === "fulfilled" ? heat.value : DEMO_EXTRAS.heatmap);
  };

  useEffect(() => {
    loadDepartments();
    loadExtras();
  }, []);
  const categories = useMemo(() => {
    const set = new Set(departments.map((d) => d.category));
    return ["all", ...Array.from(set)];
  }, [departments]);

  const filtered = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const isOpen = (t) => {
      const range = (t || "").match(/(\d{1,2}):(\d{2}).*(\d{1,2}):(\d{2})/);
      if (!range) return true;
      const openH = +range[1];
      const closeH = +range[3];
      return hour >= openH && hour <= closeH;
    };

    const base = departments
      .filter((d) => (category === "all" ? true : d.category === category))
      .filter((d) => d.rating >= minRating)
      .filter((d) => `${d.name} ${d.description} ${(d.services || []).join(" ")}`.toLowerCase().includes(query.toLowerCase()))
      .filter((d) => (openNowOnly ? isOpen(d.timings) : true));

    const sorters = {
      rating: (a, b) => b.rating - a.rating,
      wait: (a, b) => a.waitMins - b.waitMins,
      occupancy: (a, b) => a.occupancy - b.occupancy
    };

    return base.sort(sorters[sortBy] || sorters.rating);
  }, [departments, category, minRating, query, openNowOnly, sortBy]);

  const featured = useMemo(() => filtered.slice(0, 3), [filtered]);

  const uniqueInsurers = useMemo(() => {
    const map = new Map();
    insurers.forEach((i) => {
      const key = `${i.name}-${i.plan}`;
      if (!map.has(key)) map.set(key, i);
    });
    const result = Array.from(map.values());
    if (!insuranceSearch.trim()) return result.slice(0, 8);
    return result
      .filter((i) => `${i.name} ${i.plan} ${i.network}`.toLowerCase().includes(insuranceSearch.toLowerCase()))
      .slice(0, 8);
  }, [insurers, insuranceSearch]);

  return (
    <div className="min-h-screen bg-[#0b0a07] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,200,120,0.18),_rgba(10,9,7,0.9)_55%)]" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-amber-400/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-amber-200/10 rounded-full blur-[140px]" />

      <section className="relative max-w-screen-xl mx-auto px-6 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.45em] text-amber-200/70">
              <Crown className="w-4 h-4" /> Concierge Departments
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-amber-50">
              Premium Departments curated for an exceptional care journey
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/75">
              Live departmental intelligence, executive-level triage, and refined experiences across our signature units.
              {mode === "demo" && " Demo data is showing based on our seeded concierge profiles."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/book-appointment")}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-[#1a1408] text-sm font-semibold shadow-[0_20px_50px_rgba(251,191,36,0.35)] hover:brightness-105"
              >
                Book Concierge Slot
              </button>
              <button
                onClick={() => document.getElementById("departments-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10"
              >
                Explore Departments
              </button>
            </div>
            {loadError && (
              <div className="mt-4 text-xs text-amber-200/90 bg-amber-200/10 border border-amber-200/30 px-4 py-2 rounded-lg">
                {loadError} To seed demo data, run `node server/seedDepartments.js --reset`.
              </div>
            )}
          </div>

          <div className="w-full lg:w-[380px] bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_30px_70px_rgba(5,5,5,0.55)]">
            <div className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Live Highlights</div>
            <div className="mt-4 space-y-3">
              {highlights.slice(0, 4).map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div>
                    <div className="text-xs text-white/60">{item.label}</div>
                    <div className="text-lg font-semibold text-amber-100">{item.value}</div>
                  </div>
                  <div className="text-xs text-amber-200/80">{item.delta}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-white/60">Last updated {lastUpdated.toLocaleTimeString()}</div>
          </div>
        </div>
      </section>

      <section className="relative max-w-screen-xl mx-auto px-6">
        <div className="bg-[#13100b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_25px_60px_rgba(5,5,5,0.5)]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-amber-200" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search departments, services, specialists..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-4 h-4 text-amber-200" />
                <span className="text-white/75">Minimum rating</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs"
                >
                  {[0, 4, 4.5, 4.8].map((val) => (
                    <option key={val} value={val}>{val === 0 ? "Any" : `${val}+`}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/75">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="rating">Top rated</option>
                  <option value="wait">Shortest wait</option>
                  <option value="occupancy">Lowest occupancy</option>
                </select>
              </div>
              <button
                onClick={() => setOpenNowOnly((prev) => !prev)}
                className={`px-3 py-2 rounded-full text-xs border ${openNowOnly ? "border-amber-200 text-amber-100 bg-amber-200/10" : "border-white/10 text-white/75"}`}
              >
                Open now
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-full text-xs border ${category === cat ? "border-amber-200 text-amber-100 bg-amber-200/10" : "border-white/10 text-white/75"}`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="relative max-w-screen-xl mx-auto px-6 pt-12">
        <SectionTitle
          eyebrow="Signature Units"
          title="Featured luxury departments"
          subtitle="Every unit below is ranked for concierge experience, specialist depth, and premium amenities."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featured.map((dept) => {
            const deptId = String(dept.id ?? dept._id ?? "");
            return (
            <motion.div
              key={deptId || dept.id}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#17130d] via-[#13100b] to-[#0e0c09] p-6 shadow-[0_30px_70px_rgba(5,5,5,0.55)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-200/10 border border-amber-200/20 flex items-center justify-center text-amber-200">
                  {dept.icon}
                </div>
                <div>
                  <div className="text-sm text-white/60">{dept.category}</div>
                  <div className="text-lg font-semibold text-amber-50">{dept.name}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/75">{dept.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <RatingStars value={dept.rating} />
                <div className="text-xs text-white/60">{dept.reviews}+ reviews</div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-white/75">
                <span>{dept.location}</span>
                <span>{dept.waitMins} min wait</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleQuickBook(dept)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-[#1a1408] text-xs font-semibold"
                >
                  Book Priority
                </button>
                <button
                  onClick={() => toggleFavorite(dept)}
                  className={`px-3 py-2 rounded-lg border text-xs ${favorites.includes(deptId) ? "border-amber-200 text-amber-100" : "border-white/10 text-white/75"}`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(deptId) ? "fill-amber-200 text-amber-200" : "text-white/60"}`} />
                </button>
              </div>
            </motion.div>
          );
          })}
        </div>
      </section>

      <section id="departments-grid" className="relative max-w-screen-xl mx-auto px-6 pt-14">
        <SectionTitle
          eyebrow="All Departments"
          title="Browse the full concierge portfolio"
          subtitle="Compare live occupancy, wait times, and premium services across every unit."
        />
        {loading && <div className="text-sm text-white/60">Loading departments...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-sm text-white/60">No departments match your filters.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((dept) => {
            const deptId = String(dept.id ?? dept._id ?? "");
            return (
            <motion.div
              key={deptId || dept.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-[#120f0a]/80 p-5 shadow-[0_25px_60px_rgba(5,5,5,0.5)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/10 border border-amber-200/20 flex items-center justify-center text-amber-200">
                    {dept.icon}
                  </div>
                  <div>
                    <div className="text-xs text-white/60">{dept.category}</div>
                    <div className="text-base font-semibold text-amber-50">{dept.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(dept)}
                  className={`p-2 rounded-full border ${favorites.includes(deptId) ? "border-amber-200 text-amber-200" : "border-white/10 text-white/60"}`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(deptId) ? "fill-amber-200 text-amber-200" : "text-white/60"}`} />
                </button>
              </div>

              <p className="mt-3 text-sm text-white/75 line-clamp-3">{dept.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <RatingStars value={dept.rating} />
                <span className="text-xs text-white/60">{dept.reviews}+ reviews</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/75">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-white/60">Occupancy</div>
                  <div className="text-amber-100 font-semibold">{Math.round(dept.occupancy * 100)}%</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-white/60">Wait time</div>
                  <div className="text-amber-100 font-semibold">{dept.waitMins} min</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-white/60">Lead consultant: {dept.head}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(dept.services || []).slice(0, 3).map((svc) => (
                  <span key={svc} className="text-[11px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/75">
                    {svc}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickBook(dept)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-[#1a1408] text-xs font-semibold"
                >
                  Book
                </button>
                <button
                  onClick={async () => {
                    await postDepartmentEngagement("/api/department-engagements/directions", { departmentId: dept._id || dept.id }, "Location pinned");
                  }}
                  className="px-3 py-2 rounded-lg border border-white/10 text-xs"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${dept.phone}`}
                  className="px-3 py-2 rounded-lg border border-white/10 text-xs"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          );
          })}
        </div>
      </section>
      <section className="relative max-w-screen-xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionTitle
              eyebrow="Concierge Intelligence"
              title="Recommendations based on live demand"
              subtitle="Smart signals from department analytics, wait times, and patient demand trends."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(0, 6).map((rec, idx) => (
                <div key={`${rec.id || idx}`} className="rounded-2xl border border-white/10 bg-[#120f0a]/70 p-4 shadow-[0_20px_50px_rgba(5,5,5,0.5)]">
                  <div className="text-sm font-semibold text-amber-100">{rec.title}</div>
                  <p className="text-xs text-white/75 mt-2">{rec.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(rec.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/75">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#13100b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_25px_60px_rgba(5,5,5,0.5)]">
            <SectionTitle
              eyebrow="Announcements"
              title="Executive updates"
              subtitle="Priority notices and concierge alerts."
            />
            <div className="space-y-3">
              {announcements.slice(0, 4).map((a, idx) => (
                <div key={`${a.title}-${idx}`} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs font-semibold text-amber-100 flex items-center gap-2">
                    <Bell className="w-4 h-4" /> {a.title}
                  </div>
                  <p className="text-xs text-white/75 mt-1">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-screen-xl mx-auto px-6 pt-16">
        <SectionTitle
          eyebrow="Patient Voices"
          title="Luxury-level experiences"
          subtitle="Recent reviews from premium patients across our departments."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 6).map((review, idx) => (
            <div key={`${review.id || idx}`} className="rounded-2xl border border-white/10 bg-[#120f0a]/70 p-4 shadow-[0_20px_50px_rgba(5,5,5,0.5)]">
              <div className="text-sm font-semibold text-amber-100">{review.name || "Guest"}</div>
              <div className="mt-2">
                <RatingStars value={Number(review.rating) || 4.5} />
              </div>
              <p className="mt-3 text-xs text-white/75">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative max-w-screen-xl mx-auto px-6 pt-16">
        <SectionTitle
          eyebrow="Insurance Concierge"
          title="Preferred partner plans"
          subtitle="Verified coverage with executive coordination."
        />
        <div className="bg-[#13100b]/80 border border-white/10 rounded-2xl p-6 shadow-[0_25px_60px_rgba(5,5,5,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-amber-100">Insurance Partners</div>
              <div className="text-xs text-white/60">Concierge desk handles prior authorizations.</div>
            </div>
            <input
              value={insuranceSearch}
              onChange={(e) => setInsuranceSearch(e.target.value)}
              placeholder="Search insurers"
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/45"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {uniqueInsurers.map((ins) => (
              <div key={`${ins.name}-${ins.plan}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-amber-100">{ins.name} {ins.plan}</div>
                <div className="text-xs text-white/75 mt-1">{ins.network} - {ins.coverage}</div>
                <button
                  onClick={() => setInsuranceModal(ins)}
                  className="mt-3 text-xs px-3 py-2 rounded bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-[#1a1408]"
                >
                  View details
                </button>
              </div>
            ))}
            {uniqueInsurers.length === 0 && (
              <div className="text-sm text-white/60">Insurance data will appear after seeding.</div>
            )}
          </div>
        </div>
      </section>

      <section className="relative max-w-screen-xl mx-auto px-6 pt-16 pb-16">
        <SectionTitle
          eyebrow="Hospital Map"
          title="Live occupancy heatmap"
          subtitle="Track zones, wait times, and executive access flow."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="flex flex-wrap gap-4 text-sm text-white/75">
              {departments.slice(0, 6).map((dept) => (
                <button
                  key={dept.id}
                  onClick={async () => {
                    await postDepartmentEngagement("/api/department-engagements/directions", { departmentId: dept._id || dept.id }, "Location pinned");
                  }}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
                >
                  {dept.name} - {dept.location}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <div className="text-sm font-semibold">Zone occupancy</div>
            <div className="mt-3 space-y-2">
              {heatmap.length > 0 ? heatmap.map((zone) => (
                <div key={zone.zone} className="rounded-lg border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">{zone.zone}</div>
                    <div className="text-xs text-white/75">{Math.round(zone.occupancy * 100)}% occupied</div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-amber-300"
                      style={{ width: `${Math.round(zone.occupancy * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">Avg wait {zone.wait} min</div>
                </div>
              )) : (
                <div className="text-xs text-white/60">Heatmap syncing with live occupancy.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-gradient-to-r from-amber-300/10 via-amber-100/5 to-amber-300/10 border-t border-white/10 text-center py-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span className="text-sm">Need concierge help? Our care team is available 24/7.</span>
          </div>
          <div className="mt-4">
            <a href="tel:+9221111900100" className="inline-block text-[#1a1408] bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 px-6 py-3 rounded-full font-medium hover:brightness-105 transition">
              Call +92 21 111 900 100
            </a>
          </div>
          <p className="text-xs mt-4 opacity-80">Medicore Health - Departments Portal</p>
        </div>
      </footer>

      {insuranceModal && (
        <div className="fixed inset-0 bg-[#070607] z-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-3xl bg-gradient-to-br from-[#1b150b] via-[#120f0a] to-[#0b0a07] border border-amber-200/20 p-7 shadow-[0_40px_120px_rgba(5,5,5,0.85)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.35em] text-amber-200/70">Insurance</div>
                <div className="text-xl font-semibold text-amber-50">Plan Details</div>
              </div>
              <button onClick={() => setInsuranceModal(null)} className="p-2 rounded-full border border-white/10 hover:bg-white/10">
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Provider</span>
                <span className="text-amber-100">{insuranceModal.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Plan</span>
                <span className="text-amber-100">{insuranceModal.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Network</span>
                <span className="text-amber-100">{insuranceModal.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Coverage</span>
                <span className="text-amber-100">{insuranceModal.coverage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Copay</span>
                <span className="text-amber-100">{insuranceModal.copay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Pre-authorization</span>
                <span className="text-amber-100">{insuranceModal.preAuthRequired ? "Required" : "Not required"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Support</span>
                <span className="text-amber-100">{insuranceModal.phone}</span>
              </div>
              <div className="text-xs text-white/60 mt-2">{insuranceModal.notes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

