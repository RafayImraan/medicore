// Home.jsx - Complete Hospital Management System
// Single-file implementation with all features
import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../services/api";
import {
  Search, Moon, Sun, MessageSquare, ArrowUp, Phone, MapPin, ShieldCheck,
  PlayCircle, User, Users, Clock, Bell, Heart, Star, Zap, CheckCircle,
  Activity, AlertTriangle, Calendar, Camera, ChevronDown, ChevronRight,
  Clipboard, CreditCard, Database, Download, Eye, FileText, Filter, Globe,
  Headphones, Home, Image, Info, Key, Layers, Link, Lock, LogOut, Mail,
  Map, Mic, MicOff, Monitor, MoreHorizontal, Move, Package, Play, Plus, 
  Power, Printer, RefreshCw, Save, Send, Settings, Share2, Shield, 
  Smartphone, Speaker, Thermometer, ThumbsUp, Trash2, TrendingUp, Truck, 
  Tv, Upload, Video, VideoOff, Volume2, VolumeX, Watch, Wifi, X, XCircle, 
  Maximize2, Minimize2, Edit, Copy, Award, BookOpen, Briefcase, Coffee, 
  Cpu, Droplet, ExternalLink, Film, Flag, Folder, Gift, Grid, Hash,
  HelpCircle, Inbox, Layout, List, Loader, LogIn, Menu,
  MessageCircle, Paperclip, Server, Sliders, Smile, Terminal, Type, 
  Umbrella, UploadCloud, Aperture, Archive, BarChart2, Battery, Box, 
  CheckSquare, Circle, Command, Delete, Divide, Edit2, Edit3, Frown, 
  HardDrive, Italic, Meh, MinusCircle, MoreVertical, PenTool, PhoneCall,
  PhoneOff, PlusCircle, PlusSquare, Repeat, Reply, Scissors, Square,
  Tag, Target, ToggleLeft, ToggleRight, Triangle, Underline, Unlock, 
  UserCheck, UserMinus, UserPlus, UserX, Voicemail, Wind, ZoomIn, ZoomOut,
  Bed, Pill, Brain, Stethoscope, Microscope, Footprints, Baby, Languages, QrCode,
  Fingerprint, AlertCircle, BellRing, CalendarCheck, CalendarDays, 
  ClipboardList, CloudUpload, Contact, Crown, FileSearch, FolderOpen, 
  Gauge, GraduationCap, Grip, Hammer, History, Hourglass, Laptop, 
  Lightbulb, LineChart, ListChecks, Locate, MailOpen, Megaphone, 
  MousePointer, Navigation, Newspaper, PieChart, Podcast, Radio, 
  Rocket, Rss, Scale, ScanLine, ScreenShare, SearchCheck, SendHorizontal,
  ShoppingBag, ShoppingCart, Shuffle, Signal, Skull, Sparkles, 
  Sunrise, Sunset, Table, Tablet, Timer, Trophy, Wallet, Wrench,
  Hand, Accessibility, DollarSign, Percent, MousePointerClick, ChevronLeft,
  ChevronUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw,
  MinusSquare, Minus, XSquare, AlertOctagon, BellOff, BookmarkPlus,
  Bookmark, Building, Building2, CalendarPlus, CalendarX, CameraOff,
  Cast, Chrome, Codepen, Codesandbox, Columns, Compass, Crosshair,
  Disc, DollarSign as Dollar, Eye as EyeIcon, EyeOff,
  Feather, FileCheck, FileMinus, FilePlus, FileX, Flame, Focus,
  Framer, Frown as FrownIcon, Github, Gitlab, Globe as GlobeIcon,
  Glasses, HardDrive as HardDriveIcon, Hexagon, Home as HomeIcon,
  ImageOff, Instagram, Key as KeyIcon, Landmark, Layers as LayersIcon,
  Leaf, LifeBuoy as LifeBuoyIcon, Linkedin, MapPin as MapPinIcon,
  Maximize, Mic as MicIcon, Minimize, Moon as MoonIcon, Music,
  Navigation as NavigationIcon, Octagon, Pause, PauseCircle, Percent as PercentIcon,
  PersonStanding, Phone as PhoneIcon, PieChart as PieChartIcon,
  Pin, Pocket, Power as PowerIcon, Printer as PrinterIcon, Radio as RadioIcon,
  Receipt, Recycle, RefreshCcw, Rewind, Ruler, Satellite, Save as SaveIcon,
  Scale as ScaleIcon, Scan, Search as SearchIcon, Server as ServerIcon,
  Share, Shield as ShieldIcon, ShieldAlert, ShieldCheck as ShieldCheckIcon,
  ShieldOff, ShieldQuestion, Shirt, ShoppingBag as ShoppingBagIcon,
  Shuffle as ShuffleIcon, Sidebar, Signal as SignalIcon, Skull as SkullIcon,
  Slash, Sliders as SlidersIcon, Smartphone as SmartphoneIcon, Snowflake,
  Speaker as SpeakerIcon, Sprout, Star as StarIcon, StopCircle, Store,
  Sun as SunIcon, Sunrise as SunriseIcon, Sunset as SunsetIcon, Tablet as TabletIcon,
  Tag as TagIcon, Target as TargetIcon, Tent, Terminal as TerminalIcon,
  ThumbsDown, ThumbsUp as ThumbsUpIcon, Ticket, Timer as TimerIcon,
  ToggleLeft as ToggleLeftIcon, ToggleRight as ToggleRightIcon,
  Trash, Trash2 as Trash2Icon, TrendingDown, TrendingUp as TrendingUpIcon,
  Triangle as TriangleIcon, Truck as TruckIcon, Tv as TvIcon, Twitch,
  Twitter, Type as TypeIcon, Umbrella as UmbrellaIcon, Underline as UnderlineIcon,
  Unlink, Unlock as UnlockIcon, Upload as UploadIcon, UploadCloud as UploadCloudIcon,
  User as UserIcon, UserCheck as UserCheckIcon, UserMinus as UserMinusIcon,
  UserPlus as UserPlusIcon, UserX as UserXIcon, Users as UsersIcon,
  Video as VideoIcon, VideoOff as VideoOffIcon, Voicemail as VoicemailIcon,
  Volume, Volume2 as Volume2Icon, VolumeX as VolumeXIcon,
  Watch as WatchIcon, Wifi as WifiIcon, WifiOff, Wind as WindIcon,
  X as XIcon, XCircle as XCircleIcon, XOctagon, XSquare as XSquareIcon,
  Youtube, Zap as ZapIcon, ZapOff, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon
} from "lucide-react";


import toast, { Toaster } from "react-hot-toast";
import Dashboard from "@/pages/viewdashboard";

// ==================== CONTEXT PROVIDERS ====================

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, token: null, points: 0, setPoints: () => {}, setUser: () => {}, login: () => {}, logout: () => {} };
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [points, setPoints] = useState(0);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPoints(0);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, points, setPoints, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Theme Context
const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { dark: false, setDark: () => {}, highContrast: false, setHighContrast: () => {}, fontSize: 'base', setFontSize: () => {} };
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('base');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          setDark(parsed.dark || false);
          setHighContrast(parsed.highContrast || false);
          setFontSize(parsed.fontSize || 'base');
        } else if (parsed === 'dark') {
          setDark(true);
        } else if (parsed === 'light') {
          setDark(false);
        }
      } catch (e) {
        // Handle old format where theme was stored as string
        if (stored === 'dark') {
          setDark(true);
        } else {
          setDark(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify({ dark, highContrast, fontSize }));
  }, [dark, highContrast, fontSize]);

  return (
    <ThemeContext.Provider value={{ dark, setDark, highContrast, setHighContrast, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Language Context
const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: 'en', setLang: () => {}, t: (key) => key, translations: {} };
  }
  return context;
};

const translations = {
  en: {
    welcome: "Welcome to Medicore Hospital",
    bookAppointment: "Book Appointment",
    findDoctor: "Find a Doctor",
    emergencyHotline: "Emergency Hotline (24/7)",
    ourServices: "Our Core Services",
    predictiveInsights: "Predictive Insights",
    patientStories: "Patient Stories",
    healthArticles: "Health Articles",
    liveStats: "Live Statistics",
    bedsAvailable: "Beds Available",
    doctorsOnline: "Doctors Online",
    erWaitTime: "ER Wait Time",
    ongoingSurgeries: "Ongoing Surgeries",
    activeAlerts: "Active Alerts",
    search: "Search doctors, services, articles...",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",
    notifications: "Notifications",
    chat: "Chat",
    telemedicine: "Telemedicine",
    pharmacy: "Pharmacy",
    labResults: "Lab Results",
    appointments: "Appointments",
    medicalRecords: "Medical Records",
    billing: "Billing & Payments",
    insurance: "Insurance",
    mentalHealth: "Mental Health",
    wellness: "Wellness Programs",
    rehabilitation: "Rehabilitation",
    homecare: "Home Care",
    ambulance: "Ambulance Services",
    bloodBank: "Blood Bank",
    organDonation: "Organ Donation",
    research: "Clinical Research",
    education: "Medical Education",
    careers: "Careers",
    contact: "Contact Us",
    about: "About Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  ur: {
    welcome: "میڈیکور ہسپتال میں خوش آمدید",
    bookAppointment: "ملاقات بک کریں",
    findDoctor: "ڈاکٹر تلاش کریں",
    emergencyHotline: "ایمرجنسی ہاٹ لائن (24/7)",
    ourServices: "ہماری بنیادی خدمات",
    predictiveInsights: "پیش گوئی کی بصیرت",
    patientStories: "مریضوں کی کہانیاں",
    healthArticles: "صحت کے مضامین",
    liveStats: "براہ راست اعداد و شمار",
    bedsAvailable: "دستیاب بستر",
    doctorsOnline: "آن لائن ڈاکٹر",
    erWaitTime: "ایمرجنسی انتظار کا وقت",
    ongoingSurgeries: "جاری سرجریز",
    activeAlerts: "فعال الرٹس",
    search: "ڈاکٹروں، خدمات، مضامین تلاش کریں...",
    login: "لاگ ان",
    logout: "لاگ آؤٹ",
    profile: "پروفائل",
    settings: "ترتیبات",
    notifications: "اطلاعات",
  },
  ar: {
    welcome: "مرحباً بكم في مستشفى ميديكور",
    bookAppointment: "حجز موعد",
    findDoctor: "البحث عن طبيب",
    emergencyHotline: "خط الطوارئ (24/7)",
    ourServices: "خدماتنا الأساسية",
    predictiveInsights: "رؤى تنبؤية",
    patientStories: "قصص المرضى",
    healthArticles: "مقالات صحية",
    liveStats: "إحصائيات مباشرة",
    bedsAvailable: "الأسرة المتاحة",
    doctorsOnline: "الأطباء المتصلون",
    erWaitTime: "وقت انتظار الطوارئ",
    ongoingSurgeries: "العمليات الجارية",
    activeAlerts: "التنبيهات النشطة",
    search: "البحث عن الأطباء والخدمات والمقالات...",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    notifications: "الإشعارات",
  },
  zh: {
    welcome: "欢迎来到Medicore医院",
    bookAppointment: "预约挂号",
    findDoctor: "找医生",
    emergencyHotline: "急救热线 (24/7)",
    ourServices: "我们的核心服务",
    predictiveInsights: "预测洞察",
    patientStories: "患者故事",
    healthArticles: "健康文章",
    liveStats: "实时统计",
    bedsAvailable: "可用床位",
    doctorsOnline: "在线医生",
    erWaitTime: "急诊等待时间",
    ongoingSurgeries: "进行中的手术",
    activeAlerts: "活动警报",
    search: "搜索医生、服务、文章...",
    login: "登录",
    logout: "登出",
    profile: "个人资料",
    settings: "设置",
    notifications: "通知",
  },
};

