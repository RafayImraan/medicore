import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from "recharts";
import { Sun, Moon, Bell, Download, Wifi, AlertCircle, Users, Map, RefreshCw, Database, Shield, Activity, Zap, Crown, Gem, Sparkles, Trophy, Heart, Plane, Lock, Eye, MessageCircle, Video, Star, Award, TrendingUp, Globe, Camera, Brain, Stethoscope, Ambulance, Pill, Microscope, Syringe, UserCheck, Calendar, BarChart3, PieChart as PieChartIcon, TrendingDown, AlertTriangle, CheckCircle, XCircle, Clock, DollarSign, Target, Rocket, Lightbulb, Coffee, Dumbbell, Moon as SleepIcon, Battery, Wind, Bed } from "lucide-react";
import { io } from "socket.io-client";
import { apiRequest } from "../../services/api";
import {
  useAdminStats,
  useSystemHealth,
  useActivityLogs,
  useSystemNotifications,
  useIncidents,
  useTasks,
  useCreateIncident,
  useCreateTask,
  useUpdateTask
} from "../../hooks/apiHooks";

/*
  AdminDashboardUltimate.jsx
  - Single-file, enterprise-grade Admin Dashboard demo with ALL requested features (mock + API placeholders)
  - Features included:
    * KPIs with sparklines
    * Revenue & appointments analytics (recharts)
    * Predictive staffing mock
    * Live hospital bed map (mock floor plan)
    * Incident reporting & task management
    * Server & integration health
    * Real-time notifications (mock interval)
    * Audit logs & access logs
    * Natural-language query parser (mock)
    * Export/Print placeholders
    * Role-based UI toggles (Admin / Operations / Finance)
    * Multi-language toggle (EN/UR) and dark mode
    * Framer-motion micro interactions
    * WebSocket / AI placeholders (TODO comments)

  HOW TO USE
  - Paste into your React app; ensure Tailwind CSS is configured
  - Install dependencies: framer-motion, recharts, lucide-react
  - Replace TODO sections with your real APIs, WebSocket, or AI services
*/

const departments = ["Emergency", "Cardiology", "Radiology", "Pediatrics", "Oncology", "Orthopedics", "Neurology", "Surgery", "Maternity", "Intensive Care"];
const colors = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6", "#EC4899", "#8B5CF6", "#06B6D4", "#10B981"];

