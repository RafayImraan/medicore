
import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  LayoutDashboard, Users, Stethoscope, Building2, Pill,
  BarChart3, Settings, Bell, Search, ChevronRight,
  MoreVertical, ArrowUp, ArrowDown, LogOut, Clock,
  CalendarDays, CheckCircle2, AlertCircle, XCircle,
  Ambulance, Zap, Activity, TrendingUp, TrendingDown,
  MapPin, AlertTriangle
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ============================================================================
// 1. DESIGN SYSTEM (Enterprise Primitives)
// ============================================================================

// Shimmer Loading Component
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}></div>
);

// Utility for class merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Enterprise Card
const Card = ({ children, className }) => (
  <div className={cn("bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-sm shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20", className)}>
    {children}
  </div>
);

// Enterprise Button
const Button = ({ children, variant = "primary", size = "md", icon: Icon, onClick, className }) => {
  const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base", icon: "h-10 w-10" };
  
  return (
    <button onClick={onClick} className={cn(base, variants[variant], sizes[size], "rounded-md", className)}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    "Stable": "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    "Critical": "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    "Surgery": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    "On Duty": "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    "Break": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", styles[status] || styles["On Duty"])}>
      {status}
    </span>
  );
};

// ============================================================================
// 2. DATA SIMULATION ENGINE
// ============================================================================

const GlobalContext = createContext({
  activeTab: "dashboard",
  setActiveTab: () => {},
  theme: "dark",
  setTheme: () => {},
  stats: { occupancy: 75, revenue: 30000, waitingRoom: 5, surgeries: 2 },
  currentTime: new Date(),
  patients: [],
  staff: [],
  liveStreams: {
    erQueueLength: 0,
    activeSurgeries: 0,
    ambulanceETA: 0,
    infectionSpikes: 0,
    deviceTelemetry: { ventilators: 0, monitors: 0, infusionPumps: 0 }
  },
  aiInsights: [],
  filters: {
    department: "All",
    timeframe: "24h",
    severity: "All"
  },
  setFilters: () => {},
  selectedMetric: null,
  setSelectedMetric: () => {},
  visibleMetrics: [],
  setVisibleMetrics: () => {},
  refreshSpeed: 30,
  setRefreshSpeed: () => {},
  // New simulation features
  cache: {},
  isOnline: true,
  lastError: null,
  retryCount: 0,
  optimisticUpdates: {},
  setOptimisticUpdate: () => {},
  clearOptimisticUpdate: () => {}
});

const generateLiveStats = () => ({
  occupancy: Math.floor(Math.random() * (95 - 75) + 75),
  revenue: Math.floor(Math.random() * (50000 - 30000) + 30000),
  waitingRoom: Math.floor(Math.random() * 20),
  surgeries: Math.floor(Math.random() * 8)
});

// ============================================================================
// FAKE REST API GENERATOR
// ============================================================================