const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' || lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Notification Context
const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return { notifications: [], addNotification: () => {}, removeNotification: () => {}, clearAll: () => {} };
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Flu vaccine available this week", type: "info", read: false, timestamp: new Date() },
    { id: 2, text: "Your lab results are ready", type: "success", read: false, timestamp: new Date() },
    { id: 3, text: "Appointment reminder: Dr. Smith tomorrow 10:00 AM", type: "reminder", read: false, timestamp: new Date() },
  ]);

  const addNotification = (notification) => {
    setNotifications(prev => [{ ...notification, id: Date.now(), timestamp: new Date(), read: false }, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ==================== DATA NORMALIZATION ====================

const normalizeDoctors = (list = []) =>
  list.map((doc, index) => ({
    id: doc.id || doc._id || `doc-${index}`,
    name: doc.name || `Doctor ${index + 1}`,
    title: doc.title || doc.specialization || doc.role || 'Specialist',
    specialty: doc.specialization || doc.specialty || 'General',
    avatar: doc.avatar || `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
    rating: doc.rating || 0,
    reviewCount: doc.reviewCount || doc.reviews?.length || 0,
    years: doc.experience || doc.years || 0,
    education: doc.education || [],
    languages: doc.languages || ['English'],
    nextAvailable: doc.nextAvailable || (doc.slots?.[0]?.date || ''),
    consultationFee: doc.consultationFee || doc.fees || 0,
    hospital: doc.hospital || doc.clinic || 'Main Campus',
    bio: doc.bio || doc.intro || '',
    specializations: doc.specializations || [],
    awards: doc.awards || [],
    reviews: doc.reviews || [],
    availability: doc.availability || {},
    telemedicineAvailable: doc.telemedicineAvailable ?? false,
    acceptsInsurance: doc.acceptsInsurance || [],
    slots: doc.slots || []
  }));

const formatSlotTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buildSlotsFromDoctors = (list = []) => {
  const withSlots = list.find((doc) =>
    Array.isArray(doc.slots) && doc.slots.some((slot) => Array.isArray(slot.times) && slot.times.length)
  );
  if (!withSlots) return [];
  const day = withSlots.slots.find((slot) => Array.isArray(slot.times) && slot.times.length);
  if (!day) return [];

  return day.times.slice(0, 8).map((time) => ({
    id: `${withSlots.id}-${time}`,
    time: formatSlotTime(time),
    iso: time,
    free: true,
    doctorId: withSlots.id
  }));
};

// ==================== UTILITY FUNCTIONS ====================

// Speech synthesis
const ttsSpeak = (text, lang = 'en-US') => {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

const defaultServices = [
  { key: "cardiology", title: "Cardiology", desc: "Consultations, Angioplasty, Bypass, Pacemaker", icon: "❤️", color: "red" },
  { key: "diagnostics", title: "Diagnostics", desc: "Pathology, Lab Tests, Genetic Testing", icon: "🧪", color: "purple" },
  { key: "pediatrics", title: "Pediatrics", desc: "Child Care, Vaccination, NICU", icon: "👶", color: "pink" },
  { key: "telemedicine", title: "Telemedicine", desc: "Remote Consultations, E-Prescriptions", icon: "💻", color: "green" },
  { key: "orthopedics", title: "Orthopedics", desc: "Joint Replacement, Spine Surgery, Sports Medicine", icon: "🦴", color: "orange" },
  { key: "neurology", title: "Neurology", desc: "Brain & Spine, Stroke Care, Epilepsy", icon: "🧠", color: "indigo" },
  { key: "oncology", title: "Oncology", desc: "Cancer Treatment, Chemotherapy, Radiation", icon: "🎗️", color: "yellow" },
  { key: "emergency", title: "Emergency", desc: "24/7 Trauma Care, Critical Care", icon: "🚨", color: "red" },
  { key: "pharmacy", title: "Pharmacy", desc: "24/7 Pharmacy, Home Delivery", icon: "💊", color: "teal" },
  { key: "mentalhealth", title: "Mental Health", desc: "Psychiatry, Psychology, Counseling", icon: "🧘", color: "cyan" },
  { key: "rehabilitation", title: "Rehabilitation", desc: "Physical Therapy, Occupational Therapy", icon: "🏃", color: "lime" },
];

// Natural language booking parser
function parseNaturalBooking(text = "") {
  const lower = text.toLowerCase();
  const specialties = defaultServices.map(s => s.title.toLowerCase());
  const specialty = specialties.find(s => lower.includes(s)) || null;
  
  const timeMatch = lower.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b/i);
  const datePatterns = {
    today: new Date().toISOString().slice(0, 10),
    tomorrow: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  };
  
  let date = null;
  if (lower.includes("today")) date = datePatterns.today;
  else if (lower.includes("tomorrow")) date = datePatterns.tomorrow;
  else {
    const dateMatch = lower.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?\b/);
    if (dateMatch) date = dateMatch[0];
  }
  
  const doctorMatch = lower.match(/(?:dr\.?|doctor)\s+([a-z]+)/i);
  
  return { 
    specialty: specialty ? specialty.charAt(0).toUpperCase() + specialty.slice(1) : null, 
    date, 
    time: timeMatch?.[0] ?? null,
    doctor: doctorMatch?.[1] ?? null,
    urgent: lower.includes("urgent") || lower.includes("emergency"),
    telemedicine: lower.includes("tele") || lower.includes("video") || lower.includes("online"),
  };
}

// AI Symptom Checker (Mock)
function analyzeSymptoms(symptoms = []) {
  const conditions = {
    "fever,headache,fatigue": { condition: "Possible Viral Infection", urgency: "Low", recommendation: "Rest and hydration. See doctor if persists > 3 days." },
    "chest pain,shortness of breath": { condition: "Possible Cardiac Issue", urgency: "High", recommendation: "Seek immediate medical attention!" },
    "cough,fever,body ache": { condition: "Possible Flu or COVID-19", urgency: "Medium", recommendation: "Get tested. Isolate and monitor symptoms." },
    "stomach pain,nausea,vomiting": { condition: "Possible Gastroenteritis", urgency: "Medium", recommendation: "Stay hydrated. See doctor if severe." },
    "headache,dizziness,blurred vision": { condition: "Possible Hypertension", urgency: "High", recommendation: "Check blood pressure. Consult cardiologist." },
  };
  
  const key = symptoms.sort().join(",").toLowerCase();
  return conditions[key] || { 
    condition: "Unable to determine", 
    urgency: "Unknown", 
    recommendation: "Please consult a healthcare professional for proper diagnosis." 
  };
}

// Format currency
const formatCurrency = (amount, currency = 'PKR') => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency }).format(amount);
};

// Format date
const formatDate = (date, format = 'long') => {
  const options = format === 'long' 
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Calculate BMI
const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi: bmi.toFixed(1), category };
};

// ==================== UI COMPONENTS ====================

// Badge Component
const Badge = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: "bg-charcoal-900/60 text-white text-white/70",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };
  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// Avatar Component
const Avatar = ({ src, alt, size = "md", status = null }) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };
  const statusColors = {
    online: "bg-primary-500/40",
    offline: "bg-charcoal-900/80",
    busy: "bg-red-500/40",
    away: "bg-accent-400/150",
  };
  const safeSrc = src && typeof src === "string" && src.trim().length > 0 ? src : null;
  return (
    <div className="relative inline-block">
      {safeSrc ? (
        <img src={safeSrc} alt={alt} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white ring-white/20`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-charcoal-900/70 ring-2 ring-white/20 flex items-center justify-center text-white/70 text-xs`}>
          {alt?.[0]?.toUpperCase() || "U"}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

// Skeleton Component
const Skeleton = ({ className = "h-6 w-full", variant = "default" }) => {
  const variants = {
    default: "bg-charcoal-900/70 bg-charcoal-900/70",
    circle: "bg-charcoal-900/70 bg-charcoal-900/70 rounded-full",
    text: "bg-charcoal-900/70 bg-charcoal-900/70 rounded",
  };
  return <div className={`animate-pulse rounded ${variants[variant]} ${className}`} />;
};

// Card Component
const Card = ({ children, className = "", hover = false, onClick = null }) => {
  return (
    <div 
      className={`rounded-2xl bg-charcoal-900/70 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${hover ? 'hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)] transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = ({ children, variant = "primary", size = "md", disabled = false, loading = false, icon = null, onClick, className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-luxury-gold border border-primary-700/60 shadow-lg shadow-primary-900/30 hover:from-primary-800 hover:to-primary-600 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
    secondary: "bg-charcoal-900/80 text-accent-200 border border-accent-300/30 shadow-lg hover:bg-charcoal-900/90 relative overflow-hidden",
    outline: "border-2 border-accent-300/40 text-accent-100 hover:bg-charcoal-900/70 relative overflow-hidden",
    danger: "bg-gradient-to-r from-accent-700 to-accent-600 text-white border border-accent-700/60 shadow-lg shadow-accent-900/30 hover:from-accent-600 hover:to-accent-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
    ghost: "hover:bg-charcoal-900/60 text-white/80 relative overflow-hidden",
  };
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

// Input Component
const Input = ({ label, error, icon, className = "", ...props }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium lux-muted mb-1">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 lux-muted">{icon}</span>}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent outline-none transition ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-charcoal-950 rounded-2xl shadow-xl ${sizes[size]} w-full`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Tabs Component
const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-1 p-1 bg-charcoal-900/60 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-charcoal-900/70 text-white dark:text-white shadow'
              : 'text-white/70 dark:text-white/50 hover:text-white dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, max = 100, color = "green", showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    green: "bg-primary-500/40",
    blue: "bg-primary-400/150",
    red: "bg-red-500/40",
    yellow: "bg-accent-400/150",
    purple: "bg-accent-400/120",
  };
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-charcoal-900/70 bg-charcoal-900/70 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="text-xs text-white/60 mt-1">{percentage.toFixed(0)}%</span>}
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-charcoal-950 rounded whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-charcoal-950" />
        </div>
      )}
    </div>
  );
};

// Mini Sparkline Chart
const MiniSpark = ({ data = [], color = "#10B981", height = 50 }) => {
  if (!data.length) return null;
  const w = 200;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pointCount = Math.max(2, data.length);
  const safeData = data.length === 1 ? [data[0], data[0]] : data;
  const points = safeData.map((v, i) => {
    const x = (i / (pointCount - 1)) * w;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#gradient)"
        points={`0,${height} ${points} ${w},${height}`}
      />
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

// Donut Chart
const DonutChart = ({ value, max = 100, size = 80, strokeWidth = 8, color = "#10B981" }) => {
  const safeMax = Number(max) > 0 ? Number(max) : 100;
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.max(0, Math.min(100, (safeValue / safeMax) * 100));
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/70 text-white/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-semibold">{percentage.toFixed(0)}%</span>
    </div>
  );
};

// Stat Card
const StatCard = ({ title, value, change, icon, color = "green", trend = "up" }) => {
  const colors = {
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-primary-700",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Doctor Card
// Doctor Card
const DoctorCard = ({ doctor, onBook, onViewProfile, onFavorite, compact = false }) => {
  if (compact) {
    return (
      <Card hover className="p-3">
        <div className="flex items-center gap-3">
          <Avatar src={doctor.avatar} alt={doctor.name} size="md" status="online" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{doctor.name}</p>
            <p className="text-xs text-white/60 truncate">{doctor.specialty}</p>
          </div>
          <Button size="xs" onClick={() => onBook(doctor)}>Book</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden">
      <div className="relative">
        <div className="h-20 bg-gradient-to-r from-primary-900 to-primary-700" />
        <Avatar src={doctor.avatar} alt={doctor.name} size="xl" className="absolute -bottom-10 left-4 border-4 border-white" />
        {doctor.telemedicineAvailable && (
          <Badge variant="success" className="absolute top-2 right-2">
            <Video className="w-3 h-3 mr-1" /> Telemedicine
          </Badge>
        )}
      </div>
      <div className="pt-12 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-sm text-white/60">{doctor.title}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{doctor.rating}</span>
            <span className="text-xs text-white/50">({doctor.reviewCount})</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant="info">{doctor.specialty}</Badge>
          <Badge>{doctor.years} yrs exp</Badge>
        </div>

        <div className="mt-3 text-sm text-white/70 dark:text-white/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            <span>Next: {doctor.nextAvailable}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(doctor.consultationFee)}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {doctor.languages.slice(0, 3).map((lang, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-charcoal-900/70 rounded">{lang}</span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="primary" className="flex-1" onClick={() => onBook(doctor)}>
            <Calendar className="w-4 h-4" /> Book
          </Button>
          <Button variant="outline" onClick={() => onViewProfile(doctor)}>
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => onFavorite(doctor)}>
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Appointment Card
const AppointmentCard = ({ appointment, onCancel, onReschedule, onJoin }) => {
  const statusColors = {
    Scheduled: "warning",
    Confirmed: "success",
    Completed: "info",
    Cancelled: "danger",
    "No-Show": "danger",
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${appointment.type === 'Telemedicine' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {appointment.type === 'Telemedicine' ? <Video className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-medium">{appointment.doctorName}</h4>
            <p className="text-sm text-white/60">{appointment.specialty}</p>
          </div>
        </div>
        <Badge variant={statusColors[appointment.status]}>{appointment.status}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-white/70 dark:text-white/50">
          <Calendar className="w-4 h-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 dark:text-white/50">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      {appointment.reason && (
        <p className="mt-2 text-sm text-white/60 line-clamp-2">{appointment.reason}</p>
      )}

      {appointment.priority === 'Urgent' && (
        <Badge variant="danger" className="mt-2">
          <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
        </Badge>
      )}

      <div className="mt-4 flex gap-2">
        {appointment.type === 'Telemedicine' && appointment.status === 'Confirmed' && (
          <Button variant="primary" size="sm" onClick={() => onJoin(appointment)}>
            <Video className="w-4 h-4" /> Join Call
          </Button>
        )}
        {appointment.status === 'Scheduled' && (
          <>
            <Button variant="outline" size="sm" onClick={() => onReschedule(appointment)}>
              Reschedule
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onCancel(appointment)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

// Lab Result Card
const LabResultCard = ({ result }) => {
  const statusColors = {
    Pending: "warning",
    "In Progress": "info",
    Completed: "success",
    Reviewed: "purple",
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{result.testName}</h4>
          <p className="text-sm text-white/60">{result.category}</p>
        </div>
        <Badge variant={statusColors[result.status]}>{result.status}</Badge>
      </div>

      <div className="mt-3 text-sm text-white/70 dark:text-white/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Ordered: {result.orderedDate}</span>
        </div>
        {result.completedDate && (
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle className="w-4 h-4" />
            <span>Completed: {result.completedDate}</span>
          </div>
        )}
      </div>

      {result.status === 'Completed' && result.results && (
        <div className="mt-3 space-y-2">
          {result.results.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{r.parameter}</span>
              <span className={`font-medium ${r.status === 'Normal' ? 'text-green-600' : r.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                {r.value} {r.unit}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" /> Download
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>
    </Card>
  );
};

// Medication Card
const MedicationCard = ({ medication, onRefill }) => {
  const isLowStock = medication.inStock < medication.reorderLevel;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">{medication.name}</h4>
            <p className="text-sm text-white/60">{medication.dosage} - {medication.form}</p>
          </div>
        </div>
        {medication.requiresPrescription && (
          <Badge variant="warning">Rx</Badge>
        )}
      </div>

      <div className="mt-3 text-sm">
        <p className="text-white/70 dark:text-white/50">{medication.category}</p>
        <p className="font-medium mt-1">{formatCurrency(medication.price)}</p>
      </div>

      {isLowStock && (
        <div className="mt-2 flex items-center gap-1 text-yellow-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Low stock</span>
        </div>
      )}

      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onRefill(medication)}>
        <RefreshCw className="w-4 h-4" /> Request Refill
      </Button>
    </Card>
  );
};

// Room Status Card
const RoomCard = ({ room }) => {
  const statusColors = {
    Available: "success",
    Occupied: "danger",
    Maintenance: "warning",
    Reserved: "info",
    Cleaning: "purple",
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium">Room {room.number}</h4>
            <p className="text-sm text-white/60">{room.type} - {room.wing} Wing</p>
          </div>
        </div>
        <Badge variant={statusColors[room.status]}>{room.status}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-white/60">Beds:</span>
          <span className="ml-1 font-medium">{room.occupiedBeds}/{room.beds}</span>
        </div>
        <div>
          <span className="text-white/60">Floor:</span>
          <span className="ml-1 font-medium">{room.floor}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {room.amenities.slice(0, 4).map((amenity, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-charcoal-900/70 rounded">{amenity}</span>
        ))}
      </div>

      <div className="mt-3 text-sm">
        <span className="text-white/60">Rate:</span>
        <span className="ml-1 font-medium">{formatCurrency(room.ratePerDay)}/day</span>
      </div>
    </Card>
  );
};

// Staff Card
const StaffCard = ({ staff }) => {
  const statusColors = {
    "On Duty": "success",
    "Off Duty": "default",
    "On Leave": "warning",
    Training: "info",
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar src={staff.avatar} alt={staff.name} size="lg" status={staff.status === 'On Duty' ? 'online' : 'offline'} />
        <div className="flex-1">
          <h4 className="font-medium">{staff.name}</h4>
          <p className="text-sm text-white/60">{staff.role}</p>
          <Badge variant={statusColors[staff.status]} size="xs" className="mt-1">{staff.status}</Badge>
        </div>
      </div>

      <div className="mt-3 text-sm text-white/70 dark:text-white/50">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          <span>{staff.department}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-4 h-4" />
          <span>{staff.shift} Shift</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Performance</span>
          <span className="font-medium">{staff.performance.rating}/5</span>
        </div>
        <ProgressBar value={staff.performance.rating} max={5} color="green" />
      </div>
    </Card>
  );
};

// Article Card
const ArticleCard = ({ article, onRead }) => {
  return (
    <Card hover className="overflow-hidden">
      <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
          <Badge variant="info" size="xs">{article.category}</Badge>
          <span>•</span>
          <span>{article.readMinutes} min read</span>
        </div>
        <h3 className="font-semibold line-clamp-2">{article.title}</h3>
        <p className="text-sm text-white/70 dark:text-white/50 mt-2 line-clamp-2">{article.excerpt}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={article.authorAvatar} alt={article.author} size="xs" />
            <span className="text-sm text-white/60">{article.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes}</span>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => onRead(article)}>
          Read More <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

// Testimonial Card
const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar src={testimonial.avatar} alt={testimonial.name} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{testimonial.name}</h4>
            {testimonial.verified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-white/60">{testimonial.treatment}</p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-white/70 dark:text-white/50 italic">"{testimonial.quote}"</p>
      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>Treated by Dr. {testimonial.doctor}</span>
        <span>{testimonial.date}</span>
      </div>
      {testimonial.videoUrl && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => window.open(testimonial.videoUrl, '_blank')}
        >
          <PlayCircle className="w-4 h-4" /> Watch Video
        </Button>
      )}
    </Card>
  );
};

// Wellness Program Card
const WellnessProgramCard = ({ program, onEnroll }) => {
  const iconMap = {
    heart: '❤️',
    mind: '🧘',
    moon: '🌙',
    leaf: '🥬',
    shield: '🛡️'
  };
  const displayIcon = iconMap[program.icon] || program.icon || '🏥';
  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{displayIcon}</div>
        <div className="flex-1">
          <h4 className="font-medium">{program.name}</h4>
          <p className="text-sm text-white/60">{program.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-yellow-600">
          <Award className="w-4 h-4" />
          <span>{program.points} points</span>
        </div>
        <span className="text-white/60">{program.enrolled} enrolled</span>
      </div>
      <Button
        variant="primary"
        size="sm"
        className="mt-3 w-full"
        onClick={() => onEnroll(program)}
        disabled={program.joined}
      >
        {program.joined ? 'Enrolled' : 'Enroll Now'}
      </Button>
    </Card>
  );
};

// Challenge Card
const ChallengeCard = ({ challenge, onJoin }) => {
  const iconMap = {
    steps: '👟',
    water: '💧',
    sunrise: '🌅',
    sleep: '🛌',
    sugar: '🍬'
  };
  const displayIcon = iconMap[challenge.icon] || challenge.icon || '⚡';
  return (
    <Card className="p-4 border-2 border-dashed border-green-300 dark:border-green-700">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{displayIcon}</div>
        <div className="flex-1">
          <h4 className="font-medium">{challenge.name}</h4>
          <p className="text-sm text-white/60">{challenge.description}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-lg font-bold text-green-600">{challenge.points}</p>
          <p className="text-xs text-white/60">Points</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">{challenge.participants}</p>
          <p className="text-xs text-white/60">Participants</p>
        </div>
        <div>
          <p className="text-lg font-bold text-orange-600">{challenge.daysLeft}</p>
          <p className="text-xs text-white/60">Days Left</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onJoin(challenge)} disabled={challenge.joined}>
        <Zap className="w-4 h-4" /> {challenge.joined ? 'Joined' : 'Join Challenge'}
      </Button>
    </Card>
  );
};

