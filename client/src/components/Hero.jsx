// Home.jsx - Complete Hospital Management System
// Single-file implementation with all features
import React, { useEffect, useMemo, useRef, useState, useCallback, createContext, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { faker } from "@faker-js/faker";
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
  const [dark, setDark] = useState(false);
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

// ==================== MOCK DATA GENERATORS ====================

const makeDoctors = (n = 24) =>
  Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    title: `${faker.helpers.arrayElement(['Senior', 'Junior', 'Head', 'Associate', 'Consulting'])} ${faker.helpers.arrayElement(['Physician', 'Surgeon', 'Specialist', 'Consultant'])}`,
    specialty: faker.helpers.arrayElement([
      "Cardiology", "Radiology", "Pediatrics", "Orthopedics", "Neurology",
      "Gynecology", "ENT", "Dermatology", "Oncology", "Psychiatry",
      "Urology", "Nephrology", "Gastroenterology", "Pulmonology", "Endocrinology",
      "Rheumatology", "Ophthalmology", "Anesthesiology", "Emergency Medicine", "General Surgery"
    ]),
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviewCount: faker.number.int({ min: 10, max: 500 }),
    years: faker.number.int({ min: 2, max: 35 }),
    education: faker.helpers.arrayElements([
      "MBBS", "MD", "MS", "FCPS", "MRCP", "FRCS", "PhD", "DNB"
    ], faker.number.int({ min: 2, max: 4 })),
    languages: faker.helpers.arrayElements(["English", "Urdu", "Arabic", "Chinese", "Hindi", "Spanish", "French"], faker.number.int({ min: 1, max: 4 })),
    nextAvailable: faker.date.soon({ days: faker.number.int({ min: 1, max: 14 }) }).toISOString().slice(0, 10),
    consultationFee: faker.number.int({ min: 500, max: 5000 }),
    hospital: faker.helpers.arrayElement(["Main Campus", "North Wing", "South Campus", "Downtown Clinic", "Suburban Center"]),
    bio: faker.lorem.paragraph(2),
    specializations: faker.helpers.arrayElements([
      "Heart Surgery", "Bypass", "Pacemaker", "Transplant", "Arthroscopy",
      "Joint Replacement", "Spine Surgery", "Brain Surgery", "Cancer Treatment",
      "Chemotherapy", "Radiation", "Dialysis", "Pediatric Care", "Neonatal",
      "Geriatric Care", "Sports Medicine", "Pain Management", "Cosmetic Surgery"
    ], faker.number.int({ min: 1, max: 4 })),
    awards: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }).map(() => ({
      title: faker.helpers.arrayElement(["Best Doctor Award", "Excellence in Medicine", "Patient Choice Award", "Research Excellence"]),
      year: faker.number.int({ min: 2015, max: 2024 }),
    })),
    reviews: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }).map(() => ({
      text: faker.lorem.sentences(2),
      author: faker.person.fullName(),
      rating: faker.number.int({ min: 3, max: 5 }),
      date: faker.date.recent({ days: 90 }).toISOString().slice(0, 10),
    })),
    availability: {
      monday: faker.helpers.arrayElements(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"], faker.number.int({ min: 2, max: 6 })),
      tuesday: faker.helpers.arrayElements(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"], faker.number.int({ min: 2, max: 6 })),
      wednesday: faker.helpers.arrayElements(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"], faker.number.int({ min: 2, max: 6 })),
      thursday: faker.helpers.arrayElements(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"], faker.number.int({ min: 2, max: 6 })),
      friday: faker.helpers.arrayElements(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"], faker.number.int({ min: 2, max: 6 })),
    },
    telemedicineAvailable: faker.datatype.boolean(),
    acceptsInsurance: faker.helpers.arrayElements(["SehatCard", "PIMA", "State Life", "Jubilee", "EFU", "Adamjee"], faker.number.int({ min: 1, max: 4 })),
  }));

const makePatients = (n = 50) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `P-${1000 + i}`,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 1, max: 90 }),
    gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
    bloodGroup: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
    emergencyContact: {
      name: faker.person.fullName(),
      relation: faker.helpers.arrayElement(["Spouse", "Parent", "Sibling", "Child", "Friend"]),
      phone: faker.phone.number(),
    },
    allergies: faker.helpers.arrayElements(["Penicillin", "Aspirin", "Sulfa", "Latex", "Peanuts", "None"], faker.number.int({ min: 0, max: 3 })),
    chronicConditions: faker.helpers.arrayElements(["Diabetes", "Hypertension", "Asthma", "Heart Disease", "Arthritis", "None"], faker.number.int({ min: 0, max: 2 })),
    currentMedications: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }).map(() => ({
      name: faker.helpers.arrayElement(["Metformin", "Lisinopril", "Amlodipine", "Omeprazole", "Aspirin", "Atorvastatin"]),
      dosage: faker.helpers.arrayElement(["10mg", "20mg", "50mg", "100mg"]),
      frequency: faker.helpers.arrayElement(["Once daily", "Twice daily", "Three times daily"]),
    })),
    vitals: {
      bloodPressure: `${faker.number.int({ min: 90, max: 140 })}/${faker.number.int({ min: 60, max: 90 })}`,
      heartRate: faker.number.int({ min: 60, max: 100 }),
      temperature: (faker.number.float({ min: 97, max: 99, fractionDigits: 1 })).toFixed(1),
      oxygenSaturation: faker.number.int({ min: 95, max: 100 }),
      weight: faker.number.int({ min: 40, max: 120 }),
      height: faker.number.int({ min: 140, max: 190 }),
    },
    insuranceInfo: {
      provider: faker.helpers.arrayElement(["SehatCard", "PIMA", "State Life", "Jubilee", "EFU", "Self-Pay"]),
      policyNumber: faker.string.alphanumeric(12).toUpperCase(),
      validUntil: faker.date.future({ years: 2 }).toISOString().slice(0, 10),
    },
    appointments: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(() => ({
      id: faker.string.uuid(),
      date: faker.date.recent({ days: 30 }).toISOString().slice(0, 10),
      doctor: faker.person.fullName(),
      specialty: faker.helpers.arrayElement(["Cardiology", "General Medicine", "Orthopedics"]),
      status: faker.helpers.arrayElement(["Completed", "Scheduled", "Cancelled"]),
    })),
    labResults: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }).map(() => ({
      id: faker.string.uuid(),
      testName: faker.helpers.arrayElement(["Complete Blood Count", "Lipid Panel", "Metabolic Panel", "Thyroid Panel", "HbA1c"]),
      date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      status: faker.helpers.arrayElement(["Normal", "Abnormal", "Critical"]),
    })),
  }));

