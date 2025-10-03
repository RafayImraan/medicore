// HomeHealthcarePro.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faker } from "@faker-js/faker";
import tourVideo from "../components/tour video.mp4";
import {
  Stethoscope,
  HeartPulse,
  Users,
  Phone,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  ArrowUp,
  ShieldCheck,
  Award,
  Hospital,
  FileText,
  Star,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MapPin,
  PlusCircle,
  Ambulance,
  Globe,
  Link as LinkIcon,
  X,
  Paperclip,
  Map as MapIcon,
  Wifi,
} from "lucide-react";

// -----------------------------------------------------------
// Helper data & utilities (preserves original fake content)
// -----------------------------------------------------------

const makeTeam = (n = 6) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement([
      "Registered Nurse",
      "Physical Therapist",
      "Occupational Therapist",
      "Speech Therapist",
      "Home Health Aide",
      "Care Coordinator",
    ]),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    years: faker.number.int({ min: 2, max: 18 }),
    specialty: faker.helpers.arrayElement([
      "Elderly Care",
      "Post-surgical Rehab",
      "Chronic Disease Mgmt",
      "Palliative Support",
      "Pediatrics",
    ]),
  }));

const servicesList = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Skilled Nursing Care",
    desc: "Professional nursing services delivered at home.",
    features: ["Wound care", "Medication admin", "Vitals monitoring"],
  },
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: "Therapies",
    desc: "Physical, Occupational, and Speech therapy programs.",
    features: ["Mobility training", "ADL support", "Speech rehab"],
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Personal Care",
    desc: "Daily assistance and companionship.",
    features: ["Bathing & grooming", "Meal prep", "Light housekeeping"],
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Chronic Disease Mgmt",
    desc: "Evidence-based care plans for long-term conditions.",
    features: ["Diabetes care", "COPD support", "Cardiac rehab"],
  },
  {
    icon: <Ambulance className="w-8 h-8" />,
    title: "Post-Surgical Care",
    desc: "Safe recovery at home with close monitoring.",
    features: ["Pain mgmt", "Dressing changes", "Mobility progression"],
  },
  {
    icon: <Hospital className="w-8 h-8" />,
    title: "24/7 Support",
    desc: "On-call triage and emergency response guidance.",
    features: ["Hotline", "Care escalation", "Tele-support"],
  },
];

const packages = [
  {
    name: "Basic",
    price: 49,
    perks: ["Weekly nurse check-in", "Vitals tracking", "Care hotline"],
    cta: "Choose Basic",
  },
  {
    name: "Standard",
    price: 99,
    highlight: true,
    perks: ["2 nurse visits / week", "Personalized care plan", "Therapy guidance"],
    cta: "Choose Standard",
  },
  {
    name: "Premium",
    price: 179,
    perks: ["Daily nurse tele-check", "3 visits / week", "24/7 support & escalation"],
    cta: "Choose Premium",
  },
];

const baseCertifications = [
  "Joint Commission Accredited",
  "Certified Home Health Agency",
  "Licensed & Insured Professionals",
  "HIPAA Compliance & Patient Safety",
];

const insurancePartners = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: faker.company.name(),
  // small placeholder logos (can replace with real logos)
  logo: `https://picsum.photos/seed/ins-${i + 1}/80/50`,
}));

const blogPosts = Array.from({ length: 6 }, (_, i) => ({
  id: faker.string.uuid(),
  title: faker.lorem.words({ min: 4, max: 7 }),
  excerpt: faker.lorem.sentence(),
  slug: `/${faker.lorem.slug()}`,
  image: `https://picsum.photos/seed/blog-${i}/600/400`,
}));

const awards = Array.from({ length: 4 }, (_, i) => ({
  year: faker.number.int({ min: 2019, max: 2025 }),
  title: faker.helpers.arrayElement(["Top Home Care Provider", "Patient Safety Excellence", "Best Community Care", "Innovation in Telehealth"]),
  org: faker.company.name(),
}));

const press = Array.from({ length: 4 }, (_, i) => ({
  outlet: faker.company.name(),
  headline: faker.lorem.sentence(),
  link: "#",
}));

const successStories = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  patient: faker.person.firstName(),
  photo: `https://picsum.photos/seed/patient-${i}/300/300`,
  story: faker.lorem.paragraph(),
  outcome: faker.helpers.arrayElement(["Regained mobility", "Reduced rehospitalization", "Improved quality of life", "Pain reduction"]),
}));