// --------------------------- Component ---------------------------
export default function AdminDashboardUltimate() {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
  // UI state
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('Admin'); // role-based view toggles

  // Live/mock data
  const [kpis, setKpis] = useState({
    appointmentsToday: 0,
    doctorsAvailable: 0,
    openBeds: 0,
    revenueToday: 0,
    patientSatisfaction: 0,
    averageWaitTime: null,
    emergencyResponseTime: null,
    vipPatients: 0
  });
  const [trend, setTrend] = useState([]);
  const [staff, setStaff] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);

  // Luxury premium features
  const [vipPatients, setVipPatients] = useState([]);
  const [socialReviews, setSocialReviews] = useState([]);
  const [integrations, setIntegrations] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [blockchainLogs, setBlockchainLogs] = useState([]);

  // System and integrations
  const [serverHealth, setServerHealth] = useState({ cpu: 0, mem: 0, apiLatency: 0 });
  const [integrationStatus, setIntegrationStatus] = useState({});

  // Map / occupancy (simple grid)
  const [bedMap, setBedMap] = useState([]);

  // Audit & reports
  const [auditLogs, setAuditLogs] = useState([]);

  // NLP Query (mock)
  const [nlq, setNlq] = useState('');
  const [nlqResult, setNlqResult] = useState(null);

  // Predictive staffing (mock)
  const [predStaffing, setPredStaffing] = useState({ nextDayNeed: 0, confidence: 0 });

  // Task manager
  const [tasks, setTasks] = useState([]);

  // Use API hooks
  const { data: realStats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { data: realSystemHealth, loading: healthLoading, error: healthError, refetch: refetchHealth } = useSystemHealth();
  const { data: realActivityLogs, loading: activityLoading, error: activityError, refetch: refetchActivity } = useActivityLogs();
  const { data: realNotifications, loading: notificationsLoading, error: notificationsError, refetch: refetchNotifications } = useSystemNotifications();
  const { data: realIncidents, loading: incidentsLoading, error: incidentsError, refetch: refetchIncidents } = useIncidents();
  const { data: realTasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks();
  const { createIncident, loading: createIncidentLoading, error: createIncidentError } = useCreateIncident();
  const { createTask, loading: createTaskLoading, error: createTaskError } = useCreateTask();
  const { updateTask, loading: updateTaskLoading, error: updateTaskError } = useUpdateTask();

  // Additional state for real data
  const [realSecurityAlerts, setRealSecurityAlerts] = useState([]);
  const [realReports, setRealReports] = useState([]);
  const integrationEntries = useMemo(
    () =>
      Object.entries(integrations || {}).map(([key, value]) => {
        const integration = (value && typeof value === "object") ? value : {};
        return {
          key,
          status: integration.status || "unknown",
          uptime: integration.uptime ?? "N/A",
          lastSync: integration.lastSync || "N/A",
          available: integration.available,
          fleetSize: integration.fleetSize
        };
      }),
    [integrations]
  );
  const luxuryIntegrations = useMemo(() => ({
    ambulance: {
      available: integrations?.ambulance?.available ?? 0,
      fleetSize: integrations?.ambulance?.fleetSize ?? 0,
      uptime: integrations?.ambulance?.uptime ?? 0
    },
    privateJets: {
      available: integrations?.privateJets?.available ?? 0,
      fleetSize: integrations?.privateJets?.fleetSize ?? 0,
      uptime: integrations?.privateJets?.uptime ?? 0
    },
    concierge: {
      activeRequests: integrations?.concierge?.activeRequests ?? 0,
      uptime: integrations?.concierge?.uptime ?? 0
    }
  }), [integrations]);

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const loading = statsLoading || healthLoading || activityLoading || notificationsLoading || incidentsLoading || tasksLoading;
  const error = statsError || healthError || activityError || notificationsError || incidentsError || tasksError;

  // Modal states
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Form states
  const [incidentForm, setIncidentForm] = useState({ type: '', severity: 'Low', location: '', title: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '' });

  // Socket.IO state
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket.IO connection setup
  useEffect(() => {
    // Initialize Socket.IO connection
    const socketConnection = io(API_BASE_URL, {
      transports: ['polling'],
      upgrade: false,
      timeout: 5000,
      reconnectionAttempts: 3
    });

    socketConnection.on('connect', () => {
      console.log('Connected to server:', socketConnection.id);
      setIsConnected(true);

      // Join user-specific room for notifications
      // Assuming admin user ID is available from auth context or local storage
      const userId = localStorage.getItem('userId') || 'admin';
      socketConnection.emit('join', userId);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketConnection.on('connect_error', (err) => {
      console.warn('Socket connection error:', err?.message || err);
      setIsConnected(false);
    });

    socketConnection.on('notification', (notification) => {
      console.log('Received notification:', notification);

      // Add new notification to the list
      const newNotification = {
        id: notification._id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
        text: notification.title || notification.message,
        ts: new Date(notification.timestamp || notification.createdAt).toLocaleTimeString(),
        type: notification.type,
        severity: notification.severity
      };

      setNotifications(prev => [newNotification, ...prev]);
    });

    setSocket(socketConnection);

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await apiRequest('/api/admin/dashboard');
        if (data?.kpis) setKpis(data.kpis);
        if (data?.trend) setTrend(data.trend);
        if (data?.staff) setStaff(data.staff);
        if (data?.incidents) setIncidents(data.incidents);
        if (data?.notifications) setNotifications(data.notifications);
        if (data?.accessLogs) setAccessLogs(data.accessLogs);
        if (data?.vipPatients) setVipPatients(data.vipPatients);
        if (data?.socialReviews) setSocialReviews(data.socialReviews);
        if (data?.integrations) setIntegrations(data.integrations);
        if (data?.aiInsights) setAiInsights(data.aiInsights);
        if (data?.blockchainLogs) setBlockchainLogs(data.blockchainLogs);
        if (data?.bedMap) setBedMap(data.bedMap);
        if (data?.auditLogs) setAuditLogs(data.auditLogs);
        if (data?.reports) setRealReports(data.reports);
        if (data?.staff?.length) {
          const nextDayNeed = Math.max(1, Math.round(data.staff.length * 0.1));
          setPredStaffing({ nextDayNeed, confidence: 75 });
        }
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      }
    };

    loadDashboard();
  }, []);



  // Realtime simulation removed: use live API/socket data instead
  useEffect(() => {
    return () => {};
  }, []);

  // Mock WebSocket placeholder
  useEffect(() => {
    if (false) {
      // TODO: connect to WebSocket and update state
      // const ws = new WebSocket('wss://your-realtime-endpoint');
      // ws.onmessage = (evt) => handleRealtime(JSON.parse(evt.data));
      // return () => ws.close();
    }
  }, []);

  // NLP query handler (very simple mock)
  const handleNlq = () => {
    const q = nlq.toLowerCase();
    if (!q) return setNlqResult(null);
    if (q.includes('revenue')) {
      const projected = trend.reduce((sum, t) => sum + (t.revenue || 0), 0);
      return setNlqResult({ type: 'revenue', value: projected, text: 'Projected revenue next month: Rs. ' + projected });
    }
    if (q.includes('staff')) return setNlqResult({ type: 'staff', value: predStaffing.nextDayNeed, text: `Recommended staffing next day: ${predStaffing.nextDayNeed} (confidence ${predStaffing.confidence}%)` });
    return setNlqResult({ type: 'text', text: 'No direct insight available. Try: "show revenue" or "predict staff"' });
  };

  // Export CSV placeholder
  const exportCSV = () => {
    // TODO: generate CSV from current datasets and trigger download
    alert('Export CSV — placeholder (implement server-side or client CSV generation)');
  };

  // Print dashboard
  const handlePrint = () => window.print();



  // Hybrid data functions
  const getHybridKPIs = () => {
    if (realStats) {
      return {
        appointmentsToday: realStats.appointmentsToday || kpis.appointmentsToday,
        doctorsAvailable: realStats.doctorsAvailable || kpis.doctorsAvailable,
        openBeds: realStats.openBeds || kpis.openBeds,
        revenueToday: realStats.revenueToday || kpis.revenueToday
      };
    }
    return kpis;
  };

  const getHybridSystemHealth = () => {
    if (realSystemHealth) {
      const cpu = realSystemHealth.cpu;
      const memory = realSystemHealth.memory;
      return {
        cpu: (typeof cpu === 'object' && cpu?.usagePercent !== undefined) ? cpu.usagePercent : (typeof cpu === 'number' ? cpu : serverHealth.cpu),
        mem: (typeof memory === 'object' && memory?.usagePercent !== undefined) ? memory.usagePercent : (typeof memory === 'number' ? memory : serverHealth.mem),
        apiLatency: realSystemHealth.apiLatency || serverHealth.apiLatency
      };
    }
    return serverHealth;
  };

  const getHybridActivityLogs = () => {
    if (realActivityLogs && realActivityLogs.length > 0) {
      return realActivityLogs.slice(0, 8);
    }
    return auditLogs;
  };

  const getHybridNotifications = () => {
    const normalize = (items) => items.map(n => ({
      id: n.id || n._id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
      text: n.text || n.title || n.description || 'Notification',
      ts: n.ts || (n.timestamp || n.createdAt ? new Date(n.timestamp || n.createdAt).toLocaleTimeString() : ''),
      type: n.type,
      severity: n.severity || 'info'
    }));

    if (realNotifications && realNotifications.length > 0) {
      return normalize(realNotifications.slice(0, 8));
    }
    return normalize(notifications);
  };

  const getHybridSecurityAlerts = () => {
    if (realSecurityAlerts.length > 0) {
      return realSecurityAlerts.slice(0, 5);
    }
    return [];
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      await Promise.all([
        refetchStats(),
        refetchHealth(),
        refetchActivity(),
        refetchNotifications(),
        refetchIncidents(),
        refetchTasks()
      ]);
      const data = await apiRequest('/api/admin/dashboard');
      if (data?.kpis) setKpis(data.kpis);
      if (data?.trend) setTrend(data.trend);
      if (data?.staff) setStaff(data.staff);
      if (data?.incidents) setIncidents(data.incidents);
      if (data?.notifications) setNotifications(data.notifications);
      if (data?.accessLogs) setAccessLogs(data.accessLogs);
      if (data?.vipPatients) setVipPatients(data.vipPatients);
      if (data?.socialReviews) setSocialReviews(data.socialReviews);
      if (data?.integrations) setIntegrations(data.integrations);
      if (data?.aiInsights) setAiInsights(data.aiInsights);
      if (data?.blockchainLogs) setBlockchainLogs(data.blockchainLogs);
      if (data?.bedMap) setBedMap(data.bedMap);
      if (data?.auditLogs) setAuditLogs(data.auditLogs);
      if (data?.reports) setRealReports(data.reports);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  // Colors for pie chart
  const pieData = useMemo(() => {
    if (!staff.length) {
      return departments.map((d, i) => ({ name: d, value: 0, color: colors[i] }));
    }
    const per = Math.max(1, Math.floor(staff.length / departments.length));
    return departments.map((d, i) => ({
      name: d,
      value: staff.slice(i * per, (i + 1) * per).length,
      color: colors[i]
    }));
  }, [staff]);

  // Modal handlers
  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    await createIncident(incidentForm);
    setIncidentForm({ type: '', severity: 'Low', location: '', title: '', description: '' });
    setShowIncidentModal(false);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const newTask = { id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), title: taskForm.title, assignee: 'Admin', status: 'todo' };
    setTasks(prev => [...prev, newTask]);
    setTaskForm({ title: '' });
    setShowTaskModal(false);
  };

  // Task management functions
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className={`${dark ? 'dark' : ''} min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 text-white`}>
      <div className="sticky top-0 bg-charcoal-950/95 backdrop-blur-xl border-b border-primary-900/30 shadow-2xl shadow-charcoal-950/50 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-900 via-luxury-gold to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50">
              <Shield className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider">
                MEDICORE — Admin Console
              </div>
              <div className="text-sm text-muted-400 font-medium tracking-widest">Role: {role}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRole(r => r === 'Admin' ? 'Operations' : 'Admin')} className="px-4 py-2 bg-gradient-to-r from-primary-900 to-primary-800 hover:from-primary-800 hover:to-primary-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 transition-all duration-300">
              Toggle Role
            </button>
            <button onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')} className="px-4 py-2 bg-gradient-to-r from-primary-900 to-primary-800 hover:from-primary-800 hover:to-primary-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 transition-all duration-300">
              {lang === 'en' ? 'UR' : 'EN'}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-3 rounded-xl bg-charcoal-800/50 hover:bg-charcoal-700/50 backdrop-blur-sm border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
              {dark ? <Sun className="w-5 h-5 text-muted-300" /> : <Moon className="w-5 h-5 text-muted-300" />}
            </button>
            <button onClick={refreshData} disabled={loading} className="p-3 rounded-xl bg-charcoal-800/50 hover:bg-charcoal-700/50 backdrop-blur-sm border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300" title="Refresh Data">
              <RefreshCw className={`w-5 h-5 text-muted-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowNotificationPopup(!showNotificationPopup)} className="p-3 rounded-xl bg-charcoal-800/50 hover:bg-charcoal-700/50 backdrop-blur-sm border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300 relative">
              <Bell className="w-5 h-5 text-muted-300" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            <button onClick={exportCSV} className="p-3 rounded-xl bg-charcoal-800/50 hover:bg-charcoal-700/50 backdrop-blur-sm border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300">
              <Download className="w-5 h-5 text-muted-300" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Executive KPI Command Center */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-blue-900/20 p-8"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)]"></div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Executive KPI Command Center
                </h2>
                <p className="text-sm text-blue-200/80">Real-time operational intelligence dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 rounded-full text-xs font-semibold text-green-300 border border-green-500/30">
                All Systems Optimal
              </div>
              <div className="text-xs text-blue-300">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <KpiCard
                title={lang === 'en' ? 'Appointments Today' : 'آج کی ملاقاتیں'}
                value={getHybridKPIs().appointmentsToday || 0}
                spark={trend.map(t => t.appointments)}
                unit="appt"
                color="primary"
                icon={<Calendar className="w-6 h-6" />}
                trend="+12.5%"
                status="excellent"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <KpiCard
                title="Doctors Available"
                value={getHybridKPIs().doctorsAvailable || 0}
                spark={trend.map(t => Math.max(0, Math.round(t.appointments / 5)))}
                unit="docs"
                color="accent"
                icon={<Stethoscope className="w-6 h-6" />}
                trend="+8.2%"
                status="good"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <KpiCard
                title="Open Beds"
                value={getHybridKPIs().openBeds || 0}
                spark={trend.map(() => Math.max(0, Math.round(Math.random() * 10)))}
                unit="beds"
                color="luxury-gold"
                icon={<Bed className="w-6 h-6" />}
                trend="+5.1%"
                status="optimal"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <KpiCard
                title="Revenue Today"
                value={`Rs. ${(getHybridKPIs().revenueToday || 0).toLocaleString()}`}
                spark={trend.map(t => t.revenue)}
                unit="Rs"
                color="primary"
                icon={<DollarSign className="w-6 h-6" />}
                trend="+15.3%"
                status="excellent"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <KpiCard
                title="Patient Satisfaction"
                value={`${getHybridKPIs().patientSatisfaction || 0}%`}
                spark={trend.map(t => t.satisfaction)}
                unit="%"
                color="luxury-gold"
                icon={<Heart className="w-6 h-6" />}
                trend="+2.1%"
                status="excellent"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <KpiCard
                title="Avg Wait Time"
                value={`${getHybridKPIs().averageWaitTime || 0}min`}
                spark={trend.map(t => t.appointments || 0)}
                unit="min"
                color="accent"
                icon={<Clock className="w-6 h-6" />}
                trend="-8.5%"
                status="improving"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <KpiCard
                title="Emergency Response"
                value={`${getHybridKPIs().emergencyResponseTime || 0}min`}
                spark={trend.map(t => t.revenue || 0)}
                unit="min"
                color="primary"
                icon={<Ambulance className="w-6 h-6" />}
                trend="-12.3%"
                status="excellent"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <KpiCard
                title="VIP Patients"
                value={getHybridKPIs().vipPatients || 0}
                spark={trend.map(t => t.satisfaction || 0)}
                unit="vip"
                color="luxury-gold"
                icon={<Crown className="w-6 h-6" />}
                trend="+25.7%"
                status="premium"
              />
            </motion.div>
          </div>

          {/* Footer Stats */}
          <div className="relative z-10 mt-8 flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-6 text-sm text-blue-200/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Data Feed Active
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Enterprise Security Enabled
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI-Powered Analytics
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:shadow-blue-600/40">
              View Detailed Analytics
            </button>
          </div>
        </motion.section>

        {/* Enterprise Analytics Suite */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 shadow-2xl shadow-blue-900/30 border border-blue-800/50 lg:col-span-2 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Revenue Analytics</h3>
                  <div className="text-sm text-blue-200">Real-time performance metrics</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-green-500/20 rounded-full text-xs font-semibold text-green-300 border border-green-500/30">
                  +12.5% Growth
                </div>
                <div className="text-xs text-blue-300">Live Data</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-blue-200">Total Revenue</div>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">Rs. {getHybridKPIs().revenueToday.toLocaleString()}</div>
                <div className="text-xs text-green-400 mt-1">+8.2% from yesterday</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-blue-200">Appointments</div>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{getHybridKPIs().appointmentsToday}</div>
                <div className="text-xs text-blue-400 mt-1">+15.3% this week</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-blue-200">Avg. Revenue/Appointment</div>
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">Rs. {Math.round(getHybridKPIs().revenueToday / getHybridKPIs().appointmentsToday)}</div>
                <div className="text-xs text-purple-400 mt-1">+5.1% efficiency</div>
              </div>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trend}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="appointments" fill="url(#appointmentsGradient)" stroke="#3b82f6" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                  <defs>
                    <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AI Prediction</div>
                  <div className="text-xs text-blue-200">Next 24h staffing: {predStaffing.nextDayNeed} staff ({predStaffing.confidence}% confidence)</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300">
                  View Details
                </button>
                <button className="px-4 py-2 border border-blue-400/50 text-blue-300 hover:bg-blue-400/10 text-sm font-medium rounded-xl transition-all duration-300">
                  Export Report
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl p-6 shadow-2xl shadow-emerald-900/30 border border-emerald-800/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Department Load</h3>
                  <div className="text-sm text-emerald-200">Real-time capacity analysis</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                Optimized
              </div>
            </div>

            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    innerRadius={30}
                    fill="#8884d8"
                    stroke="#0f172a"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              {pieData.slice(0, 4).map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <div className="text-sm font-medium text-white">{dept.name}</div>
                  </div>
                  <div className="text-sm font-bold text-emerald-300">{dept.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-emerald-200">
              <div>Peak load: {pieData[0].name}</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live monitoring
              </div>
            </div>
          </motion.div>
        </section>

        {/* Enterprise Operations Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 rounded-2xl p-6 shadow-2xl shadow-rose-900/30 border border-rose-800/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/50">
                  <Bed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Live Bed Occupancy</h3>
                  <div className="text-sm text-rose-200">Real-time capacity management</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-rose-500/20 rounded-full text-xs font-semibold text-rose-300 border border-rose-500/30">
                {bedMap.flat().filter(b => !b.occupied).length}/{bedMap.flat().length} Available
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-4">
              {bedMap.flat().map((b, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`p-2 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                    b.occupied
                      ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                      : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  } hover:shadow-lg hover:shadow-white/10`}
                >
                  <div className="text-xs font-bold text-white">{b.ward}</div>
                  <div className="text-xs opacity-80">{b.occupied ? 'Occupied' : 'Available'}</div>
                  {b.patient && (
                    <div className="text-xs mt-1 opacity-60 truncate" title={b.patient}>
                      {String(b.patient).substring(0, 6)}...
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Live updates every 30s
              </div>
              <button className="px-3 py-1 bg-rose-600/50 hover:bg-rose-600/70 rounded text-xs font-medium transition-colors">
                View Details
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-2xl p-6 shadow-2xl shadow-amber-900/30 border border-amber-800/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Staff Command Center</h3>
                  <div className="text-sm text-amber-200">On-call roster & performance</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-amber-500/20 rounded-full text-xs font-semibold text-amber-300 border border-amber-500/30">
                {staff.filter(s => s.onCall).length}/{staff.length} On Duty
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-auto">
              {staff.slice(0, 6).map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.onCall ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.name}</div>
                      <div className="text-xs text-amber-200">{s.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded font-bold ${
                      s.onCall ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {s.onCall ? 'On Call' : 'Off Duty'}
                    </div>
                    <div className="text-xs text-amber-300 mt-1">Perf: {s.performance}%</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-amber-600/25 transition-all duration-300">
                Manage Roster
              </button>
              <button className="px-3 py-2 border border-amber-400/50 text-amber-300 hover:bg-amber-400/10 text-sm font-medium rounded-xl transition-all duration-300">
                Alerts
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-2xl p-6 shadow-2xl shadow-violet-900/30 border border-violet-800/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/50">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Integration Matrix</h3>
                  <div className="text-sm text-violet-200">Connected systems status</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-violet-500/20 rounded-full text-xs font-semibold text-violet-300 border border-violet-500/30">
                {integrationEntries.filter(i => i.status === 'online').length}/{integrationEntries.length} Online
              </div>
            </div>

            <div className="space-y-4">
              {integrationEntries.map((integration, index) => (
                <motion.div
                  key={integration.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'online' ? 'bg-green-400 animate-pulse' :
                        integration.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <div className="text-sm font-semibold text-white capitalize">{integration.key}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      integration.status === 'online' ? 'bg-green-500/20 text-green-300' :
                      integration.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {integration.status}
                    </div>
                  </div>
                  <div className="text-xs text-violet-200">
                    Uptime: {integration.uptime}% • Last sync: {integration.lastSync}
                  </div>
                  {integration?.available !== undefined && (
                    <div className="text-xs text-violet-300 mt-1">
                      Available: {integration.available}/{integration.fleetSize ?? 'N/A'}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-violet-200">
              <div>Auto-reconnect enabled</div>
              <button className="px-3 py-1 bg-violet-600/50 hover:bg-violet-600/70 rounded text-xs font-medium transition-colors">
                System Logs
              </button>
            </div>
          </motion.div>
        </section>

        {/* Crisis Management & Workflow Center */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-br from-red-900 via-rose-900 to-pink-900 rounded-2xl p-6 shadow-2xl shadow-red-900/30 border border-red-800/50 backdrop-blur-xl lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Crisis Management Hub</h3>
                  <div className="text-sm text-red-200">Real-time incident response & escalation</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-red-500/20 rounded-full text-xs font-semibold text-red-300 border border-red-500/30">
                  {incidents.filter(i => i.status === 'Open').length} Active
                </div>
                <button
                  onClick={() => setShowIncidentModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-600/25 transition-all duration-300"
                >
                  Report Incident
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-auto">
              {(Array.isArray(incidents) ? incidents : []).map((ic, index) => (
                <motion.div
                  key={ic.id || ic._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        ic.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                        ic.severity === 'High' ? 'bg-orange-500' :
                        ic.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-semibold text-white">{ic.type}</div>
                        <div className="text-xs text-red-200">{ic.location}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      ic.severity === 'Critical' ? 'bg-red-500/20 text-red-300' :
                      ic.severity === 'High' ? 'bg-orange-500/20 text-orange-300' :
                      ic.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {ic.severity}
                    </div>
                  </div>
                  <div className="text-xs text-red-200 mb-3">{ic.createdAt} • Assigned: {ic.assignedTo}</div>
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      ic.status === 'Resolved' ? 'bg-green-500/20 text-green-300' :
                      ic.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                      ic.status === 'Escalated' ? 'bg-red-500/20 text-red-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {ic.status}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition-colors">
                        Details
                      </button>
                      <button className="px-3 py-1 bg-red-600/50 hover:bg-red-600/70 text-white text-xs font-medium rounded transition-colors">
                        Escalate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-red-200">
              <div>Auto-escalation in 15 minutes for critical incidents</div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Response team notified
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 rounded-2xl p-6 shadow-2xl shadow-cyan-900/30 border border-cyan-800/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Workflow Orchestrator</h3>
                  <div className="text-sm text-cyan-200">Task management & automation</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-cyan-500/20 rounded-full text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                {tasks.filter(t => t.status === 'done').length}/{tasks.length} Complete
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-auto">
              {(Array.isArray(tasks) ? tasks : []).map((t, index) => (
                <motion.div
                  key={t.id || t._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-white">{t.title}</div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      t.status === 'done' ? 'bg-green-500/20 text-green-300' :
                      t.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {t.status === 'in-progress' ? 'In Progress' :
                       t.status === 'done' ? 'Completed' : 'To Do'}
                    </div>
                  </div>
                  <div className="text-xs text-cyan-200 mb-3">Assigned to: {t.assignee}</div>
                  <div className="flex items-center justify-between">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id || t._id, e.target.value)}
                      className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button className="px-2 py-1 bg-cyan-600/50 hover:bg-cyan-600/70 text-white text-xs font-medium rounded transition-colors">
                      Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-cyan-600/25 transition-all duration-300"
              >
                Create Task
              </button>
              <button
                onClick={() => setTasks([])}
                className="px-3 py-2 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 text-sm font-medium rounded-xl transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        </section>

        {/* Enterprise Security & System Intelligence Hub */}

        {/* VIP Patient Tracking */}
        <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-xl text-white">VIP Patient Concierge</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vipPatients.slice(0, 6).map(vip => (
              <div key={vip.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">{vip.name}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${vip.vipStatus === 'Platinum' ? 'bg-yellow-500 text-black' : vip.vipStatus === 'Gold' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'}`}>
                    {vip.vipStatus}
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-2">Last Visit: {vip.lastVisit}</div>
                <div className="text-xs text-gray-400">
                  Services: {vip.conciergeServices.join(', ')}
                </div>
                <div className="mt-2 text-sm text-green-400">Satisfaction: {vip.satisfaction}%</div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media Reviews */}
        <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-xl text-white">Social Media Buzz</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialReviews.slice(0, 8).map(review => (
              <div key={review.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white">{review.platform}</div>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                  </div>
                </div>
                <div className="text-xs text-gray-300 mb-2">"{review.text}"</div>
                <div className="text-xs text-gray-400">- {review.author}</div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insights Dashboard */}
        <section className="bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-green-400" />
            <h3 className="font-bold text-xl text-white">AI-Powered Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiInsights.map(insight => (
              <div key={insight.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">{insight.type}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${insight.impact === 'High' ? 'bg-red-500' : insight.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                    {insight.impact}
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-2">{insight.title}</div>
                <div className="text-xs text-gray-400 mb-2">{insight.description}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-400">Confidence: {insight.confidence}%</div>
                  <div className="text-xs text-gray-400">{insight.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Luxury Integrations */}
        <section className="bg-gradient-to-r from-gold-900 via-yellow-900 to-orange-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Plane className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-xl text-white">Luxury Ecosystem</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Ambulance className="w-5 h-5 text-red-400" />
                <div className="font-semibold text-white">Ambulance Fleet</div>
              </div>
              <div className="text-2xl font-bold text-white">{luxuryIntegrations.ambulance.available}/{luxuryIntegrations.ambulance.fleetSize}</div>
              <div className="text-sm text-gray-300">Available Units</div>
              <div className="text-xs text-green-400 mt-1">Uptime: {luxuryIntegrations.ambulance.uptime}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-5 h-5 text-blue-400" />
                <div className="font-semibold text-white">Private Jets</div>
              </div>
              <div className="text-2xl font-bold text-white">{luxuryIntegrations.privateJets.available}/{luxuryIntegrations.privateJets.fleetSize}</div>
              <div className="text-sm text-gray-300">Available Aircraft</div>
              <div className="text-xs text-green-400 mt-1">Uptime: {luxuryIntegrations.privateJets.uptime}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-5 h-5 text-brown-400" />
                <div className="font-semibold text-white">Concierge Services</div>
              </div>
              <div className="text-2xl font-bold text-white">{luxuryIntegrations.concierge.activeRequests}</div>
              <div className="text-sm text-gray-300">Active Requests</div>
              <div className="text-xs text-green-400 mt-1">Uptime: {luxuryIntegrations.concierge.uptime}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-green-400" />
                <div className="font-semibold text-white">Eco-Friendly Ops</div>
              </div>
              <div className="text-2xl font-bold text-white">98.5%</div>
              <div className="text-sm text-gray-300">Carbon Neutral</div>
              <div className="text-xs text-green-400 mt-1">Sustainability Score</div>
            </div>
          </div>
        </section>

        {/* Blockchain Security Logs */}
        <section className="bg-gradient-to-r from-gray-900 via-slate-900 to-zinc-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-green-400" />
            <h3 className="font-bold text-xl text-white">Blockchain Security</h3>
          </div>
          <div className="space-y-3">
            {(Array.isArray(blockchainLogs) ? blockchainLogs : []).map((log, idx) => (
              <div key={log?.hash || `chain-${idx}`} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-xs text-green-400">{String(log?.hash || "N/A").substring(0, 16)}...</div>
                  <div className={`px-2 py-1 rounded text-xs ${log.verified ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {log.verified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-1">{log.action}</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div>{log.user}</div>
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Admin Wellness Dashboard */}
        <section className="bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-400" />
            <h3 className="font-bold text-xl text-white">Admin Wellness</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Battery className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">87%</div>
              <div className="text-sm text-gray-300">Energy Level</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <SleepIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">6.5h</div>
              <div className="text-sm text-gray-300">Sleep Quality</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Dumbbell className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8/10</div>
              <div className="text-sm text-gray-300">Stress Level</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Coffee className="w-8 h-8 text-brown-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-300">Breaks Taken</div>
            </div>
          </div>
        </section>

        {/* Achievements & Gamification */}
        <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-xl text-white">Achievements Unlocked</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Zero Incidents</div>
              <div className="text-sm text-gray-300">30 Days Streak</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Revenue Champion</div>
              <div className="text-sm text-gray-300">+25% This Month</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Patient Hero</div>
              <div className="text-sm text-gray-300">98% Satisfaction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
              <Rocket className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Efficiency Master</div>
              <div className="text-sm text-gray-300">15% Time Saved</div>
            </div>
          </div>
        </section>

        {/* NLP Query & Quick Actions */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-3">
            <input value={nlq} onChange={(e) => setNlq(e.target.value)} placeholder="Ask (e.g. 'show revenue', 'predict staff')" className="flex-1 px-3 py-2 border rounded" />
            <button onClick={handleNlq} className="text-black px-3 py-2 bg-green-600 text-white rounded">Ask</button>
            <button onClick={handlePrint} className="text-black px-3 py-2 border rounded">Print</button>
          </div>
          {nlqResult && (
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-900">
              <strong>Result:</strong>
              <div>{nlqResult.text || JSON.stringify(nlqResult)}</div>
            </div>
          )}
        </section>

      </main>

      {/* Notification Popup */}
      <AnimatePresence>
        {showNotificationPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 top-20 w-80 z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-primary-900/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">Notifications</div>
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-auto">
                <AnimatePresence>
                  {getHybridNotifications().map((n, index) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{n.text}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.ts}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          n.severity === 'high' ? 'bg-red-100 text-red-800' :
                          n.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {n.severity || 'info'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>No new notifications</div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setNotifications([])}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Incident</h3>
            <form onSubmit={handleIncidentSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={incidentForm.type}
                    onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Medication Shortage">Medication Shortage</option>
                    <option value="Staff Shortage">Staff Shortage</option>
                    <option value="IT Outage">IT Outage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <select
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={incidentForm.location}
                    onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="e.g., Ward 3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={incidentForm.title}
                    onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Brief title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={incidentForm.description}
                    onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    rows="3"
                    placeholder="Detailed description"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Create Incident</button>
                <button type="button" onClick={() => setShowIncidentModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="tetx-black bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-black text-blacktext-lg font-semibold mb-4">Add Task</h3>
            <form onSubmit={handleTaskSubmit}>
              <div className="text-black space-y-4">
                <div>
                  <label className="text-black block text-sm font-medium mb-1">Task Title</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter task title"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Task</button>
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-8 py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Medicore — Admin</footer>
    </div>
  );
}

// --------------------------- Subcomponents ---------------------------
function KpiCard({ title, value, spark, unit, icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-charcoal-800/50 backdrop-blur-sm rounded-xl p-4 shadow-2xl shadow-charcoal-950/20 border border-primary-900/30 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-muted-400">{icon}</div>}
        <div className="text-xs text-muted-400">{title}</div>
      </div>
      <div className="font-bold text-2xl text-white">{value}</div>
      <div className="mt-2 text-xs text-muted-500">{unit ? unit : ''}</div>
      <div className="mt-3" style={{ height: 36 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark.map((s, i) => ({ idx: i, val: s }))}>
            <Line type="monotone" dataKey="val" stroke="#0F5132" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