const makeAppointments = (n = 30) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `APT-${2000 + i}`,
    patientId: `P-${1000 + faker.number.int({ min: 0, max: 49 })}`,
    patientName: faker.person.fullName(),
    doctorId: faker.number.int({ min: 1, max: 24 }),
    doctorName: faker.person.fullName(),
    specialty: faker.helpers.arrayElement(["Cardiology", "Radiology", "Pediatrics", "Orthopedics", "Neurology"]),
    date: faker.date.soon({ days: 14 }).toISOString().slice(0, 10),
    time: faker.helpers.arrayElement(["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]),
    type: faker.helpers.arrayElement(["In-Person", "Telemedicine", "Follow-up", "Initial Consultation"]),
    status: faker.helpers.arrayElement(["Scheduled", "Confirmed", "Completed", "Cancelled", "No-Show"]),
    reason: faker.lorem.sentence(4),
    notes: faker.lorem.paragraph(1),
    priority: faker.helpers.arrayElement(["Normal", "Urgent", "Emergency"]),
    estimatedDuration: faker.helpers.arrayElement([15, 30, 45, 60]),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
  }));

const makeLabResults = (n = 20) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `LAB-${3000 + i}`,
    patientId: `P-${1000 + faker.number.int({ min: 0, max: 49 })}`,
    patientName: faker.person.fullName(),
    testName: faker.helpers.arrayElement([
      "Complete Blood Count", "Lipid Panel", "Metabolic Panel", "Thyroid Panel",
      "HbA1c", "Liver Function Test", "Kidney Function Test", "Urinalysis",
      "Blood Glucose", "Vitamin D", "Iron Panel", "Coagulation Panel"
    ]),
    category: faker.helpers.arrayElement(["Blood Test", "Urine Test", "Imaging", "Biopsy"]),
    orderedBy: faker.person.fullName(),
    orderedDate: faker.date.recent({ days: 7 }).toISOString().slice(0, 10),
    completedDate: faker.date.recent({ days: 3 }).toISOString().slice(0, 10),
    status: faker.helpers.arrayElement(["Pending", "In Progress", "Completed", "Reviewed"]),
    priority: faker.helpers.arrayElement(["Routine", "Urgent", "STAT"]),
    results: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }).map(() => ({
      parameter: faker.helpers.arrayElement(["Hemoglobin", "WBC", "RBC", "Platelets", "Glucose", "Cholesterol", "Triglycerides", "Creatinine"]),
      value: faker.number.float({ min: 0.5, max: 300, fractionDigits: 2 }),
      unit: faker.helpers.arrayElement(["mg/dL", "g/dL", "mmol/L", "cells/mcL", "IU/L"]),
      referenceRange: "Normal: 70-100",
      status: faker.helpers.arrayElement(["Normal", "Low", "High", "Critical"]),
    })),
    notes: faker.lorem.sentence(6),
  }));

const makeMedications = (n = 30) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `MED-${4000 + i}`,
    name: faker.helpers.arrayElement([
      "Metformin", "Lisinopril", "Amlodipine", "Omeprazole", "Aspirin",
      "Atorvastatin", "Metoprolol", "Losartan", "Gabapentin", "Hydrochlorothiazide",
      "Levothyroxine", "Simvastatin", "Pantoprazole", "Furosemide", "Clopidogrel"
    ]),
    genericName: faker.lorem.word(),
    category: faker.helpers.arrayElement(["Cardiovascular", "Diabetes", "Pain Relief", "Antibiotics", "Vitamins", "Mental Health"]),
    dosage: faker.helpers.arrayElement(["10mg", "20mg", "50mg", "100mg", "250mg", "500mg"]),
    form: faker.helpers.arrayElement(["Tablet", "Capsule", "Liquid", "Injection", "Cream", "Inhaler"]),
    manufacturer: faker.company.name(),
    price: faker.number.int({ min: 50, max: 5000 }),
    inStock: faker.number.int({ min: 0, max: 1000 }),
    reorderLevel: faker.number.int({ min: 50, max: 200 }),
    expiryDate: faker.date.future({ years: 2 }).toISOString().slice(0, 10),
    requiresPrescription: faker.datatype.boolean(),
    sideEffects: faker.helpers.arrayElements(["Nausea", "Dizziness", "Headache", "Fatigue", "Dry mouth", "Constipation"], faker.number.int({ min: 1, max: 3 })),
    contraindications: faker.helpers.arrayElements(["Pregnancy", "Kidney disease", "Liver disease", "Heart failure"], faker.number.int({ min: 0, max: 2 })),
  }));

const makeEquipment = (n = 25) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `EQ-${5000 + i}`,
    name: faker.helpers.arrayElement([
      "MRI Scanner", "CT Scanner", "X-Ray Machine", "Ultrasound", "ECG Machine",
      "Ventilator", "Defibrillator", "Patient Monitor", "Infusion Pump", "Surgical Robot",
      "Dialysis Machine", "Endoscope", "Mammography Unit", "Blood Analyzer", "Centrifuge"
    ]),
    category: faker.helpers.arrayElement(["Imaging", "Diagnostic", "Therapeutic", "Surgical", "Monitoring", "Laboratory"]),
    manufacturer: faker.company.name(),
    model: faker.string.alphanumeric(8).toUpperCase(),
    serialNumber: faker.string.alphanumeric(12).toUpperCase(),
    location: faker.helpers.arrayElement(["Radiology Dept", "ICU", "Emergency", "OT-1", "OT-2", "Lab", "Cardiology Wing"]),
    status: faker.helpers.arrayElement(["Operational", "Under Maintenance", "Out of Order", "Reserved"]),
    purchaseDate: faker.date.past({ years: 5 }).toISOString().slice(0, 10),
    warrantyExpiry: faker.date.future({ years: 2 }).toISOString().slice(0, 10),
    lastMaintenance: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
    nextMaintenance: faker.date.soon({ days: 60 }).toISOString().slice(0, 10),
    usageHours: faker.number.int({ min: 100, max: 10000 }),
    costPerUse: faker.number.int({ min: 100, max: 10000 }),
  }));

const makeRooms = (n = 40) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `ROOM-${100 + i}`,
    number: `${faker.number.int({ min: 1, max: 5 })}${String(i + 1).padStart(2, '0')}`,
    floor: faker.number.int({ min: 1, max: 5 }),
    wing: faker.helpers.arrayElement(["North", "South", "East", "West"]),
    type: faker.helpers.arrayElement(["Private", "Semi-Private", "General Ward", "ICU", "NICU", "CCU", "Isolation", "Emergency"]),
    beds: faker.number.int({ min: 1, max: 6 }),
    occupiedBeds: faker.number.int({ min: 0, max: 4 }),
    status: faker.helpers.arrayElement(["Available", "Occupied", "Maintenance", "Reserved", "Cleaning"]),
    amenities: faker.helpers.arrayElements(["TV", "AC", "WiFi", "Bathroom", "Nurse Call", "Oxygen", "Suction"], faker.number.int({ min: 2, max: 6 })),
    ratePerDay: faker.number.int({ min: 2000, max: 50000 }),
    currentPatients: [],
    assignedNurse: faker.person.fullName(),
    lastCleaned: faker.date.recent({ days: 1 }).toISOString(),
    equipment: faker.helpers.arrayElements(["Patient Monitor", "Infusion Pump", "Ventilator", "ECG"], faker.number.int({ min: 1, max: 3 })),
  }));

