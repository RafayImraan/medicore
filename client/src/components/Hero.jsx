import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CalendarDays,
  Clock3,
  HeartPulse,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import { apiRequest } from "../services/api";

const iconMap = {
  activity: Activity,
  alert: AlertTriangle,
  blue: Building2,
  building: Building2,
  clock: Clock3,
  emerald: ShieldCheck,
  heart: HeartPulse,
  phone: Phone,
  red: AlertTriangle,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  user: UserRound,
  users: Users,
  video: Video,
};

const fallbackHero = {
  badge: "Medicore Hospital Management System",
  title: "Integrated hospital management for patients, clinicians, and operations.",
  subtitle:
    "Medicore connects appointments, departments, diagnostics, emergency response, and follow-up care in one hospital management platform.",
  searchPlaceholder: "Search specialties, symptoms, doctors, and services",
  primaryActionLabel: "Book Appointment",
  primaryActionHref: "/book-appointment",
  secondaryActionLabel: "Find a Specialist",
  secondaryActionHref: "/doctors",
};

const fallbackStats = {
  beds: 42,
  doctors: 64,
  erWait: 15,
  surgeries: 4,
  alerts: 2,
  patientsToday: 156,
  appointmentsToday: 89,
  labTestsCompleted: 234,
};

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" },
};

function PremiumPanel({ children, className = "" }) {
  return <div className={`premium-panel rounded-[28px] p-6 ${className}`}>{children}</div>;
}

function AnimatedNumber({ value, suffix = "", prefix = "", duration = 1200 }) {
  const target = Number(value) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(target * eased));
      if (progress < 1) frameId = window.requestAnimationFrame(tick);
    };

    setDisplayValue(0);
    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
        <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white md:text-4xl">{title}</h2>
        {copy ? <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p> : null}
      </div>
      {action || null}
    </div>
  );
}

const formatCompact = (value) => new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0);
const clampPercent = (value, factor = 1) => Math.max(8, Math.min(100, Math.round((value || 0) * factor)));
const parseMetricValue = (raw = "") => {
  const source = String(raw);
  const match = source.match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  return {
    number: Number(match[1]),
    prefix: source.slice(0, match.index),
    suffix: source.slice(match.index + match[1].length),
  };
};

