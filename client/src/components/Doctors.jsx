import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  Download,
  Heart,
  Phone,
  Search,
  Share2,
  Star,
  Video,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiRequest } from "../services/api";

const FAVORITE_KEY = "doctors.favs.v1";

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const normalizeDoctor = (doc) => ({
  ...doc,
  id: doc.id || doc._id || newId(),
  name: doc.name || "Dr. Unknown",
  specialization: doc.specialization || "General Medicine",
  experience: doc.experience || 0,
  rating: typeof doc.rating === "number" ? doc.rating : 0,
  reviews: Array.isArray(doc.reviews) ? doc.reviews : [],
  available: doc.available ?? true,
  languages: Array.isArray(doc.languages) && doc.languages.length ? doc.languages : ["English"],
  fees: doc.fees ?? doc.consultationFee ?? 0,
  intro: doc.intro || "Trusted care with a patient-first approach.",
  badges: Array.isArray(doc.badges) ? doc.badges : [],
  slots: Array.isArray(doc.slots) ? doc.slots : [],
  analytics:
    Array.isArray(doc.analytics) && doc.analytics.length
      ? doc.analytics
      : [
          { x: "W1", v: 78 },
          { x: "W2", v: 82 },
          { x: "W3", v: 80 },
          { x: "W4", v: 88 },
        ],
  bio: doc.bio || "Experienced specialist focused on safe, evidence-based treatment.",
});

function fuzzyIncludes(text = "", query = "") {
  if (!query) return true;
  const source = text.toLowerCase();
  const target = query.toLowerCase();
  return source.includes(target) || target.split("").every((char) => source.includes(char));
}