const makeStaff = (n = 50) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `STF-${6000 + i}`,
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(["Nurse", "Technician", "Receptionist", "Administrator", "Pharmacist", "Lab Technician", "Radiographer", "Paramedic"]),
    department: faker.helpers.arrayElement(["Emergency", "ICU", "OPD", "Surgery", "Pediatrics", "Cardiology", "Administration", "Pharmacy", "Lab"]),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
    shift: faker.helpers.arrayElement(["Morning", "Evening", "Night", "Rotating"]),
    status: faker.helpers.arrayElement(["On Duty", "Off Duty", "On Leave", "Training"]),
    hireDate: faker.date.past({ years: 10 }).toISOString().slice(0, 10),
    certifications: faker.helpers.arrayElements(["BLS", "ACLS", "PALS", "CPR", "First Aid"], faker.number.int({ min: 1, max: 4 })),
    performance: {
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      attendance: faker.number.int({ min: 85, max: 100 }),
      tasksCompleted: faker.number.int({ min: 50, max: 500 }),
    },
  }));

const makeArticles = (n = 12) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `ART-${i}`,
    title: faker.lorem.sentence(6),
    excerpt: faker.lorem.sentences(2),
    content: faker.lorem.paragraphs(5),
    author: faker.person.fullName(),
    authorRole: faker.helpers.arrayElement(["Cardiologist", "Nutritionist", "Pediatrician", "Psychologist", "General Physician"]),
    authorAvatar: `https://i.pravatar.cc/50?img=${(i % 70) + 1}`,
    readMinutes: faker.number.int({ min: 2, max: 15 }),
    category: faker.helpers.arrayElement(["Heart Health", "Nutrition", "Mental Health", "Fitness", "Pediatrics", "Women's Health", "Senior Care"]),
    tags: faker.helpers.arrayElements(["wellness", "prevention", "lifestyle", "treatment", "research"], faker.number.int({ min: 2, max: 4 })),
    publishDate: faker.date.recent({ days: 30 }).toISOString().slice(0, 10),
    views: faker.number.int({ min: 100, max: 10000 }),
    likes: faker.number.int({ min: 10, max: 500 }),
    comments: faker.number.int({ min: 0, max: 50 }),
    image: `https://picsum.photos/800/400?random=${i}`,
  }));

