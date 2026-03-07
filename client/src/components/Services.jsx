import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, CalendarDays, HeartPulse, Microscope, ShieldCheck, Sparkles, Stethoscope, Video } from "lucide-react";
import { apiRequest } from "../services/api";

const serviceIcons = {
  diagnostics: Microscope,
  cardiology: HeartPulse,
  telemedicine: Video,
  emergency: Activity,
  surgery: ShieldCheck,
};

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadServices = async () => {
      try {
        const data = await apiRequest("/api/services");
        if (!alive) return;
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load services:", error);
        if (alive) setServices([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadServices();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((service) => service.category).filter(Boolean)))],
    [services]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchCategory = activeCategory === "All" || service.category === activeCategory;
      const source = `${service.title} ${service.description} ${(service.features || []).join(" ")}`.toLowerCase();
      const matchQuery = !query || source.includes(query);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, search, services]);

  const topServices = useMemo(() => filtered.slice(0, 6), [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-accent-300" />
              Premium service catalog
            </div>
            <h1 className="mt-6 font-['Playfair_Display'] text-5xl font-bold tracking-tight text-white md:text-6xl">
              Services designed as full care experiences.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              From urgent diagnostics to scheduled specialist care, every Medicore service is structured for clarity, speed, and confidence.
            </p>
          </div>

          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
            <div className="mt-4 grid gap-3">
              <button onClick={() => navigate("/book-appointment")} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-5 py-3 text-left text-sm font-medium text-white">
                <CalendarDays className="mr-2 inline h-4 w-4" />
                Book a service consultation
              </button>
              <button onClick={() => navigate("/contact")} className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-left text-sm font-medium text-slate-200">
                <Stethoscope className="mr-2 inline h-4 w-4" />
                Speak with a care coordinator
              </button>
            </div>
          </Panel>
        </header>

        <section className="mt-10">
          <Panel>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      activeCategory === category
                        ? "bg-accent-500 text-charcoal-950"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services"
                className="w-full rounded-xl border border-white/10 bg-charcoal-950/60 px-4 py-3 text-sm text-white lg:max-w-sm"
              />
            </div>
          </Panel>
        </section>

        <section className="mt-8">
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
              {topServices.map((service, index) => {
                const Icon =
                  serviceIcons[(service.category || "").toLowerCase()] ||
                  serviceIcons[(service.title || "").toLowerCase()] ||
                  Stethoscope;

                return (
                  <motion.div key={service._id || service.id || index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Panel className="h-full">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        {service.badge && (
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{service.category || "General Care"}</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white">{service.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{service.description}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                        {service.duration && <span className="rounded-full border border-white/10 px-3 py-1">{service.duration}</span>}
                        {service.available && <span className="rounded-full border border-white/10 px-3 py-1">{service.available}</span>}
                        {service.price && <span className="rounded-full border border-white/10 px-3 py-1">{service.price}</span>}
                      </div>

                      <ul className="mt-5 space-y-2 text-sm text-slate-300">
                        {(service.features || []).slice(0, 3).map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>

                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() => setSelectedService(service)}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
                        >
                          View details
                        </button>
                        <button
                          onClick={() => navigate("/book-appointment")}
                          className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white"
                        >
                          Book now
                        </button>
                      </div>
                    </Panel>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && !filtered.length && (
            <Panel className="mt-6 text-center">
              <p className="text-sm text-slate-400">No services match the current filters.</p>
            </Panel>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <Panel>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300 w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Care quality controls</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Every service flow is structured around safety checks, availability transparency, and patient guidance.
            </p>
          </Panel>
          <Panel>
            <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300 w-fit">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Operational visibility</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Clear timelines, availability windows, and service expectations reduce friction before booking.
            </p>
          </Panel>
          <Panel>
            <div className="rounded-2xl bg-primary-500/10 p-3 text-primary-200 w-fit">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Hybrid access</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              In-person, digital, and follow-up care pathways can be combined without forcing patients into separate systems.
            </p>
          </Panel>
        </section>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedService(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} onClick={(event) => event.stopPropagation()} className="premium-panel max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{selectedService.category || "General Care"}</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{selectedService.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{selectedService.description}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Starting price</p>
                  <p className="mt-3 text-xl font-semibold text-white">{selectedService.price || `$${selectedService.startingPrice || 0}`}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                  <p className="mt-3 text-xl font-semibold text-white">{selectedService.timeline || selectedService.duration || "Custom"}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Availability</p>
                  <p className="mt-3 text-xl font-semibold text-white">{selectedService.available || "On request"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">Included features</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {(selectedService.features || []).map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Best for</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {(selectedService.useCases || []).slice(0, 5).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-2 border-t border-white/10 pt-4">
                <button onClick={() => setSelectedService(null)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">Close</button>
                <button onClick={() => navigate("/book-appointment")} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">
                  Proceed to booking
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