// Leaderboard Component
const Leaderboard = ({ data }) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" /> Wellness Leaderboard
      </h3>
      <div className="space-y-3">
        {data.map((entry, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${i < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/20' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              i === 0 ? 'bg-accent-400/150 text-white' : 
              i === 1 ? 'bg-charcoal-900/80 text-white' : 
              i === 2 ? 'bg-accent-500/120 text-white' : 
              'bg-charcoal-900/70 bg-charcoal-900/70'
            }`}>
              {entry.rank}
            </div>
            <Avatar src={entry.avatar} alt={entry.name} size="sm" />
            <div className="flex-1">
              <p className="font-medium text-sm">{entry.name}</p>
              <p className="text-xs text-white/60">{entry.streak} day streak</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-white/60">{entry.badges} badges</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Vital Signs Widget
const VitalSignsWidget = ({ vitals }) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-red-500" /> Vital Signs
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-red-500/15 dark:bg-red-900/20 rounded-lg">
          <Heart className="w-6 h-6 text-red-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.heartRate}</p>
          <p className="text-xs text-white/60">Heart Rate (bpm)</p>
        </div>
        <div className="text-center p-3 bg-primary-400/15 dark:bg-blue-900/20 rounded-lg">
          <Activity className="w-6 h-6 text-blue-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.bloodPressure}</p>
          <p className="text-xs text-white/60">Blood Pressure</p>
        </div>
        <div className="text-center p-3 bg-primary-500/15 dark:bg-green-900/20 rounded-lg">
          <Thermometer className="w-6 h-6 text-green-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.temperature}°F</p>
          <p className="text-xs text-white/60">Temperature</p>
        </div>
        <div className="text-center p-3 bg-accent-400/12 dark:bg-purple-900/20 rounded-lg">
          <Wind className="w-6 h-6 text-purple-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.oxygenSaturation}%</p>
          <p className="text-xs text-white/60">SpO2</p>
        </div>
      </div>
    </Card>
  );
};

// Symptom Checker Component
const SymptomChecker = ({ onAnalyze, onEmergency }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' });

  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Fatigue", "Body Ache", "Nausea",
    "Vomiting", "Chest Pain", "Shortness of Breath", "Dizziness",
    "Stomach Pain", "Sore Throat", "Runny Nose", "Joint Pain", "Rash"
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyze = async () => {
    const analysis = analyzeSymptoms(selectedSymptoms);
    setResult(analysis);
    setSaveState({ status: 'saving', message: 'Saving analysis...' });
    let ok = true;
    try {
      if (onAnalyze) {
        ok = await onAnalyze({
          symptoms: selectedSymptoms,
          result: analysis?.condition || '',
          recommendation: analysis?.recommendation || ''
        });
      } else {
        await apiRequest('/api/engagements/symptom-checks', {
          method: 'POST',
          body: JSON.stringify({
            symptoms: selectedSymptoms,
            result: analysis?.condition || '',
            recommendation: analysis?.recommendation || ''
          })
        });
      }
    } catch (error) {
      ok = false;
      setDebugLog(prev => [
        {
          ts: new Date().toISOString(),
          action: 'symptom-checks',
          error: error?.message || String(error)
        },
        ...prev
      ].slice(0, 5));
    }
    if (ok) {
      toast.success('Analysis saved');
      setSaveState({ status: 'saved', message: 'Analysis saved to your health record.' });
    } else {
      toast.error('Unable to save analysis. Please try again.');
      setSaveState({ status: 'error', message: 'Save failed. Please try again.' });
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-green-500" /> AI Symptom Checker
      </h3>
      
      <p className="text-sm text-white/60 mb-3">Select your symptoms for AI-powered analysis</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {commonSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedSymptoms.includes(symptom)
                ? 'bg-primary-500/40 text-white'
                : 'bg-charcoal-900/70 hover:bg-charcoal-900/70 dark:hover:bg-charcoal-900/70'
            }`}
          >
            {symptom}
          </button>
        ))}
      </div>

      <Button 
        variant="primary" 
        className="w-full" 
        disabled={selectedSymptoms.length === 0}
        onClick={analyze}
      >
        <Brain className="w-4 h-4" /> Analyze Symptoms
      </Button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.urgency === 'High' ? 'bg-red-500/15 dark:bg-red-900/20 border border-red-500/30' :
          result.urgency === 'Medium' ? 'bg-accent-400/15 dark:bg-yellow-900/20 border border-accent-400/30' :
          'bg-primary-500/15 dark:bg-green-900/20 border border-primary-400/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {result.urgency === 'High' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
             result.urgency === 'Medium' ? <AlertCircle className="w-5 h-5 text-yellow-500" /> :
             <CheckCircle className="w-5 h-5 text-green-500" />}
            <span className="font-medium">{result.condition}</span>
          </div>
          <p className="text-sm text-white/70 dark:text-white/50">{result.recommendation}</p>
          {result.urgency === 'High' && (
            <Button variant="danger" size="sm" className="mt-3" onClick={() => onEmergency?.()}>
              <Phone className="w-4 h-4" /> Contact Emergency
            </Button>
          )}
        </div>
      )}
      {saveState.status !== 'idle' && (
        <p className={`mt-3 text-xs ${
          saveState.status === 'saved' ? 'text-emerald-400' :
          saveState.status === 'error' ? 'text-red-400' :
          'text-white/60'
        }`}>
          {saveState.message}
        </p>
      )}
    </Card>
  );
};