const faqs = [
  {
    q: "What types of services are offered?",
    a: "Skilled nursing, therapy services, chronic disease management, post-surgical care, and personal care assistance.",
  },
  {
    q: "How do I schedule a home healthcare visit?",
    a: "Book online or call our dedicated home healthcare line to arrange an assessment.",
  },
  {
    q: "Is home healthcare covered by insurance?",
    a: "Many insurance plans cover home healthcare. Contact your provider or our billing desk for details.",
  },
  {
    q: "Do you offer emergency care?",
    a: "Our hotline operates 24/7 to triage concerns and guide next steps.",
  },
];

// -----------------------------------------------------------
// Utility components (small helpers used below)
// -----------------------------------------------------------

function IconBadge({ children, className = "" }) {
  return <div className={"inline-flex items-center justify-center rounded-full p-2 bg-green-50 text-green-700 " + className}>{children}</div>;
}

// -----------------------------------------------------------
// Main Component — Final upgraded file
// -----------------------------------------------------------

export default function HomeHealthcarePro() {
  // Theme
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("mh-dark");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mh-dark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  // top button
  const [showTop, setShowTop] = useState(false);

  // FAQ
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [faqQuery, setFaqQuery] = useState("");

  // rating
  const [rating, setRating] = useState(() => {
    try {
      return Number(localStorage.getItem("mh-rating")) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mh-rating", rating.toString());
    } catch {}
  }, [rating]);

  // carousel / testimonials
  const [carouselIndex, setCarouselIndex] = useState(0);
  const testimonials = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        name: faker.person.fullName(),
        text: faker.lorem.sentences({ min: 1, max: 2 }),
        avatar: faker.image.avatar(),
        rating: faker.number.int({ min: 4, max: 5 }),
      })),
    []
  );

  // selected package
  const [selectedPackage, setSelectedPackage] = useState(null);

  // certifications (simulate fetch)
  const [certifications, setCertifications] = useState(baseCertifications);

  // counters
  const [counts, setCounts] = useState({ patients: 0, caregivers: 0, years: 0, coverage: 0 });

  useEffect(() => {
    const targets = { patients: 1250, caregivers: 48, years: 12, coverage: 20 };
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setCounts({
        patients: Math.floor(p * targets.patients),
        caregivers: Math.floor(p * targets.caregivers),
        years: Math.floor(p * targets.years),
        coverage: Math.floor(p * targets.coverage),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // testimonials auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  // Smooth scroll helper
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // sticky top observer
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Booking form
  const [form, setForm] = useState({ name: "", phone: "", date: "", service: servicesList[0].title });
  const [formMsg, setFormMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitForm = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.phone || !form.date) {
      setFormMsg("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    // simulate
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setFormMsg("✅ Appointment request submitted (demo). We will contact you shortly.");
    setForm({ name: "", phone: "", date: "", service: servicesList[0].title });
  };

  // Symptom checker
  const [symptoms, setSymptoms] = useState({ pain: false, dizziness: false, fever: false, breathless: false, bleeding: false });
  const symptomResult = useMemo(() => {
    const s = Object.values(symptoms).filter(Boolean).length;
    if (symptoms.bleeding || symptoms.breathless) return "Seek immediate urgent care or call emergency services.";
    if (s >= 3) return "You may benefit from a nurse assessment soon.";
    if (s === 1 || s === 2) return "Monitor closely and consider a tele-check.";
    return "You seem stable. Reach out if anything changes.";
  }, [symptoms]);

  // Symptom severity
  const [severity, setSeverity] = useState("moderate");

  // Simple chat widget messages (demo)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ id: 1, from: "bot", text: "Hello! How can we help you today?" }]);
  const chatInputRef = useRef(null);
  const sendChat = (text) => {
    if (!text) return;
    const id = Math.random().toString(36).slice(2, 9);
    setChatMessages((m) => [...m, { id, from: "user", text }]);
    setTimeout(() => {
      setChatMessages((m) => [...m, { id: id + "-bot", from: "bot", text: "Thanks — we'll connect you with a nurse shortly (demo)." }]);
    }, 800);
  };

  // BMI calculator
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const calcBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const val = (w / (h * h)).toFixed(1);
      setBmi(val);
    }
  };

  // Map center (hardcoded for Karachi as user is there)
  const coverageMapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1161775941!2d66.84648375895886!3d24.86096617640753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f9f8ef2b653%3A0x5d8893c3793d5a6a!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1696158000000!5m2!1sen!2s`;

  // Team
  const team = useMemo(() => makeTeam(9), []);

  // Blog load more
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  // Accessibility: focus trap for modals is omitted for brevity but worth adding in production

  // -----------------------------------------------------------
  // Rendering — large UI with many sections
  // -----------------------------------------------------------

  return (
    <div className={dark ? "min-h-screen dark bg-gray-900 text-gray-100" : "min-h-screen bg-gray-50 text-gray-800"}>
      <div className="relative">
        {/* Emergency banner */}
        <div className="bg-red-600 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
          <Ambulance className="w-4 h-4" />
          <span>Emergency Hotline: +92 21 01 98 11 10 (24/7)</span>
        </div>

        {/* Header / Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 font-bold text-green-800 dark:text-green-300">
              <ShieldCheck className="w-5 h-5" /> Medicore HomeCare
            </button>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {[
                ["Services", "services"],
                ["Packages", "packages"],
                ["Team", "team"],
                ["Testimonials", "testimonials"],
                ["Tools", "tools"],
                ["FAQs", "faqs"],
                ["Blog", "blog"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <button key={id} className="hover:text-green-700 dark:hover:text-green-300" onClick={() => scrollTo(id)}>
                  {label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <a
                href="#book"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("booking");
                }}
                className="hidden sm:inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800"
              >
                <CalendarIcon className="w-4 h-4" /> Book Now
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs text-gray-500 dark:text-gray-400">
            Home / Services / Home Healthcare
          </div>
        </header>

        {/* Hero with video background */}
        <section id="hero" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <video className="w-full h-full object-cover" src={tourVideo} autoPlay muted loop playsInline />
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 to-green-700/40 mix-blend-multiply" />
          </div>
          <div className="relative py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Compassionate Care. At Your Home.
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-white/90 mb-6">
                Professional nurses & therapists delivering quality care—anytime you need it.
              </motion.p>
              <motion.div className="flex items-center justify-center gap-3 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <button onClick={() => scrollTo("booking")} className="bg-white text-green-900 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Book Appointment
                </button>
                <button onClick={() => scrollTo("services")} className="bg-green-600/30 hover:bg-green-600/40 border border-white/30 px-6 py-3 rounded-full text-white flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Explore Services
                </button>
              </motion.div>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <IconBadge><CheckCircle2 className="w-4 h-4" /></IconBadge>
                  <span>Trusted medical staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBadge><ShieldCheck className="w-4 h-4" /></IconBadge>
                  <span>Accredited & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBadge><PlayCircle className="w-4 h-4" /></IconBadge>
                  <span>Virtual tour available</span>
                </div>
              </div>
            </div>
          </div>
          {/* decorative wave */}
          <svg className="block w-full -mt-1" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden>
            <path fill="#f9fafb" d="M0,64L48,69.3C96,75,192,85,288,96C384,107,480,117,576,117.3C672,117,768,107,864,90.7C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z" />
          </svg>
        </section>

        {/* Floating Book CTA */}
        <button
          onClick={() => scrollTo("booking")}
          aria-label="Book Now"
          className="fixed bottom-6 right-6 z-40 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-800"
        >
          Book Now
        </button>

        {/* Counters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ label: "Patients Served", val: counts.patients }, { label: "Caregivers", val: counts.caregivers }, { label: "Years", val: counts.years }, { label: "Cities Covered", val: counts.coverage }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">{s.val}+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Services */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {servicesList.map((s, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800 transition">
                <div className="text-green-700 dark:text-green-400 mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{s.desc}</p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Packages / Pricing */}
        <section id="packages" className="bg-green-50 dark:bg-green-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Care Packages</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((p) => (
                <motion.div key={p.name} whileHover={{ scale: 1.03 }} className={(p.highlight ? "ring-2 ring-green-600 " : "") + "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow"}>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    {p.highlight && <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">Popular</span>}
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">${p.price}<span className="text-base text-gray-500">/wk</span></div>
                  <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> {perk}</li>
                    ))}
                  </ul>
                  <button onClick={() => { setSelectedPackage(p); scrollTo("booking"); }} className="w-full bg-green-700 text-white py-2 rounded-xl hover:bg-green-800">{p.cta}</button>
                </motion.div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="mt-10 overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="p-3">Feature</th>
                    {packages.map((p) => (<th key={p.name} className="p-3">{p.name}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {["Nurse visits", "Tele-check", "24/7 hotline", "Therapy guidance"].map((feat) => (
                    <tr key={feat} className="bg-white dark:bg-gray-900 shadow rounded">
                      <td className="p-3 font-medium">{feat}</td>
                      {packages.map((p) => (
                        <td key={p.name} className="p-3">
                          {Math.random() > 0.5 ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((m) => (
              <motion.div key={m.id} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow border border-gray-100 dark:border-gray-800 text-center">
                <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-full mx-auto mb-3" />
                <div className="font-semibold">{m.name}</div>
                <div className="text-green-700 dark:text-green-400 text-sm">{m.role} • {m.specialty}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{m.years} yrs exp.</div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{m.bio}</p>
              </motion.div>
            ))}
          </div>

          {/* Training & Certifications timeline */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /> Certifications</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {certifications.map((c, i) => (
                  <li key={i} className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-green-600" /> Staff Training Timeline</h3>
              <ul className="space-y-3 text-sm">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 24 * 60).toLocaleDateString()} — {["CPR Renewal", "Infection Control", "Medication Safety", "EHR Training"][i % 4]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials with carousel controls */}
        <section id="testimonials" className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-300">What Patients Say</h2>
              <div className="flex items-center gap-2">
                <button aria-label="prev" onClick={() => setCarouselIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                  ◀
                </button>
                <button aria-label="next" onClick={() => setCarouselIndex((i) => (i + 1) % testimonials.length)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                  ▶
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0.6 }} animate={i === carouselIndex ? { opacity: 1, scale: 1.02 } : { opacity: 0.7, scale: 0.98 }} transition={{ duration: 0.4 }} className={"rounded-2xl p-5 shadow border bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-800 " + (i === carouselIndex ? "ring-2 ring-green-600" : "")}>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="flex">
                          {Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-4 h-4 text-yellow-500" />))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">“{t.text}”</p>
                  </motion.div>
                ))}
              </div>
              {/* small dots */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCarouselIndex(i)} className={"w-2 h-2 rounded-full " + (i === carouselIndex ? "bg-green-700" : "bg-gray-300") } aria-label={`Go to testimonial ${i + 1}`}></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories / Case Studies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">
                <div className="flex items-center gap-3 mb-3">
                  <img src={s.photo} alt={s.patient} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold">{s.patient}</div>
                    <div className="text-xs text-gray-500">Outcome: {s.outcome}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{s.story}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Insurance & Pricing Transparency */}
        <section className="bg-green-50 dark:bg-green-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Insurance & Payment</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-2">Insurance Partners</h3>
                <div className="flex gap-3 overflow-x-auto py-2">
                  {insurancePartners.map((p) => (
                    <div key={p.id} className="flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-2 rounded-xl flex items-center gap-3">
                      <img src={p.logo} alt={p.name} className="w-20 h-12 object-contain" />
                      <div className="text-sm">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-2">Pricing Transparency</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">We provide upfront estimates and no-surprise billing. Contact us for a custom quote based on your care plan.</p>
                <a href="#" className="inline-flex items-center gap-2 mt-3 text-green-700 dark:text-green-400 hover:underline"><FileText className="w-4 h-4" /> Download Sample Estimate (PDF)</a>
              </div>
            </div>
          </div>
        </section>

        {/* Tools: Symptom Checker + BMI + FAQ */}
        <section id="faqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Symptom Checker */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-green-600" /> Quick Symptom Checker</h3>
              <div className="space-y-3 text-sm">
                {Object.keys(symptoms).map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-green-700" checked={symptoms[k]} onChange={(e) => setSymptoms({ ...symptoms, [k]: e.target.checked })} />
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                ))}
                <div className="mt-2">
                  <label className="text-xs">Severity</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full rounded-xl p-2 border border-gray-200 dark:border-gray-700">
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300"><strong>Result:</strong> {symptomResult}</div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-600" /> FAQs</h3>
                <div className="flex items-center gap-2">
                  <input value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-sm" />
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {faqs.filter((f) => (f.q + " " + f.a).toLowerCase().includes(faqQuery.toLowerCase())).map((f, i) => (
                  <div key={i} className="py-3">
                    <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)} className="w-full flex items-center justify-between text-left">
                      <span className="font-medium">{f.q}</span>
                      {activeFAQ === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {activeFAQ === i && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking" className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-8">Book an Appointment</h2>
            {selectedPackage && (
              <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-800 dark:text-green-300 font-semibold">Selected Package: {selectedPackage.name} - ${selectedPackage.price}/wk</p>
              </div>
            )}
            <form onSubmit={submitForm} className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl shadow space-y-4" aria-label="Appointment booking form">
              <div className="grid md:grid-cols-2 gap-4">
                <input aria-label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name*" className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                <input aria-label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone*" className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input aria-label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                <select aria-label="Service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  {servicesList.map((s) => (<option key={s.title}>{s.title}</option>))}
                </select>
              </div>
              <textarea aria-label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"></textarea>
              <div className="flex items-center justify-between">
                <button disabled={submitting} type="submit" className="bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded-xl hover:bg-green-800 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit"}</button>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Add to calendar demo - integrate with calendar API later."); }} className="text-sm text-green-700 dark:text-green-400 hover:underline flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Add to Calendar</a>
              </div>
              {formMsg && <div className="text-sm">{formMsg}</div>}
            </form>
          </div>
        </section>

        {/* Feedback / Ratings */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setRating(i + 1)} aria-label={`Rate ${i + 1}`}>
                  <Star className={(i < rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600") + " w-6 h-6"} />
                </button>
              ))}
            </div>
            <textarea placeholder="Your feedback..." className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"></textarea>
            <button className="mt-3 bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800">Submit</button>
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="bg-green-50 dark:bg-green-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Health Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(showAllBlogs ? blogPosts : blogPosts.slice(0, 3)).map((b) => (
                <article key={b.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">
                  <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{b.excerpt}</p>
                  <a href={b.slug} className="text-green-700 dark:text-green-400 hover:underline inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Read more</a>
                </article>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center">
              <button onClick={() => setShowAllBlogs((s) => !s)} className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 shadow">{showAllBlogs ? "Show less" : "Load more"}</button>
            </div>
          </div>
        </section>

        {/* Trust & Social Proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> Patient Safety</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Hand hygiene & PPE compliance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Medication double-check protocol</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Fall risk screening at each visit</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /> Awards</h3>
              <ul className="space-y-2 text-sm">
                {awards.map((a, i) => (
                  <li key={i} className="flex items-center gap-2"><Award className="w-4 h-4 text-green-600" /> {a.year} • {a.title} — {a.org}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" /> Press</h3>
              <ul className="space-y-2 text-sm">
                {press.map((p, i) => (
                  <li key={i} className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-green-600" /> <a href={p.link} className="hover:underline">{p.outlet} — {p.headline}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Multimedia: Virtual Tour + Video Testimonial */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Multimedia</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl shadow overflow-hidden">
                <iframe title="virtual-tour" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen className="w-full h-full" />
              </div>
              <div className="aspect-video rounded-2xl shadow overflow-hidden">
                <video className="w-full h-full object-cover" controls>
                  <source src={tourVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Map */}
        <section id="contact" className="bg-green-50 dark:bg-green-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Phone className="w-5 h-5 text-green-600" /> Call</h3>
                <a className="text-lg font-semibold text-green-700 dark:text-green-400" href="tel:+922101981110">+92 21 01 98 11 10</a>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">24/7 hotline for emergencies and urgent care guidance.</p>
                <button onClick={() => window.open("tel:+922101981110")} className="mt-3 px-3 py-2 bg-green-700 text-white rounded-xl">Call Now</button>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600" /> Service Area</h3>
                <p>We currently cover {counts.coverage}+ cities. Coverage expands monthly.</p>
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <iframe title="coverage-map" src={coverageMapSrc} className="w-full h-48 border-0" loading="lazy" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-green-600" /> Social</h3>
                <div className="flex gap-3 text-sm text-green-700 dark:text-green-400">
                  <a href="#" className="hover:underline">Facebook</a>
                  <a href="#" className="hover:underline">Instagram</a>
                  <a href="#" className="hover:underline">LinkedIn</a>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Newsletter</h4>
                  <div className="flex gap-2">
                    <input placeholder="Your email" className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-1" />
                    <button className="px-3 py-2 bg-green-700 text-white rounded-xl">Subscribe</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        {/* Floating Chat */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <AnimatePresence>
            {chatOpen && (
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Medicore Assistant</div>
                  <button onClick={() => setChatOpen(false)} className="p-1 rounded-md">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-48 overflow-auto space-y-2 mb-2">
                  {chatMessages.map((m) => (
                    <div key={m.id} className={m.from === "bot" ? "text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded" : "text-sm bg-green-700 text-white p-2 rounded self-end"}>
                      {m.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); const v = chatInputRef.current?.value?.trim(); if (v) { sendChat(v); chatInputRef.current.value = ""; } }} className="flex gap-2">
                  <input ref={chatInputRef} placeholder="Type a message..." className="flex-1 rounded-xl p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" />
                  <button type="submit" className="px-3 py-2 bg-green-700 text-white rounded-xl">Send</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={() => setChatOpen((s) => !s)} aria-label="Toggle chat" className="bg-green-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>

        {/* Scroll to top */}
        {showTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 left-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow rounded-full p-2">
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