const makeTestimonials = (n = 10) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `T-${i}`,
    name: faker.person.fullName(),
    avatar: `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
    quote: faker.lorem.sentences(3),
    rating: faker.number.int({ min: 4, max: 5 }),
    treatment: faker.helpers.arrayElement(["Heart Surgery", "Joint Replacement", "Cancer Treatment", "Childbirth", "Emergency Care"]),
    doctor: faker.person.fullName(),
    date: faker.date.recent({ days: 180 }).toISOString().slice(0, 10),
    videoUrl: faker.datatype.boolean() ? "https://example.com/video" : null,
    verified: faker.datatype.boolean(),
  }));

const makeInsuranceProviders = () => [
  { id: 1, name: "SehatCard", logo: "🏥", coverage: "100%", network: "All Hospitals" },
  { id: 2, name: "PIMA", logo: "🏦", coverage: "80%", network: "Selected Hospitals" },
  { id: 3, name: "State Life", logo: "🏛️", coverage: "70%", network: "Pan Pakistan" },
  { id: 4, name: "Jubilee Life", logo: "💼", coverage: "75%", network: "Major Cities" },
  { id: 5, name: "EFU Health", logo: "🛡️", coverage: "85%", network: "Premium Hospitals" },
  { id: 6, name: "Adamjee Insurance", logo: "⚕️", coverage: "70%", network: "All Pakistan" },
];

const makeEmergencyServices = () => [
  { id: 1, name: "Ambulance", icon: "🚑", available: true, responseTime: "5-10 mins", number: "1122" },
  { id: 2, name: "Air Ambulance", icon: "🚁", available: true, responseTime: "15-30 mins", number: "021-111-222-333" },
  { id: 3, name: "Blood Bank", icon: "🩸", available: true, units: 250, types: ["A+", "B+", "O+", "AB+"] },
  { id: 4, name: "Trauma Center", icon: "🏥", available: true, beds: 15, status: "Operational" },
  { id: 5, name: "Poison Control", icon: "☠️", available: true, number: "0800-00-786" },
];

const defaultServices = [
  { key: "radiology", title: "Radiology", desc: "MRI, CT, Digital X-Ray, Ultrasound, PET Scan", icon: "🔬", color: "blue" },
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

const makeWellnessPrograms = () => [
  { id: 1, name: "Heart Health Program", description: "12-week cardiovascular wellness", points: 500, enrolled: 234, icon: "❤️" },
  { id: 2, name: "Diabetes Management", description: "Blood sugar control & lifestyle", points: 400, enrolled: 189, icon: "🩺" },
  { id: 3, name: "Mental Wellness", description: "Mindfulness & stress management", points: 300, enrolled: 312, icon: "🧘" },
  { id: 4, name: "Weight Management", description: "Nutrition & exercise program", points: 350, enrolled: 278, icon: "⚖️" },
  { id: 5, name: "Smoking Cessation", description: "Quit smoking support", points: 450, enrolled: 156, icon: "🚭" },
  { id: 6, name: "Sleep Better", description: "Sleep hygiene improvement", points: 250, enrolled: 201, icon: "😴" },
];

const makeChallenges = () => [
  { id: 1, name: "10K Steps Challenge", description: "Walk 10,000 steps daily", points: 50, participants: 1234, daysLeft: 7, icon: "👟" },
  { id: 2, name: "Hydration Hero", description: "Drink 8 glasses of water daily", points: 30, participants: 890, daysLeft: 14, icon: "💧" },
  { id: 3, name: "Meditation Month", description: "Meditate 10 mins daily", points: 100, participants: 567, daysLeft: 21, icon: "🧘‍♀️" },
  { id: 4, name: "Healthy Eating", description: "Log healthy meals for 30 days", points: 150, participants: 432, daysLeft: 28, icon: "🥗" },
];

const makeLeaderboard = () =>
  Array.from({ length: 10 }).map((_, i) => ({
    rank: i + 1,
    name: faker.person.fullName(),
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    points: faker.number.int({ min: 5000, max: 50000 }) - i * 1000,
    badges: faker.number.int({ min: 5, max: 25 }),
    streak: faker.number.int({ min: 1, max: 100 }),
  }));

const makeResearchStudies = () => [
  { id: 1, title: "Cardiovascular Disease Prevention Trial", status: "Recruiting", participants: 150, target: 500, compensation: 5000 },
  { id: 2, title: "Diabetes Type 2 New Treatment Study", status: "Active", participants: 300, target: 400, compensation: 3000 },
  { id: 3, title: "Mental Health App Effectiveness", status: "Recruiting", participants: 80, target: 200, compensation: 1000 },
  { id: 4, title: "Pediatric Vaccine Safety Study", status: "Completed", participants: 1000, target: 1000, compensation: 2000 },
];

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
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
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
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };
  return (
    <div className="relative inline-block">
      <img src={src} alt={alt} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800`} />
      {status && (
        <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

// Skeleton Component
const Skeleton = ({ className = "h-6 w-full", variant = "default" }) => {
  const variants = {
    default: "bg-gray-200 dark:bg-gray-700",
    circle: "bg-gray-200 dark:bg-gray-700 rounded-full",
    text: "bg-gray-200 dark:bg-gray-700 rounded",
  };
  return <div className={`animate-pulse rounded ${variants[variant]} ${className}`} />;
};

// Card Component
const Card = ({ children, className = "", hover = false, onClick = null }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = ({ children, variant = "primary", size = "md", disabled = false, loading = false, icon = null, onClick, className = "", ...props }) => {
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${error ? 'border-red-500' : ''}`}
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
        <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl ${sizes[size]} w-full`}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}%</span>}
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
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
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
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
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
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
          className="text-gray-200 dark:text-gray-700"
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
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
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
const DoctorCard = ({ doctor, onBook, onViewProfile, compact = false }) => {
  if (compact) {
    return (
      <Card hover className="p-3">
        <div className="flex items-center gap-3">
          <Avatar src={doctor.avatar} alt={doctor.name} size="md" status="online" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{doctor.name}</p>
            <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
          </div>
          <Button size="xs" onClick={() => onBook(doctor)}>Book</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden">
      <div className="relative">
        <div className="h-20 bg-gradient-to-r from-green-500 to-blue-500" />
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
            <p className="text-sm text-gray-500">{doctor.title}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{doctor.rating}</span>
            <span className="text-xs text-gray-400">({doctor.reviewCount})</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          <Badge variant="info">{doctor.specialty}</Badge>
          <Badge>{doctor.years} yrs exp</Badge>
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
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
            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{lang}</span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="primary" className="flex-1" onClick={() => onBook(doctor)}>
            <Calendar className="w-4 h-4" /> Book
          </Button>
          <Button variant="outline" onClick={() => onViewProfile(doctor)}>
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => toast.success('Added to favorites')}>
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
            <p className="text-sm text-gray-500">{appointment.specialty}</p>
          </div>
        </div>
        <Badge variant={statusColors[appointment.status]}>{appointment.status}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
      </div>

      {appointment.reason && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{appointment.reason}</p>
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
          <p className="text-sm text-gray-500">{result.category}</p>
        </div>
        <Badge variant={statusColors[result.status]}>{result.status}</Badge>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
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
            <p className="text-sm text-gray-500">{medication.dosage} - {medication.form}</p>
          </div>
        </div>
        {medication.requiresPrescription && (
          <Badge variant="warning">Rx</Badge>
        )}
      </div>

      <div className="mt-3 text-sm">
        <p className="text-gray-600 dark:text-gray-400">{medication.category}</p>
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
            <p className="text-sm text-gray-500">{room.type} - {room.wing} Wing</p>
          </div>
        </div>
        <Badge variant={statusColors[room.status]}>{room.status}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Beds:</span>
          <span className="ml-1 font-medium">{room.occupiedBeds}/{room.beds}</span>
        </div>
        <div>
          <span className="text-gray-500">Floor:</span>
          <span className="ml-1 font-medium">{room.floor}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {room.amenities.slice(0, 4).map((amenity, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{amenity}</span>
        ))}
      </div>

      <div className="mt-3 text-sm">
        <span className="text-gray-500">Rate:</span>
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
          <p className="text-sm text-gray-500">{staff.role}</p>
          <Badge variant={statusColors[staff.status]} size="xs" className="mt-1">{staff.status}</Badge>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
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
          <span className="text-gray-500">Performance</span>
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
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Badge variant="info" size="xs">{article.category}</Badge>
          <span>•</span>
          <span>{article.readMinutes} min read</span>
        </div>
        <h3 className="font-semibold line-clamp-2">{article.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={article.authorAvatar} alt={article.author} size="xs" />
            <span className="text-sm text-gray-500">{article.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
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
          <p className="text-sm text-gray-500">{testimonial.treatment}</p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Treated by Dr. {testimonial.doctor}</span>
        <span>{testimonial.date}</span>
      </div>
      {testimonial.videoUrl && (
        <Button variant="ghost" size="sm" className="mt-2">
          <PlayCircle className="w-4 h-4" /> Watch Video
        </Button>
      )}
    </Card>
  );
};

// Wellness Program Card
const WellnessProgramCard = ({ program, onEnroll }) => {
  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{program.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium">{program.name}</h4>
          <p className="text-sm text-gray-500">{program.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-yellow-600">
          <Award className="w-4 h-4" />
          <span>{program.points} points</span>
        </div>
        <span className="text-gray-500">{program.enrolled} enrolled</span>
      </div>
      <Button variant="primary" size="sm" className="mt-3 w-full" onClick={() => onEnroll(program)}>
        Enroll Now
      </Button>
    </Card>
  );
};

// Challenge Card
const ChallengeCard = ({ challenge, onJoin }) => {
  return (
    <Card className="p-4 border-2 border-dashed border-green-300 dark:border-green-700">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{challenge.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium">{challenge.name}</h4>
          <p className="text-sm text-gray-500">{challenge.description}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-lg font-bold text-green-600">{challenge.points}</p>
          <p className="text-xs text-gray-500">Points</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">{challenge.participants}</p>
          <p className="text-xs text-gray-500">Participants</p>
        </div>
        <div>
          <p className="text-lg font-bold text-orange-600">{challenge.daysLeft}</p>
          <p className="text-xs text-gray-500">Days Left</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onJoin(challenge)}>
        <Zap className="w-4 h-4" /> Join Challenge
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
              i === 0 ? 'bg-yellow-500 text-white' : 
              i === 1 ? 'bg-gray-400 text-white' : 
              i === 2 ? 'bg-orange-500 text-white' : 
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              {entry.rank}
            </div>
            <Avatar src={entry.avatar} alt={entry.name} size="sm" />
            <div className="flex-1">
              <p className="font-medium text-sm">{entry.name}</p>
              <p className="text-xs text-gray-500">{entry.streak} day streak</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{entry.badges} badges</p>
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
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <Heart className="w-6 h-6 text-red-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.heartRate}</p>
          <p className="text-xs text-gray-500">Heart Rate (bpm)</p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Activity className="w-6 h-6 text-blue-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.bloodPressure}</p>
          <p className="text-xs text-gray-500">Blood Pressure</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Thermometer className="w-6 h-6 text-green-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.temperature}°F</p>
          <p className="text-xs text-gray-500">Temperature</p>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Wind className="w-6 h-6 text-purple-500 mx-auto" />
          <p className="text-2xl font-bold mt-1">{vitals.oxygenSaturation}%</p>
          <p className="text-xs text-gray-500">SpO2</p>
        </div>
      </div>
    </Card>
  );
};

// Symptom Checker Component
const SymptomChecker = ({ onAnalyze }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

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

  const analyze = () => {
    const analysis = analyzeSymptoms(selectedSymptoms);
    setResult(analysis);
    toast.success('Analysis complete');
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-green-500" /> AI Symptom Checker
      </h3>
      
      <p className="text-sm text-gray-500 mb-3">Select your symptoms for AI-powered analysis</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {commonSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedSymptoms.includes(symptom)
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
          result.urgency === 'High' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200' :
          result.urgency === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200' :
          'bg-green-50 dark:bg-green-900/20 border border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {result.urgency === 'High' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
             result.urgency === 'Medium' ? <AlertCircle className="w-5 h-5 text-yellow-500" /> :
             <CheckCircle className="w-5 h-5 text-green-500" />}
            <span className="font-medium">{result.condition}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{result.recommendation}</p>
          {result.urgency === 'High' && (
            <Button variant="danger" size="sm" className="mt-3">
              <Phone className="w-4 h-4" /> Contact Emergency
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

// Mood Tracker Component
const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([
    { date: '2024-01-15', mood: 'happy', note: 'Great day!' },
    { date: '2024-01-14', mood: 'neutral', note: 'Normal day' },
    { date: '2024-01-13', mood: 'stressed', note: 'Work pressure' },
  ]);

  const moods = [
    { key: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-600' },
    { key: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-600' },
    { key: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-600' },
    { key: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 text-yellow-600' },
    { key: 'stressed', emoji: '😤', label: 'Stressed', color: 'bg-red-100 text-red-600' },
  ];

  const logMood = () => {
    if (!selectedMood) return;
    setMoodHistory(prev => [
      { date: new Date().toISOString().slice(0, 10), mood: selectedMood, note: '' },
      ...prev
    ]);
    toast.success('Mood logged successfully');
    setSelectedMood(null);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-yellow-500" /> Mood Tracker
      </h3>

      <p className="text-sm text-gray-500 mb-3">How are you feeling today?</p>

      <div className="flex justify-between mb-4">
        {moods.map((mood) => (
          <button
            key={mood.key}
            onClick={() => setSelectedMood(mood.key)}
            className={`p-3 rounded-xl transition-all ${
              selectedMood === mood.key 
                ? `${mood.color} ring-2 ring-offset-2 ring-current` 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
            <div key={i} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span>{moods.find(m => m.key === entry.mood)?.emoji} {entry.date}</span>
              <span className="text-gray-500">{entry.note}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Medication Reminder Component
const MedicationReminder = ({ medications }) => {
  const [reminders, setReminders] = useState([
    { id: 1, name: 'Metformin', time: '08:00 AM', taken: false },
    { id: 2, name: 'Lisinopril', time: '08:00 AM', taken: true },
    { id: 3, name: 'Aspirin', time: '12:00 PM', taken: false },
    { id: 4, name: 'Atorvastatin', time: '08:00 PM', taken: false },
  ]);

  const toggleTaken = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, taken: !r.taken } : r
    ));
    toast.success('Medication status updated');
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
              reminder.taken ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <button 
              onClick={() => toggleTaken(reminder.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                reminder.taken ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
              }`}
            >
              {reminder.taken && <CheckCircle className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <p className={`font-medium ${reminder.taken ? 'line-through text-gray-400' : ''}`}>{reminder.name}</p>
              <p className="text-sm text-gray-500">{reminder.time}</p>
            </div>
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mt-4 w-full">
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
    <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Medicore Assistant</h3>
              <p className="text-xs text-white/80">AI-Powered Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
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
                : 'bg-gray-100 dark:bg-gray-700 rounded-bl-sm'
            }`}>
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Book Appointment', 'Find Doctor', 'Lab Results', 'Emergency'].map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-2">
          <button
            type="button"
            onClick={startVoiceInput}
            className={`p-2 rounded-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none"
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
    <div className="fixed inset-0 z-50 bg-gray-900">
      {/* Main Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={doctor?.avatar || "https://i.pravatar.cc/800"} 
            alt="Doctor" 
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <VideoOff className="w-20 h-20 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Self Video */}
      <div className="absolute bottom-24 right-6 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
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
            <div className="px-3 py-1 bg-red-500 rounded-full text-sm flex items-center gap-1">
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
            className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full ${isScreenSharing ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
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
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700">
          Clear all
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
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
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                  className="text-gray-400 hover:text-gray-600"
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
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50">
      <div className="p-2">
        {results.map((result, i) => (
          <div
            key={i}
            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
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
                <p className="text-xs text-gray-500">{result.hint}</p>
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
    <div className="fixed bottom-6 left-6 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 w-48">
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
        <Hand className="w-16 h-16 text-gray-400 animate-pulse" />
      </div>
      <p className="text-xs text-center text-gray-500">Sign Language Interpreter</p>
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
          <div key={device.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`p-2 rounded-lg ${device.connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {device.type === 'smartwatch' ? <Watch className="w-4 h-4" /> :
               device.type === 'fitness' ? <Activity className="w-4 h-4" /> :
               <Thermometer className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{device.name}</p>
              <p className="text-xs text-gray-500">{device.lastSync}</p>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-gray-400" />
              <span className="text-xs">{device.battery}%</span>
              <div className={`w-2 h-2 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <Footprints className="w-5 h-5 text-blue-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.steps.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Steps</p>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <Zap className="w-5 h-5 text-orange-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.calories}</p>
          <p className="text-xs text-gray-500">Calories</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <MapPin className="w-5 h-5 text-green-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.distance} km</p>
          <p className="text-xs text-gray-500">Distance</p>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <Moon className="w-5 h-5 text-purple-500 mx-auto" />
          <p className="text-lg font-bold mt-1">{liveData.sleepHours}h</p>
          <p className="text-xs text-gray-500">Sleep</p>
        </div>
      </div>
    </Card>
  );
};

// Insurance Card Component
const InsuranceCard = ({ insurance }) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{insurance.logo}</div>
        <Badge className="bg-white/20 text-white">{insurance.coverage} Coverage</Badge>
      </div>
      <h3 className="font-semibold text-lg">{insurance.name}</h3>
      <p className="text-sm text-white/70 mt-1">{insurance.network}</p>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
          View Details
        </Button>
        <Shield className="w-8 h-8 text-white/50" />
      </div>
    </Card>
  );
};

// Emergency Services Widget
const EmergencyServicesWidget = () => {
  const services = makeEmergencyServices();

  return (
    <Card className="p-4 border-2 border-red-200 dark:border-red-800">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-600">
        <AlertTriangle className="w-5 h-5" /> Emergency Services
      </h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl">{service.icon}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-gray-500">
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
const ResearchStudiesWidget = () => {
  const studies = makeResearchStudies();

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Microscope className="w-5 h-5 text-purple-500" /> Clinical Research
      </h3>
      <div className="space-y-3">
        {studies.map((study) => (
          <div key={study.id} className="p-3 border dark:border-gray-700 rounded-lg">
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
              <p className="text-xs text-gray-500 mt-1">{study.participants}/{study.target} participants</p>
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
      <div className="p-4 border-b dark:border-gray-700">
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
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-sm">Medicore Hospital</p>
              <p className="text-xs text-gray-500">Stadium Road, Karachi, Pakistan</p>
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
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
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
  
  // Initialize memoized data
  const doctors = useMemo(() => makeDoctors(24), []);
  const patients = useMemo(() => makePatients(50), []);
  const appointments = useMemo(() => makeAppointments(30), []);
  const labResults = useMemo(() => makeLabResults(20), []);
  const medications = useMemo(() => makeMedications(30), []);
  const equipment = useMemo(() => makeEquipment(25), []);
  const rooms = useMemo(() => makeRooms(40), []);
  const staff = useMemo(() => makeStaff(50), []);
  const articles = useMemo(() => makeArticles(12), []);
  const testimonials = useMemo(() => makeTestimonials(10), []);
  const insuranceProviders = useMemo(() => makeInsuranceProviders(), []);
  const wellnessPrograms = useMemo(() => makeWellnessPrograms(), []);
  const challenges = useMemo(() => makeChallenges(), []);
  const leaderboard = useMemo(() => makeLeaderboard(), []);
  const researchStudies = useMemo(() => makeResearchStudies(), []);

  // State
  const [dark, setDark] = useState(false);
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
    beds: 42,
    doctorsOnline: 18,
    erWait: 12,
    surgeries: 2,
    alerts: 0,
    patientsToday: 156,
    appointmentsToday: 89,
    labTestsCompleted: 234,
  });

  // Booking Slots
  const [slots, setSlots] = useState(
    Array.from({ length: 8 }).map((_, i) => ({ 
      id: i, 
      time: `${9 + i}:00`, 
      free: Math.random() > 0.4 
    }))
  );

  // Natural Language Booking
  const [nlInput, setNlInput] = useState('');
  const [nlParse, setNlParse] = useState(null);

  // Predictive Insights
  const [insights, setInsights] = useState({
    erWaitForecast: [12, 10, 15, 18, 16, 13, 12, 14, 11, 9, 10, 12],
    bedOccupancyTrend: [60, 62, 65, 63, 67, 70, 68, 72, 75, 73, 70, 68],
    readmissionRisk: 6,
    surgeryVolume: [5, 8, 6, 9, 7, 10, 8, 11, 9, 7, 8, 6],
  });

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
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Flu vaccine available this week", type: "info", read: false, timestamp: new Date() },
    { id: 2, text: "Your lab results are ready", type: "success", read: false, timestamp: new Date() },
    { id: 3, text: "Appointment reminder: Tomorrow 10:00 AM", type: "reminder", read: false, timestamp: new Date() },
  ]);

  // Speech Recognition Ref
  const speechRecRef = useRef(null);

  // Effects
  useEffect(() => {
    // Update live stats periodically
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        beds: Math.max(20, Math.min(60, prev.beds + Math.floor(Math.random() * 5) - 2)),
        doctorsOnline: Math.max(10, Math.min(25, prev.doctorsOnline + Math.floor(Math.random() * 3) - 1)),
        erWait: Math.max(5, Math.min(30, prev.erWait + Math.floor(Math.random() * 5) - 2)),
        surgeries: Math.max(0, Math.min(8, prev.surgeries + Math.floor(Math.random() * 3) - 1)),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rotate appointment slots
    const interval = setInterval(() => {
      setSlots(s => s.map(slot => ({ ...slot, free: Math.random() > 0.4 })));
    }, 15000);
    return () => clearInterval(interval);
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
    defaultServices.filter(s => 
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

  const bookSlot = async (slot) => {
    if (!slot.free) {
      toast.error('Slot already booked');
      return;
    }
    
    setSlots(s => s.map(sl => sl.id === slot.id ? { ...sl, free: false } : sl));
    toast.success(`Booked appointment at ${slot.time}`);
    setPoints(p => p + 5);
  };

  const mockLogin = (role = 'patient') => {
    const newUser = {
      id: `USR-${Date.now()}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      phone: faker.phone.number(),
      bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
      memberSince: faker.date.past({ years: 3 }).toISOString().slice(0, 10),
    };
    setUser(newUser);
    setPoints(faker.number.int({ min: 100, max: 5000 }));
    toast.success(`Logged in as ${role}`);
  };

  const mockLogout = () => {
    setUser(null);
    setPoints(0);
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
    toast.success(`Enrolled in ${program.name}! +10 points`);
  };

  const handleJoinChallenge = (challenge) => {
    setPoints(p => p + 5);
    toast.success(`Joined ${challenge.name}! +5 points`);
  };

  const handleRefillMedication = (medication) => {
    toast.success(`Refill request sent for ${medication.name}`);
  };

  const handleReadArticle = (article) => {
    setPoints(p => p + 2);
    toast.success(`Reading: ${article.title} +2 points`);
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
              className={`min-h-screen ${dark ? 'dark' : ''} ${fontSizeClasses[fontSize]} ${contrastClasses}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <Toaster position="top-right" />

                {/* ==================== HEADER ==================== */}
                <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
                  <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      {/* Logo */}
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-2.5 rounded-xl shadow-lg">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h1 className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Medicore Hospital
                          </h1>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            24/7 Emergency & Telehealth
                          </p>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                          <Search className="w-5 h-5 text-gray-400" />
                          <input
                            id="search-input"
                            value={searchQ}
                            onChange={(e) => runSearch(e.target.value)}
                            placeholder={t('search')}
                            className="flex-1 bg-transparent outline-none text-sm"
                            aria-label="Search"
                          />
                          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 rounded">
                            ⌘K
                          </kbd>
                          <button
                            onClick={startSpeechSearch}
                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Voice search"
                          >
                            <Mic className="w-4 h-4 text-gray-500" />
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
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                          >
                            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                          </button>
                        </Tooltip>

                        {/* Font Size Toggle */}
                        <Tooltip content="Adjust font size">
                          <button
                            onClick={() => setFontSize(f => f === 'base' ? 'lg' : f === 'lg' ? 'xl' : 'base')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-bold"
                          >
                            A{fontSize === 'base' ? '' : fontSize === 'lg' ? '+' : '++'}
                          </button>
                        </Tooltip>

                        {/* Language Selector */}
                        <Tooltip content="Change language">
                          <button
                            onClick={() => setLang(l => l === 'en' ? 'ur' : l === 'ur' ? 'ar' : l === 'ar' ? 'zh' : 'en')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* High Contrast Toggle */}
                        <Tooltip content="Toggle high contrast">
                          <button
                            onClick={() => setHighContrast(!highContrast)}
                            className={`p-2 rounded-lg transition-colors ${highContrast ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* Sign Language Toggle */}
                        <Tooltip content="Sign language interpreter">
                          <button
                            onClick={() => setShowSignLanguage(!showSignLanguage)}
                            className={`p-2 rounded-lg transition-colors ${showSignLanguage ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                          >
                            <Hand className="w-5 h-5" />
                          </button>
                        </Tooltip>

                        {/* Notifications */}
                        <div className="relative">
                          <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                          >
                            <Bell className="w-5 h-5" />
                            {notifications.filter(n => !n.read).length > 0 && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {notifications.filter(n => !n.read).length}
                              </span>
                            )}
                          </button>
                          
                          {notificationsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50">
                              <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                                <h3 className="font-semibold">{t('notifications')}</h3>
                                <button onClick={clearAllNotifications} className="text-sm text-gray-500 hover:text-gray-700">
                                  Clear all
                                </button>
                              </div>
                              <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                  <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No notifications</p>
                                  </div>
                                ) : (
                                  notifications.map((notification) => (
                                    <div
                                      key={notification.id}
                                      className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
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
                                          <p className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.timestamp).toLocaleString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                                          className="text-gray-400 hover:text-gray-600"
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
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Award className="w-3 h-3 text-yellow-500" />
                                {points.toLocaleString()} points
                              </p>
                            </div>
                            <Avatar src={user.avatar} alt={user.name} size="md" status="online" />
                            <Button variant="ghost" size="sm" onClick={mockLogout}>
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => mockLogin('patient')}>
                              {t('login')}
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => mockLogin('doctor')}>
                              Doctor Login
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-3 md:hidden">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2.5">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                          value={searchQ}
                          onChange={(e) => runSearch(e.target.value)}
                          placeholder={t('search')}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                        <button onClick={startSpeechSearch}>
                          <Mic className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Navigation Tabs */}
                  
                </header>

                {/* ==================== MAIN CONTENT ==================== */}
                <main className="pb-20">
                  {/* Hero Section */}
                  <section className="bg-gradient-to-br from-green-600 via-green-700 to-blue-700 text-white py-16 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-white/20 text-white border-0">
                              <Zap className="w-3 h-3 mr-1" /> AI-Powered
                            </Badge>
                            <Badge className="bg-white/20 text-white border-0">
                              <ShieldCheck className="w-3 h-3 mr-1" /> HIPAA Compliant
                            </Badge>
                          </div>

                          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                            {t('welcome')}
                          </h1>
                          <p className="text-lg text-white/80 mb-6 max-w-xl">
                            Experience next-generation healthcare with AI-assisted diagnostics, 
                            telemedicine, predictive analytics, and personalized wellness programs.
                          </p>

                          <div className="flex flex-wrap gap-3 mb-8">
                            <Button
                              variant="secondary"
                              size="lg"
                              className="bg-white text-green-700 hover:bg-gray-100"
                              onClick={() => navigate('/book-appointment')}
                            >
                              <Calendar className="w-5 h-5" />
                              {t('bookAppointment')}
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="border-white text-white hover:bg-white/10"
                              onClick={() => setChatOpen(true)}
                            >
                              <MessageSquare className="w-5 h-5" />
                              AI Assistant
                            </Button>
                            <Button
                              variant="ghost"
                              size="lg"
                              className="text-white hover:bg-white/10"
                              onClick={() => ttsSpeak('Welcome to Medicore Hospital. How can we help you today?')}
                            >
                              <Volume2 className="w-5 h-5" />
                              Listen
                            </Button>
                          </div>

                          {/* Compliance Badges */}
                          <div className="flex flex-wrap gap-3">
                            {['ISO 9001', 'NABH', 'JCI', 'HIPAA', 'SehatCard'].map((badge) => (
                              <span key={badge} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Featured Doctor Card */}
                        <div className="hidden lg:block">
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar src={doctors[0].avatar} alt={doctors[0].name} size="xl" status="online" />
                              <div>
                                <h3 className="font-semibold text-lg">{doctors[0].name}</h3>
                                <p className="text-white/70">{doctors[0].specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{doctors[0].rating}</span>
                                  <span className="text-white/50">• {doctors[0].years} years exp</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-white/10 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold">{doctors[0].reviewCount}</p>
                                <p className="text-xs text-white/70">Reviews</p>
                              </div>
                              <div className="bg-white/10 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold">{formatCurrency(doctors[0].consultationFee)}</p>
                                <p className="text-xs text-white/70">Consultation</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                className="flex-1 bg-white text-green-700"
                                onClick={() => handleBookDoctor(doctors[0])}
                              >
                                Book Now
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-white border border-white/30"
                                onClick={() => handleStartVideoCall(doctors[0])}
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
                        { icon: <Calendar className="w-6 h-6" />, label: 'Book Appointment', color: 'green', action: () => navigate('/book-appointment') },
                        { icon: <Video className="w-6 h-6" />, label: 'Telemedicine', color: 'blue', action: () => navigate('/Diagnostic') },
                        { icon: <FileText className="w-6 h-6" />, label: 'Home Healthcare', color: 'purple', action: () => navigate('/home-healthcare') },
                        { icon: <Pill className="w-6 h-6" />, label: 'Pharmacy', color: 'orange', action: () => navigate('/pharmacy') },
                        { icon: <AlertTriangle className="w-6 h-6" />, label: 'Emergency', color: 'red', action: () => navigate('/emergency') },
                        { icon: <MessageSquare className="w-6 h-6" />, label: 'AI Assistant', color: 'cyan', action: () => setChatOpen(true) },
                      ].map((item, i) => (
                        <Card
                          key={i}
                          hover
                          className="p-4 text-center cursor-pointer group"
                          onClick={item.action}
                        >
                          <div className={`w-12 h-12 mx-auto rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                          </div>
                          <p className="text-sm font-medium">{item.label}</p>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Services Section */}
                  <section className="py-12 bg-gray-100 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold">{t('ourServices')}</h2>
                          <p className="text-gray-500 mt-1">Comprehensive healthcare solutions</p>
                        </div>
                        <Button variant="outline">
                          View All <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {defaultServices.map((service) => (
                          <Card key={service.key} hover className="p-6 group">
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{service.desc}</p>
                            <Button variant="ghost" size="sm" className="group-hover:text-green-600" onClick={() => navigate('/services')}>
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
                          <p className="text-gray-500 mb-4">
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
                              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  Parsed Booking Intent
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Specialty:</span>
                                    <span className="ml-2 font-medium">{nlParse.specialty || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Date:</span>
                                    <span className="ml-2 font-medium">{nlParse.date || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Time:</span>
                                    <span className="ml-2 font-medium">{nlParse.time || '—'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Type:</span>
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
                                <Button variant="primary" size="sm" className="mt-4 w-full">
                                  Confirm Booking
                                </Button>
                              </div>
                            )}

                            {/* Selected Doctor */}
                            {selectedDoctor && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <Avatar src={selectedDoctor.avatar} alt={selectedDoctor.name} size="lg" />
                                  <div>
                                    <p className="font-medium">{selectedDoctor.name}</p>
                                    <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
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
                          <p className="text-gray-500 mb-4">
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
                                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-500 hover:shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
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

                          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                              Live updates active
                            </span>
                            <Button variant="ghost" size="sm">
                              View more dates
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </section>

                  {/* Predictive Insights Section */}
                  <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Brain className="w-6 h-6 text-purple-400" />
                            {t('predictiveInsights')}
                          </h2>
                          <p className="text-gray-400 mt-1">AI-powered analytics and forecasting</p>
                        </div>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                          View Dashboard
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-gray-400 mb-2">ER Wait Forecast</h4>
                          <p className="text-3xl font-bold mb-4">{liveStats.erWait} min</p>
                          <MiniSpark data={insights.erWaitForecast} color="#10B981" height={60} />
                          <p className="text-xs text-gray-400 mt-2">Next 12 hours prediction</p>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-gray-400 mb-2">Bed Occupancy Trend</h4>
                          <p className="text-3xl font-bold mb-4">{insights.bedOccupancyTrend[insights.bedOccupancyTrend.length - 1]}%</p>
                          <MiniSpark data={insights.bedOccupancyTrend} color="#3B82F6" height={60} />
                          <p className="text-xs text-gray-400 mt-2">7-day trend</p>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-gray-400 mb-2">Readmission Risk</h4>
                          <div className="flex items-center gap-4">
                            <DonutChart value={insights.readmissionRisk} max={100} size={80} color="#EF4444" />
                            <div>
                              <p className="text-2xl font-bold">{insights.readmissionRisk}%</p>
                              <p className="text-xs text-green-400">Low risk</p>
                            </div>
                          </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                          <h4 className="text-sm text-gray-400 mb-2">Surgery Volume</h4>
                          <p className="text-3xl font-bold mb-4">{liveStats.surgeries} active</p>
                          <MiniSpark data={insights.surgeryVolume} color="#8B5CF6" height={60} />
                          <p className="text-xs text-gray-400 mt-2">Daily surgeries</p>
                        </Card>
                      </div>

                      {/* Disease Outbreak Alert */}
                      <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="w-8 h-8 text-yellow-400" />
                          <div>
                            <h4 className="font-semibold text-yellow-400">Flu Season Alert</h4>
                            <p className="text-sm text-gray-300">
                              Increased flu cases detected in your area. Vaccination recommended. 
                              <Button variant="ghost" size="sm" className="text-yellow-400 ml-2">
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
                          <p className="text-gray-500 mt-1">Expert specialists across all departments</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4" /> Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </div>
                      </div>

                      {/* Specialty Filter */}
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Psychiatry'].map((specialty) => (
                          <button
                            key={specialty}
                            className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {doctors.slice(0, 8).map((doctor) => (
                          <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onBook={handleBookDoctor}
                            onViewProfile={handleViewDoctorProfile}
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
                  <section className="py-12 bg-gray-100 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4">
                      <h2 className="text-2xl font-bold mb-8">Health Tools & Trackers</h2>

                      <div className="grid lg:grid-cols-3 gap-6">
                        <SymptomChecker />
                        <MoodTracker />
                        <VitalSignsWidget vitals={vitals} />
                      </div>

                      <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        <MedicationReminder medications={medications} />
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
                          <p className="text-gray-500 mt-1">Earn points, unlock rewards, stay healthy</p>
                        </div>
                        {user && (
                          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-4 py-2 rounded-xl">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Your Points</p>
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
                            {wellnessPrograms.slice(0, 4).map((program) => (
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
                  <section className="py-12 bg-gray-100 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Testimonials */}
                        <div>
                          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            {t('patientStories')}
                          </h2>
                          <div className="space-y-4">
                            {testimonials.slice(0, 3).map((testimonial) => (
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
                            {articles.slice(0, 3).map((article) => (
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
                            {insuranceProviders.slice(0, 4).map((insurance) => (
                              <InsuranceCard key={insurance.id} insurance={insurance} />
                            ))}
                          </div>
                        </div>

                        {/* Emergency Services */}
                        <EmergencyServicesWidget />
                      </div>
                    </div>
                  </section>

                  {/* Research Studies Section */}
                  <section className="py-12 bg-purple-50 dark:bg-purple-900/20">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <ResearchStudiesWidget />
                        <HospitalMap />
                      </div>
                    </div>
                  </section>

                  {/* Footer Compliance Section */}
                  <section className="py-8 bg-gray-100 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4">
                      <h3 className="text-center text-sm text-gray-500 mb-4">Accreditations & Compliance</h3>
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
                      className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                      className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
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
                  <div className="bg-white dark:bg-gray-800 rounded-r-xl shadow-lg p-2 space-y-2">
                    <Tooltip content="Increase font size">
                      <button
                        onClick={() => setFontSize(f => f === 'base' ? 'lg' : f === 'lg' ? 'xl' : 'base')}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Type className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="High contrast">
                      <button
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${highContrast ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Sign language">
                      <button
                        onClick={() => setShowSignLanguage(!showSignLanguage)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${showSignLanguage ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        <Hand className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Read aloud">
                      <button
                        onClick={() => ttsSpeak('Welcome to Medicore Hospital. How can we help you today?')}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Cookie Consent Banner */}
                {!localStorage.getItem('cookieConsent') && (
                  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 shadow-lg">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
  // Data generators
  makeDoctors,
  makePatients,
  makeAppointments,
  makeLabResults,
  makeMedications,
  makeEquipment,
  makeRooms,
  makeStaff,
  makeArticles,
  makeTestimonials,
  makeInsuranceProviders,
  makeEmergencyServices,
  makeWellnessPrograms,
  makeChallenges,
  makeLeaderboard,
  makeResearchStudies,
  // Constants
  defaultServices,
  translations,
};