// Mood Tracker Component
const MoodTracker = ({ onLogMood }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [saveState, setSaveState] = useState({ status: 'idle', message: '' });
  const [moodHistory, setMoodHistory] = useState([
    { date: '2024-01-15', mood: 'happy', note: 'Great day!' },
    { date: '2024-01-14', mood: 'neutral', note: 'Normal day' },
    { date: '2024-01-13', mood: 'stressed', note: 'Work pressure' },
  ]);

  const moods = [
    { key: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-600' },
    { key: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-charcoal-900/60 text-white/70' },
    { key: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-600' },
    { key: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 text-yellow-600' },
    { key: 'stressed', emoji: '😤', label: 'Stressed', color: 'bg-red-100 text-red-600' },
  ];

  const logMood = async () => {
    if (!selectedMood) return;
    setMoodHistory(prev => [
      { date: new Date().toISOString().slice(0, 10), mood: selectedMood, note: '' },
      ...prev
    ]);
    setSaveState({ status: 'saving', message: 'Saving mood...' });
    let ok = true;
    try {
      if (onLogMood) {
        const moodMeta = moods.find((m) => m.key === selectedMood);
        ok = await onLogMood({ mood: selectedMood, label: moodMeta?.label || selectedMood });
      } else {
        await apiRequest('/api/engagements/mood-logs', {
          method: 'POST',
          body: JSON.stringify({
            mood: selectedMood,
            label: moods.find((m) => m.key === selectedMood)?.label || selectedMood
          })
        });
      }
    } catch (error) {
      ok = false;
      setDebugLog(prev => [
        {
          ts: new Date().toISOString(),
          action: 'mood-logs',
          error: error?.message || String(error)
        },
        ...prev
      ].slice(0, 5));
    }
    if (ok) {
      toast.success('Mood saved');
      setSaveState({ status: 'saved', message: 'Mood logged to your wellness timeline.' });
    } else {
      toast.error('Unable to save mood. Please try again.');
      setSaveState({ status: 'error', message: 'Save failed. Please try again.' });
    }
    setSelectedMood(null);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-yellow-500" /> Mood Tracker
      </h3>

      <p className="text-sm text-white/60 mb-3">How are you feeling today?</p>

      <div className="flex justify-between mb-4">
        {moods.map((mood) => (
          <button
            key={mood.key}
            onClick={() => setSelectedMood(mood.key)}
            className={`p-3 rounded-xl transition-all ${
              selectedMood === mood.key 
                ? `${mood.color} ring-2 ring-offset-2 ring-current` 
                : 'hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>

      <Button 
        variant="primary" 
        className="w-full" 
        disabled={!selectedMood}
        onClick={logMood}
      >
        Log Mood
      </Button>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Recent Moods</h4>
        <div className="space-y-2">
          {moodHistory.slice(0, 5).map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-sm p-2 bg-charcoal-950 bg-charcoal-950 rounded">
              <span>{moods.find(m => m.key === entry.mood)?.emoji} {entry.date}</span>
              <span className="text-white/60">{entry.note}</span>
            </div>
          ))}
        </div>
      </div>
      {saveState.status !== 'idle' && (
        <p className={`mt-3 text-xs ${
          saveState.status === 'saved' ? 'text-emerald-400' :
          saveState.status === 'error' ? 'text-red-400' :
          'text-white/60'
        }`}>
          {saveState.message}
        </p>
      )}
    </Card>
  );
};

// Medication Reminder Component
const MedicationReminder = ({ medications, onAdd, onToggle }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (!Array.isArray(medications) || medications.length === 0) {
      setReminders([]);
      return;
    }

    const seeded = medications.map((med, index) => ({
      id: med.id || med._id || `med-${index}`,
      name: med.name || 'Medication',
      time: med.frequency || med.dosage || 'As prescribed',
      taken: false
    }));

    setReminders(seeded);
  }, [medications]);

  const toggleTaken = (id) => {
    const entry = reminders.find((r) => r.id === id);
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, taken: !r.taken } : r
    ));
    toast.success('Medication status updated');
    if (onToggle && entry) {
      onToggle({
        reminderId: entry.id,
        name: entry.name,
        taken: !entry.taken
      });
    }
  };

  const progress = (reminders.filter(r => r.taken).length / reminders.length) * 100;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Pill className="w-5 h-5 text-purple-500" /> Today's Medications
        </h3>
        <DonutChart value={progress} size={50} strokeWidth={5} color="#8B5CF6" />
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div 
            key={reminder.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              reminder.taken ? 'bg-primary-500/15 dark:bg-green-900/20 border-primary-400/30' : 'border-white/10 border-white/10'
            }`}
          >
            <button 
              onClick={() => toggleTaken(reminder.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                reminder.taken ? 'bg-primary-500/40 border-green-500 text-white' : 'border-white/20'
              }`}
            >
              {reminder.taken && <CheckCircle className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <p className={`font-medium ${reminder.taken ? 'line-through text-white/50' : ''}`}>{reminder.name}</p>
              <p className="text-sm text-white/60">{reminder.time}</p>
            </div>
            <Bell className="w-4 h-4 text-white/50" />
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onAdd}>
        <Plus className="w-4 h-4" /> Add Medication
      </Button>
    </Card>
  );
};

// Chat Interface Component
const ChatInterface = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 I'm your Medicore AI assistant. How can I help you today?", time: new Date() }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef(null);
  const speechRecRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { from: "user", text, time: new Date() }]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm sorry, I didn't understand that. Could you please rephrase?";
      const lower = text.toLowerCase();

      if (lower.includes("book") || lower.includes("appointment")) {
        response = "I can help you book an appointment! Please tell me:\n1. Which specialty?\n2. Preferred date and time?\n3. Any specific doctor?";
      } else if (lower.includes("doctor") || lower.includes("find")) {
        response = "I can help you find a doctor. What specialty are you looking for? We have Cardiology, Neurology, Pediatrics, and more.";
      } else if (lower.includes("emergency") || lower.includes("urgent")) {
        response = "⚠️ For emergencies, please call 1122 or go to the nearest ER. Should I provide directions to our Emergency Department?";
      } else if (lower.includes("symptom") || lower.includes("feel")) {
        response = "I can help assess your symptoms. Please describe what you're experiencing, or use our Symptom Checker tool for a detailed analysis.";
      } else if (lower.includes("lab") || lower.includes("result")) {
        response = "Your lab results can be viewed in the 'Lab Results' section. Would you like me to guide you there?";
      } else if (lower.includes("prescription") || lower.includes("medication")) {
        response = "For prescription refills, please visit our Pharmacy section or I can connect you with your doctor. What medication do you need?";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        response = "Hello! How can I assist you today? I can help with appointments, finding doctors, lab results, and more.";
      } else if (lower.includes("thank")) {
        response = "You're welcome! Is there anything else I can help you with?";
      }

      setMessages(prev => [...prev, { from: "bot", text: response, time: new Date() }]);
      setIsTyping(false);
      ttsSpeak(response);
    }, 1000 + Math.random() * 1000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      speechRecRef.current?.stop();
      setIsListening(false);
      return;
    }

    const sr = new SpeechRecognition();
    sr.continuous = false;
    sr.interimResults = false;
    sr.lang = 'en-US';

    sr.onstart = () => setIsListening(true);
    sr.onend = () => setIsListening(false);
    sr.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInputText(text);
    };
    sr.onerror = () => {
      toast.error("Speech recognition error");
      setIsListening(false);
    };

    sr.start();
    speechRecRef.current = sr;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-charcoal-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-charcoal-900/70 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Medicore Assistant</h3>
              <p className="text-xs text-white/80">AI-Powered Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-charcoal-900/70 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.from === 'user' 
                ? 'bg-green-600 text-white rounded-br-sm' 
                : 'bg-charcoal-900/70 rounded-bl-sm'
            }`}>
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/70' : 'text-white/50'}`}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-charcoal-900/70 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-charcoal-900/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-charcoal-900/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-charcoal-900/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Book Appointment', 'Find Doctor', 'Lab Results', 'Emergency'].map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="px-3 py-1 bg-charcoal-900/70 rounded-full text-xs whitespace-nowrap hover:bg-charcoal-900/70 dark:hover:bg-charcoal-900/70"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-2">
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2 rounded-lg ${isListening ? 'bg-red-500/40 text-white animate-pulse' : 'bg-charcoal-900/70'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-charcoal-900/70 rounded-lg outline-none"
          />
          <Button type="submit" variant="primary" disabled={!inputText.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// Video Call Component
const VideoCallInterface = ({ isOpen, onClose, doctor }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950">
      {/* Main Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] bg-charcoal-950 rounded-lg overflow-hidden">
          <img 
            src={doctor?.avatar || "https://i.pravatar.cc/800"} 
            alt="Doctor" 
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-charcoal-950 flex items-center justify-center">
              <VideoOff className="w-20 h-20 text-white/70" />
            </div>
          )}
        </div>
      </div>

      {/* Self Video */}
      <div className="absolute bottom-24 right-6 w-48 h-36 bg-charcoal-950 rounded-lg overflow-hidden shadow-lg">
        <img 
          src="https://i.pravatar.cc/200?img=5" 
          alt="You" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={doctor?.avatar} alt={doctor?.name || 'Doctor'} size="md" />
            <div className="text-white">
              <h3 className="font-semibold">{doctor?.name || 'Dr. Smith'}</h3>
              <p className="text-sm text-white/70">{doctor?.specialty || 'Cardiology'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            <div className="px-3 py-1 bg-red-500/40 rounded-full text-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full ${isMuted ? 'bg-red-500/40' : 'bg-charcoal-900/70 hover:bg-charcoal-900/70'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500/40' : 'bg-charcoal-900/70 hover:bg-charcoal-900/70'}`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full ${isScreenSharing ? 'bg-primary-500/40' : 'bg-charcoal-900/70 hover:bg-charcoal-900/70'}`}
          >
            <Monitor className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          >
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Panel Component
const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, removeNotification, clearAll } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-charcoal-950 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={clearAll} className="text-sm text-white/60 hover:text-white">
          Clear all
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <Bell className="w-12 h-12 mx-auto mb-2 text-white/30" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-white/10 hover:bg-charcoal-900/60 hover:bg-charcoal-900/60 cursor-pointer ${
                !notification.read ? 'bg-primary-400/15 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  notification.type === 'danger' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                   notification.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   notification.type === 'danger' ? <XCircle className="w-4 h-4" /> :
                   <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-white/60 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                  className="text-white/50 hover:text-white/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Search Results Component
const SearchResults = ({ results, onClose }) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-charcoal-950 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
      <div className="p-2">
        {results.map((result, i) => (
          <div
            key={i}
            className="p-3 hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70 rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                result.type === 'doctor' ? 'bg-green-100 text-green-600' :
                result.type === 'service' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {result.type === 'doctor' ? <User className="w-4 h-4" /> :
                 result.type === 'service' ? <Briefcase className="w-4 h-4" /> :
                 <FileText className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-medium text-sm">{result.title}</p>
                <p className="text-xs text-white/60">{result.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sign Language Avatar Placeholder
const SignLanguageAvatar = ({ text }) => {
  return (
    <div className="fixed bottom-6 left-6 z-40 bg-charcoal-950 rounded-xl shadow-lg p-4 w-48">
      <div className="aspect-square bg-charcoal-900/70 rounded-lg flex items-center justify-center mb-2">
        <Hand className="w-16 h-16 text-white/50 animate-pulse" />
      </div>
      <p className="text-xs text-center text-white/60">Sign Language Interpreter</p>
    </div>
  );
};

// Wearable Data Widget
const WearableDataWidget = () => {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Apple Watch', type: 'smartwatch', connected: true, battery: 75, lastSync: '2 mins ago' },
    { id: 2, name: 'Fitbit Sense', type: 'fitness', connected: true, battery: 45, lastSync: '5 mins ago' },
    { id: 3, name: 'Glucose Monitor', type: 'medical', connected: false, battery: 90, lastSync: '1 hour ago' },
  ]);

  const [liveData, setLiveData] = useState({
    steps: 8432,
    calories: 1856,
    distance: 6.2,
    activeMinutes: 45,
    heartRate: 72,
    sleepHours: 7.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 10),
        heartRate: 70 + Math.floor(Math.random() * 10),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Watch className="w-5 h-5 text-blue-500" /> Connected Devices
      </h3>

      <div className="space-y-3 mb-4">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center gap-3 p-2 bg-charcoal-950 bg-charcoal-950 rounded-lg">
            <div className={`p-2 rounded-lg ${device.connected ? 'bg-green-100 text-green-600' : 'bg-charcoal-900/60 text-white/50'}`}>
              {device.type === 'smartwatch' ? <Watch className="w-4 h-4" /> :
               device.type === 'fitness' ? <Activity className="w-4 h-4" /> :
               <Thermometer className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{device.name}</p>
              <p className="text-xs text-white/60">{device.lastSync}</p>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-white/50" />
              <span className="text-xs">{device.battery}%</span>
              <div className={`w-2 h-2 rounded-full ${device.connected ? 'bg-primary-500/40' : 'bg-charcoal-900/80'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-primary-400/15 dark:bg-blue-900/20 rounded-lg text-center">
          <Footprints className="w-5 h-5 text-blue-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.steps.toLocaleString()}</p>
          <p className="text-xs text-white/60">Steps</p>
        </div>
        <div className="p-3 bg-accent-500/12 dark:bg-orange-900/20 rounded-lg text-center">
          <Zap className="w-5 h-5 text-orange-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.calories}</p>
          <p className="text-xs text-white/60">Calories</p>
        </div>
        <div className="p-3 bg-primary-500/15 dark:bg-green-900/20 rounded-lg text-center">
          <MapPin className="w-5 h-5 text-green-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.distance} km</p>
          <p className="text-xs text-white/60">Distance</p>
        </div>
        <div className="p-3 bg-accent-400/12 dark:bg-purple-900/20 rounded-lg text-center">
          <Moon className="w-5 h-5 text-purple-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.sleepHours}h</p>
          <p className="text-xs text-white/60">Sleep</p>
        </div>
      </div>
    </Card>
  );
};

// Insurance Card Component
const InsuranceCard = ({ insurance, onView }) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{insurance.logo}</div>
        <Badge className="bg-charcoal-900/70 text-white">{insurance.coverage} Coverage</Badge>
      </div>
      <h3 className="font-semibold text-lg">{insurance.name}</h3>
      <p className="text-sm text-white/70 mt-1">{insurance.network}</p>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          className="bg-charcoal-900/70 hover:bg-charcoal-900/80 text-white border-0"
          onClick={() => onView?.(insurance)}
        >
          View Details
        </Button>
        <Shield className="w-8 h-8 text-white/50" />
      </div>
    </Card>
  );
};

// Emergency Services Widget
const EmergencyServicesWidget = ({ services = [] }) => {

  return (
    <Card className="p-4 border-2 border-red-500/30 dark:border-red-800">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-600">
        <AlertTriangle className="w-5 h-5" /> Emergency Services
      </h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex items-center gap-3 p-2 bg-red-500/15 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl">{service.icon}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-white/60">
                {service.responseTime ? `Response: ${service.responseTime}` : 
                 service.units ? `${service.units} units available` :
                 service.beds ? `${service.beds} beds` : ''}
              </p>
            </div>
            {service.number && (
              <Button variant="danger" size="xs">
                <Phone className="w-3 h-3" /> {service.number}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Research Studies Widget
const ResearchStudiesWidget = ({ studies = [] }) => {

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Microscope className="w-5 h-5 text-purple-500" /> Clinical Research
      </h3>
      <div className="space-y-3">
        {studies.map((study) => (
          <div key={study.id} className="p-3 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{study.title}</h4>
                <Badge variant={study.status === 'Recruiting' ? 'success' : study.status === 'Active' ? 'info' : 'default'} size="xs" className="mt-1">
                  {study.status}
                </Badge>
              </div>
            </div>
            <div className="mt-2">
              <ProgressBar value={study.participants} max={study.target} color="purple" />
              <p className="text-xs text-white/60 mt-1">{study.participants}/{study.target} participants</p>
            </div>
            {study.status === 'Recruiting' && (
              <Button variant="outline" size="xs" className="mt-2">
                Learn More
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Hospital Map Component
const HospitalMap = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold flex items-center gap-2">
          <Map className="w-5 h-5 text-green-500" /> Hospital Navigation
        </h3>
      </div>
      <div className="relative">
        <iframe
          title="Hospital Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.123456789!2d67.0123456!3d24.8765432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUyJzM1LjYiTiA2N8KwMDAnNDQuNCJF!5e0!3m2!1sen!2s!4v1234567890"
          className="w-full h-64 border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-4 left-4 right-4 bg-charcoal-950/90 bg-charcoal-950/90 backdrop-blur rounded-lg p-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-sm">Medicore Hospital</p>
              <p className="text-xs text-white/60">Stadium Road, Karachi, Pakistan</p>
            </div>
            <Button variant="primary" size="sm" className="ml-auto">
              Directions
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Compliance Badges Component
const ComplianceBadges = () => {
  const badges = [
    { name: 'ISO 9001', icon: '🏅', description: 'Quality Management' },
    { name: 'NABH', icon: '🏥', description: 'National Accreditation' },
    { name: 'JCI', icon: '🌍', description: 'International Standard' },
    { name: 'HIPAA', icon: '🔒', description: 'Data Protection' },
    { name: 'GDPR', icon: '🇪🇺', description: 'EU Compliance' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((badge, i) => (
        <Tooltip key={i} content={badge.description}>
          <div className="flex items-center gap-2 px-3 py-2 bg-charcoal-950 rounded-lg shadow-sm border border-white/10">
            <span className="text-xl">{badge.icon}</span>
            <span className="text-sm font-medium">{badge.name}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

// ==================== MAIN HOME COMPONENT ====================

export default function Hero() {
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [medications, setMedications] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [wellnessPrograms, setWellnessPrograms] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [researchStudies, setResearchStudies] = useState([]);
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [engagementStats, setEngagementStats] = useState({
    favorites: 0,
    articleReads: 0,
    wellnessEnrollments: 0,
    challengeJoins: 0,
    medicationRefills: 0,
    moodLogs: 0,
    symptomChecks: 0,
    reminderLogs: 0,
    insuranceViews: 0
  });
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const lastToastRef = useRef(0);
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: '' });
  const [debugLog, setDebugLog] = useState([]);

  const serviceIconMap = {
    Heart: '❤️',
    Brain: '🧠',
    Baby: '👶',
    Stethoscope: '🩺',
    Activity: '📈',
    ShieldCheck: '🛡️'
  };
  const serviceColors = ['red', 'purple', 'pink', 'green', 'orange', 'indigo', 'yellow', 'teal', 'cyan', 'lime'];
  const serviceCards = (services?.length ? services : defaultServices).map((service, index) => {
    if (service.key) return service;
    return {
      key: service.id || service.title || `service-${index}`,
      title: service.title || 'Service',
      desc: service.description || service.desc || '',
      icon: serviceIconMap[service.icon] || service.icon || '🏥',
      color: serviceColors[index % serviceColors.length]
    };
  });
  // State
  const [dark, setDark] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('base');
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  
  // UI State
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Live Stats
  const [liveStats, setLiveStats] = useState({
    beds: 0,
    doctorsOnline: 0,
    erWait: 0,
    surgeries: 0,
    alerts: 0,
    patientsToday: 0,
    appointmentsToday: 0,
    labTestsCompleted: 0,
  });

  // Booking Slots
  const [slots, setSlots] = useState([]);

  // Natural Language Booking
  const [nlInput, setNlInput] = useState('');
  const [nlParse, setNlParse] = useState(null);

  // Predictive Insights
  const [insights, setInsights] = useState({
    erWaitForecast: [],
    bedOccupancyTrend: [],
    readmissionRisk: 0,
    surgeryVolume: [],
  });
  const erWaitForecast = insights.erWaitForecast.length ? insights.erWaitForecast : [0];
  const bedOccupancyTrend = insights.bedOccupancyTrend.length ? insights.bedOccupancyTrend : [0];
  const surgeryVolume = insights.surgeryVolume.length ? insights.surgeryVolume : [0];
  const featuredDoctor = doctors[0];
  const safeDoc = featuredDoctor || {
    name: 'Loading...',
    specialty: 'General',
    rating: 0,
    years: 0,
    reviewCount: 0,
    consultationFee: 0,
    avatar: ''
  };

  // Sample Vitals
  const [vitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: '98.6',
    oxygenSaturation: 98,
    weight: 75,
    height: 175,
  });

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Speech Recognition Ref
  const speechRecRef = useRef(null);
  const lastUiLogRef = useRef(0);
  const lastSearchLogRef = useRef(0);

  const logUiEvent = useCallback(async (payload = {}) => {
    const body = {
      action: payload.action || 'ui_click',
      resource: payload.resource || 'ui',
      description: payload.description || 'UI interaction',
      details: payload.details || {},
      severity: payload.severity || 'low',
      status: payload.status || 'success'
    };

    try {
      await apiRequest('/api/activity/public', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    } catch (error) {
      // Never block UI on logging
    }
  }, []);

  const postEngagement = useCallback(async (endpoint, payload) => {
    try {
      await apiRequest(`/api/engagements/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      // Never block UI on engagement logging
      return false;
    }
  }, []);

  const bumpEngagement = useCallback((key, by = 1) => {
    setEngagementStats((prev) => ({ ...prev, [key]: (prev?.[key] || 0) + by }));
  }, []);

  const showPremiumToast = useCallback((message, variant = 'info') => {
    toast.custom((t) => (
      <div
        className={`px-4 py-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl ${
          variant === 'success'
            ? 'bg-emerald-500/15 text-white'
            : variant === 'warning'
            ? 'bg-amber-500/15 text-white'
            : variant === 'danger'
            ? 'bg-red-500/15 text-white'
            : 'bg-charcoal-900/80 text-white'
        }`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    ), { duration: 1600 });
  }, []);

  const handleUiClickCapture = useCallback((event) => {
    const target = event.target?.closest?.('button, a, [role="button"]');
    if (!target) return;

    const now = Date.now();
    if (now - lastUiLogRef.current < 200) return;
    lastUiLogRef.current = now;

    const label =
      target.getAttribute('data-track') ||
      target.getAttribute('aria-label') ||
      target.getAttribute('title') ||
      (target.innerText || '').trim().slice(0, 80) ||
      'button';

    logUiEvent({
      action: 'ui_click',
      resource: 'ui',
      description: `Clicked ${label}`,
      details: {
        label,
        id: target.id || null,
        href: target.getAttribute('href') || null,
        role: target.getAttribute('role') || null,
        section: target.closest('section')?.getAttribute('id') || null,
        page: 'home'
      }
    });

    if (now - lastToastRef.current > 900) {
      lastToastRef.current = now;
      showPremiumToast(`${label} updated`, 'success');
    }
  }, [logUiEvent]);

  // Effects
  useEffect(() => {
    const loadHome = async () => {
      try {
        const [home, directory] = await Promise.all([
          apiRequest('/api/public/home'),
          apiRequest('/api/public/doctors-directory')
        ]);

        const normalizedDoctors = normalizeDoctors(directory || []);
        setDoctors(normalizedDoctors);
        setServices(home?.services || []);
        setArticles(home?.articles || []);
        setTestimonials(home?.testimonials || []);
        setInsuranceProviders(home?.insuranceProviders || []);
        setWellnessPrograms(home?.wellnessPrograms || []);
        setChallenges(home?.challenges || []);
        setLeaderboard(home?.leaderboard || []);
        setResearchStudies(home?.researchStudies || []);
        setEmergencyServices(home?.emergencyServices || []);
        setPatients(home?.patients || []);
        setAppointments(home?.appointments || []);
        setLabResults(home?.labResults || []);
        setMedications(home?.medications || []);
        setEquipment(home?.equipment || []);
        setRooms(home?.rooms || []);
        setStaff(home?.staff || []);

        const stats = home?.liveStats || {};
        setLiveStats({
          beds: stats.beds ?? 0,
          doctorsOnline: stats.doctors ?? 0,
          erWait: stats.erWait ?? 0,
          surgeries: stats.surgeries ?? 0,
          alerts: stats.alerts ?? 0,
          patientsToday: stats.patientsToday ?? 0,
          appointmentsToday: stats.appointmentsToday ?? 0,
          labTestsCompleted: stats.labTestsCompleted ?? 0,
        });

        const insightData = home?.insights || {};
        setInsights({
          erWaitForecast: insightData.erWaitForecast || [],
          bedOccupancyTrend: insightData.bedOccupancyTrend || [],
          readmissionRisk: insightData.readmissionRisk ?? 0,
          surgeryVolume: insightData.surgeryVolume || [],
        });

        const derivedSlots = buildSlotsFromDoctors(normalizedDoctors);
        if (derivedSlots.length) {
          setSlots(derivedSlots);
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };

    loadHome();
  }, []);

  useEffect(() => {
    const loadEngagements = async () => {
      try {
        const stats = await apiRequest('/api/engagements/stats');
        setEngagementStats(stats || {});
      } catch (error) {
        // Non-blocking
      }
    };
    loadEngagements();
  }, []);

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:5000'
    );

    socket.on('engagementUpdate', (payload = {}) => {
      if (!payload?.key) return;
      bumpEngagement(payload.key, payload.delta || 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [bumpEngagement]);

  useEffect(() => {
    logUiEvent({
      action: 'page_view',
      resource: 'navigation',
      description: 'Viewed home page',
      details: { page: 'home' }
    });
  }, [logUiEvent]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    apiRequest('/api/notifications', {}, token)
      .then((items) => {
        if (Array.isArray(items)) {
          const mapped = items.map((item) => ({
            id: item._id || item.id,
            text: item.title || item.description || 'Notification',
            type: item.type || 'info',
            read: item.read || false,
            timestamp: item.createdAt ? new Date(item.createdAt) : new Date()
          }));
          setNotifications(mapped);
        }
      })
      .catch((error) => {
        console.error('Failed to load notifications:', error);
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setPoints(parsed?.points || 0);
    } catch (error) {
      console.error('Failed to read stored user:', error);
    }
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handler = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'b' && e.altKey) {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Functions
  const runSearch = (q) => {
    setSearchQ(q);
    if (!q) return setSearchResults([]);

    const now = Date.now();
    if (q.length >= 3 && now - lastSearchLogRef.current > 1500) {
      lastSearchLogRef.current = now;
      logUiEvent({
        action: 'search',
        resource: 'search',
        description: 'Search query',
        details: { query: q, page: 'home' }
      });
    }
    
    const ql = q.toLowerCase();
    const res = [];
    
    // Search doctors
    const matchedDoctors = doctors.filter(d => 
      d.name.toLowerCase().includes(ql) || 
      d.specialty.toLowerCase().includes(ql)
    ).slice(0, 3);
    matchedDoctors.forEach(d => {
      res.push({ type: 'doctor', title: d.name, hint: d.specialty });
    });
    
    // Search services
    serviceCards.filter(s =>
      s.title.toLowerCase().includes(ql) ||
      s.desc.toLowerCase().includes(ql)
    ).slice(0, 2).forEach(s => {
      res.push({ type: 'service', title: s.title, hint: s.desc });
    });
    
    // Search articles
    articles.filter(a => 
      a.title.toLowerCase().includes(ql) || 
      a.category.toLowerCase().includes(ql)
    ).slice(0, 2).forEach(a => {
      res.push({ type: 'article', title: a.title, hint: a.category });
    });
    
    if (res.length === 0) {
      res.push({ type: 'article', title: 'No results found', hint: 'Try different keywords' });
    }
    
    setSearchResults(res);
  };

  const startSpeechSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported');
      return;
    }
    
    if (speechRecRef.current) {
      speechRecRef.current.stop();
      speechRecRef.current = null;
      return;
    }
    
    const sr = new SpeechRecognition();
    sr.continuous = false;
    sr.lang = lang === 'en' ? 'en-US' : lang === 'ur' ? 'ur-PK' : lang === 'ar' ? 'ar-SA' : 'zh-CN';
    sr.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setSearchQ(t);
      runSearch(t);
    };
    sr.onerror = () => toast.error('Speech recognition error');
    sr.start();
    speechRecRef.current = sr;
    toast('Listening...');
  };

  const handleParseNL = () => {
    const parsed = parseNaturalBooking(nlInput);
    setNlParse(parsed);
    toast.success('Parsed booking intent');
  };

  const handleConfirmBooking = () => {
    if (!slots.length) {
      toast.error('No slots available');
      return;
    }
    bookSlot(slots[0], {
      reason: nlInput,
      type: nlParse?.telemedicine ? 'Telemedicine' : 'In-Person'
    });
  };

  const bookSlot = async (slot, options = {}) => {
    if (!slot?.free) {
      toast.error('Slot already booked');
      return;
    }

    if (!user?.name || !user?.email) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    const doctor = selectedDoctor || featuredDoctor;
    if (!doctor) {
      toast.error('No doctor available for booking');
      return;
    }

    const slotValue = slot.iso || slot.datetime || (slot.date ? `${slot.date}T${slot.time}` : slot.time);

    const payload = {
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialty || doctor.specialization || 'General',
        experience: doctor.years || doctor.experience || 0,
        rating: doctor.rating || 0,
        fee: doctor.consultationFee || doctor.fees || 0,
        languages: doctor.languages || [],
        clinic: doctor.hospital || doctor.clinic || ''
      },
      slot: slotValue || slot,
      type: options.type || (nlParse?.telemedicine ? 'Telemedicine' : 'In-Person'),
      patient: {
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      },
      reason: options.reason || nlInput || 'General consultation',
      insurance: options.insurance || {},
      fee: doctor.consultationFee || doctor.fees || 500
    };

    try {
      await apiRequest('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setSlots((prev) => prev.map((sl) => (sl.id === slot.id ? { ...sl, free: false } : sl)));
      toast.success(`Booked appointment at ${slot.time || 'selected slot'}`);
      setPoints((p) => p + 5);
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    setUser(null);
    setPoints(0);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
  };

  const handleBookDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    toast.success(`Selected ${doctor.name} for booking`);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor);
    toast.success(`Viewing ${doctor.name}'s profile`);
  };

  const handleStartVideoCall = (doctor) => {
    setSelectedDoctor(doctor);
    setVideoCallOpen(true);
  };

  const handleEnrollWellness = (program) => {
    setPoints(p => p + 10);
    setWellnessPrograms((prev) =>
      prev.map((p) =>
        (p.id === program.id || p._id === program._id)
          ? { ...p, enrolled: (p.enrolled || 0) + 1, joined: true }
          : p
      )
    );
    showPremiumToast(`Enrolled in ${program.name}! +10 points`, 'success');
    postEngagement('wellness-enrollments', {
      programId: program.id || program._id || '',
      programName: program.name || program.title || ''
    });
    bumpEngagement('wellnessEnrollments', 1);
  };

  const handleJoinChallenge = (challenge) => {
    setPoints(p => p + 5);
    setChallenges((prev) =>
      prev.map((c) =>
        (c.id === challenge.id || c._id === challenge._id)
          ? { ...c, participants: (c.participants || 0) + 1, joined: true }
          : c
      )
    );
    showPremiumToast(`Joined ${challenge.name}! +5 points`, 'success');
    postEngagement('challenge-joins', {
      challengeId: challenge.id || challenge._id || '',
      challengeName: challenge.name || challenge.title || ''
    });
    bumpEngagement('challengeJoins', 1);
  };

  const handleRefillMedication = (medication) => {
    showPremiumToast(`Refill request sent for ${medication.name}`, 'success');
    postEngagement('medication-refills', {
      medicationId: medication.id || medication._id || '',
      medicationName: medication.name || '',
      dosage: medication.dosage || '',
      form: medication.form || ''
    });
    bumpEngagement('medicationRefills', 1);
  };

  const handleReadArticle = (article) => {
    setPoints(p => p + 2);
    showPremiumToast(`Reading: ${article.title} +2 points`, 'success');
    postEngagement('article-reads', {
      articleId: article.id || article._id || '',
      title: article.title || '',
      category: article.category || ''
    });
    bumpEngagement('articleReads', 1);
  };

  const handleSymptomAnalyze = async (payload) => {
    const ok = await postEngagement('symptom-checks', payload);
    if (ok) {
      bumpEngagement('symptomChecks', 1);
      showPremiumToast('Symptom analysis saved', 'success');
      return true;
    } else {
      showPremiumToast('Symptom analysis failed to save', 'warning');
      return false;
    }
  };

  const handleMoodLog = async (payload) => {
    const ok = await postEngagement('mood-logs', payload);
    if (ok) {
      bumpEngagement('moodLogs', 1);
      showPremiumToast('Mood logged to your wellness timeline', 'success');
      return true;
    } else {
      showPremiumToast('Mood log failed to save', 'warning');
      return false;
    }
  };

  const handleReminderToggle = (payload) => {
    postEngagement('reminder-logs', payload);
    bumpEngagement('reminderLogs', 1);
    showPremiumToast('Medication reminder updated', 'success');
  };

  const handleFavoriteDoctor = (doctor) => {
    const key = "favoriteDoctors";
    const entry = {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      avatar: doctor.avatar
    };
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (existing.some((item) => item.id === doctor.id)) {
        toast("Already in favorites");
        return;
      }
      localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 25)));
      showPremiumToast("Added to favorites", 'success');
    } catch {
      localStorage.setItem(key, JSON.stringify([entry]));
      showPremiumToast("Added to favorites", 'success');
    }
    postEngagement('favorites', {
      doctorId: doctor.id || doctor._id || '',
      doctorName: doctor.name || '',
      specialty: doctor.specialty || ''
    });
    bumpEngagement('favorites', 1);
  };

  const handleAddMedication = () => {
    navigate('/pharmacy');
  };

  const handleInsuranceView = (insurance) => {
    setSelectedInsurance(insurance);
    setInsuranceOpen(true);
    postEngagement('insurance-views', {
      insuranceId: insurance.id || insurance._id || '',
      name: insurance.name || '',
      network: insurance.network || '',
      coverage: insurance.coverage || ''
    });
    bumpEngagement('insuranceViews', 1);
    showPremiumToast(`${insurance.name} details opened`, 'success');
  };

  const openInfoModal = (title, body) => {
    setInfoModal({ open: true, title, body });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), timestamp: new Date(), read: false },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Font size classes
  const fontSizeClasses = {
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // High contrast classes
  const contrastClasses = highContrast 
    ? 'contrast-125 saturate-150' 
    : '';

  // RTL support for Arabic and Urdu
  const isRTL = lang === 'ar' || lang === 'ur';

  // Translation helper
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  // ==================== RENDER ====================
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <div 
              className={`min-h-screen dark ${fontSizeClasses[fontSize]} ${contrastClasses}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="bg-charcoal-950 text-white min-h-screen" onClickCapture={handleUiClickCapture}>
                <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />

                {/* ==================== HEADER ==================== */}
                <header className="sticky top-0 z-40 backdrop-blur-lg bg-charcoal-950/80 border-b border-white/10">
                  <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      {/* Logo */}
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-accent-500 to-primary-700 text-charcoal-950 p-2.5 rounded-xl shadow-lg border border-accent-300/50">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h1 className="font-bold text-xl bg-gradient-to-r from-accent-300 to-white bg-clip-text text-transparent font-display">
                            Medicore Hospital
                          </h1>
                          <p className="text-xs text-white/60">
                            24/7 Emergency & Telehealth
                          </p>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
                        <div className="flex items-center gap-2 bg-charcoal-900/60 rounded-xl px-4 py-2.5 border border-white/10 focus-within:border-accent-300 focus-within:ring-2 focus-within:ring-accent-300/20 transition-all">
                          <Search className="w-5 h-5 text-white/50" />
                          <input
                            id="search-input"
                            value={searchQ}
                            onChange={(e) => runSearch(e.target.value)}
                            placeholder={t('search')}
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
                            aria-label="Search"
                          />
                          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-white/50 bg-charcoal-900/70 rounded">
                            ⌘K
                          </kbd>
                          <button
                            onClick={startSpeechSearch}
                            className="p-1.5 rounded-lg hover:bg-charcoal-900/70 transition-colors"
                            title="Voice search"
                          >
                            <Mic className="w-4 h-4 text-white/60" />
                          </button>
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                          <SearchResults results={searchResults} onClose={() => setSearchResults([])} />
                        )}
                      </div>

                      {/* Right Side Actions */}
                      <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <Tooltip content={dark ? 'Light Mode' : 'Dark Mode'}>
                          <button
                            onClick={() => setDark(!dark)}
                            className="p-2 rounded-lg hover:bg-charcoal-900/70 transition-colors"
                            aria-label="Toggle theme"
                          >
                            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                          </button>
                        </Tooltip>

                        {/* Font Size Toggle */}
                        <Tooltip content="Adjust font size">
                          <button
                            onClick={() => setFontSize(f => f === 'base' ? 'lg' : f === 'lg' ? 'xl' : 'base')}
                            className="p-2 rounded-lg hover:bg-charcoal-900/70 transition-colors font-bold"
                          >
                            A{fontSize === 'base' ? '' : fontSize === 'lg' ? '+' : '++'}
                          </button>
                        </Tooltip>

                        {/* Language Selector */}
                        <Tooltip content="Change language">
                          <button
                            onClick={() => setLang(l => l === 'en' ? 'ur' : l === 'ur' ? 'ar' : l === 'ar' ? 'zh' : 'en')}
                            className="p-2 rounded-lg hover:bg-charcoal-900/70 transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* High Contrast Toggle */}
                        <Tooltip content="Toggle high contrast">
                          <button
                            onClick={() => setHighContrast(!highContrast)}
                            className={`p-2 rounded-lg transition-colors ${highContrast ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-charcoal-900/70'}`}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* Sign Language Toggle */}
                        <Tooltip content="Sign language interpreter">
                          <button
                            onClick={() => setShowSignLanguage(!showSignLanguage)}
                            className={`p-2 rounded-lg transition-colors ${showSignLanguage ? 'bg-blue-100 text-blue-700' : 'hover:bg-charcoal-900/70'}`}
                          >
                            <Hand className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* Notifications */}
                        <div className="relative">
                          <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 rounded-lg hover:bg-charcoal-900/70 transition-colors relative"
                          >
                            <Bell className="w-5 h-5" />
                            {notifications.filter(n => !n.read).length > 0 && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/40 text-white text-xs rounded-full flex items-center justify-center">
                                {notifications.filter(n => !n.read).length}
                              </span>
                            )}
                          </button>
                          
                          {notificationsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-charcoal-950 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
                              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="font-semibold">{t('notifications')}</h3>
                                <button onClick={clearAllNotifications} className="text-sm text-white/60 hover:text-white">
                                  Clear all
                                </button>
                              </div>
                              <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-white/60">
                                    <Bell className="w-12 h-12 mx-auto mb-2 text-white/30" />
                                    <p>No notifications</p>
                                  </div>
                                ) : (
                                  notifications.map((notification) => (
                                    <div
                                      key={notification.id}
                                      className={`p-4 border-b border-white/10 hover:bg-charcoal-900/60 hover:bg-charcoal-900/60 cursor-pointer ${
                                        !notification.read ? 'bg-primary-400/15 dark:bg-blue-900/20' : ''
                                      }`}
                                      onClick={() => markNotificationAsRead(notification.id)}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${
                                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                          notification.type === 'danger' ? 'bg-red-100 text-red-600' :
                                          'bg-blue-100 text-blue-600'
                                        }`}>
                                          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                                           notification.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                           notification.type === 'danger' ? <XCircle className="w-4 h-4" /> :
                                           <Info className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm">{notification.text}</p>
                                          <p className="text-xs text-white/60 mt-1">
                                            {new Date(notification.timestamp).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                                          className="text-white/50 hover:text-white/70"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* User Menu */}
                        {user ? (
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-white/60 flex items-center gap-1">
                                <Award className="w-3 h-3 text-yellow-500" />
                                {points.toLocaleString()} points
                              </p>
                            </div>
                            <Avatar src={user.avatar} alt={user.name} size="md" status="online" />
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleLogin}>
                              {t('login')}
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleRegister}>
                              Create Account
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-3 md:hidden">
                      <div className="flex items-center gap-2 bg-charcoal-900/60 rounded-xl px-4 py-2.5">
                        <Search className="w-5 h-5 text-white/50" />
                        <input
                          value={searchQ}
                          onChange={(e) => runSearch(e.target.value)}
                          placeholder={t('search')}
                          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
                        />
                        <button onClick={startSpeechSearch}>
                          <Mic className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Navigation Tabs */}
                  
                </header>

                {/* ==================== MAIN CONTENT ==================== */}
                <main className="pb-20">
                  {/* Hero Section */}
                  <section className="relative overflow-hidden text-white py-24">
                    {/* Cinematic Gradient Base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-black animate-gradient-x"></div>

                    {/* Gold Veil + Emerald Depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(212,175,55,0.18),rgba(0,0,0,0))]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_80%_20%,rgba(22,163,74,0.18),rgba(0,0,0,0))]"></div>

                    {/* Noise + Vignette for premium depth */}
                    <div
                      className="absolute inset-0 opacity-40 mix-blend-soft-light"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
                      }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,rgba(255,255,255,0.06),rgba(0,0,0,0.8))]"></div>

                    {/* Floating glow orbs */}
                    <div className="absolute top-16 right-16 w-40 h-40 bg-accent-400/20 rounded-full blur-3xl animate-float shadow-lg shadow-accent-500/20"></div>
                    <div className="absolute bottom-20 left-10 w-28 h-28 bg-primary-400/20 rounded-full blur-2xl animate-float-delayed shadow-lg shadow-primary-500/20"></div>
                    <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-accent-300/20 rounded-full blur-2xl animate-float shadow-lg shadow-accent-500/20" style={{ animationDelay: '1s' }}></div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                      <div className="grid lg:grid-cols-5 gap-8 items-center">
                        {/* Left content with asymmetric layout */}
                        <div className="lg:col-span-3 relative">
                          <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-white/5 via-white/0 to-white/5 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]"></div>
                          <div className="absolute -inset-10 rounded-[36px] border border-accent-400/20"></div>
                          <div className="relative p-2">
                          {/* Overlapping badge container */}
                          <div className="flex items-center gap-2 mb-6 -ml-2">
                            <div className="bg-charcoal-950/70 backdrop-blur-sm rounded-full px-4 py-2 border border-accent-400/40 shadow-lg">
                              <Badge className="bg-transparent text-white border-0">
                                <Zap className="w-3 h-3 mr-1" /> AI-Powered
                              </Badge>
                            </div>
                            <div className="bg-charcoal-950/70 backdrop-blur-sm rounded-full px-4 py-2 border border-accent-400/40 shadow-lg -ml-4">
                              <Badge className="bg-transparent text-white border-0">
                                <ShieldCheck className="w-3 h-3 mr-1" /> HIPAA Compliant
                              </Badge>
                            </div>
                          </div>

                          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-2xl font-display tracking-tight">
                            {t('welcome')}
                          </h1>
                          <p className="text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
                            Experience next-generation healthcare with AI-assisted diagnostics,
                            telemedicine, predictive analytics, and personalized wellness programs.
                          </p>

                          <div className="flex flex-wrap gap-4 mb-10">
                            <Button
                              variant="secondary"
                              size="lg"
                              className="bg-accent-500 text-charcoal-950 hover:bg-accent-400 shadow-[0_18px_40px_rgba(212,175,55,0.35)] hover:shadow-[0_24px_60px_rgba(212,175,55,0.45)] transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-accent-300/60"
                              onClick={() => navigate('/book-appointment')}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-accent-200/0 via-accent-200/40 to-accent-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <Calendar className="w-5 h-5 relative z-10" />
                              {t('bookAppointment')}
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="border-white/20 text-white hover:bg-charcoal-900/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                              onClick={() => setChatOpen(true)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-accent-300/0 via-accent-200/20 to-primary-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <MessageSquare className="w-5 h-5 relative z-10" />
                              AI Assistant
                            </Button>
                            <Button
                              variant="ghost"
                              size="lg"
                              className="text-white hover:bg-charcoal-900/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                              onClick={() => ttsSpeak('Welcome to Medicore Hospital. How can we help you today?')}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-accent-300/0 via-accent-200/15 to-primary-200/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <Volume2 className="w-5 h-5 relative z-10" />
                              Listen
                            </Button>
                          </div>

                          {/* Enhanced compliance badges with staggered layout */}
                          <div className="flex flex-wrap gap-3">
                            {['ISO 9001', 'NABH', 'JCI', 'HIPAA', 'SehatCard'].map((badge, index) => (
                              <span
                                key={badge}
                                className="px-4 py-2 bg-charcoal-950/60 backdrop-blur-sm rounded-full text-sm border border-accent-300/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white/90"
                                style={{ transform: `translateY(${index * 2}px)` }}
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                          </div>
                        </div>

                        {/* Featured Doctor Card with glassmorphism */}
                        <div className="lg:col-span-2 relative">
                          <div className="bg-charcoal-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden">
                            {/* Glassmorphism gradient border */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-violet-400/20 to-gold-400/20 opacity-50"></div>
                            {/* Floating accent elements with neon glow */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400/40 rounded-full blur-sm shadow-lg shadow-cyan-500/50 animate-pulse-slow" />
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-violet-400/40 rounded-full blur-sm shadow-lg shadow-violet-500/50 animate-pulse-slow" style={{ animationDelay: '1s' }} />

                            <div className="flex items-center gap-4 mb-6">
                              <div className="relative">
                                <Avatar src={safeDoc.avatar} alt={safeDoc.name} size="xl" status="online" />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary-500/40 rounded-full flex items-center justify-center shadow-lg">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-xl">{safeDoc.name}</h3>
                                <p className="text-white/80">{safeDoc.specialty}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-medium">{safeDoc.rating}</span>
                                  </div>
                                  <span className="text-white/60">•</span>
                                  <span className="text-white/70">{safeDoc.years} years exp</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-charcoal-900/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                                <p className="text-2xl font-bold">{safeDoc.reviewCount}</p>
                                <p className="text-xs text-white/70">Reviews</p>
                              </div>
                              <div className="bg-charcoal-900/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                                <p className="text-2xl font-bold">{formatCurrency(safeDoc.consultationFee)}</p>
                                <p className="text-xs text-white/70">Consultation</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                variant="secondary"
                                className="flex-1 bg-accent-500 text-charcoal-950 hover:bg-charcoal-900/60 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => handleBookDoctor(safeDoc)}
                              >
                                Book Now
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-white border border-white/40 hover:bg-charcoal-900/70 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => handleStartVideoCall(safeDoc)}
                              >
                                <Video className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Live Stats Section */}
                  <section className="-mt-8 max-w-7xl mx-auto px-4 relative z-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      <StatCard
                        title={t('bedsAvailable')}
                        value={liveStats.beds}
                        change="+3 from yesterday"
                        icon={<Bed className="w-6 h-6" />}
                        color="green"
                        trend="up"
                      />
                      <StatCard
                        title={t('doctorsOnline')}
                        value={liveStats.doctorsOnline}
                        change="Active now"
                        icon={<User className="w-6 h-6" />}
                        color="blue"
                        trend="up"
                      />
                      <StatCard
                        title={t('erWaitTime')}
                        value={`${liveStats.erWait} min`}
                        change="-5 min"
                        icon={<Clock className="w-6 h-6" />}
                        color="yellow"
                        trend="up"
                      />
                      <StatCard
                        title={t('ongoingSurgeries')}
                        value={liveStats.surgeries}
                        change="2 scheduled"
                        icon={<Activity className="w-6 h-6" />}
                        color="red"
                        trend="up"
                      />
                      <StatCard
                        title="Patients Today"
                        value={liveStats.patientsToday}
                        change="+12%"
                        icon={<Users className="w-6 h-6" />}
                        color="purple"
                        trend="up"
                      />
                    </div>
                  </section>

                  {/* Quick Actions */}
                  <section className="py-8 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {[
                        { icon: <Calendar className="w-6 h-6" />, label: 'Book Appointment', iconClass: 'bg-accent-500/20 text-accent-300 ring-1 ring-accent-400/30', action: () => navigate('/book-appointment') },
                        { icon: <Video className="w-6 h-6" />, label: 'Telemedicine', iconClass: 'bg-primary-500/20 text-primary-300 ring-1 ring-primary-400/30', action: () => navigate('/Diagnostic') },
                        { icon: <FileText className="w-6 h-6" />, label: 'Home Healthcare', iconClass: 'bg-accent-400/15 text-accent-200 ring-1 ring-accent-300/30', action: () => navigate('/home-healthcare') },
                        { icon: <Pill className="w-6 h-6" />, label: 'Pharmacy', iconClass: 'bg-primary-400/15 text-primary-200 ring-1 ring-primary-300/30', action: () => navigate('/pharmacy') },
                        { icon: <AlertTriangle className="w-6 h-6" />, label: 'Emergency', iconClass: 'bg-accent-500/20 text-accent-200 ring-1 ring-accent-400/30', action: () => navigate('/emergency') },
                        { icon: <MessageSquare className="w-6 h-6" />, label: 'AI Assistant', iconClass: 'bg-primary-500/20 text-primary-200 ring-1 ring-primary-400/30', action: () => setChatOpen(true) },
                      ].map((item, i) => (
                        <Card
                          key={i}
                          hover
                          className="p-4 text-center cursor-pointer group bg-charcoal-950/40 border border-white/10"
                          onClick={item.action}
                        >
                          <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.iconClass}`}>
                            {item.icon}
                          </div>
                          <p className="text-sm font-medium">{item.label}</p>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Engagement Highlights */}
                  <section className="py-6 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Favorites', value: engagementStats.favorites, icon: <Heart className="w-5 h-5" /> },
                        { label: 'Article Reads', value: engagementStats.articleReads, icon: <BookOpen className="w-5 h-5" /> },
                        { label: 'Wellness Enrollments', value: engagementStats.wellnessEnrollments, icon: <Sparkles className="w-5 h-5" /> },
                        { label: 'Challenges Joined', value: engagementStats.challengeJoins, icon: <Trophy className="w-5 h-5" /> },
                        { label: 'Refill Requests', value: engagementStats.medicationRefills, icon: <Pill className="w-5 h-5" /> },
                        { label: 'Mood Logs', value: engagementStats.moodLogs, icon: <Smile className="w-5 h-5" /> },
                        { label: 'Symptom Checks', value: engagementStats.symptomChecks, icon: <Stethoscope className="w-5 h-5" /> },
                        { label: 'Insurance Views', value: engagementStats.insuranceViews, icon: <Shield className="w-5 h-5" /> },
                      ].map((item) => (
                        <Card key={item.label} className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-charcoal-900/70 border border-white/10 flex items-center justify-center text-accent-200">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs text-white/60">{item.label}</p>
                            <p className="text-xl font-semibold">{item.value ?? 0}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Services Section */}
                  <section className="py-12 bg-charcoal-950/80 text-white">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold">{t('ourServices')}</h2>
                          <p className="text-white/60 mt-1">Comprehensive healthcare solutions</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-accent-300/40 text-accent-100 hover:bg-charcoal-900/70"
                          onClick={() => navigate('/services')}
                        >
                          View All <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {serviceCards.map((service) => (
                          <Card key={service.key || service.id || service.title} hover className="p-6 group bg-charcoal-900/60 border border-white/10">
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                            <p className="text-sm text-white/60 mb-4">{service.desc}</p>
                            <Button variant="ghost" size="sm" className="group-hover:text-accent-300" onClick={() => navigate('/services')}>
                              Learn more <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Appointment Booking Section */}
                  <section id="booking" className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Natural Language Booking */}
                        <Card className="p-6">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-500" />
                            Smart Booking
                          </h3>
                          <p className="text-white/60 mb-4">
                            Type naturally like "Book Cardiology tomorrow at 10am" or use voice input.
                          </p>

                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                value={nlInput}
                                onChange={(e) => setNlInput(e.target.value)}
                                placeholder='e.g., "Book Cardiology tomorrow 10am"'
                                className="flex-1"
                                icon={<MessageSquare className="w-4 h-4" />}
                              />
                              <Button variant="primary" onClick={handleParseNL}>
                                Parse
                              </Button>
                            </div>

                            {nlParse && (
                              <div className="p-4 bg-primary-500/15 dark:bg-green-900/20 rounded-xl border border-primary-400/30 dark:border-green-800">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  Parsed Booking Intent
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-white/60">Specialty:</span>
                                    <span className="ml-2 font-medium">{nlParse.specialty || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-white/60">Date:</span>
                                    <span className="ml-2 font-medium">{nlParse.date || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-white/60">Time:</span>
                                    <span className="ml-2 font-medium">{nlParse.time || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-white/60">Type:</span>
                                    <span className="ml-2 font-medium">
                                      {nlParse.telemedicine ? 'Telemedicine' : 'In-Person'}
                                    </span>
                                  </div>
                                </div>
                                {nlParse.urgent && (
                                  <Badge variant="danger" className="mt-2">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                                <Button variant="primary" size="sm" className="mt-4 w-full" onClick={handleConfirmBooking}>
                                  Confirm Booking
                                </Button>
                              </div>
                            )}

                            {/* Selected Doctor */}
                            {selectedDoctor && (
                              <div className="p-4 bg-primary-400/15 dark:bg-blue-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <Avatar src={selectedDoctor.avatar} alt={selectedDoctor.name} size="lg" />
                                  <div>
                                    <p className="font-medium">{selectedDoctor.name}</p>
                                    <p className="text-sm text-white/60">{selectedDoctor.specialty}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={() => setSelectedDoctor(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>

                        {/* Live Appointment Slots */}
                        <Card className="p-6">
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Available Slots
                          </h3>
                          <p className="text-white/60 mb-4">
                            Real-time availability • Updates every 15 seconds
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {slots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => bookSlot(slot)}
                                disabled={!slot.free}
                                className={`p-4 rounded-xl text-center transition-all ${
                                  slot.free
                                    ? 'bg-primary-500/15 dark:bg-green-900/20 border-2 border-primary-400/30 dark:border-green-800 hover:border-green-500 hover:shadow-lg'
                                    : 'bg-charcoal-900/60 text-white/50 cursor-not-allowed'
                                }`}
                              >
                                <p className="font-semibold">{slot.time}</p>
                                <p className="text-xs mt-1">
                                  {slot.free ? (
                                    <span className="text-green-600">Available</span>
                                  ) : (
                                    <span>Booked</span>
                                  )}
                                </p>
                              </button>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-primary-500/40 rounded-full animate-pulse" />
                              Live updates active
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/book-appointment')}>
                              View more dates
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </section>

                  {/* Predictive Insights Section */}
                  <section className="py-12 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-primary-900 text-white">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Brain className="w-6 h-6 text-accent-300" />
                            {t('predictiveInsights')}
                          </h2>
                          <p className="text-white/60 mt-1">AI-powered analytics and forecasting</p>
                        </div>
                        <Button onClick={() => navigate('/viewdashboard')} variant="outline" className="border-accent-300/40 text-accent-100 hover:bg-charcoal-900/70">
                          View Dashboard
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-charcoal-900/60 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-white/60 mb-2">ER Wait Forecast</h4>
                          <p className="text-3xl font-bold mb-4">{liveStats.erWait} min</p>
                          <MiniSpark data={erWaitForecast} color="#D4AF37" height={60} />
                          <p className="text-xs text-white/50 mt-2">Next 12 hours prediction</p>
                        </Card>

                        <Card className="bg-charcoal-900/60 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-white/60 mb-2">Bed Occupancy Trend</h4>
                          <p className="text-3xl font-bold mb-4">{bedOccupancyTrend[bedOccupancyTrend.length - 1]}%</p>
                          <MiniSpark data={bedOccupancyTrend} color="#22c55e" height={60} />
                          <p className="text-xs text-white/50 mt-2">7-day trend</p>
                        </Card>

                        <Card className="bg-charcoal-900/60 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-white/60 mb-2">Readmission Risk</h4>
                          <div className="flex items-center gap-4">
                            <DonutChart value={insights.readmissionRisk} max={100} size={80} color="#EF4444" />
                            <div>
                              <p className="text-2xl font-bold">{insights.readmissionRisk}%</p>
                              <p className="text-xs text-primary-200">Low risk</p>
                            </div>
                          </div>
                        </Card>

                        <Card className="bg-charcoal-900/60 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-white/60 mb-2">Surgery Volume</h4>
                          <p className="text-3xl font-bold mb-4">{liveStats.surgeries} active</p>
                          <MiniSpark data={surgeryVolume} color="#D4AF37" height={60} />
                          <p className="text-xs text-white/50 mt-2">Daily surgeries</p>
                        </Card>
                      </div>

                      {/* Disease Outbreak Alert */}
                      <div className="mt-8 p-4 bg-accent-500/15 border border-accent-400/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="w-8 h-8 text-accent-300" />
                          <div>
                            <h4 className="font-semibold text-accent-200">Flu Season Alert</h4>
                            <p className="text-sm text-white/70">
                              Increased flu cases detected in your area. Vaccination recommended. 
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-accent-200 ml-2"
                                onClick={() => openInfoModal('Flu Vaccination', 'Book your flu vaccination at the nearest clinic or schedule a home visit with our nursing team.')}
                              >
                                Get Vaccinated
                              </Button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Doctors Section */}
                  <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold">{t('findDoctor')}</h2>
                          <p className="text-white/60 mt-1">Expert specialists across all departments</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openInfoModal('Doctor Filters', 'Filter by specialty, availability, insurance, and ratings to find your ideal clinician.')}
                          >
                            <Filter className="w-4 h-4" /> Filter
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate('/doctors')}>
                            View All
                          </Button>
                        </div>
                      </div>

                      {/* Specialty Filter */}
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Psychiatry'].map((specialty) => (
                          <button
                            key={specialty}
                            className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-charcoal-900/60 hover:bg-charcoal-900/70 dark:hover:bg-green-900/30 transition-colors"
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {doctors.slice(0, 12).map((doctor) => (
                          <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onBook={handleBookDoctor}
                            onViewProfile={handleViewDoctorProfile}
                            onFavorite={handleFavoriteDoctor}
                          />
                        ))}
                      </div>

                      <div className="mt-8 text-center">
                        <Button variant="outline" size="lg">
                          View All {doctors.length} Doctors
                        </Button>
                      </div>
                    </div>
                  </section>

                  {/* Health Tools Section */}
                  <section className="py-12 bg-charcoal-900/60">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-accent-300/80">Precision Wellness</p>
                          <h2 className="text-3xl font-bold mt-2">Health Tools & Trackers</h2>
                          <p className="text-white/60 mt-2 max-w-2xl">
                            Clinical-grade tools for daily wellbeing — log moods, analyze symptoms, and track vitals in real time.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            View Dashboard
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => openInfoModal('Premium Health Tools', 'Your personalized trackers update in real time. Insights, alerts, and trends are recorded securely.')}
                          >
                            How It Works
                          </Button>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">
                        <SymptomChecker
                          onAnalyze={handleSymptomAnalyze}
                          onEmergency={() => navigate('/emergency')}
                        />
                        <MoodTracker onLogMood={handleMoodLog} />
                        <VitalSignsWidget vitals={vitals} />
                      </div>

                      <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        <MedicationReminder
                          medications={medications}
                          onAdd={handleAddMedication}
                          onToggle={handleReminderToggle}
                        />
                        <WearableDataWidget />
                      </div>
                    </div>
                  </section>

                  {/* Wellness & Gamification Section */}
                  <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            Wellness Programs & Challenges
                          </h2>
                          <p className="text-white/60 mt-1">Earn points, unlock rewards, stay healthy</p>
                        </div>
                        {user && (
                          <div className="flex items-center gap-3 bg-gradient-to-r from-accent-500/15 to-primary-500/15 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-xl">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <div>
                              <p className="text-sm text-white/70 dark:text-white/50">Your Points</p>
                              <p className="text-xl font-bold text-yellow-600">{points.toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Wellness Programs */}
                        <div className="lg:col-span-2">
                          <h3 className="font-semibold mb-4">Active Programs</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {wellnessPrograms.slice(0, 6).map((program) => (
                              <WellnessProgramCard
                                key={program.id}
                                program={program}
                                onEnroll={handleEnrollWellness}
                              />
                            ))}
                          </div>

                          <h3 className="font-semibold mt-8 mb-4">Community Challenges</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {challenges.map((challenge) => (
                              <ChallengeCard
                                key={challenge.id}
                                challenge={challenge}
                                onJoin={handleJoinChallenge}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Leaderboard */}
                        <div>
                          <Leaderboard data={leaderboard} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Testimonials & Articles Section */}
                  <section className="py-12 bg-charcoal-900/60">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Testimonials */}
                        <div>
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            {t('patientStories')}
                          </h2>
                          <div className="space-y-4">
                            {testimonials.slice(0, 5).map((testimonial) => (
                              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                            ))}
                          </div>
                        </div>

                        {/* Articles */}
                        <div>
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                            {t('healthArticles')}
                          </h2>
                          <div className="space-y-4">
                            {articles.slice(0, 6).map((article) => (
                              <ArticleCard key={article.id} article={article} onRead={handleReadArticle} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Insurance & Emergency Section */}
                  <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Insurance Providers */}
                        <div>
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-500" />
                            Accepted Insurance
                          </h2>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {insuranceProviders.slice(0, 8).map((insurance) => (
                              <InsuranceCard key={insurance.id} insurance={insurance} onView={handleInsuranceView} />
                            ))}
                          </div>
                        </div>

                        {/* Emergency Services */}
                        <EmergencyServicesWidget services={emergencyServices} />
                      </div>
                    </div>
                  </section>

                  {/* Insurance Details Modal */}
                  <Modal
                    isOpen={insuranceOpen}
                    onClose={() => setInsuranceOpen(false)}
                    title={selectedInsurance?.name || 'Insurance Details'}
                    size="md"
                  >
                    {selectedInsurance ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{selectedInsurance.logo}</div>
                          <div>
                            <p className="text-sm text-white/60">Network</p>
                            <p className="font-medium">{selectedInsurance.network}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-charcoal-900/70 border border-white/10">
                            <p className="text-xs text-white/60">Coverage</p>
                            <p className="font-semibold">{selectedInsurance.coverage}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-charcoal-900/70 border border-white/10">
                            <p className="text-xs text-white/60">Claims</p>
                            <p className="font-semibold">{selectedInsurance.claims || '24/7 Support'}</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-charcoal-900/70 border border-white/10">
                          <p className="text-xs text-white/60">Accepted Services</p>
                          <p className="text-sm text-white/80">
                            {selectedInsurance.services?.join(', ') || 'Primary care, specialty visits, diagnostics'}
                          </p>
                        </div>
                        <Button variant="primary" className="w-full" onClick={() => navigate('/contact')}>
                          Contact Insurance Desk
                        </Button>
                      </div>
                    ) : null}
                  </Modal>

                  {/* Info Modal */}
                  <Modal
                    isOpen={infoModal.open}
                    onClose={() => setInfoModal({ open: false, title: '', body: '' })}
                    title={infoModal.title || 'Details'}
                    size="md"
                  >
                    <p className="text-sm text-white/80 leading-relaxed">{infoModal.body}</p>
                  </Modal>

                  {/* Debug Panel */}
                  {debugLog.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 pb-6">
                      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-red-200">Debug: Engagement Save Errors</p>
                          <button
                            className="text-xs text-red-200 underline"
                            onClick={() => setDebugLog([])}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="space-y-2 text-xs text-red-100">
                          {debugLog.map((entry, idx) => (
                            <div key={`${entry.ts}-${idx}`} className="flex items-start justify-between gap-3">
                              <span className="opacity-70">{entry.ts}</span>
                              <span className="font-medium">{entry.action}</span>
                              <span className="flex-1 text-right">{entry.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Research Studies Section */}
                  <section className="py-12 bg-accent-400/12 dark:bg-purple-900/20">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <ResearchStudiesWidget studies={researchStudies} />
                        <HospitalMap />
                      </div>
                    </div>
                  </section>

                  {/* Footer Compliance Section */}
                  <section className="py-8 bg-charcoal-900/60">
                    <div className="max-w-7xl mx-auto px-4">
                      <h3 className="text-center text-sm text-white/60 mb-4">Accreditations & Compliance</h3>
                      <ComplianceBadges />
                    </div>
                  </section>
                </main>

                {/* ==================== FOOTER ==================== */}
               

                {/* ==================== FLOATING ELEMENTS ==================== */}
                
                {/* Chat Widget */}
                <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} />

                {/* Video Call */}
                <VideoCallInterface
                  isOpen={videoCallOpen}
                  onClose={() => setVideoCallOpen(false)}
                  doctor={selectedDoctor}
                />

                {/* Sign Language Avatar */}
                {showSignLanguage && <SignLanguageAvatar text="Welcome" />}

                {/* Floating Action Buttons */}
                <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
                  {/* Back to top */}
                  <Tooltip content="Back to top">
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="w-12 h-12 bg-charcoal-950 rounded-full shadow-lg flex items-center justify-center hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70 transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </Tooltip>

                  {/* Quick Book */}
                  <Tooltip content="Quick Book">
                    <button
                      onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                  </Tooltip>

                  {/* AI Chat */}
                  <Tooltip content="AI Assistant">
                    <button
                      onClick={() => setChatOpen(!chatOpen)}
                      className="w-14 h-14 bg-gradient-to-r from-purple-600 to-primary-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                    >
                      <MessageSquare className="w-6 h-6" />
                    </button>
                  </Tooltip>
                </div>

                {/* Emergency Button */}
                <div className="fixed bottom-6 left-6 z-40">
                  <Tooltip content="Emergency: Call 1122">
                    <button
                      onClick={() => {
                        toast.error('Calling Emergency Services: 1122');
                        // In real app: window.location.href = 'tel:1122';
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors animate-pulse"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">Emergency</span>
                    </button>
                  </Tooltip>
                </div>

                {/* Accessibility Quick Panel */}
                <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
                  <div className="bg-charcoal-950 rounded-r-xl shadow-lg p-2 space-y-2">
                    <Tooltip content="Increase font size">
                      <button
                        onClick={() => setFontSize(f => f === 'base' ? 'lg' : f === 'lg' ? 'xl' : 'base')}
                        className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70 rounded-lg"
                      >
                        <Type className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="High contrast">
                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${highContrast ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70'}`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Sign language">
                      <button
                        onClick={() => setShowSignLanguage(!showSignLanguage)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${showSignLanguage ? 'bg-blue-100 text-blue-700' : 'hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70'}`}
                      >
                        <Hand className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Read aloud">
                      <button
                        onClick={() => ttsSpeak('Welcome to Medicore Hospital. How can we help you today?')}
                        className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-900/60 dark:hover:bg-charcoal-900/70 rounded-lg"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Cookie Consent Banner */}
                {!localStorage.getItem('cookieConsent') && (
                  <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal-950 border-t border-white/10 p-4 shadow-lg">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-white/70 dark:text-white/50">
                        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            localStorage.setItem('cookieConsent', 'true');
                            toast.success('Preferences saved');
                          }}
                        >
                          Accept All
                        </Button>
                        <Button variant="outline" size="sm">
                          Customize
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Export additional components for potential use in other files
export {
  AuthProvider,
  ThemeProvider,
  LanguageProvider,
  NotificationProvider,
  Badge,
  Avatar,
  Skeleton,
  Card,
  Button,
  Input,
  Modal,
  Tabs,
  ProgressBar,
  Tooltip,
  MiniSpark,
  DonutChart,
  StatCard,
  DoctorCard,
  AppointmentCard,
  LabResultCard,
  MedicationCard,
  RoomCard,
  StaffCard,
  ArticleCard,
  TestimonialCard,
  WellnessProgramCard,
  ChallengeCard,
  Leaderboard,
  VitalSignsWidget,
  SymptomChecker,
  MoodTracker,
  MedicationReminder,
  ChatInterface,
  VideoCallInterface,
  WearableDataWidget,
  InsuranceCard,
  EmergencyServicesWidget,
  ResearchStudiesWidget,
  HospitalMap,
  ComplianceBadges,
  SignLanguageAvatar,
  // Utility functions
  ttsSpeak,
  parseNaturalBooking,
  analyzeSymptoms,
  formatCurrency,
  formatDate,
  calculateBMI,
  // Constants
  defaultServices,
  translations,
};