export default function Hero() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(() => {
    const storedRole = (localStorage.getItem("role") || "guest").toLowerCase();
    if (storedRole.includes("admin")) return "admin";
    if (storedRole.includes("doctor")) return "doctor";
    if (storedRole.includes("patient")) return "patient";
    return "guest";
  });
  const [content, setContent] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [matchedRoute, setMatchedRoute] = useState(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 260);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const query = new URLSearchParams();
        if (activeRole) query.set("role", activeRole);
        if (debouncedSearch) query.set("q", debouncedSearch);
        const [homeContent, directory, departmentData] = await Promise.all([
          apiRequest(`/api/public/home${query.toString() ? `?${query.toString()}` : ""}`),
          apiRequest("/api/public/doctors-directory"),
          apiRequest("/api/public/departments"),
        ]);

        if (!alive) return;
        setContent(homeContent || {});
        setDoctors(Array.isArray(directory) ? directory : []);
        setDepartments(Array.isArray(departmentData) ? departmentData : []);
      } catch (error) {
        console.error("Failed to load home page content:", error);
        if (!alive) return;
        setContent({});
        setDoctors([]);
        setDepartments([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [activeRole, debouncedSearch]);

  const hero = { ...fallbackHero, ...(content.hero || {}), ...(content.resolvedHero || {}) };
  const stats = { ...fallbackStats, ...(content.liveStats || {}) };
  const heroMedia = content.heroMedia || {};

  const featuredDoctors = useMemo(() => (Array.isArray(doctors) ? doctors.slice(0, 4) : []), [doctors]);
  const featuredDepartments = useMemo(() => (Array.isArray(departments) ? departments.slice(0, 4) : []), [departments]);

  const trustSignals = Array.isArray(content.trustSignals) ? content.trustSignals.filter((item) => item.enabled !== false) : [];
  const intentPaths = Array.isArray(content.intentPaths) ? content.intentPaths.filter((item) => item.enabled !== false) : [];
  const audiencePaths = Array.isArray(content.audiencePaths) ? content.audiencePaths.filter((item) => item.enabled !== false) : [];
  const symptomRouter = Array.isArray(content.symptomRouter) ? content.symptomRouter : [];
  const quickActions = Array.isArray(content.quickActions) ? content.quickActions.filter((item) => item.enabled !== false) : [];
  const operationalHighlights = Array.isArray(content.operationalHighlights) ? content.operationalHighlights : [];
  const services = Array.isArray(content.services) ? content.services.filter((item) => item.enabled !== false).slice(0, 6) : [];
  const carePaths = Array.isArray(content.carePaths) ? content.carePaths : [];
  const patientJourney = Array.isArray(content.patientJourney) ? content.patientJourney : [];
  const featuredCampaigns = Array.isArray(content.featuredCampaigns) ? content.featuredCampaigns.filter((item) => item.enabled !== false) : [];
  const recommendationCards = Array.isArray(content.scoredRecommendations)
    ? content.scoredRecommendations
    : Array.isArray(content.recommendationCards)
      ? content.recommendationCards.filter((item) => item.enabled !== false)
      : [];
  const urgentActions = Array.isArray(content.urgentActions) ? content.urgentActions.filter((item) => item.enabled !== false) : [];
  const insuranceProviders = Array.isArray(content.insuranceProviders) ? content.insuranceProviders.slice(0, 6) : [];
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials.slice(0, 3) : [];
  const articles = Array.isArray(content.articles) ? content.articles.slice(0, 3) : [];
  const ctaBanner = content.ctaBanner || {};
  const spotlightCampaign = content.activeSpotlight || featuredCampaigns[spotlightIndex % Math.max(featuredCampaigns.length, 1)] || null;

  const audienceCard =
    audiencePaths.find((item) => item.role === activeRole) ||
    audiencePaths.find((item) => item.role === "guest") ||
    null;

  const recommendations = recommendationCards.filter((item) => !item.audience || item.audience === activeRole || item.audience === "guest").slice(0, 3);

  useEffect(() => {
    setMatchedRoute(content.guidedRoute || null);
  }, [content.guidedRoute, symptomRouter]);

  useEffect(() => {
    if (featuredCampaigns.length <= 1) return undefined;
    const intervalId = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % featuredCampaigns.length);
    }, 4800);
    return () => window.clearInterval(intervalId);
  }, [featuredCampaigns.length]);

  const logInteraction = async ({ action = "homepage_cta_click", resource = "homepage", description, details = {} }) => {
    try {
      await apiRequest("/api/activity/public", {
        method: "POST",
        body: JSON.stringify({
          action,
          resource,
          description,
          details,
          severity: "low",
          status: "success",
        }),
      });
    } catch (error) {
      console.error("Failed to track homepage interaction:", error);
    }
  };

  const handleAction = ({ href, label, section, state = {}, details = {} }) => {
    logInteraction({
      description: `${label} clicked from ${section}`,
      details: { href, section, label, ...details },
    });
    navigate(href, { state: { source: "homepage", entrySection: section, ...state } });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) {
      handleAction({ href: "/doctors", label: "Search specialists", section: "hero_search_empty" });
      return;
    }

    if (matchedRoute) {
      handleAction({
        href: matchedRoute.href,
        label: matchedRoute.title,
        section: "hero_search_matched",
        state: { homepageQuery: query, suggestedRoute: matchedRoute },
        details: { query, matchedDepartment: matchedRoute.department, urgency: matchedRoute.urgency },
      });
      return;
    }

    handleAction({
      href: "/doctors",
      label: "Search doctors",
      section: "hero_search",
      state: { homepageQuery: query },
      details: { query },
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,185,66,0.16),transparent_22%),radial-gradient(circle_at_85%_15%,rgba(44,111,187,0.18),transparent_28%),linear-gradient(180deg,#07111f_0%,#081423_35%,#040812_100%)] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="mb-8 grid gap-3 md:grid-cols-3">
            {[
              { label: "Readmission risk", value: `${content.insights?.readmissionRisk || 8}%`, note: "tracked against discharge and recovery flow" },
              { label: "Emergency routing", value: `${stats.erWait} min`, note: "current average from triage to doctor review" },
              { label: "Clinical throughput", value: `${stats.patientsToday}+`, note: "patients coordinated across live care lines today" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="text-2xl font-semibold text-white">
                    {(() => {
                      const metric = parseMetricValue(item.value);
                      return metric ? (
                        <AnimatedNumber value={metric.number} prefix={metric.prefix} suffix={metric.suffix} />
                      ) : (
                        item.value
                      );
                    })()}
                  </p>
                  <p className="max-w-[12rem] text-right text-xs leading-5 text-slate-400">{item.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-accent-300" />
                {hero.badge}
              </div>
              <h1 className="mt-6 max-w-4xl font-['Playfair_Display'] text-5xl font-bold leading-tight text-white md:text-7xl">
                {hero.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{hero.subtitle}</p>

              <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-950/55 p-3 shadow-[0_20px_60px_rgba(2,8,24,0.45)] backdrop-blur xl:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={hero.searchPlaceholder}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-4 text-sm font-semibold text-white"
                >
                  Search care options
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleAction({
                      href: hero.primaryActionHref,
                      label: hero.primaryActionLabel,
                      section: "hero_primary",
                    })
                  }
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-medium text-white shadow-2xl shadow-primary-950/30"
                >
                  {hero.primaryActionLabel}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAction({
                      href: hero.secondaryActionHref,
                      label: hero.secondaryActionLabel,
                      section: "hero_secondary",
                    })
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  {hero.secondaryActionLabel}
                </button>
              </div>

              {matchedRoute ? (
                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Suggested route</p>
                      <p className="mt-2 text-lg font-semibold text-white">{matchedRoute.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{matchedRoute.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
                      {matchedRoute.urgency} urgency
                    </span>
                  </div>
                </div>
              ) : null}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
              >
                {trustSignals.map((item) => (
                  <PremiumPanel key={item.id} className="p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {(() => {
                        const metric = parseMetricValue(item.value);
                        return metric ? (
                          <AnimatedNumber value={metric.number} prefix={metric.prefix} suffix={metric.suffix} duration={1500} />
                        ) : (
                          item.value
                        );
                      })()}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{item.context}</p>
                  </PremiumPanel>
                ))}
              </motion.div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {intentPaths.map((intent) => {
                  const Icon = iconMap[intent.icon] || Stethoscope;
                  return (
                    <motion.div key={intent.id} {...cardMotion}>
                      <button
                        type="button"
                        onClick={() => handleAction({ href: intent.href, label: intent.title, section: "intent_paths", details: { metric: intent.metric } })}
                        className="w-full text-left"
                      >
                        <PremiumPanel className="h-full transition hover:-translate-y-1 hover:border-accent-400/30">
                          <div className="flex items-start justify-between gap-3">
                            <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Intent</span>
                          </div>
                          <h3 className="mt-5 text-xl font-semibold text-white">{intent.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{intent.description}</p>
                          <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                            <span>{intent.metric}</span>
                            <ArrowRight className="h-4 w-4 text-accent-300" />
                          </div>
                        </PremiumPanel>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {audienceCard ? (
                <div className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,37,62,0.94),rgba(7,13,24,0.98))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{audienceCard.eyebrow}</p>
                      <h3 className="mt-3 text-3xl font-semibold text-white">{audienceCard.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{audienceCard.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAction({ href: audienceCard.href, label: audienceCard.cta, section: "audience_path", details: { role: activeRole } })}
                      className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                      {audienceCard.cta}
                    </button>
                  </div>
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {recommendations.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAction({ href: item.href, label: item.title, section: "role_recommendations", details: { audience: item.audience, tag: item.tag } })}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.tag}</p>
                        <p className="mt-3 font-semibold text-white">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-accent-300">{item.metric}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <PremiumPanel className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Operations snapshot</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Live hospital readiness</h2>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300">Live</div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                  <div className="relative min-h-[320px]">
                    {heroMedia.videoUrl ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={heroMedia.poster || heroMedia.image}
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={heroMedia.videoUrl} />
                      </video>
                    ) : (
                      <img
                        src={heroMedia.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&h=1000&fit=crop"}
                        alt={heroMedia.ambientLabel || heroMedia.title || "Hospital experience"}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,24,0.18),rgba(3,9,24,0.78)_72%,rgba(3,9,24,0.95))]" />
                    <div className="relative flex h-full flex-col justify-end p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                        {heroMedia.eyebrow || "Signature care environment"}
                      </p>
                      <h3 className="mt-3 max-w-xl font-['Playfair_Display'] text-3xl font-semibold text-white">
                        {heroMedia.title || "Luxury clinical coordination, rendered as a live experience"}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                        {heroMedia.description || "Medicore presents hospital services, operational visibility, and patient access through one unified digital system."}
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {(heroMedia.metrics || []).slice(0, 3).map((metric) => (
                          <div key={metric.id || metric.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{metric.label}</p>
                            <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["ER wait", `${stats.erWait} min`],
                    ["Doctors online", `${stats.doctors}`],
                    ["Beds available", `${stats.beds}`],
                    ["Patients today", `${stats.patientsToday}`],
                    ["Appointments today", `${stats.appointmentsToday}`],
                    ["Lab tests completed", `${stats.labTestsCompleted}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-4">
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        {(() => {
                          const metric = parseMetricValue(value);
                          return metric ? (
                            <AnimatedNumber value={metric.number} prefix={metric.prefix} suffix={metric.suffix} duration={1100} />
                          ) : (
                            value
                          );
                        })()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Readiness board</p>
                      <p className="mt-2 text-xl font-semibold text-white">Critical capacity mix</p>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
                      Stable
                    </span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      { label: "Bed occupancy", value: clampPercent(100 - stats.beds, 1.4), tone: "from-amber-400 to-orange-500" },
                      { label: "Doctor coverage", value: clampPercent(stats.doctors, 1.3), tone: "from-cyan-400 to-sky-500" },
                      { label: "Diagnostics load", value: clampPercent(stats.labTestsCompleted, 0.26), tone: "from-emerald-400 to-teal-500" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{metric.label}</span>
                          <span className="font-medium text-white">{metric.value}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                          <div className={`h-full rounded-full bg-gradient-to-r ${metric.tone}`} style={{ width: `${metric.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {spotlightCampaign ? (
                  <div className="mt-6 rounded-[28px] border border-accent-400/20 bg-[linear-gradient(135deg,rgba(28,49,82,0.92),rgba(8,16,29,0.98))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Luxury spotlight</p>
                        <h3 className="mt-2 font-['Playfair_Display'] text-3xl font-semibold text-white">{spotlightCampaign.title}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{spotlightCampaign.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {spotlightCampaign.metric}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {featuredCampaigns.map((campaign, index) => (
                          <button
                            key={campaign.id}
                            type="button"
                            onClick={() => {
                              setSpotlightIndex(index);
                              logInteraction({
                                description: `Spotlight campaign selected: ${campaign.title}`,
                                details: { section: "spotlight_selector", campaignId: campaign.id },
                              });
                            }}
                            className={`h-2.5 rounded-full transition-all ${index === spotlightIndex ? "w-10 bg-accent-400" : "w-2.5 bg-white/20"}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSpotlightIndex((current) => (current - 1 + featuredCampaigns.length) % featuredCampaigns.length)}
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction({ href: spotlightCampaign.href, label: spotlightCampaign.title, section: "spotlight_campaign", details: { metric: spotlightCampaign.metric } })}
                          className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-2 text-sm font-medium text-white"
                        >
                          Open spotlight
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpotlightIndex((current) => (current + 1) % featuredCampaigns.length)}
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 space-y-3">
                  {operationalHighlights.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">{item.title}</p>
                          <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                          {item.tone}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {quickActions.map((action) => {
                    const Icon = iconMap[action.icon] || ArrowRight;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleAction({ href: action.href, label: action.label, section: "quick_actions" })}
                        className="rounded-2xl border border-white/10 bg-charcoal-950/40 p-4 text-left transition hover:bg-charcoal-900/70"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="rounded-xl bg-white/5 p-3 text-accent-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-500" />
                        </div>
                        <p className="mt-4 font-medium text-white">{action.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{action.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </PremiumPanel>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Core service architecture"
          title="Service lines that can be merchandised and updated from the database"
          copy="These blocks are designed to act like a live service catalogue on the homepage, not a static marketing afterthought."
          action={<button type="button" onClick={() => handleAction({ href: "/services", label: "Explore all services", section: "services_heading" })} className="text-sm font-medium text-accent-300">Explore all services</button>}
        />
        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {services.slice(0, 4).map((service, index) => {
              const Icon = iconMap[(service.icon || "").toLowerCase()] || Stethoscope;
              return (
                <motion.div key={`${service.title}-${index}`} {...cardMotion}>
                  <PremiumPanel className="h-full bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(8,15,28,0.78))]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Service line</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-white">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{service.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(service.features || []).slice(0, 3).map((feature) => (
                        <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </PremiumPanel>
                </motion.div>
              );
            })}
          </div>
          <PremiumPanel className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(17,31,53,0.92),rgba(7,12,22,0.98))]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Utilization signal</p>
            <h3 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white">Why this feels dynamic</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The homepage can now rotate services, campaigns, and operational priorities without code changes. That gives you seasonal agility and stronger merchandising of high-margin or high-urgency care lines.
            </p>
            <div className="mt-6 space-y-4">
              {services.slice(0, 4).map((service, index) => {
                const score = 64 + index * 8;
                return (
                  <div key={`${service.title}-meter`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{service.title}</span>
                      <span className="font-medium text-white">{score}% interest</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent-400 via-primary-500 to-cyan-400" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Same-day booking release</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatCompact(stats.appointmentsToday)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Live doctors surfaced</p>
                <p className="mt-2 text-3xl font-semibold text-white">{featuredDoctors.length}</p>
              </div>
            </div>
          </PremiumPanel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Dynamic departments"
          title="High-demand care lines with live context"
          copy="These departments come directly from the live directory, so ratings, wait times, occupancy, and on-call teams stay relevant."
          action={<button type="button" onClick={() => handleAction({ href: "/departments", label: "View all departments", section: "departments_heading" })} className="text-sm font-medium text-accent-300">View all departments</button>}
        />
        <div className="mt-8 grid gap-4 xl:grid-cols-4">
          {featuredDepartments.map((department) => (
            <motion.div key={department._id} {...cardMotion}>
              <PremiumPanel className="h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,15,28,0.92))]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{department.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{department.name}</h3>
                  </div>
                  <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs text-accent-300">{department.timings}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{department.description}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-400 to-cyan-400" style={{ width: `${clampPercent(department.occupancy, 100)}%` }} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-3">
                    <p className="text-slate-500">Wait</p>
                    <p className="mt-2 font-semibold text-white">{department.waitMins} min</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-3">
                    <p className="text-slate-500">Doctors</p>
                    <p className="mt-2 font-semibold text-white">{department.doctors?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-3">
                    <p className="text-slate-500">Rating</p>
                    <p className="mt-2 font-semibold text-white">{department.rating?.toFixed?.(1) || department.rating}</p>
                  </div>
                </div>
              </PremiumPanel>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <PremiumPanel>
            <SectionHeading
              eyebrow="Specialist discovery"
              title="Doctors surfaced from the live directory"
              copy="Featured doctors update from the doctor collection, not a static marketing list."
              action={<button type="button" onClick={() => handleAction({ href: "/doctors", label: "Explore all specialists", section: "doctors_heading" })} className="text-sm font-medium text-accent-300">Explore all specialists</button>}
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {featuredDoctors.map((doctor) => (
                <div key={doctor.id} className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{doctor.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{doctor.specialization}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm text-white">
                      <Star className="h-4 w-4 text-yellow-400" />
                      {doctor.rating?.toFixed ? doctor.rating.toFixed(1) : doctor.rating}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{doctor.intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(doctor.languages || []).slice(0, 3).map((language) => (
                      <span key={language} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        {language}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Consultation fee</span>
                    <span className="font-semibold text-white">Rs. {formatCompact(doctor.fees)}</span>
                  </div>
                </div>
              ))}
            </div>
          </PremiumPanel>

          <PremiumPanel>
            <SectionHeading
              eyebrow="Care pathways"
              title="Guided treatment pathways"
              copy="Help patients understand the next step in care, from consultation and diagnostics to procedure planning and recovery."
            />
            <div className="mt-6 space-y-4">
              {carePaths.map((pathway) => (
                <div key={pathway.id} className="rounded-2xl border border-white/10 bg-charcoal-950/45 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-white">{pathway.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{pathway.description}</p>
                    </div>
                    <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-300">
                      {pathway.duration}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">{pathway.outcome}</span>
                    <button
                      type="button"
                      onClick={() => handleAction({ href: pathway.href, label: pathway.title, section: "care_paths" })}
                      className="font-medium text-accent-300"
                    >
                      Open path
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PremiumPanel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <PremiumPanel className="overflow-hidden bg-[linear-gradient(180deg,rgba(13,23,40,0.96),rgba(7,12,22,0.98))]">
            <SectionHeading
              eyebrow="Patient journey"
              title="From first concern to confirmed care"
              copy="Show how care progresses at Medicore, from the first inquiry through consultation, testing, treatment, and follow-up."
            />
            <div className="mt-8 space-y-5">
              {patientJourney.length ? (
                patientJourney.map((item, index) => (
                  <div key={item.id} className="relative rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(7,13,24,0.9))] p-5">
                    {index < patientJourney.length - 1 ? (
                      <div className="absolute left-[2.1rem] top-[4.9rem] hidden h-12 w-px bg-gradient-to-b from-accent-400/70 to-transparent md:block" />
                    ) : null}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="flex items-center gap-4 md:w-48 md:flex-col md:items-start md:gap-3">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-accent-400/20 bg-accent-500/12 font-semibold text-accent-200">
                          {item.step}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Patient stage</p>
                          <p className="mt-2 text-sm font-medium text-white">{item.sla}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{item.description}</p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                            Step {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                  Care journey updates are not available right now.
                </div>
              )}
            </div>
          </PremiumPanel>

          <PremiumPanel className="overflow-hidden bg-[linear-gradient(160deg,rgba(12,22,39,0.98),rgba(7,12,22,0.98))]">
            <SectionHeading
              eyebrow="Priority campaigns"
              title="Featured health programs"
              copy="Highlight current screening drives, recovery programs, wellness plans, and other priority hospital initiatives."
            />
            {featuredCampaigns.length ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {featuredCampaigns.map((campaign, index) => (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() =>
                      handleAction({
                        href: campaign.href,
                        label: campaign.title,
                        section: "campaigns",
                        details: { metric: campaign.metric, slot: index + 1 },
                      })
                    }
                    className={`group rounded-[28px] border p-6 text-left transition duration-300 hover:-translate-y-1 ${
                      index === 0
                        ? "border-accent-400/20 bg-[radial-gradient(circle_at_top_right,rgba(244,185,66,0.18),transparent_30%),linear-gradient(145deg,rgba(21,34,56,0.96),rgba(10,16,28,0.98))] md:col-span-2"
                        : "border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(7,12,22,0.96))]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{campaign.eyebrow}</p>
                        <h3 className="mt-3 max-w-2xl font-['Playfair_Display'] text-3xl font-semibold text-white">
                          {campaign.title}
                        </h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200">
                        {campaign.metric}
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{campaign.description}</p>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-accent-300">Open program details</span>
                      <div className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition group-hover:border-accent-400/30 group-hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No featured programs are available right now.
              </div>
            )}
          </PremiumPanel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <PremiumPanel className="bg-[linear-gradient(155deg,rgba(16,25,43,0.98),rgba(7,12,22,0.98))]">
            <SectionHeading
              eyebrow="Urgent utility"
              title="Immediate help and support"
              copy="Give visitors direct access to urgent care, support teams, and insurance guidance from one clear section."
            />
            <div className="mt-8 grid gap-4">
              {urgentActions.length ? (
                urgentActions.map((action, index) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleAction({ href: action.href, label: action.title, section: "urgent_actions" })}
                    className="group block w-full rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(7,12,22,0.95))] p-5 text-left transition hover:border-accent-400/30 hover:bg-[linear-gradient(160deg,rgba(244,185,66,0.08),rgba(7,12,22,0.95))]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 text-sm font-semibold text-white">
                          0{index + 1}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{action.title}</p>
                          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-accent-300 transition group-hover:translate-x-1" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                  Support actions are not available right now.
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(7,12,22,0.94))] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Accepted insurers</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {insuranceProviders.length ? (
                    insuranceProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4 text-sm font-medium text-slate-100"
                      >
                        {provider.name}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                      Insurance partner information is not available right now.
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-[26px] border border-accent-400/15 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),linear-gradient(150deg,rgba(13,25,44,0.98),rgba(7,12,22,0.98))] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Coverage support</p>
                <p className="mt-4 font-['Playfair_Display'] text-3xl font-semibold text-white">Check coverage before booking</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Help patients confirm insurance support before appointments, diagnostics, or admission planning.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Partners</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{insuranceProviders.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Support</p>
                    <p className="mt-2 text-2xl font-semibold text-white">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </PremiumPanel>

          <div className="grid gap-6">
            <PremiumPanel className="bg-[linear-gradient(155deg,rgba(16,24,41,0.98),rgba(8,12,22,0.98))]">
              <SectionHeading
                eyebrow="Patient proof"
                title="Patient experiences"
                copy="Share real feedback from patients and families to reinforce trust in care quality, coordination, and outcomes."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {testimonials.length ? (
                  testimonials.map((item, index) => (
                    <div
                      key={item.id}
                      className={`rounded-[26px] border p-5 ${
                        index === 0
                          ? "border-accent-400/20 bg-[linear-gradient(155deg,rgba(244,185,66,0.08),rgba(7,12,22,0.96))]"
                          : "border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(7,12,22,0.94))]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star key={`${item.id}-${starIndex}`} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Verified</span>
                      </div>
                      <p className="mt-5 text-base leading-8 text-slate-200">"{item.quote}"</p>
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.treatment || item.title}</p>
                        </div>
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                          {String(item.name || "P").charAt(0)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-3 rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                    Patient feedback is not available right now.
                  </div>
                )}
              </div>
            </PremiumPanel>

            <PremiumPanel className="bg-[linear-gradient(160deg,rgba(16,24,41,0.98),rgba(8,12,22,0.98))]">
              <SectionHeading
                eyebrow="Health briefings"
                title="Health updates and guidance"
                copy="Publish hospital updates, preventive advice, and patient education content in a clear, readable format."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {articles.length ? (
                  articles.map((article, index) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => handleAction({ href: article.href || "/services", label: article.title, section: "articles" })}
                      className={`group rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${
                        index === 0
                          ? "border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),linear-gradient(150deg,rgba(12,22,39,0.98),rgba(7,12,22,0.96))]"
                          : "border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(7,12,22,0.94))]"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{article.category}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{article.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{article.excerpt}</p>
                      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                        <span>{article.readMinutes} min read</span>
                        <span>{formatCompact(article.views)} views</span>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-sm font-medium text-accent-300">Open briefing</span>
                        <ArrowRight className="h-4 w-4 text-accent-300 transition group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="md:col-span-3 rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                    Health updates are not available right now.
                  </div>
                )}
              </div>
            </PremiumPanel>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/10">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <PremiumPanel className="border border-accent-500/20 bg-[linear-gradient(135deg,rgba(17,34,58,0.92),rgba(8,15,28,0.96))]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{ctaBanner.eyebrow || "Need a guided next step?"}</p>
                <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white md:text-4xl">
                  {ctaBanner.title || "Move from search to care without losing context."}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  {ctaBanner.description ||
                    "Our booking, support, and recovery teams are coordinated around one patient record and one operational flow."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleAction({ href: ctaBanner.primaryActionHref || "/book-appointment", label: ctaBanner.primaryActionLabel || "Start booking", section: "final_cta_primary" })}
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-3 text-sm font-medium text-white"
                >
                  <CalendarDays className="mr-2 inline h-4 w-4" />
                  {ctaBanner.primaryActionLabel || "Start booking"}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction({ href: ctaBanner.secondaryActionHref || "/contact", label: ctaBanner.secondaryActionLabel || "Talk to support", section: "final_cta_secondary" })}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200"
                >
                  <Phone className="mr-2 inline h-4 w-4" />
                  {ctaBanner.secondaryActionLabel || "Talk to support"}
                </button>
              </div>
            </div>
          </PremiumPanel>
        </div>
      </section>

      {loading ? <div className="pb-8 text-center text-sm text-slate-500">Loading dynamic homepage content...</div> : null}
    </div>
  );
}
