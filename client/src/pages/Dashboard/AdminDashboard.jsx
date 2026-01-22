import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Sun, Moon, Bell, Download, Wifi, AlertCircle, Users, Map, RefreshCw, Database, Shield, Activity } from "lucide-react";
import { io } from "socket.io-client";
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
  - Install dependencies: @faker-js/faker, framer-motion, recharts, lucide-react
  - Replace TODO sections with your real APIs, WebSocket, or AI services
*/

// --------------------------- Mock generators ---------------------------
const genKPIs = () => ({
  appointmentsToday: faker.number.int({ min: 20, max: 120 }),
  doctorsAvailable: faker.number.int({ min: 8, max: 40 }),
  openBeds: faker.number.int({ min: 5, max: 60 }),
  revenueToday: faker.number.int({ min: 20000, max: 150000 })
});

const genTrend = (points = 12) => Array.from({ length: points }).map((_, i) => ({
  name: `P${i + 1}`,
  appointments: faker.number.int({ min: 5, max: 40 }),
  revenue: faker.number.int({ min: 1000, max: 8000 })
}));

const genStaff = (n = 8) => Array.from({ length: n }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: faker.helpers.arrayElement(["Doctor", "Nurse", "Admin", "Lab Tech"]),
  onCall: faker.datatype.boolean(),
  lastActive: faker.date.recent().toLocaleString()
}));

const genIncidents = (n = 4) => Array.from({ length: n }).map(() => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(["Equipment Failure", "Medication Shortage", "Staff Shortage", "IT Outage"]),
  severity: faker.helpers.arrayElement(["Low", "Medium", "High", "Critical"]),
  createdAt: faker.date.recent().toLocaleString(),
  status: faker.helpers.arrayElement(["Open", "In Progress", "Resolved"]),
  location: `Ward ${faker.number.int({ min: 1, max: 8 })}`
}));

const genAccessLogs = (n = 6) => Array.from({ length: n }).map(() => ({
  time: faker.date.recent().toLocaleString(),
  user: faker.person.fullName(),
  action: faker.helpers.arrayElement(["Login", "Viewed Patient", "Exported Report", "Edited Schedule"]),
  ip: `${faker.internet.ip()}`
}));

const departments = ["Emergency", "Cardiology", "Radiology", "Pediatrics", "Oncology", "Orthopedics"];
const colors = ["#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"];

