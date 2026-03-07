import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TriangleAlert,
  Users,
} from "lucide-react";
import { apiRequest } from "../services/api";

const iconMap = {
  heart: HeartPulse,
  activity: Activity,
  shield: ShieldCheck,
  users: Users,
  stethoscope: Stethoscope,
};

const fallbackStats = {
  beds: 120,
  doctors: 48,
  erWait: 12,
  surgeries: 6,
  alerts: 1,
  patientsToday: 230,
};

function PremiumPanel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

export default function Hero() {
  const navigate = useNavigate();
  const [content, setContent] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [homeContent, directory] = await Promise.all([
          apiRequest("/api/public/home"),
          apiRequest("/api/public/doctors-directory"),
        ]);

        if (!alive) return;
        setContent(homeContent || {});
        setDoctors(Array.isArray(directory) ? directory : []);
      } catch (error) {
        console.error("Failed to load home page content:", error);
        if (!alive) return;
        setContent({});
        setDoctors([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const stats = { ...fallbackStats, ...(content.liveStats || {}) };
  const services = Array.isArray(content.services) ? content.services.slice(0, 4) : [];
  const articles = Array.isArray(content.articles) ? content.articles.slice(0, 3) : [];
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials.slice(0, 3) : [];
  const emergencyServices = Array.isArray(content.emergencyServices) ? content.emergencyServices.slice(0, 3) : [];
  const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,185,66,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(24,96,160,0.25),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-accent-300" />
                Premium healthcare operations
              </div>
              <h1 className="mt-6 max-w-3xl font-['Playfair_Display'] text-5xl font-bold tracking-tight text-white md:text-7xl">
                Hospital care that feels coordinated, calm, and high trust.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Medicore brings emergency readiness, specialist access, diagnostics, and appointment management into one premium patient experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-2xl shadow-primary-950/30"
                >
                  Book Appointment
                </button>
                <Link
                  to="/doctors"
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Explore Specialists
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <PremiumPanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ER wait</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.erWait} min</p>
                  <p className="mt-1 text-sm text-slate-400">Current emergency average</p>
                </PremiumPanel>
                <PremiumPanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Doctors online</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.doctors}</p>
                  <p className="mt-1 text-sm text-slate-400">Specialists on network</p>
                </PremiumPanel>
                <PremiumPanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Beds available</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.beds}</p>
                  <p className="mt-1 text-sm text-slate-400">Live capacity visibility</p>
                </PremiumPanel>
              </div>
            </div>

            <PremiumPanel className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations snapshot</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Today at Medicore</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300">
                    Live
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <p className="text-sm text-slate-400">Patients today</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stats.patientsToday || 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <p className="text-sm text-slate-400">Ongoing surgeries</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stats.surgeries || 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <p className="text-sm text-slate-400">Active alerts</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stats.alerts || 0}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <p className="text-sm text-slate-400">Appointments today</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stats.appointmentsToday || 0}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <TriangleAlert className="h-5 w-5 text-red-300" />
                    <div>
                      <p className="font-medium text-white">Emergency coordination</p>
                      <p className="text-sm text-slate-300">Ambulance, trauma, and ICU readiness available 24/7.</p>
                    </div>
                  </div>
                  <Link to="/emergency" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-200">
                    Open emergency response
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </PremiumPanel>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Core Services</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white md:text-4xl">
            Structured care pathways, not disconnected departments.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[(service.icon || "").toLowerCase()] || Stethoscope;
            return (
              <motion.div key={`${service.title}-${index}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <PremiumPanel className="h-full">
                  <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300 w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{service.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-400">
                    {(service.features || []).slice(0, 3).map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </PremiumPanel>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <PremiumPanel>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Featured Doctors</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Specialists available now</h2>
              </div>
              <Link to="/doctors" className="text-sm font-medium text-accent-300">View all</Link>
            </div>
            <div className="mt-6 space-y-4">
              {featuredDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{doctor.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 text-sm text-white">
                        <Star className="h-4 w-4 text-yellow-400" />
                        {doctor.rating?.toFixed ? doctor.rating.toFixed(1) : doctor.rating}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{doctor.languages?.join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumPanel>

          <PremiumPanel>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Emergency Access</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Rapid response numbers</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {emergencyServices.map((service) => (
                <div key={service.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{service.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{service.number}</p>
                    </div>
                    <div className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                      {service.responseTime || "Fast response"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumPanel>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PremiumPanel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Insights</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">What patients notice first</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-sm leading-6 text-slate-300">“{item.quote}”</p>
                  <p className="mt-4 font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.treatment || item.title}</p>
                </div>
              ))}
            </div>
          </PremiumPanel>

          <PremiumPanel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Health Briefings</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Latest articles</h2>
            <div className="mt-6 space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{article.category || "Health"}</p>
                  <p className="mt-2 font-medium text-white">{article.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </PremiumPanel>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ready to continue?</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Move from discovery to booking in minutes.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/book-appointment")} className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-medium text-white">
              <CalendarDays className="mr-2 inline h-4 w-4" />
              Start Booking
            </button>
            <Link to="/contact" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200">
              <Clock3 className="mr-2 inline h-4 w-4" />
              Speak to Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
