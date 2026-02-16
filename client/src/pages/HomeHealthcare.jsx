// HomeHealthcarePro.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import tourVideo from "../components/tour video.mp4";
import { apiRequest } from "../services/api";
import {
  Stethoscope,
  HeartPulse,
  Users,
  Phone,
  Calendar as CalendarIcon, // Required: Code uses <CalendarIcon />
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
  Ambulance,
  Globe,
  Link as LinkIcon, // Required: Code uses <LinkIcon />
  X,
  Video,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  UserCheck
} from "lucide-react";

// -----------------------------------------------------------
// Helper data & utilities
// -----------------------------------------------------------

const DEFAULT_SERVICES = [];
const DEFAULT_PACKAGES = [];
const DEFAULT_CERTIFICATIONS = [];
const DEFAULT_PARTNERS = [];
const DEFAULT_BLOGPOSTS = [];
const DEFAULT_AWARDS = [];
const DEFAULT_PRESS = [];
const DEFAULT_STORIES = [];
const DEFAULT_TEAM = [];

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

  const [content, setContent] = useState({
    team: DEFAULT_TEAM,
    services: DEFAULT_SERVICES,
    packages: DEFAULT_PACKAGES,
    certifications: DEFAULT_CERTIFICATIONS,
    partners: DEFAULT_PARTNERS,
    blogPosts: DEFAULT_BLOGPOSTS,
    awards: DEFAULT_AWARDS,
    press: DEFAULT_PRESS,
    stories: DEFAULT_STORIES
  });

  useEffect(() => {
    let alive = true;
    const loadContent = async () => {
      try {
        const data = await apiRequest('/api/public/home-healthcare');
        if (!alive) return;
        setContent({
          team: Array.isArray(data.team) ? data.team : [],
          services: Array.isArray(data.services)
            ? data.services.map((s) => ({ ...s, desc: s.description || s.desc || "" }))
            : [],
          packages: Array.isArray(data.packages) ? data.packages : [],
          certifications: Array.isArray(data.certifications) ? data.certifications.map((c) => c.title || c) : [],
          partners: Array.isArray(data.partners) ? data.partners : [],
          blogPosts: Array.isArray(data.blogPosts) ? data.blogPosts : [],
          awards: Array.isArray(data.awards)
            ? data.awards.map((a) => ({ ...a, org: a.organization || a.org || "" }))
            : [],
          press: Array.isArray(data.press) ? data.press : [],
          stories: Array.isArray(data.stories) ? data.stories : []
        });
      } catch (err) {
        console.error('Failed to load home healthcare content:', err);
      }
    };

    loadContent();
    return () => { alive = false; };
  }, []);

  const servicesList = content.services;
  const packages = content.packages;
  const certifications = content.certifications;
  const insurancePartners = content.partners;
  const blogPosts = content.blogPosts;
  const awards = content.awards;
  const press = content.press;
  const successStories = content.stories;
  const team = content.team;

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
      [
        {
          name: "Dr. Sarah Johnson",
          text: "As a leading cardiologist, I've seen firsthand how Medicore's premium home healthcare transforms patient outcomes. Their enterprise-level care is unparalleled.",
          avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop",
          rating: 5,
          title: "Chief of Cardiology, Metropolitan Hospital"
        },
        {
          name: "Michael Chen",
          text: "The virtual consultation feature and AI-powered symptom checker have revolutionized our family's healthcare experience. Truly enterprise-grade service.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
          rating: 5,
          title: "CEO, Chen Enterprises"
        },
        {
          name: "Dr. Emily Rodriguez",
          text: "Medicore's advanced analytics and patient portal provide the insights we need for optimal care management. A game-changer for healthcare delivery.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
          rating: 5,
          title: "Director of Patient Care, Elite Medical Group"
        },
        {
          name: "Robert Williams",
          text: "The luxury care packages and 24/7 support have given my mother peace of mind. Exceptional enterprise healthcare at home.",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
          rating: 5,
          title: "President, Williams Foundation"
        },
        {
          name: "Dr. Lisa Park",
          text: "Their partnerships with major healthcare organizations ensure seamless, high-quality care. The telemedicine features are cutting-edge.",
          avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
          rating: 5,
          title: "VP of Medical Affairs, Global Health Network"
        },
        {
          name: "David Thompson",
          text: "From the premium symptom checker to the enterprise analytics dashboard, Medicore delivers healthcare excellence that exceeds expectations.",
          avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop",
          rating: 5,
          title: "Chairman, Thompson Healthcare Group"
        },
      ],
    []
  );

  // selected package
  const [selectedPackage, setSelectedPackage] = useState(null);

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

  // Parallax effect for hero
  const [heroOffset, setHeroOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeroOffset(scrollY * 0.5); // Adjust multiplier for parallax speed
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Booking form
  const [form, setForm] = useState({ name: "", phone: "", date: "", service: servicesList[0]?.title || "" });
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
    setFormMsg("Appointment request submitted. We will contact you shortly.");
    setForm({ name: "", phone: "", date: "", service: servicesList[0]?.title || "" });
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

  // Blog load more
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  // Accessibility: focus trap for modals is omitted for brevity but worth adding in production

  // New premium enhancements
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState([]);
  const [liveData, setLiveData] = useState({
    activePatients: 0,
    availableNurses: 0,
    responseTime: 0,
    satisfaction: 0
  });
  const [card3D, setCard3D] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [floatingElements, setFloatingElements] = useState([]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Particle background
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      }));
      setParticles(newParticles);
    };
    generateParticles();

    const animateParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + window.innerWidth) % window.innerWidth,
        y: (p.y + p.speedY + window.innerHeight) % window.innerHeight,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Dynamic fake data updates
  useEffect(() => {
    const updateLiveData = () => {
      setLiveData({
        activePatients: Math.floor(Math.random() * 50) + 1200,
        availableNurses: Math.floor(Math.random() * 10) + 40,
        responseTime: Math.floor(Math.random() * 5) + 2,
        satisfaction: Math.floor(Math.random() * 5) + 95,
      });
    };

    const interval = setInterval(updateLiveData, 30000); // Update every 30 seconds
    updateLiveData(); // Initial update
    return () => clearInterval(interval);
  }, []);

  // Floating luxury elements
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: [ShieldCheck, Award, Star, HeartPulse, Users, Hospital, Globe, CheckCircle2][i],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setFloatingElements(elements);

    const animateElements = () => {
      setFloatingElements(prev => prev.map(el => ({
        ...el,
        y: (el.y - el.speed) % 100,
      })));
    };

    const interval = setInterval(animateElements, 100);
    return () => clearInterval(interval);
  }, []);

  // 3D card effect handler
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setCard3D({ x, y, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setCard3D({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  // Premium loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Medicore HomeCare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/70"
          >
            Loading premium healthcare experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // Rendering — large UI with many sections
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 text-white relative overflow-hidden">
      {/* Luxury background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-gray-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.1),transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(192,192,192,0.1),transparent_50%)]"></div>

      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Floating Luxury Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingElements.map((el) => {
          const IconComponent = el.icon;
          return (
            <motion.div
              key={el.id}
              className="absolute text-yellow-400/30"
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                fontSize: `${el.size}px`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + el.speed,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <IconComponent />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10">
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
            <video className="w-full h-full object-cover" style={{ transform: `translateY(${heroOffset}px)` }} src={tourVideo} autoPlay muted loop playsInline />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-slate-900/60 to-slate-900/80 mix-blend-multiply" />
            {/* Premium overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.05),transparent_70%)]" />
          </div>
          <div className="relative py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl tracking-wide leading-tight">
                Luxury Home Healthcare Excellence
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-2xl text-white/95 mb-8 font-light leading-relaxed">
                Professional nurses & therapists delivering quality care—anytime you need it.
              </motion.p>
              <motion.div className="flex items-center justify-center gap-4 flex-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <button onClick={() => scrollTo("booking")} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" /> Book Appointment
                </button>
                <button onClick={() => scrollTo("services")} className="bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/40 px-8 py-4 rounded-full text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" /> Explore Services
                </button>
              </motion.div>

              <motion.div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <IconBadge className="bg-yellow-400/20"><CheckCircle2 className="w-4 h-4 text-yellow-400" /></IconBadge>
                  <span>Trusted medical staff</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <IconBadge className="bg-yellow-400/20"><ShieldCheck className="w-4 h-4 text-yellow-400" /></IconBadge>
                  <span>Accredited & Insured</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <IconBadge className="bg-yellow-400/20"><PlayCircle className="w-4 h-4 text-yellow-400" /></IconBadge>
                  <span>Virtual tour available</span>
                </div>
              </motion.div>
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

        {/* Live Data Dashboard */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Live Service Status</motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-700"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${card3D.rotateX}deg) rotateY(${card3D.rotateY}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">{liveData.activePatients}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Patients</div>
                </div>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">Updated live</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{liveData.availableNurses}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Available Nurses</div>
                </div>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">On duty now</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{liveData.responseTime}min</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</div>
                </div>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Last 24 hours</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{liveData.satisfaction}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Patient Satisfaction</div>
                </div>
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Based on reviews</div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Our Premium Services</motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {servicesList.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: idx * 0.1 }} whileHover={{ y: -6, scale: 1.02 }} className="backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-3xl hover:bg-white/20 dark:hover:bg-gray-900/20">
                <div className="text-yellow-400 mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-1 text-white">{s.title}</h3>
                <p className="text-gray-200 dark:text-gray-300 mb-4">{s.desc}</p>
                <ul className="space-y-1 text-sm text-gray-200 dark:text-gray-400">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-400" /> {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Packages / Pricing */}
        <section id="packages" className="bg-green-50 dark:bg-green-950/20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-12">Care Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <tr key={feat} className="text-black bg-white dark:bg-gray-900 shadow rounded">
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

        {/* Virtual Consultation */}
        <section id="virtual-consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">Virtual Consultation</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Connect with our expert healthcare professionals from the comfort of your home.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-black text-xl font-semibold mb-4 flex items-center gap-2"><Video className="w-5 h-5 text-green-600" /> Schedule a Consultation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Book a secure video call with our licensed nurses and therapists.</p>
              <button className="w-full bg-green-700 text-white py-2 rounded-xl hover:bg-green-800">Book Now</button>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-black text-xl font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-green-600" /> AI Symptom Assessment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Get preliminary health insights powered by advanced AI technology.</p>
              <button className="w-full bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800">Start Assessment</button>
            </div>
          </div>
        </section>

        {/* Patient Portal Preview */}
        <section id="patient-portal" className="bg-green-50 dark:bg-green-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Patient Portal Preview</h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-black font-semibold mb-2">Login Securely</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Access your health records with HIPAA-compliant security.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-black font-semibold mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Track your health metrics and progress over time.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-black font-semibold mb-2">Communicate</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Message your care team and schedule appointments.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Analytics Dashboard Preview */}
        <section id="analytics-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Advanced Analytics Dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <BarChart3 className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Patient Outcomes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Track recovery progress and health improvements.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <PieChart className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Care Efficiency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monitor care delivery metrics and response times.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <Activity className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-black font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Live vitals tracking and alert systems.</p>
            </motion.div>
          </div>
        </section>

        {/* Strategic Partnerships */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-10">Strategic Partnerships</h2>
            <div className="flex gap-6 overflow-x-auto py-4">
              <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Hospital className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">Mayo Clinic</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Research collaboration</p>
                </div>
              </div>
              <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">Harvard Medical School</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Education partnership</p>
                </div>
              </div>
              <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">Cleveland Clinic</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Quality assurance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-black text-3xl font-bold text-green-800 dark:text-green-300 text-center mb-10">Meet Our Team</h2>
          <div className="text-black grid sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              <ul className="text-black space-y-3 text-sm">
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

        {/* Testimonials with enhanced carousel controls */}
        <section id="testimonials" className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-300">What Patients Say</h2>
              <div className="flex items-center gap-2">
                <motion.button aria-label="prev" onClick={() => setCarouselIndex((i) => (i - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  ◀
                </motion.button>
                <motion.button aria-label="next" onClick={() => setCarouselIndex((i) => (i + 1) % testimonials.length)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  ▶
                </motion.button>
              </div>
            </motion.div>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={i === carouselIndex ? { opacity: 1, scale: 1.05, y: 0 } : { opacity: 0.6, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={"rounded-2xl p-5 shadow border bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-800 cursor-pointer " + (i === carouselIndex ? "ring-2 ring-green-600 shadow-2xl" : "")}
                    onClick={() => setCarouselIndex(i)}
                    whileHover={{ scale: i === carouselIndex ? 1.05 : 1.02, y: -5 }}
                  >
                    <motion.div className="flex items-center gap-3 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <motion.img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" whileHover={{ scale: 1.1 }} />
                      <div>
                        <div className="font-semibold text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.title}</div>
                        <div className="flex">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <motion.div key={j} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + j * 0.1 }}>
                              <Star className="w-4 h-4 text-yellow-500" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    <motion.p className="text-sm text-gray-700 dark:text-gray-300 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                      "{t.text}"
                    </motion.p>
                  </motion.div>
                ))}
              </div>
              {/* enhanced dots */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={"w-3 h-3 rounded-full transition-all duration-300 " + (i === carouselIndex ? "bg-green-700 scale-125" : "bg-gray-300 hover:bg-gray-400")}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
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
                <h3 className="text-black font-semibold mb-2">Insurance Partners</h3>
                <div className="text-black flex gap-3 overflow-x-auto py-2">
                  {insurancePartners.map((p) => (
                    <div key={p.id} className="flex-shrink-0 bg-gray-50 dark:bg-gray-950 p-2 rounded-xl flex items-center gap-3">
                      <img src={p.logo} alt={p.name} className="w-20 h-12 object-contain" />
                      <div className="text-sm">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="text-black font-semibold mb-2">Pricing Transparency</h3>
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
              <h3 className="text-black text-xl font-semibold mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-green-600" /> Quick Symptom Checker</h3>
              <div className="text-black space-y-3 text-sm">
                {Object.keys(symptoms).map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-green-700" checked={symptoms[k]} onChange={(e) => setSymptoms({ ...symptoms, [k]: e.target.checked })} />
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                ))}
                <div className="mt-2">
                  <label className="text-black text-xs">Severity</label>
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
                <h3 className="text-black text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-600" /> FAQs</h3>
                <div className="text-black flex items-center gap-2">
                  <input value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} placeholder="Search..." className="text-black px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-sm" />
                </div>
              </div>
              <div className="text-black divide-y divide-gray-200 dark:divide-gray-800">
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
              <button onClick={() => setShowAllBlogs((s) => !s)} className="text-black Font-bold px-4 py-2 rounded-xl bg-white dark:bg-gray-900 shadow">{showAllBlogs ? "Show less" : "Load more"}</button>
            </div>
          </div>
        </section>

        {/* Trust & Social Proof */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-black font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> Patient Safety</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Hand hygiene & PPE compliance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Medication double-check protocol</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Fall risk screening at each visit</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-black font-semibold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /> Awards</h3>
              <ul className="text-black space-y-2 text-sm">
                {awards.map((a, i) => (
                  <li key={i} className="flex items-center gap-2"><Award className="w-4 h-4 text-green-600" /> {a.year} • {a.title} — {a.org}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="text-black font-semibold mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" /> Press</h3>
              <ul className="text-black space-y-2 text-sm">
                {press.map((p, i) => (
                  <li key={i} className="text-black flex items-center gap-2"><LinkIcon className="w-4 h-4 text-green-600" /> <a href={p.link} className="hover:underline">{p.outlet} — {p.headline}</a></li>
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
                <h3 className="text-black font-semibold mb-2 flex items-center gap-2"><Phone className="w-5 h-5 text-green-600" /> Call</h3>
                <a className="text-lg font-semibold text-green-700 dark:text-green-400" href="tel:+922101981110">+92 21 01 98 11 10</a>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">24/7 hotline for emergencies and urgent care guidance.</p>
                <button onClick={() => window.open("tel:+922101981110")} className="mt-3 px-3 py-2 bg-green-700 text-white rounded-xl">Call Now</button>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="text-black font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600" /> Service Area</h3>
                <p className="text-black ">We currently cover {counts.coverage}+ cities. Coverage expands monthly.</p>
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <iframe title="coverage-map" src={coverageMapSrc} className="w-full h-48 border-0" loading="lazy" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
                <h3 className="text-black font-semibold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-green-600" /> Social</h3>
                <div className="flex gap-3 text-sm text-green-700 dark:text-green-400">
                  <a href="#" className="hover:underline">Facebook</a>
                  <a href="#" className="hover:underline">Instagram</a>
                  <a href="#" className="hover:underline">LinkedIn</a>
                </div>
                <div className="mt-4">
                  <h4 className="text-black font-medium mb-2">Newsletter</h4>
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