// --------------------------- Component ---------------------------
export default function AdminDashboardUltimate() {
  // UI state
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('Admin'); // role-based view toggles

  // Live/mock data
  const [kpis, setKpis] = useState(genKPIs());
  const [trend, setTrend] = useState(() => genTrend(12));
  const [staff, setStaff] = useState(() => genStaff(10));
  const [incidents, setIncidents] = useState(() => genIncidents(4));
  const [notifications, setNotifications] = useState([]);
  const [accessLogs, setAccessLogs] = useState(() => genAccessLogs(6));

  // System and integrations
  const [serverHealth, setServerHealth] = useState({ cpu: 28, mem: 62, apiLatency: 120 });
  const [integrationStatus, setIntegrationStatus] = useState({ lab: 'online', pharmacy: 'online', insurance: 'degraded' });

  // Map / occupancy (simple grid)
  const [bedMap] = useState(() => {
    // 4x6 grid of wards with bed occupancy
    return Array.from({ length: 4 }).map((_, row) => (
      Array.from({ length: 6 }).map((__, col) => ({
        ward: `W-${row + 1}${col + 1}`,
        occupied: faker.datatype.boolean(),
        patient: faker.datatype.boolean() ? faker.person.fullName() : null
      }))
    ));
  });

  // Audit & reports
  const [auditLogs, setAuditLogs] = useState(() => Array.from({ length: 8 }).map(() => ({
    time: faker.date.recent().toLocaleString(), event: faker.helpers.arrayElement(['Data Export', 'Report Viewed', 'User Role Changed']), actor: faker.person.fullName()
  })));

  // NLP Query (mock)
  const [nlq, setNlq] = useState('');
  const [nlqResult, setNlqResult] = useState(null);

  // Predictive staffing (mock)
  const [predStaffing, setPredStaffing] = useState(() => ({ nextDayNeed: faker.number.int({ min: 5, max: 20 }), confidence: faker.number.int({ min: 60, max: 95 }) }));

  // Task manager
  const [tasks, setTasks] = useState(() => Array.from({ length: 4 }).map(() => ({ id: faker.string.uuid(), title: faker.hacker.phrase(), assignee: faker.person.fullName(), status: faker.helpers.arrayElement(['todo', 'in-progress', 'done']) })));

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

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const loading = statsLoading || healthLoading || activityLoading || notificationsLoading || incidentsLoading || tasksLoading;
  const error = statsError || healthError || activityError || notificationsError || incidentsError || tasksError;

  // Modal states
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form states
  const [incidentForm, setIncidentForm] = useState({ type: '', severity: 'Low', location: '', title: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '' });

  // Socket.IO state
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket.IO connection setup
  useEffect(() => {
    // Initialize Socket.IO connection
    const socketConnection = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
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

    socketConnection.on('notification', (notification) => {
      console.log('Received notification:', notification);

      // Add new notification to the list
      const newNotification = {
        id: notification._id || faker.string.uuid(),
        text: notification.title || notification.message,
        ts: new Date(notification.timestamp || notification.createdAt).toLocaleTimeString(),
        type: notification.type,
        severity: notification.severity
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Update real notifications if using real data
      if (realNotifications.length > 0) {
        setRealNotifications(prev => [notification, ...prev]);
      }
    });

    setSocket(socketConnection);

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);



  // Realtime simulation: notifications + slight metric drift
  useEffect(() => {
    const nid = setInterval(() => {
      // Notify on any change in the project (simulate)
      const changeNotification = {
        id: faker.string.uuid(),
        text: 'Project updated: AdminDashboard.jsx modified',
        ts: new Date().toLocaleTimeString()
      };
      setNotifications(n => [changeNotification]); // Replace with latest notification

      // small KPI drift
      setKpis(k => ({ ...k, appointmentsToday: Math.max(5, k.appointmentsToday + faker.number.int({ min: -3, max: 5 })) }));
      // server health fluctuate
      setServerHealth(s => ({ cpu: Math.min(98, Math.max(5, s.cpu + faker.number.int({ min: -3, max: 3 }))), mem: Math.min(98, Math.max(20, s.mem + faker.number.int({ min: -2, max: 2 }))), apiLatency: Math.max(20, s.apiLatency + faker.number.int({ min: -15, max: 20 })) }));
    }, 8000);
    return () => clearInterval(nid);
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
    if (q.includes('revenue')) return setNlqResult({ type: 'revenue', value: faker.number.int({ min: 500000, max: 2000000 }), text: 'Projected revenue next month: Rs. ' + faker.number.int({ min: 500000, max: 2000000 }) });
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
    if (realNotifications && realNotifications.length > 0) {
      return realNotifications.slice(0, 8);
    }
    return notifications;
  };

  const getHybridSecurityAlerts = () => {
    if (realSecurityAlerts.length > 0) {
      return realSecurityAlerts.slice(0, 5);
    }
    return [];
  };

  // Refresh data function
  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsResult, healthResult, activityResult, notificationsResult, alertsResult, incidentsResult, tasksResult, reportsResult] = await Promise.allSettled([
        fetchWithFallback(adminAPI.getDashboardStats, fallbackData.generateAdminStats),
        fetchWithFallback(adminAPI.getSystemHealth, fallbackData.generateSystemHealth),
        fetchWithFallback(() => adminAPI.getActivityLogs(1, 10), () => fallbackData.generateActivityLogs(10)),
        fetchWithFallback(adminAPI.getNotifications, () => fallbackData.generateNotifications(8)),
        fetchWithFallback(adminAPI.getSecurityAlerts, () => fallbackData.generateSecurityAlerts(5)),
        fetchWithFallback(adminAPI.getIncidents, () => fallbackData.generateIncidents(5)),
        fetchWithFallback(adminAPI.getTasks, () => fallbackData.generateTasks(5)),
        fetchWithFallback(adminAPI.getReports, () => fallbackData.generateReports(5)),
      ]);

      if (statsResult.status === 'fulfilled') {
        setRealStats(statsResult.value.data);
      }

      if (healthResult.status === 'fulfilled') {
        setRealSystemHealth(healthResult.value.data);
      }

      if (activityResult.status === 'fulfilled') {
        setRealActivityLogs(activityResult.value.data);
      }

      if (notificationsResult.status === 'fulfilled') {
        setRealNotifications(notificationsResult.value.data);
      }

      if (alertsResult.status === 'fulfilled') {
        setRealSecurityAlerts(alertsResult.value.data);
      }

      if (incidentsResult.status === 'fulfilled') {
        const incidentsData = Array.isArray(incidentsResult.value.data) ? incidentsResult.value.data : [];
        setRealIncidents(incidentsData);
        setIncidents(incidentsData);
      }

      if (tasksResult.status === 'fulfilled') {
        const tasksData = Array.isArray(tasksResult.value.data) ? tasksResult.value.data : [];
        setRealTasks(tasksData);
        setTasks(tasksData);
      }

      if (reportsResult.status === 'fulfilled') {
        setRealReports(reportsResult.value.data);
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Using cached data.');
    } finally {
      setLoading(false);
    }
  };

  // Colors for pie chart
  const pieData = useMemo(() => departments.map((d, i) => ({ name: d, value: faker.number.int({ min: 30, max: 200 }), color: colors[i] })), []);

  // Modal handlers
  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    await createIncident(incidentForm);
    setIncidentForm({ type: '', severity: 'Low', location: '', title: '', description: '' });
    setShowIncidentModal(false);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    await addTask(taskForm.title);
    setTaskForm({ title: '' });
    setShowTaskModal(false);
  };

  return (
    <div className={`${dark ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}> 
      <div className="sticky top-0 bg-white/60 dark:bg-gray-800/70 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg">Medicore — Admin Console</div>
            <div className="text-sm text-gray-500">Role: {role}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRole(r => r === 'Admin' ? 'Operations' : 'Admin')} className="px-2 py-1 border rounded text-sm">Toggle Role</button>
            <button onClick={() => setLang(l => l === 'en' ? 'ur' : 'en')} className="px-2 py-1 border rounded text-sm">{lang === 'en' ? 'UR' : 'EN'}</button>
            <button onClick={() => setDark(d => !d)} className="px-2 py-1 border rounded text-sm">{dark ? <Sun /> : <Moon />}</button>
            <button onClick={refreshData} disabled={loading} className="p-2 relative" title="Refresh Data">
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setNotifications([])} className="p-2 relative"><Bell /></button>
            <button onClick={exportCSV} className="p-2"><Download /></button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <KpiCard title={lang === 'en' ? 'Appointments Today' : 'آج کی ملاقاتیں'} value={getHybridKPIs().appointmentsToday} spark={trend.map(t => t.appointments)} unit="appt" />
          <KpiCard title="Doctors Available" value={getHybridKPIs().doctorsAvailable} spark={trend.map(t => Math.max(0, Math.round(t.appointments / 5)))} unit="docs" />
          <KpiCard title="Open Beds" value={getHybridKPIs().openBeds} spark={trend.map(() => Math.max(0, Math.round(Math.random() * 10)))} unit="beds" />
          <KpiCard title="Revenue Today" value={`Rs. ${getHybridKPIs().revenueToday}`} spark={trend.map(t => t.revenue)} unit="Rs" />
        </section>

        {/* Charts & Predictions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Appointments & Revenue</h3>
              <div className="text-xs text-gray-500">Last 12 periods</div>
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">Predictive staffing: <strong>{predStaffing.nextDayNeed} staff</strong> (confidence {predStaffing.confidence}%)</div>
              <div>
                <button onClick={() => setPredStaffing({ nextDayNeed: predStaffing.nextDayNeed + 1, confidence: Math.max(50, predStaffing.confidence - 1) })} className="px-2 py-1 border rounded text-sm mr-2">Adjust</button>
                <button onClick={() => alert('Open predictive model settings (placeholder)')} className="px-2 py-1 border rounded text-sm">Model Settings</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Department Load</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60} fill="#8884d8">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-gray-500">Top loaded: {pieData[0].name}</div>
          </div>
        </section>

        {/* Bed map + Staff + Integrations row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Live Bed Map</h3>
              <div className="text-xs text-gray-500">Mock floor plan</div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {bedMap.flat().map((b, idx) => (
                <div key={idx} className={`p-2 rounded text-center ${b.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  <div className="text-xs font-semibold">{b.ward}</div>
                  <div className="text-xs">{b.occupied ? 'Occupied' : 'Available'}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">Click a ward to view patients (placeholder)</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">On-Call Staff</h3>
            <ul className="space-y-2 text-sm">
              {staff.map(s => (
                <li key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.role} • Last active {s.lastActive}</div>
                  </div>
                  <div className={`text-xs rounded px-2 py-1 ${s.onCall ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{s.onCall ? 'On Call' : 'Off'}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-gray-500">Toggle to manage on-call rota (placeholder)</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Integrations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><div>Lab System</div><div className={`px-2 py-1 rounded ${integrationStatus.lab === 'online' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{integrationStatus.lab}</div></div>
              <div className="flex items-center justify-between"><div>Pharmacy</div><div className={`px-2 py-1 rounded ${integrationStatus.pharmacy === 'online' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{integrationStatus.pharmacy}</div></div>
              <div className="flex items-center justify-between"><div>Insurance</div><div className={`px-2 py-1 rounded ${integrationStatus.insurance === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{integrationStatus.insurance}</div></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Reconnect or view logs (placeholder)</div>
          </div>
        </section>

        {/* Incidents, Tasks & Audit */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Incidents</h3>
              <button onClick={() => setShowIncidentModal(true)} className="text-sm px-2 py-1 border rounded">Create Incident</button>
            </div>
            <ul className="space-y-2">
              {(Array.isArray(incidents) ? incidents : []).map(ic => (
                <li key={ic.id || ic._id} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{ic.type} • {ic.location}</div>
                    <div className="text-xs text-gray-500">{ic.createdAt} — Severity: {ic.severity}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Open incident details')}>Details</button>
                    <button className="px-2 py-1 text-sm border rounded" onClick={() => alert('Assign to team')}>Assign</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold">Tasks</h3>
            <ul className="space-y-2 text-sm">
              {(Array.isArray(tasks) ? tasks : []).map(t => (
                <li key={t.id || t._id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">Assignee: {t.assignee}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <select value={t.status} onChange={(e) => updateTaskStatus(t.id || t._id, e.target.value)} className="text-xs border rounded px-2 py-1">
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setShowTaskModal(true)} className="px-3 py-1 border rounded text-sm">Add Task</button>
              <button onClick={() => setTasks([])} className="px-3 py-1 border rounded text-sm">Clear</button>
            </div>
          </div>
        </section>

        {/* System Health & Access Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">System Health</h3>
            <div className="text-sm space-y-2">
              <div>CPU: <strong>{getHybridSystemHealth().cpu}%</strong></div>
              <div>Memory: <strong>{getHybridSystemHealth().mem}%</strong></div>
              <div>API Latency: <strong>{getHybridSystemHealth().apiLatency} ms</strong></div>
              <div className="mt-2 text-xs text-gray-500">Monitor endpoints and configure alerts (placeholder).</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Access Logs</h3>
            <div className="text-xs max-h-40 overflow-auto space-y-2">
              {getHybridActivityLogs().map((log, i) => (
                <div key={i} className="flex justify-between">
                  <div>{log.time} — {log.user} — {log.action}</div>
                  <div className="text-gray-400">{log.ip}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Audit Log</h3>
            <div className="text-xs max-h-40 overflow-auto space-y-2">
              {getHybridActivityLogs().map((a, i) => (
                <div key={i} className="flex justify-between">
                  <div>{a.time} — {a.event}</div>
                  <div className="text-gray-400">{a.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NLP Query & Quick Actions */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center gap-3 mb-3">
            <input value={nlq} onChange={(e) => setNlq(e.target.value)} placeholder="Ask (e.g. 'show revenue', 'predict staff')" className="flex-1 px-3 py-2 border rounded" />
            <button onClick={handleNlq} className="px-3 py-2 bg-green-600 text-white rounded">Ask</button>
            <button onClick={handlePrint} className="px-3 py-2 border rounded">Print</button>
          </div>
          {nlqResult && (
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-900">
              <strong>Result:</strong>
              <div>{nlqResult.text || JSON.stringify(nlqResult)}</div>
            </div>
          )}
        </section>

      </main>

      {/* Floating notifications */}
      <div className="fixed right-6 top-20 w-80 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Notifications</div>
            <div className="text-xs text-gray-400">{notifications.length}</div>
          </div>
          <div className="space-y-2 max-h-64 overflow-auto text-sm">
            {getHybridNotifications().map(n => (
              <div key={n.id} className="p-2 border rounded">{n.ts} — {n.text}</div>
            ))}
          </div>
        </div>
      </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Task</h3>
            <form onSubmit={handleTaskSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
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
function KpiCard({ title, value, spark, unit }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex flex-col">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="font-bold text-2xl">{value}</div>
      <div className="mt-2 text-xs text-gray-400">{unit ? unit : ''}</div>
      <div className="mt-3" style={{ height: 36 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark.map((s, i) => ({ idx: i, val: s }))}>
            <Line type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
