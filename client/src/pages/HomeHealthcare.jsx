import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe,
  HeartPulse,
  Home,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { apiRequest } from "../services/api";

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

function titleOf(item, fallback = "Item") {
  return item?.title || item?.name || item?.patient || item?.organization || item?.source || fallback;
}

export default function HomeHealthcarePro() {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    team: [],
    services: [],
    packages: [],
    certifications: [],
    partners: [],
    blogPosts: [],
    awards: [],
    press: [],
    stories: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await apiRequest("/api/public/home-healthcare");
        if (!alive) return;
        setContent({
          team: Array.isArray(data.team) ? data.team : [],
          services: Array.isArray(data.services) ? data.services : [],
          packages: Array.isArray(data.packages) ? data.packages : [],
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          partners: Array.isArray(data.partners) ? data.partners : [],
          blogPosts: Array.isArray(data.blogPosts) ? data.blogPosts : [],
          awards: Array.isArray(data.awards) ? data.awards : [],
          press: Array.isArray(data.press) ? data.press : [],
          stories: Array.isArray(data.stories) ? data.stories : [],
        });
      } catch (error) {
        console.error("Failed to load home healthcare content:", error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Patients supported", value: Math.max(content.stories.length * 40, 320), icon: Users },
      { label: "Clinical team", value: Math.max(content.team.length, 18), icon: Stethoscope },
      { label: "Programs available", value: Math.max(content.services.length, 6), icon: HeartPulse },
      { label: "Coverage zones", value: Math.max(content.partners.length, 8), icon: Globe },
    ],
    [content]
  );

  const primaryServices = content.services.slice(0, 6);
  const packages = content.packages.slice(0, 3);
  const team = content.team.slice(0, 4);
  const stories = content.stories.slice(0, 3);
  const insights = [...content.awards, ...content.press, ...content.blogPosts].slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-emerald-950/20 to-charcoal-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,185,66,0.16),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-accent-300" />
                Home healthcare concierge
              </div>
              <h1 className="mt-6 font-['Playfair_Display'] text-5xl font-bold tracking-tight text-white md:text-7xl">
                Premium clinical care, delivered where patients recover best.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Skilled nursing, therapy, chronic care support, and recovery programs coordinated through one modern home-healthcare service.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/book-appointment")}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-accent-500 px-6 py-3 text-sm font-medium text-white"
                >
                  Schedule Assessment
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200"
                >
                  Speak to Coordinator
                </button>
              </div>
            </div>

            <Panel>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-charcoal-950/40 p-4">
                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300 w-fit">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-charcoal-950/40 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent-300" />
                  <div>
                    <p className="font-medium text-white">Clinical oversight built in</p>
                    <p className="mt-1 text-sm text-slate-400">Care plans, progress review, and escalation pathways stay visible throughout the program.</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Programs</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-semibold text-white md:text-4xl">
            Care pathways built for real recovery at home.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 6 }) : primaryServices).map((service, index) => (
            <motion.div key={loading ? index : titleOf(service)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Panel className="h-full">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300 w-fit">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{loading ? "Loading..." : titleOf(service, "Home care service")}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{loading ? "" : service.description || service.desc || "Personalized support tailored to clinical and lifestyle needs."}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-400">
                  {loading
                    ? null
                    : (service.features || []).slice(0, 3).map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                </ul>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Packages</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Choose the right care intensity.</h2>
            <div className="mt-6 grid gap-4">
              {packages.map((pkg) => (
                <div key={pkg._id || pkg.name} className={`rounded-2xl border p-5 ${pkg.highlight ? "border-accent-400/30 bg-accent-500/10" : "border-white/10 bg-charcoal-950/40"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-white">{pkg.name}</p>
                      <p className="mt-2 text-sm text-slate-400">${pkg.price} / week</p>
                    </div>
                    {pkg.highlight && <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-medium text-charcoal-950">Recommended</span>}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {(pkg.perks || []).slice(0, 4).map((perk) => (
                      <li key={perk}>• {perk}</li>
                    ))}
                  </ul>
                  <button onClick={() => setSelectedPackage(pkg)} className="mt-5 rounded-xl bg-gradient-to-r from-emerald-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">
                    {pkg.cta || "Choose package"}
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Clinical Team</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Trusted professionals assigned with continuity.</h2>
            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <div key={member._id || member.name} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-charcoal-950/40 p-4">
                  <img
                    src={member.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"}
                    alt={member.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{member.role || member.specialty}</p>
                    <p className="mt-2 text-sm text-slate-300">{member.bio || `${member.years || 0} years in patient-centered care.`}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Patient Stories</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Progress measured in comfort and confidence.</h2>
            <div className="mt-6 space-y-4">
              {stories.map((story) => (
                <div key={story._id || story.patient} className="rounded-2xl border border-white/10 bg-charcoal-950/40 p-4">
                  <p className="font-medium text-white">{story.patient}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{story.story || "A successful home recovery supported by a coordinated care plan."}</p>
                  {story.outcome && <p className="mt-3 text-sm text-emerald-300">Outcome: {story.outcome}</p>}
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trust Signals</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Evidence that the program is built seriously.</h2>
            <div className="mt-6 grid gap-4">
              {[
                ...content.certifications.map((item) => ({ title: titleOf(item, "Certification"), meta: item.description || item.issuer || "" })),
                ...insights.map((item) => ({ title: titleOf(item, "Insight"), meta: item.description || item.summary || item.outcome || "" })),
              ]
                .slice(0, 5)
                .map((item, index) => (
                  <div key={`${item.title}-${index}`} className="rounded-2xl border border-white/10 bg-charcoal-950/40 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-accent-500/10 p-3 text-accent-300">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.meta || "Operationally verified and ready for coordinated care delivery."}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/10">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next step</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Start with a home-health assessment.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Our coordinators can match clinical needs, scheduling preferences, and care-package intensity before the first visit is booked.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button onClick={() => navigate("/book-appointment")} className="rounded-xl bg-gradient-to-r from-emerald-600 to-accent-500 px-6 py-3 text-sm font-medium text-white">
                <CalendarDays className="mr-2 inline h-4 w-4" />
                Book Assessment
              </button>
              <button onClick={() => navigate("/contact")} className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200">
                <Phone className="mr-2 inline h-4 w-4" />
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPackage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedPackage(null)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }} onClick={(event) => event.stopPropagation()} className="premium-panel w-full max-w-2xl rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Care package</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{selectedPackage.name}</h2>
              <p className="mt-4 text-sm text-slate-300">${selectedPackage.price} / week</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                {(selectedPackage.perks || []).map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
              <div className="mt-8 flex justify-end gap-2 border-t border-white/10 pt-4">
                <button onClick={() => setSelectedPackage(null)} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200">Close</button>
                <button onClick={() => navigate("/book-appointment")} className="rounded-xl bg-gradient-to-r from-emerald-600 to-accent-500 px-4 py-3 text-sm font-medium text-white">
                  Continue
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