export default function DoctorsPro() {
  const [highContrast, setHighContrast] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [ratingMin, setRatingMin] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [booking, setBooking] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [compare, setCompare] = useState([]);
  const [aiQuery, setAiQuery] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchRef = useRef(null);

  useEffect(() => {
    let alive = true;

    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await apiRequest("/api/public/doctors-directory");
        if (!alive) return;
        setDoctors(Array.isArray(data) ? data.map(normalizeDoctor) : []);
      } catch (error) {
        console.error("Failed to load doctors directory:", error);
        if (alive) setDoctors([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    loadDoctors();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
    } catch {
    }
  }, [favorites]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const specializations = useMemo(
    () => ["All", ...Array.from(new Set(doctors.map((doctor) => doctor.specialization)))],
    [doctors]
  );

  const filtered = useMemo(() => {
    let list = doctors.filter(
      (doctor) =>
        doctor.rating >= ratingMin &&
        fuzzyIncludes(`${doctor.name} ${doctor.specialization} ${doctor.bio}`, search)
    );

    if (specFilter !== "All") {
      list = list.filter((doctor) => doctor.specialization === specFilter);
    }

    if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "experience") {
      list = [...list].sort((a, b) => b.experience - a.experience);
    }

    return list;
  }, [doctors, ratingMin, search, sortBy, specFilter]);

  const favoriteDoctors = favorites
    .map((id) => doctors.find((doctor) => doctor.id === id))
    .filter(Boolean);

  const handleAiSuggest = () => {
    if (!aiQuery.trim()) {
      setAiSuggestion(null);
      return;
    }

    const query = aiQuery.toLowerCase();
    let specialization = "General Medicine";

    if (query.includes("heart") || query.includes("chest")) specialization = "Cardiologist";
    else if (query.includes("skin") || query.includes("rash")) specialization = "Dermatologist";
    else if (query.includes("child") || query.includes("fever")) specialization = "Pediatrician";
    else if (query.includes("head") || query.includes("seizure")) specialization = "Neurologist";

    const doctor =
      doctors.find((item) => item.specialization === specialization) ||
      doctors.find((item) => item.available) ||
      doctors[0];

    if (!doctor) {
      setAiSuggestion(null);
      return;
    }

    setAiSuggestion({ specialization, doctor });
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleCompare = (id) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  };

  const bookSlot = (doctorId, isoString) => {
    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor || !isoString) return;
    setBooking({ id: newId(), doctor, slot: isoString });
  };

  const confirmBooking = () => {
    if (!booking) return;
    alert(`Booked ${booking.doctor.name} at ${new Date(booking.slot).toLocaleString()} (demo)`);
    setBooking(null);
  };

  const downloadDoctorVCard = (doctor) => {
    const vcard = `BEGIN:VCARD\nFN:${doctor.name}\nTITLE:${doctor.specialization}\nTEL:${doctor.phone || "N/A"}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${doctor.name.replace(/\s+/g, "_")}.vcf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderDoctorCard = (doctor, index) => {
    const featured = index % 5 === 0;
    const nextSlot = doctor.slots[0]?.times?.[0];

    return (
      <motion.article
        key={doctor.id}
        className={`premium-panel rounded-2xl p-6 ${featured ? "md:col-span-2 ring-1 ring-accent-500/25" : ""}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-primary-500/25 to-accent-500/25 text-lg font-bold text-white">
            {doctor.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
            {doctor.available && (
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-charcoal-950 bg-emerald-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  {doctor.specialization} | {doctor.experience} years experience
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className={`text-sm font-semibold ${doctor.available ? "text-emerald-400" : "text-rose-400"}`}>
                  {doctor.available ? "Available" : "Busy"}
                </p>
                <p className="text-xs text-slate-400">Consultation fee: ${doctor.fees}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{doctor.intro}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 text-white">
                <Star className="h-4 w-4 text-yellow-400" />
                {doctor.rating.toFixed(1)}
                <span className="text-slate-400">({doctor.reviews.length} reviews)</span>
              </span>
              <span className="text-slate-400">Languages: {doctor.languages.join(", ")}</span>
              {doctor.badges.map((badge) => (
                <span
                  key={`${doctor.id}-${badge}`}
                  className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            {nextSlot && (
              <div className="mt-4 rounded-xl border border-white/10 bg-charcoal-950/50 px-4 py-3 text-sm text-slate-300">
                Next opening: <span className="font-medium text-white">{new Date(nextSlot).toLocaleString()}</span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDoc(doctor)}
                className="rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-950/30"
              >
                View Profile
              </button>
              <button
                onClick={() => toggleFavorite(doctor.id)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                <Heart
                  className={`h-4 w-4 ${favorites.includes(doctor.id) ? "fill-rose-500 text-rose-500" : "text-slate-300"}`}
                />
              </button>
              <button
                onClick={() => toggleCompare(doctor.id)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  compare.includes(doctor.id)
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                Compare
              </button>
              <button
                onClick={() => setSelectedDoc(doctor)}
                className="ml-auto text-sm text-slate-400 transition hover:text-accent-300"
              >
                More details
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className={`${highContrast ? "contrast-more" : ""} min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 px-4 py-8 text-white md:px-8`}>
      <header className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Medicore Medical Specialists</h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-300">
            Find the right specialist, compare expertise, and schedule consultations through the Medicore hospital management system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={highContrast} onChange={() => setHighContrast((value) => !value)} />
            High contrast
          </label>
          <button
            className="rounded-lg border border-white/10 bg-charcoal-950/70 px-3 py-2 text-slate-200 transition hover:bg-white/10"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("Page link copied");
            }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          <div className="premium-panel rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search doctor, specialty, or symptom"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                Specialization
                <select
                  value={specFilter}
                  onChange={(event) => setSpecFilter(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-charcoal-950/60 px-3 py-2 text-sm text-white"
                >
                  {specializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                Minimum rating
                <select
                  value={ratingMin}
                  onChange={(event) => setRatingMin(Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-charcoal-950/60 px-3 py-2 text-sm text-white"
                >
                  <option value={0}>Any</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </label>

              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-charcoal-950/60 px-3 py-2 text-sm text-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                </select>
              </label>
            </div>
          </div>

          <div className="premium-panel rounded-2xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">AI triage assist</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Describe the concern and surface a likely specialty for a faster shortlist.
            </p>
            <textarea
              value={aiQuery}
              onChange={(event) => setAiQuery(event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-xl border border-white/10 bg-charcoal-950/60 p-3 text-sm text-white outline-none"
              placeholder="Example: severe chest pain and shortness of breath"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAiSuggest}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-medium text-white"
              >
                Suggest
              </button>
              <button
                onClick={() => {
                  setAiQuery("");
                  setAiSuggestion(null);
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200"
              >
                Clear
              </button>
            </div>

            {aiSuggestion && (
              <div className="mt-4 rounded-xl border border-accent-400/20 bg-accent-500/10 p-4">
                <p className="text-sm text-slate-300">
                  Suggested specialty: <span className="font-semibold text-white">{aiSuggestion.specialization}</span>
                </p>
                <button
                  onClick={() => setSelectedDoc(aiSuggestion.doctor)}
                  className="mt-2 text-sm font-medium text-accent-300 transition hover:text-accent-200"
                >
                  View {aiSuggestion.doctor.name}
                </button>
              </div>
            )}
          </div>

          <div className="premium-panel rounded-2xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Saved doctors</h2>
            {favoriteDoctors.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No saved doctors yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {favoriteDoctors.map((doctor) => (
                  <li key={doctor.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-200">{doctor.name}</span>
                    <button onClick={() => toggleFavorite(doctor.id)} className="text-rose-400">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section className="space-y-4 lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="premium-panel rounded-2xl p-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 animate-pulse rounded-full bg-white/10" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{filtered.map(renderDoctorCard)}</div>
          ) : (
            <div className="premium-panel rounded-2xl p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 text-sm text-slate-400">No doctors match the current filters.</p>
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4"
          >
            <div className="premium-panel rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="flex-1 text-sm text-slate-200">
                  Comparing {compare.map((id) => doctors.find((doctor) => doctor.id === id)?.name).join(" vs ")}
                </p>
                <button onClick={() => setCompare([])} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200">
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(event) => event.stopPropagation()}
              className="premium-panel max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6"
            >
              <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                <div className="rounded-2xl border border-white/10 bg-charcoal-950/40 p-5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-primary-500/25 to-accent-500/25 text-2xl font-bold text-white">
                    {selectedDoc.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{selectedDoc.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{selectedDoc.specialization}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>Consultation fee: <span className="font-medium text-white">${selectedDoc.fees}</span></p>
                    <p>Languages: <span className="font-medium text-white">{selectedDoc.languages.join(", ")}</span></p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92 21 111 900 000</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => downloadDoctorVCard(selectedDoc)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      <Download className="mr-2 inline h-4 w-4" />
                      VCard
                    </button>
                    <button
                      onClick={() => alert("Share profile (placeholder)")}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      Share
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{selectedDoc.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{selectedDoc.bio}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-charcoal-950/40 px-4 py-3 text-sm">
                      <p className="font-medium text-white">{selectedDoc.rating.toFixed(1)} stars</p>
                      <p className="mt-1 text-slate-400">{selectedDoc.reviews.length} reviews</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Next opening</p>
                      <p className="mt-1 text-sm text-slate-200">
                        {selectedDoc.slots[0]?.times?.[0]
                          ? new Date(selectedDoc.slots[0].times[0]).toLocaleString()
                          : "No open slots"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal-950/50 p-4">
                    <p className="text-sm font-semibold text-white">Reputation trend</p>
                    <div className="mt-3 h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedDoc.analytics}>
                          <XAxis dataKey="x" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              border: "1px solid rgba(148, 163, 184, 0.2)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                          />
                          <Line type="monotone" dataKey="v" stroke="#f4b942" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-charcoal-950/50 p-4">
                      <p className="text-sm font-semibold text-white">Doctor introduction</p>
                      <div className="mt-3 flex h-36 items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 text-sm text-slate-400">
                        Intro video placeholder
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-charcoal-950/50 p-4">
                      <p className="text-sm font-semibold text-white">Telemedicine options</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Launch a secure video consult or reserve a phone follow-up from the same profile.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => alert("Start video call (placeholder)")}
                          className="rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-2 text-sm text-white"
                        >
                          <Video className="mr-2 inline h-4 w-4" />
                          Video
                        </button>
                        <button
                          onClick={() => alert("Start phone call (placeholder)")}
                          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200"
                        >
                          <Phone className="mr-2 inline h-4 w-4" />
                          Phone
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-accent-300" />
                      <p className="text-sm font-semibold text-white">Choose a slot</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {selectedDoc.slots.slice(0, 8).map((slot) => (
                        <button
                          key={slot.date}
                          onClick={() => bookSlot(selectedDoc.id, slot.times?.[0])}
                          className="rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
                        >
                          <p className="text-xs text-slate-400">{new Date(slot.date).toLocaleDateString()}</p>
                          <p className="mt-1 text-sm font-medium text-slate-200">
                            {slot.times?.[0]
                              ? new Date(slot.times[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "--"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-white">Patient reviews</p>
                    <div className="mt-3 space-y-3">
                      {selectedDoc.reviews.slice(0, 4).map((review) => (
                        <div key={review.id} className="rounded-2xl border border-white/10 bg-charcoal-950/40 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white">{review.name}</p>
                            <p className="text-xs text-slate-400">{review.rating} stars</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
                <button onClick={() => setSelectedDoc(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200">
                  Close
                </button>
                <button
                  onClick={() => {
                    const firstSlot = selectedDoc.slots[0]?.times?.[0];
                    if (!firstSlot) {
                      alert("No slot available");
                      return;
                    }
                    bookSlot(selectedDoc.id, firstSlot);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Quick Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="premium-panel w-full max-w-md rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-white">Confirm Booking</h3>
              <p className="mt-3 text-sm text-slate-300">
                Doctor: <span className="font-medium text-white">{booking.doctor.name}</span>
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Time: <span className="font-medium text-white">{new Date(booking.slot).toLocaleString()}</span>
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setBooking(null)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200">
                  Cancel
                </button>
                <button onClick={confirmBooking} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="/emergency"
        className="fixed bottom-6 right-6 z-[70] rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-red-950/40"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        Emergency
      </motion.a>

      <footer className="mx-auto mt-12 max-w-6xl text-center text-xs text-slate-500">
        Copyright Medicore | Doctors Directory
      </footer>
    </div>
  );
}