const mockApi = {
  // Simulate network delay and random errors
  simulateDelay: (min = 100, max = 1000) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min)),

  simulateError: () => Math.random() < 0.1, // 10% chance of error

  // Fake REST API methods
  fetchStats: async (filters = {}) => {
    await mockApi.simulateDelay(200, 800);
    if (mockApi.simulateError()) throw new Error('Network timeout');

    const baseStats = generateLiveStats();
    // Apply filters logic
    if (filters.timeframe === '24h') {
      baseStats.revenue = Math.floor(baseStats.revenue * 0.8);
    } else if (filters.timeframe === '7d') {
      baseStats.revenue = Math.floor(baseStats.revenue * 7);
    }

    return { data: baseStats, timestamp: new Date().toISOString() };
  },

  fetchPatients: async (params = {}) => {
    await mockApi.simulateDelay(300, 1200);
    if (mockApi.simulateError()) throw new Error('Server error');

    const patients = Array.from({ length: params.limit || 12 }).map((_, i) => ({
      id: `PAT-${202400 + i + (params.page || 0) * 12}`,
      name: PATIENT_NAMES[i % PATIENT_NAMES.length] + (i > 7 ? ` ${i}` : ""),
      age: 20 + Math.floor(Math.random() * 60),
      gender: Math.random() > 0.5 ? "M" : "F",
      dept: DEPARTMENTS[i % DEPARTMENTS.length],
      doctor: `Dr. ${["House", "Grey", "Strange", "Who"][i % 4]}`,
      status: ["Stable", "Critical", "Surgery", "Recovering"][Math.floor(Math.random() * 4)],
      insurance: Math.random() > 0.2 ? "Verified" : "Pending",
      lastVitals: `${90 + Math.floor(Math.random()*40)}/${60 + Math.floor(Math.random()*30)}`,
      admissionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    return {
      data: patients,
      pagination: {
        page: params.page || 0,
        limit: params.limit || 12,
        total: 1204,
        totalPages: Math.ceil(1204 / (params.limit || 12))
      }
    };
  },

  fetchStaff: async () => {
    await mockApi.simulateDelay(250, 600);
    if (mockApi.simulateError()) throw new Error('Authentication failed');

    return {
      data: Array.from({ length: 8 }).map((_, i) => ({
        id: `STF-${100 + i}`,
        name: `Dr. ${PATIENT_NAMES[i % 5].split(" ")[1]}`,
        role: STAFF_ROLES[i % 4],
        dept: DEPARTMENTS[i % DEPARTMENTS.length],
        status: ["On Duty", "In Surgery", "Break", "Off"][Math.floor(Math.random() * 4)],
        load: Math.floor(Math.random() * 100),
        lastActive: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString()
      }))
    };
  },

  updatePatientStatus: async (patientId, newStatus) => {
    await mockApi.simulateDelay(500, 1500);
    if (mockApi.simulateError()) throw new Error('Update failed');

    return {
      data: {
        id: patientId,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: 'System'
      }
    };
  },

  fetchLiveStreams: async () => {
    await mockApi.simulateDelay(100, 300);
    return {
      data: {
        erQueueLength: Math.floor(Math.random() * 15),
        activeSurgeries: Math.floor(Math.random() * 6),
        ambulanceETA: Math.floor(Math.random() * 25) + 5,
        infectionSpikes: Math.floor(Math.random() * 5),
        deviceTelemetry: {
          ventilators: Math.floor(Math.random() * 12) + 3,
          monitors: Math.floor(Math.random() * 20) + 10,
          infusionPumps: Math.floor(Math.random() * 15) + 5
        }
      }
    };
  }
};

const PATIENT_NAMES = ["James Anderson", "Sarah Chen", "Michael Rossi", "Emily Blunt", "David Okafor", "Linda Kim", "Robert Stone", "Patricia Silva"];
const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Emergency", "Pediatrics"];
const STAFF_ROLES = ["Chief Surgeon", "Senior Resident", "Head Nurse", "Anesthesiologist"];

function GlobalProvider({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [stats, setStats] = useState(generateLiveStats());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStreams, setLiveStreams] = useState({
    erQueueLength: 0,
    activeSurgeries: 0,
    ambulanceETA: 0,
    infectionSpikes: 0,
    deviceTelemetry: { ventilators: 0, monitors: 0, infusionPumps: 0 }
  });
  const [aiInsights, setAiInsights] = useState([
    { type: 'prediction', message: 'Patient admission surge expected in 2 hours', severity: 'medium', trend: 'up' },
    { type: 'alert', message: 'ICU capacity at 85% - prepare overflow protocols', severity: 'high' },
    { type: 'prediction', message: 'Staff burnout risk increasing - consider shift adjustments', severity: 'medium', trend: 'up' },
    { type: 'alert', message: 'Equipment maintenance required in OR-3', severity: 'low' },
    { type: 'prediction', message: 'Pharmacy inventory low on critical medications', severity: 'high', trend: 'down' }
  ]);
  const [filters, setFilters] = useState({
    department: "All",
    timeframe: "24h",
    severity: "All"
  });
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [visibleMetrics, setVisibleMetrics] = useState([
    "bedOccupancy", "erQueue", "surgeries", "ambulance", "infections", "telemetry", "revenue", "waitingRoom"
  ]);
  const [refreshSpeed, setRefreshSpeed] = useState(30);

  // New simulation features
  const [cache, setCache] = useState({});
  const [isOnline, setIsOnline] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  // Cache management functions
  const getCachedData = (key) => cache[key];
  const setCachedData = (key, data, ttl = 300000) => { // 5 minutes default TTL
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: Date.now(), ttl }
    }));
  };

  const isCacheValid = (key) => {
    const cached = cache[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < cached.ttl;
  };

  // Optimistic update functions
  const setOptimisticUpdate = (key, data) => {
    setOptimisticUpdates(prev => ({ ...prev, [key]: data }));
  };

  const clearOptimisticUpdate = (key) => {
    setOptimisticUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[key];
      return newUpdates;
    });
  };

  // Enhanced API wrapper with caching and error simulation
  const apiCall = async (method, key, ...args) => {
    try {
      // Check cache first
      if (isCacheValid(key)) {
        return getCachedData(key).data;
      }

      // Simulate network conditions
      if (!isOnline) {
        throw new Error('Network offline');
      }

      const result = await mockApi[method](...args);

      // Cache successful results
      setCachedData(key, result);

      // Clear any previous errors
      setLastError(null);
      setRetryCount(0);

      return result;
    } catch (error) {
      setLastError(error.message);

      // Try to return cached data on error
      if (isCacheValid(key)) {
        console.warn(`API call failed, using cached data for ${key}`);
        return getCachedData(key).data;
      }

      throw error;
    }
  };

  // Fake Database
  const [patients, setPatients] = useState(Array.from({ length: 12 }).map((_, i) => ({
    id: `PAT-${202400 + i}`,
    name: PATIENT_NAMES[i % PATIENT_NAMES.length] + (i > 7 ? ` ${i}` : ""),
    age: 20 + Math.floor(Math.random() * 60),
    gender: Math.random() > 0.5 ? "M" : "F",
    dept: DEPARTMENTS[i % DEPARTMENTS.length],
    doctor: `Dr. ${["House", "Grey", "Strange", "Who"][i % 4]}`,
    status: ["Stable", "Critical", "Surgery", "Recovering"][Math.floor(Math.random() * 4)],
    insurance: Math.random() > 0.2 ? "Verified" : "Pending",
    lastVitals: `${90 + Math.floor(Math.random()*40)}/${60 + Math.floor(Math.random()*30)}`
  })));

  const [staff, setStaff] = useState(Array.from({ length: 8 }).map((_, i) => ({
    id: `STF-${100 + i}`,
    name: `Dr. ${PATIENT_NAMES[i % 5].split(" ")[1]}`,
    role: STAFF_ROLES[i % 4],
    dept: DEPARTMENTS[i % DEPARTMENTS.length],
    status: ["On Duty", "In Surgery", "Break", "Off"][Math.floor(Math.random() * 4)],
    load: Math.floor(Math.random() * 100)
  })));

  // Socket.IO connection
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('liveStatsUpdate', (data) => {
      setStats(prev => ({ ...prev, occupancy: data.beds }));
    });

    socket.on('erQueueUpdate', (data) => {
      setLiveStreams(prev => ({ ...prev, erQueueLength: data.erQueueLength }));
    });

    socket.on('activeSurgeriesUpdate', (data) => {
      setLiveStreams(prev => ({ ...prev, activeSurgeries: data.activeSurgeries }));
    });

    socket.on('ambulanceETAUpdate', (data) => {
      setLiveStreams(prev => ({ ...prev, ambulanceETA: data.ambulanceETA }));
    });

    socket.on('infectionSpikesUpdate', (data) => {
      setLiveStreams(prev => ({ ...prev, infectionSpikes: data.infectionSpikes }));
    });

    socket.on('deviceTelemetryUpdate', (data) => {
      setLiveStreams(prev => ({ ...prev, deviceTelemetry: data }));
    });

    socket.on('aiInsightUpdate', (data) => {
      setAiInsights(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 insights
    });

    // Enhanced WebSocket events for better simulation
    socket.on('patientAdmitted', (data) => {
      console.log('Patient admitted:', data);
      // Could trigger optimistic updates or notifications
    });

    socket.on('staffStatusChange', (data) => {
      console.log('Staff status changed:', data);
      // Update staff status in real-time
    });

    socket.on('equipmentAlert', (data) => {
      console.log('Equipment alert:', data);
      // Handle equipment maintenance alerts
    });

    socket.on('inventoryLow', (data) => {
      console.log('Inventory low:', data);
      // Trigger inventory reorder notifications
    });

    socket.on('systemHealth', (data) => {
      console.log('System health update:', data);
      // Monitor system performance
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // "Websocket" Simulation
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const dataLoop = setInterval(() => {
      setStats(generateLiveStats());

      // Randomly update a patient status
      setPatients(prev => {
        const newArr = [...prev];
        const idx = Math.floor(Math.random() * newArr.length);
        newArr[idx] = {
          ...newArr[idx],
          lastVitals: `${90 + Math.floor(Math.random()*40)}/${60 + Math.floor(Math.random()*30)}`,
          status: Math.random() > 0.9 ? ["Stable", "Critical", "Surgery"][Math.floor(Math.random() * 3)] : newArr[idx].status
        };
        return newArr;
      });

    }, 3000);

    return () => { clearInterval(timer); clearInterval(dataLoop); };
  }, []);

  return (
    <GlobalContext.Provider value={{
      activeTab, setActiveTab, theme, setTheme, stats, currentTime, patients, staff, liveStreams, aiInsights, filters, setFilters, selectedMetric, setSelectedMetric, visibleMetrics, setVisibleMetrics, refreshSpeed, setRefreshSpeed,
      // New simulation features
      cache, isOnline, lastError, retryCount, optimisticUpdates, setOptimisticUpdate, clearOptimisticUpdate, apiCall,
      setIsOnline, setLastError, setRetryCount, setCache, setOptimisticUpdates
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

// ============================================================================
// 3. LAYOUT COMPONENTS
// ============================================================================

const Sidebar = () => {
  const { activeTab, setActiveTab } = useContext(GlobalContext);
  
  const menu = [
    { id: "dashboard", label: "Executive Overview", icon: LayoutDashboard },
    { id: "patients", label: "Patient Records", icon: Users },
    { id: "staff", label: "Staff Rostering", icon: Stethoscope },
    { id: "finance", label: "Financial Analytics", icon: BarChart3 },
    { id: "inventory", label: "Inventory & Assets", icon: Pill },
  ];

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl">
      {/* Header - No Logo, Text Only */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="ml-auto text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">V.4.2</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-4">
        <div className="text-xs font-semibold text-slate-500 mb-4 px-2 uppercase tracking-wider">Module Navigation</div>
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
              activeTab === item.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5 opacity-80" />
            {item.label}
            {activeTab === item.id && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
          </button>
        ))}
      </nav>

      {/* Bottom Section - User Profile */}
      <div className="mt-auto border-t border-slate-800 p-4 bg-slate-950">
        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-slate-900 p-2 rounded transition">
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-500">System Administrator</p>
          </div>
          <Settings className="h-4 w-4 text-slate-500" />
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

const Header = () => {
  const { currentTime, theme, setTheme } = useContext(GlobalContext);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Search */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Global search (Patients, Doctors, IDs)..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right: Status */}
      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
            <Clock className="h-3 w-3" /> System Time
          </div>
          <div className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-sm border border-slate-300 dark:border-slate-700 rounded px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="low-light">Low Light</option>
        </select>

        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
        </button>
      </div>
    </header>
  );
};

// ============================================================================
// 4. MODULE VIEWS
// ============================================================================



// --- DASHBOARD ---
const DashboardView = () => {
  const { stats, liveStreams, aiInsights, filters, setFilters, selectedMetric, setSelectedMetric, visibleMetrics, setVisibleMetrics, refreshSpeed, setRefreshSpeed, theme, setTheme, isOnline, lastError, setIsOnline, setLastError, setCache, setOptimisticUpdates, retryCount } = useContext(GlobalContext);

  // Fake Chart Data
  const chartData = [
    { time: '08:00', admissions: 12, discharges: 5 },
    { time: '10:00', admissions: 19, discharges: 8 },
    { time: '12:00', admissions: 25, discharges: 15 },
    { time: '14:00', admissions: 30, discharges: 20 },
    { time: '16:00', admissions: 22, discharges: 28 },
    { time: '18:00', admissions: 15, discharges: 30 },
  ];

  // Simulated data for new features
  const diseaseOutbreakData = {
    cityWide: 23.5, // probability %
    hospitalWide: 12.8,
  };

  const patientDeteriorationAlerts = [
    { patient: "John Doe", condition: "Sepsis", likelihood: 78, risk: "High" },
    { patient: "Jane Smith", condition: "Cardiac Risk", likelihood: 65, risk: "Medium" },
    { patient: "Bob Johnson", condition: "Respiratory Decline", likelihood: 82, risk: "High" },
  ];

  const admissionForecast = {
    next24h: 45,
    weekly: 320,
    seasonal: "Increasing",
  };

  const resourceStrain = {
    icuOverload: 87, // %
    predictedTime: "2 hours",
  };

  const staffBurnout = {
    predictedBurnout: 3, // staff members
    averageWorkload: 92, // %
  };

  const aiScheduling = [
    "Shift swap: Dr. Grey (Night) ↔ Dr. House (Day)",
    "Extra coverage needed: ER 6-10 PM",
    "Break optimization: Reduce overlaps by 15%",
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Advanced Simulation Controls</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {isOnline ? 'Online' : 'Offline'} | Errors: {retryCount}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsOnline(!isOnline);
                if (!isOnline) setLastError(null);
              }}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setLastError(`Simulated error at ${new Date().toLocaleTimeString()}`)}
            >
              Trigger Error
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCache({});
                setLastError(null);
                setRetryCount(0);
                setOptimisticUpdates({});
              }}
            >
              Clear Cache
            </Button>
          </div>
        </div>
        {lastError && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
            ⚠️ {lastError}
          </div>
        )}
      </Card>

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department:</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="text-sm border border-slate-300 dark:border-slate-700 rounded px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Emergency">Emergency</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timeframe:</label>
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
              className="text-sm border border-slate-300 dark:border-slate-700 rounded px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Severity:</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="text-sm border border-slate-300 dark:border-slate-700 rounded px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Refresh Speed:</label>
            <select
              value={refreshSpeed}
              onChange={(e) => setRefreshSpeed(Number(e.target.value))}
              className="text-sm border border-slate-300 dark:border-slate-700 rounded px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFilters({ department: "All", timeframe: "24h", severity: "All" })}>
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Dashboard Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard Controls</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Visible Metrics:</label>
              <div className="flex gap-2">
                {[
                  { key: "bedOccupancy", label: "Bed Occupancy" },
                  { key: "erQueue", label: "ER Queue" },
                  { key: "surgeries", label: "Surgeries" },
                  { key: "ambulance", label: "Ambulance" },
                  { key: "infections", label: "Infections" },
                  { key: "telemetry", label: "Telemetry" },
                  { key: "revenue", label: "Revenue" },
                  { key: "waitingRoom", label: "Waiting Room" }
                ].map((metric) => (
                  <label key={metric.key} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={visibleMetrics.includes(metric.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVisibleMetrics(prev => [...prev, metric.key]);
                        } else {
                          setVisibleMetrics(prev => prev.filter(m => m !== metric.key));
                        }
                      }}
                      className="rounded"
                    />
                    {metric.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => console.log("Exporting to CSV...")}>
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={() => console.log("Exporting to Excel...")}>
              Export Excel
            </Button>
            <Button variant="secondary" size="sm" onClick={() => console.log("Exporting to PDF...")}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleMetrics.includes("bedOccupancy") && (
          <MetricCard label="Bed Occupancy" value={`${stats.occupancy}%`} trend="+2.4%" trendUp={true} icon={Building2} metricKey="bedOccupancy" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("erQueue") && (
          <MetricCard label="ER Queue Length" value={liveStreams.erQueueLength} trend="Live" icon={Users} color="text-orange-600" metricKey="erQueue" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("surgeries") && (
          <MetricCard label="Active Surgeries" value={liveStreams.activeSurgeries} trend="Live" icon={Stethoscope} color="text-blue-600" metricKey="surgeries" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("ambulance") && (
          <MetricCard label="Ambulance ETA" value={`${liveStreams.ambulanceETA} min`} trend="Live" icon={Ambulance} color="text-red-600" metricKey="ambulance" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("infections") && (
          <MetricCard label="Infection Spikes" value={liveStreams.infectionSpikes} trend="Live" icon={Zap} color="text-purple-600" metricKey="infections" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("telemetry") && (
          <MetricCard label="Device Telemetry" value={`${liveStreams.deviceTelemetry.ventilators}/${liveStreams.deviceTelemetry.monitors}/${liveStreams.deviceTelemetry.infusionPumps}`} trend="Live" icon={Activity} color="text-green-600" metricKey="telemetry" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("revenue") && (
          <MetricCard label="Daily Revenue" value={`$${stats.revenue.toLocaleString()}`} trend="+12.5%" trendUp={true} icon={BarChart3} metricKey="revenue" onClick={setSelectedMetric} />
        )}
        {visibleMetrics.includes("waitingRoom") && (
          <MetricCard label="Waiting Room" value={stats.waitingRoom} trend="-5" trendUp={false} icon={Users} color="text-amber-600" metricKey="waitingRoom" onClick={setSelectedMetric} />
        )}
      </div>

      {/* New Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Disease Outbreak Tracking */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Disease Outbreak Tracking</h3>
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">City-wide Probability</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{diseaseOutbreakData.cityWide}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${diseaseOutbreakData.cityWide}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Hospital-wide</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{diseaseOutbreakData.hospitalWide}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${diseaseOutbreakData.hospitalWide}%` }}></div>
            </div>
          </div>
        </Card>

        {/* Patient Deterioration Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Patient Deterioration Alerts</h3>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="space-y-3">
            {patientDeteriorationAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.patient}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{alert.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{alert.likelihood}%</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${alert.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {alert.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Admission Load Forecasting */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Admission Load Forecasting</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Next 24 Hours</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{admissionForecast.next24h}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Weekly Total</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{admissionForecast.weekly}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Seasonal Trend</span>
              <span className={`text-sm font-medium ${admissionForecast.seasonal === 'Increasing' ? 'text-green-600' : 'text-red-600'}`}>
                {admissionForecast.seasonal}
              </span>
            </div>
          </div>
        </Card>

        {/* Resource Strain Level Meter */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Resource Strain Level</h3>
            <Activity className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">ICU Overload</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{resourceStrain.icuOverload}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div className={`h-3 rounded-full ${resourceStrain.icuOverload > 80 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${resourceStrain.icuOverload}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Predicted Time</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{resourceStrain.predictedTime}</span>
            </div>
          </div>
        </Card>

        {/* Staff Burnout Prediction */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Staff Burnout Prediction</h3>
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Predicted Burnout</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{staffBurnout.predictedBurnout} staff</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Average Workload</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{staffBurnout.averageWorkload}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${staffBurnout.averageWorkload > 90 ? 'bg-red-500' : staffBurnout.averageWorkload > 80 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${staffBurnout.averageWorkload}%` }}></div>
            </div>
          </div>
        </Card>

        {/* AI-Generated Scheduling Recommendations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">AI Scheduling Recommendations</h3>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            {aiScheduling.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-900 dark:text-white">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* New Operational Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* OR Schedule Grid */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">OR Schedule Grid</h3>
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1 text-xs font-medium text-slate-500 mb-2">
              <span>Room</span>
              <span>Procedure</span>
              <span>Status</span>
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1 text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <span className="font-medium">OR-1</span>
                <span>Cardiac Bypass</span>
                <StatusBadge status="Surgery" />
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                <span className="font-medium">OR-2</span>
                <span>Appendectomy</span>
                <span className="text-amber-600">Starting Soon</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span className="font-medium">OR-3</span>
                <span>Knee Replacement</span>
                <span className="text-blue-600">In Progress</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <span className="font-medium">OR-4</span>
                <span>Emergency</span>
                <span className="text-red-600">Delayed</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Ambulance Live Map Widget */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Ambulance Live Map</h3>
            <MapPin className="h-5 w-5 text-red-600" />
          </div>
          <div className="relative h-48 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            {/* Simple map representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-900 dark:to-blue-900">
              {/* Fake GPS markers */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Ambulance A - 41.40338, 2.17403"></div>
              <div className="absolute top-12 right-8 w-3 h-3 bg-blue-500 rounded-full animate-pulse" title="Ambulance B - 41.38506, 2.17340"></div>
              <div className="absolute bottom-8 left-12 w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Ambulance C - 41.39020, 2.15400"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" title="Ambulance D - 41.37589, 2.17743"></div>
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded">
              Live GPS Tracking
            </div>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Active Units</span>
              <span className="font-medium">4/6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Avg Response</span>
              <span className="font-medium">8.2 min</span>
            </div>
          </div>
        </Card>

        {/* Pharmacy Inventory Forecasting */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Pharmacy Forecasting</h3>
            <Pill className="h-5 w-5 text-purple-600" />
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { day: 'Mon', stock: 85 },
                { day: 'Tue', stock: 78 },
                { day: 'Wed', stock: 92 },
                { day: 'Thu', stock: 67 },
                { day: 'Fri', stock: 73 },
                { day: 'Sat', stock: 88 },
                { day: 'Sun', stock: 95 },
              ]}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#8b5cf6" strokeWidth={2} dot={{fill: '#8b5cf6', strokeWidth: 2, r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Predicted Shortage</span>
              <span className="font-medium text-red-600">3 items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Reorder Needed</span>
              <span className="font-medium text-amber-600">By EOW</span>
            </div>
          </div>
        </Card>

        {/* Ward Status Heatmap */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Ward Occupancy Heatmap</h3>
            <Building2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Cardiology</div>
              <div className="h-8 bg-red-500 rounded" style={{opacity: 0.9}}></div>
              <div className="text-xs font-medium mt-1">95%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Neurology</div>
              <div className="h-8 bg-amber-500 rounded" style={{opacity: 0.7}}></div>
              <div className="text-xs font-medium mt-1">78%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Pediatrics</div>
              <div className="h-8 bg-green-500 rounded" style={{opacity: 0.4}}></div>
              <div className="text-xs font-medium mt-1">45%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Orthopedics</div>
              <div className="h-8 bg-amber-500 rounded" style={{opacity: 0.8}}></div>
              <div className="text-xs font-medium mt-1">82%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Emergency</div>
              <div className="h-8 bg-red-500 rounded" style={{opacity: 1}}></div>
              <div className="text-xs font-medium mt-1">100%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">ICU</div>
              <div className="h-8 bg-red-500 rounded" style={{opacity: 0.85}}></div>
              <div className="text-xs font-medium mt-1">92%</div>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Low</span>
            <span className="text-slate-600 dark:text-slate-400">High</span>
          </div>
        </Card>

        {/* Outage Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Critical Outage Alerts</h3>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Oxygen Supply Low</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Tank 3 - Ward A</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Ventilator Maintenance</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Unit 7 - ICU</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Power Backup Test</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Generator B</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Equipment Usage Meter */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Equipment Usage Meter</h3>
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Ventilators</span>
                <span className="font-medium">7/10 active</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Imaging Machines</span>
                <span className="font-medium">3/5 active</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Dialysis Units</span>
                <span className="font-medium">4/6 active</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Graph */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">Patient Flow Analysis (24h)</h3>
            <select className="text-sm border rounded p-1 bg-transparent dark:text-slate-300 dark:border-slate-700">
              <option>Today</option>
              <option>Yesterday</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '4px'}} />
                <Area type="monotone" dataKey="admissions" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAdm)" />
                <Area type="monotone" dataKey="discharges" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Streaming AI Insights */}
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">Streaming AI Insights</h3>
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">Live</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIInsightsTicker insights={aiInsights} />
          </div>
        </Card>
      </div>

      {/* Drill-down Panel */}
      {selectedMetric && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6"
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedMetric === 'bedOccupancy' && 'Bed Occupancy Details'}
                {selectedMetric === 'erQueue' && 'ER Queue Analysis'}
                {selectedMetric === 'surgeries' && 'Active Surgeries Overview'}
                {selectedMetric === 'ambulance' && 'Ambulance Tracking'}
                {selectedMetric === 'infections' && 'Infection Control Dashboard'}
                {selectedMetric === 'telemetry' && 'Device Telemetry Details'}
                {selectedMetric === 'revenue' && 'Revenue Analytics'}
                {selectedMetric === 'waitingRoom' && 'Waiting Room Management'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMetric(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {selectedMetric === 'bedOccupancy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { ward: 'Cardiology', occupied: 45, total: 50 },
                        { ward: 'Neurology', occupied: 32, total: 40 },
                        { ward: 'Pediatrics', occupied: 18, total: 25 },
                        { ward: 'Emergency', occupied: 28, total: 30 },
                        { ward: 'ICU', occupied: 22, total: 25 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ward" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="occupied" fill="#4f46e5" />
                        <Bar dataKey="total" fill="#e2e8f0" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Beds</span>
                      <span className="font-bold">170</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Occupied</span>
                      <span className="font-bold">145</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Available</span>
                      <span className="font-bold">25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Occupancy Rate</span>
                      <span className="font-bold text-green-600">85.3%</span>
                    </div>
                  </div>
                </div>
              )}
              {selectedMetric === 'erQueue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { time: '08:00', patients: 3 },
                        { time: '10:00', patients: 7 },
                        { time: '12:00', patients: 12 },
                        { time: '14:00', patients: 8 },
                        { time: '16:00', patients: 5 },
                        { time: '18:00', patients: 2 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="patients" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Queue</span>
                      <span className="font-bold">{liveStreams.erQueueLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Average Wait Time</span>
                      <span className="font-bold">45 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Triage Level 1</span>
                      <span className="font-bold text-red-600">2 patients</span>
                    </div>
                  </div>
                </div>
              )}
              {selectedMetric === 'surgeries' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">OR-1: Cardiac Bypass</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Dr. Smith - 2h 30m remaining</p>
                      </div>
                      <StatusBadge status="Surgery" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">OR-2: Appendectomy</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Dr. Johnson - 45m remaining</p>
                      </div>
                      <StatusBadge status="Surgery" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">OR-3: Knee Replacement</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Dr. Davis - Starting in 15m</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Preparing</span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'In Progress', value: 2, fill: '#3b82f6' },
                            { name: 'Scheduled', value: 1, fill: '#10b981' },
                            { name: 'Available', value: 1, fill: '#e2e8f0' },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#10b981" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {selectedMetric === 'revenue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { month: 'Jan', revenue: 280000 },
                        { month: 'Feb', revenue: 320000 },
                        { month: 'Mar', revenue: 290000 },
                        { month: 'Apr', revenue: 350000 },
                        { month: 'May', revenue: 380000 },
                        { month: 'Jun', revenue: 420000 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Today's Revenue</span>
                      <span className="font-bold">${stats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Target</span>
                      <span className="font-bold">$500,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-bold text-green-600">84%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
              )}
              {/* Add similar detailed views for other metrics */}
              {['ambulance', 'infections', 'telemetry', 'waitingRoom'].includes(selectedMetric) && (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed view for {selectedMetric} coming soon...</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

// --- PATIENTS TABLE ---
const PatientsView = () => {
  const { patients } = useContext(GlobalContext);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Patient Directory</h2>
          <p className="text-sm text-slate-500">Manage admissions, discharges, and patient records.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" icon={CalendarDays}>Schedule</Button>
           <Button icon={Users}>New Admission</Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-semibold">
             <tr>
               <th className="px-6 py-4">ID / Name</th>
               <th className="px-6 py-4">Department</th>
               <th className="px-6 py-4">Doctor</th>
               <th className="px-6 py-4">Live Vitals</th>
               <th className="px-6 py-4">Status</th>
               <th className="px-6 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.id}</div>
                </td>
                <td className="px-6 py-4">{p.dept}</td>
                <td className="px-6 py-4">{p.doctor}</td>
                <td className="px-6 py-4 font-mono text-xs">{p.lastVitals}</td>
                <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 flex justify-between">
         <span>Showing 1-12 of 1,204 records</span>
         <div className="flex gap-2">
           <button className="hover:text-slate-900">Previous</button>
           <button className="hover:text-slate-900">Next</button>
         </div>
      </div>
    </Card>
  );
};

// --- STAFF VIEW ---
const StaffView = () => {
  const { staff } = useContext(GlobalContext);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Roster</h2>
         <Button>Generate Schedule</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((s) => (
          <Card key={s.id} className="p-5 hover:shadow-md transition border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                {s.name.charAt(4)}
              </div>
              <StatusBadge status={s.status} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{s.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{s.role}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Current Load</span>
                <span>{s.load}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${s.load > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${s.load}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- FINANCIAL VIEW (Mockup) ---
const FinanceView = () => {
  const data = [
    { name: 'Surgery', value: 400 },
    { name: 'Consultation', value: 300 },
    { name: 'Pharmacy', value: 300 },
    { name: 'Diagnostics', value: 200 },
  ];
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <Card className="p-6">
         <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Revenue by Department</h3>
         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip />
               <Legend />
             </PieChart>
           </ResponsiveContainer>
         </div>
       </Card>
       <Card className="p-6">
         <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Insurance Claims (Weekly)</h3>
         <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', accepted: 40, rejected: 4 },
                { name: 'Tue', accepted: 30, rejected: 8 },
                { name: 'Wed', accepted: 55, rejected: 2 },
                { name: 'Thu', accepted: 45, rejected: 6 },
                { name: 'Fri', accepted: 60, rejected: 5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
         </div>
       </Card>
    </div>
  );
}

// Streaming AI Insights Ticker Component
const AIInsightsTicker = ({ insights }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (insights.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
      }, 3000); // Change insight every 3 seconds
      return () => clearInterval(interval);
    }
  }, [insights]);

  if (insights.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Waiting for AI insights...</p>
      </div>
    );
  }

  const currentInsight = insights[currentIndex];

  return (
    <div className="p-4 space-y-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-full ${currentInsight.type === 'prediction' ? 'bg-green-100 text-green-600' : currentInsight.type === 'alert' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
              {currentInsight.type === 'prediction' ? <TrendingUp className="h-4 w-4" /> : currentInsight.type === 'alert' ? <AlertCircle className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{currentInsight.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${currentInsight.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {currentInsight.type}
                </span>
                {currentInsight.trend && (
                  <span className={`text-xs flex items-center gap-1 ${currentInsight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {currentInsight.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {currentInsight.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1">
        {insights.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 w-4' : 'bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, trendUp, icon: Icon, color, metricKey, onClick }) => (
  <Card
    className={`p-6 relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${onClick ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''}`}
    onClick={() => onClick && onClick(metricKey)}
  >
    <div className="flex justify-between items-start z-10 relative">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${color || "text-slate-900 dark:text-white"}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`flex items-center text-sm font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
        {trendUp ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        {trend}
      </span>
      <span className="text-slate-400 text-xs ml-2">vs last month</span>
    </div>
  </Card>
);

// ============================================================================
// 5. ROOT COMPONENT
// ============================================================================

export default function EnterpriseDashboard() {
  const { theme } = useContext(GlobalContext);

  const themeClasses = {
    light: "bg-white text-slate-900",
    dark: "bg-slate-950 text-slate-100",
    "low-light": "bg-slate-900 text-slate-300",
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900"
  };

  return (
    <GlobalProvider>
      <div className={`flex min-h-screen font-sans ${themeClasses[theme] || themeClasses.dark}`}>
        <Sidebar />
        <div className="flex-1 ml-72 flex flex-col transition-all duration-300">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">
            <MainContentSwitcher />
          </main>
        </div>
      </div>
    </GlobalProvider>
  );
}

function MainContentSwitcher() {
  const { activeTab } = useContext(GlobalContext);

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
          {activeTab === "dashboard" ? "Executive Overview" : 
           activeTab === "staff" ? "Staff Management" : 
           activeTab === "finance" ? "Financial Performance" :
           activeTab}
        </h2>
        <p className="text-slate-500 text-sm">Real-time data synchronization active.</p>
      </div>

      {activeTab === "dashboard" && <DashboardView />}
      {activeTab === "patients" && <PatientsView />}
      {activeTab === "staff" && <StaffView />}
      {activeTab === "finance" && <FinanceView />}
      {activeTab === "inventory" && <InventoryView />}
    </motion.div>
  );
}

// ============================================================================
// 6. INVENTORY MODULE (Detailed Implementation)
// ============================================================================

const InventoryView = () => {
  // Mock Inventory Data
  const inventoryItems = [
    { id: "MED-2991", name: "Amoxicillin 500mg", category: "Pharmaceuticals", stock: 1250, minLevel: 500, expiry: "2025-12-01", supplier: "PharmaCorp", status: "In Stock" },
    { id: "SUR-1102", name: "Surgical Gloves (L)", category: "Consumables", stock: 45, minLevel: 100, expiry: "2026-06-15", supplier: "MedEquip", status: "Low Stock" },
    { id: "MED-9921", name: "Epinephrine Inj.", category: "Emergency", stock: 12, minLevel: 20, expiry: "2024-08-01", supplier: "BioLife", status: "Critical" },
    { id: "EQU-3321", name: "Defibrillator Pads", category: "Equipment", stock: 8, minLevel: 10, expiry: "2025-01-20", supplier: "HeartSafe", status: "Low Stock" },
    { id: "MED-4421", name: "Insulin Glargine", category: "Pharmaceuticals", stock: 300, minLevel: 100, expiry: "2024-11-10", supplier: "PharmaCorp", status: "In Stock" },
    { id: "LAB-8821", name: "MRI Contrast Dye", category: "Radiology", stock: 55, minLevel: 30, expiry: "2024-09-30", supplier: "Imagix", status: "In Stock" },
    { id: "CON-1122", name: "N95 Respirators", category: "PPE", stock: 5000, minLevel: 1000, expiry: "N/A", supplier: "SafeWear", status: "In Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Level Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Valuation</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$2.4M</h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Across 4,203 SKUs</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12 Items</h3>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Requires immediate re-order</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">5 Batches</h3>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Within next 30 days</p>
        </Card>
      </div>

      {/* Main Inventory Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4 items-center bg-slate-50 dark:bg-slate-950">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by SKU, Name or Supplier..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" icon={ArrowUp}>Export CSV</Button>
            <Button icon={Pill}>Create Purchase Order</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-3">SKU Info</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Stock Levels</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Supplier</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{item.stock}</span>
                      <span className="text-slate-400">Target: {item.minLevel}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          item.stock < item.minLevel ? 'bg-red-500' : 
                          item.stock < item.minLevel * 1.5 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${Math.min(100, (item.stock / (item.minLevel * 2)) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {item.expiry}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4">
                     <StatusBadge status={item.status === "In Stock" ? "Stable" : item.status === "Critical" ? "Critical" : "Break"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
