import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CalendarClock, HeartPulse, MapPin, Phone, Search, ShieldCheck, Star, Stethoscope, Users } from "lucide-react";
import { apiRequest } from "../services/api";

const ICON_MAP = {
  HeartPulse,
  Stethoscope,
  Activity,
  Users,
  CalendarClock,
};

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{subtitle}</p>}
    </div>
  );
}

function RatingStars({ value }) {
  const full = Math.floor(value || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < full ? "fill-amber-400 text-amber-400" : "text-white/20"}`} />
      ))}
    </div>
  );
}

export default function Departments() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [insurers, setInsurers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [deptData, announcementsData, highlightsData, insurersData, reviewsData, recommendationsData] = await Promise.all([
          apiRequest("/api/public/departments"),
          apiRequest("/api/public/departments/announcements"),
          apiRequest("/api/public/departments/highlights"),
          apiRequest("/api/public/departments/insurers"),
          apiRequest("/api/public/departments/reviews"),
          apiRequest("/api/public/departments/recommendations"),
        ]);

        if (!alive) return;
        setDepartments(Array.isArray(deptData) ? deptData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
        setHighlights(Array.isArray(highlightsData) ? highlightsData : []);
        setInsurers(Array.isArray(insurersData) ? insurersData : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
      } catch (error) {
        console.error("Failed to load departments:", error);
        if (!alive) return;
        setDepartments([]);
        setAnnouncements([]);
        setHighlights([]);
        setInsurers([]);
        setReviews([]);
        setRecommendations([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(departments.map((department) => department.category?.toLowerCase()).filter(Boolean)))],
    [departments]
  );

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const searchSource = `${department.name} ${department.description} ${department.location} ${(department.services || []).join(" ")}`.toLowerCase();
      const queryMatch = !query.trim() || searchSource.includes(query.toLowerCase());
      const categoryMatch = category === "all" || department.category?.toLowerCase() === category;
      return queryMatch && categoryMatch;
    });
  }, [category, departments, query]);

  const quickBook = (department) => {
    const doctor = department.doctors?.[0];
    const time = doctor?.slots?.[0];
    if (!doctor || !time) {
      navigate("/book-appointment");
      return;
    }

    const slot = new Date();
    const [hours, minutes = "0"] = String(time).split(":");
    slot.setHours(Number(hours) || 9, Number(minutes) || 0, 0, 0);
    if (slot <= new Date()) slot.setDate(slot.getDate() + 1);

    navigate("/book-appointment", {
      state: {
        department: { id: department._id || department.id, name: department.name },
        doctor: {
          id: `${department.slug || department.id}-${doctor.name}`.replace(/\s+/g, "-").toLowerCase(),
          name: doctor.name,
          specialization: department.name,
          experience: 0,
          rating: department.rating || 0,
          fee: 500,
          languages: ["English"],
          clinic: department.location || "",
          slots: [
            {
              date: slot.toISOString().split("T")[0],
              times: [{ iso: slot.toISOString(), taken: false }],
            },
          ],
        },
        slot: slot.toISOString(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Departments</p>
            <h1 className="mt-3 font-['Playfair_Display'] text-5xl font-bold tracking-tight text-white md:text-6xl">
              Hospital departments with visible capacity and premium booking paths.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Explore specialty units, compare wait times, and move directly into booking without losing context.
            </p>
          </div>

          <Panel>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Search</p>
                <div className="mt-3 flex items-center gap-3">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search departments, services, location" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-2 text-sm transition ${category === item ? "bg-accent-500 text-charcoal-950" : "border border-white/10 bg-white/5 text-slate-200"}`}
                  >
                    {item === "all" ? "All" : item}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        </header>

        <section className="mt-10">
          <div className="grid gap-4 md:grid-cols-4">
            {(highlights.length ? highlights.slice(0, 4) : [
              { label: "Patient satisfaction", value: "96%", delta: "+2%" },
              { label: "Average wait", value: "18 min", delta: "-3 min" },
              { label: "Specialists on duty", value: "28", delta: "+4" },
              { label: "Priority slots", value: "140", delta: "steady" },
            ]).map((item, index) => (
              <Panel key={index} className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.delta}</p>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle eyebrow="Directory" title="Compare departments by care style and speed" subtitle="Every card gives you the essentials: availability signals, specialist coverage, and location clarity." />
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Panel key={index} className="animate-pulse space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10" />
                  <div className="h-4 rounded bg-white/10" />
                  <div className="h-4 w-2/3 rounded bg-white/10" />
                </Panel>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDepartments.map((department) => {
                const Icon = ICON_MAP[department.iconKey] || Stethoscope;
                return (
                  <motion.div key={department._id || department.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Panel className="h-full">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        {department.badges?.[0] && (
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                            {department.badges[0]}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-2xl font-semibold text-white">{department.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{department.description}</p>

                      <div className="mt-5 flex items-center justify-between">
                        <RatingStars value={department.rating || 0} />
                        <p className="text-sm text-slate-400">{department.reviews || 0} reviews</p>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-slate-300">
                        <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-slate-500" />{department.timings}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" />{department.location}</div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" />{department.phone}</div>
                      </div>

                      <div className="mt-5 rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current outlook</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-slate-300">Average wait</p>
                          <p className="font-medium text-white">{department.waitMins || 0} min</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-slate-300">Occupancy</p>
                          <p className="font-medium text-white">{Math.round((department.occupancy || 0) * 100)}%</p>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button onClick={() => setSelectedDepartment(department)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200">
                          View details
                        </button>
                        <button onClick={() => quickBook(department)} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">
                          Quick book
                        </button>
                      </div>
                    </Panel>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <SectionTitle eyebrow="Announcements" title="Operational updates" subtitle="Short updates relevant to admissions, premium access, and specialist availability." />
            <div className="space-y-3">
              {announcements.slice(0, 4).map((item) => (
                <div key={item._id || item.title} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.message || item.description}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Recommendations" title="Priority access tracks" subtitle="Suggested departments with strong throughput, satisfaction, or demand." />
            <div className="space-y-3">
              {recommendations.slice(0, 4).map((item) => (
                <div key={item.id || item._id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-300">{item.reason}</p>
                    </div>
                    {item.score && <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-300">{item.score}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <SectionTitle eyebrow="Insurers" title="Accepted premium plans" subtitle="Review network support before moving into consultation or diagnostics." />
            <div className="space-y-3">
              {insurers.slice(0, 4).map((item) => (
                <div key={item._id || item.name} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.plan || item.network}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      {item.coverage || "Covered"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle eyebrow="Reviews" title="Patient impressions" subtitle="What patients mention most about the department experience." />
            <div className="space-y-3">
              {reviews.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.rating} / 5</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.comment}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <AnimatePresence>
        {selectedDepartment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDepartment(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} onClick={(event) => event.stopPropagation()} className="premium-panel max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{selectedDepartment.category}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{selectedDepartment.name}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{selectedDepartment.description}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Department head</p>
                  <p className="mt-3 text-lg font-medium text-white">{selectedDepartment.head}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Average wait</p>
                  <p className="mt-3 text-lg font-medium text-white">{selectedDepartment.waitMins || 0} min</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Occupancy</p>
                  <p className="mt-3 text-lg font-medium text-white">{Math.round((selectedDepartment.occupancy || 0) * 100)}%</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">Included services</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {(selectedDepartment.services || []).map((service) => (
                      <li key={service}>• {service}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Specialists on this unit</h3>
                  <div className="mt-4 space-y-3">
                    {(selectedDepartment.doctors || []).map((doctor) => (
                      <div key={doctor.name} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                        <p className="font-medium text-white">{doctor.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{doctor.role}</p>
                        <p className="mt-2 text-sm text-slate-300">Next slots: {(doctor.slots || []).join(", ") || "Contact department"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-2 border-t border-white/10 pt-4">
                <button onClick={() => setSelectedDepartment(null)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">Close</button>
                <button onClick={() => quickBook(selectedDepartment)} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">Quick book</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
