import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSync, FaExclamationTriangle, FaStethoscope, FaHeartbeat, FaThermometerHalf,
  FaTint, FaVideo, FaPhoneAlt, FaCalendarAlt,
  FaBell, FaFlask, FaUserInjured, FaCreditCard,
  FaChartLine, FaRobot, FaBrain, FaLungs, FaSearch, FaKeyboard, FaDownload,
  FaTimes, FaClock, FaPills, FaHospital,
  FaTrophy, FaChevronUp, FaChevronDown, FaExpand, FaCompress,
  FaGripVertical, FaMoon, FaSun, FaEye, FaMicrophone, FaArrowUp,
  FaExclamationCircle, FaCheckCircle, FaInfoCircle,
  FaSave, FaCog
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, ReferenceLine, Brush
} from 'recharts';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { apiRequest } from '../../services/api';

// Helpers
const toTitle = (value = '') => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 'N/A';
  const diff = Date.now() - dob.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
};
const deriveRisk = (age, historyCount) => Math.min(100, Math.max(0, (age || 0) + (historyCount || 0) * 8));

// Colors
const PRIORITY_COLORS = { Critical: '#dc2626', High: '#f59e0b', Medium: '#3b82f6', Low: '#22c55e' };

// Sortable Widget Component
function SortableWidget({ widget, children, onToggleCollapse, onResize }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-3'
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${sizeClasses[widget.size]} bg-charcoal-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-charcoal-950/20 overflow-hidden border border-primary-900/30`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-charcoal-800/80 to-primary-900/20 border-b border-primary-800/30">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-primary-900/30 rounded">
            <FaGripVertical className="text-muted-400" />
          </div>
          <h3 className="font-semibold text-white">{widget.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onResize(widget.id, 'small')} className={`p-1 rounded ${widget.size === 'small' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <FaCompress size={12} />
          </button>
          <button onClick={() => onResize(widget.id, 'large')} className={`p-1 rounded ${widget.size === 'large' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            <FaExpand size={12} />
          </button>
          <button onClick={() => onToggleCollapse(widget.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
            {widget.collapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {!widget.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Sparkline Component
function Sparkline({ data, dataKey, color = '#3b82f6', height = 30 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Main Dashboard Component
export function App() {
  const navigate = useNavigate();
  // State
  const [dark, setDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('risk');
  const [page, setPage] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [teamMembers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [hoveredPatient, setHoveredPatient] = useState(null);
  const [forecastMode, setForecastMode] = useState(false);
  const [scenarioSliders, setScenarioSliders] = useState({ patientLoad: 50, riskThreshold: 70 });
  const [customAlerts, setCustomAlerts] = useState({});
  const [leaderboard] = useState([]);
  const [widgets, setWidgets] = useState([
    { id: 'vitals', title: 'Live Vitals Monitor', type: 'vitals', collapsed: false, size: 'large' },
    { id: 'queue', title: 'Patient Queue', type: 'queue', collapsed: false, size: 'medium' },
    { id: 'appointments', title: "Today's Appointments", type: 'appointments', collapsed: false, size: 'medium' },
    { id: 'analytics', title: 'Real-time Analytics', type: 'analytics', collapsed: false, size: 'large' },
    { id: 'ai', title: 'AI Insights & Predictions', type: 'ai', collapsed: false, size: 'medium' },
    { id: 'team', title: 'Team Collaboration', type: 'team', collapsed: false, size: 'small' },
  ]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [vitalsLive, setVitalsLive] = useState([]);

  const perPage = 6;
  const commandInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load doctor profile + dashboard data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?._id || parsedUser?.id;
    if (!userId) return;

    const loadDoctor = async () => {
      try {
        const doc = await apiRequest(`/api/doctors/${userId}`);
        setDoctorProfile(doc);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      }
    };

    loadDoctor();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [patientsData, notificationsData, vitalsData] = await Promise.all([
          apiRequest('/api/patients'),
          apiRequest('/api/notifications'),
          apiRequest('/api/vitals/live')
        ]);

        const appointmentsData = doctorProfile?._id
          ? await apiRequest(`/api/appointments/doctor/${doctorProfile._id}`)
          : [];

        const appointmentItems = Array.isArray(appointmentsData) ? appointmentsData.map((appt) => ({
          id: appt._id,
          date: appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : '',
          time: appt.appointmentTime || '',
          patient: appt.patient?.name || 'Unknown Patient',
          patientId: appt.patient?.email || appt.patient?.name || '',
          reason: appt.reason || 'Consultation',
          status: toTitle(appt.status || 'pending'),
          waitTime: 0,
          type: appt.type === 'video' ? 'Telemedicine' : appt.type === 'phone' ? 'Telemedicine' : 'In-person'
        })) : [];

        const patientCards = Array.isArray(patientsData) ? patientsData.map((p) => {
          const age = getAge(p.dateOfBirth);
          const history = p.medicalHistory || [];
          const riskScore = deriveRisk(age, history.length);
          const priority = riskScore > 80 ? 'Critical' : riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low';

          const userName = p.userId?.name || 'Unknown Patient';
          const userEmail = p.userId?.email || '';
          const nextAppt = appointmentItems.find(a => a.patientId === userEmail);

          return {
            id: p._id,
            name: userName,
            age,
            gender: toTitle(p.gender || 'Other'),
            nextAppointment: nextAppt?.date || '—',
            priority,
            tags: history.map(h => h.status).filter(Boolean),
            condition: history[0]?.condition || 'General',
            vitalsHistory: [],
            photo: `https://i.pravatar.cc/150?u=${encodeURIComponent(userEmail || p._id)}`,
            riskScore,
            adherenceScore: Math.max(0, 100 - history.length * 5),
            lastVisit: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—',
            onlineStatus: 'offline',
            missingData: [],
            predictedDeterioration: 0,
            assignedTeam: []
          };
        }) : [];

        const normalizedNotifications = Array.isArray(notificationsData)
          ? notificationsData.map(n => ({
              id: n._id,
              type: n.severity || n.type || 'info',
              title: n.title || n.message || 'Notification',
              message: n.description || n.message || '',
              timestamp: new Date(n.timestamp || n.createdAt || Date.now()),
              patientId: n.patientId,
              actions: [],
              read: n.read || false,
              snoozed: false
            }))
          : [];

        setPatients(patientCards);
        setAppointments(appointmentItems);
        setNotifications(normalizedNotifications);
        setVitalsLive(Array.isArray(vitalsData) ? vitalsData : []);
      } catch (err) {
        console.error('Failed to load doctor dashboard data:', err);
      }
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 15000);
    return () => clearInterval(interval);
  }, [doctorProfile?._id]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setSelectedPatient(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus command input when palette opens
  useEffect(() => {
    if (showCommandPalette && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [showCommandPalette]);

  /* Real-time vitals streaming simulation (disabled for live data)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prev => prev.map(p => {
        const newVital = {
          date: new Date().toLocaleDateString(),
          bp: `${rand(90, 180)}/${rand(55, 110)}`,
          hr: rand(50, 140),
          sugar: rand(60, 280),
          temp: +(35 + Math.random() * 4).toFixed(1),
          o2: rand(85, 100),
          timestamp: Date.now()
        };

        // Check for alerts
        const systolic = parseInt(newVital.bp.split('/')[0]);
        const isAbnormal = systolic > 160 || systolic < 90 || newVital.hr > 120 || newVital.hr < 50 ||
          newVital.sugar > 200 || newVital.o2 < 92;

        if (isAbnormal && !customAlerts[p.id]) {
          const alertType = systolic > 160 || newVital.hr > 120 ? 'critical' : 'warning';
          setNotifications(n => [{
            id: `alert-${Date.now()}-${p.id}`,
            type: alertType,
            title: alertType === 'critical' ? 'Critical Vitals Alert!' : 'Abnormal Vitals',
            message: `${p.name}: BP ${newVital.bp}, HR ${newVital.hr}, O₂ ${newVital.o2}%`,
            timestamp: new Date(),
            patientId: p.id,
            actions: [
              { label: 'View Patient', action: 'view' },
              { label: 'Start Call', action: 'call' },
              { label: 'Acknowledge', action: 'ack' }
            ],
            read: false,
            snoozed: false
          }, ...n.slice(0, 19)]);
        }

        // Update risk score based on vitals
        const newRiskScore = Math.min(100, Math.max(0, p.riskScore + (isAbnormal ? rand(1, 5) : rand(-3, 1))));
        const newPriority = newRiskScore > 80 ? 'Critical' : newRiskScore > 60 ? 'High' : newRiskScore > 30 ? 'Medium' : 'Low';

        return {
          ...p,
          vitalsHistory: [newVital, ...p.vitalsHistory.slice(0, 13)],
          riskScore: newRiskScore,
          priority: newPriority,
          predictedDeterioration: Math.min(100, Math.max(0, p.predictedDeterioration + rand(-5, 10)))
        };
      }));

      // Update appointment wait times
      setAppointments(prev => prev.map(a => ({
        ...a,
        waitTime: a.status === 'Pending' ? Math.max(0, a.waitTime + rand(-2, 3)) : a.waitTime
      })));

      // Add activity log
      const actions = ['updated vitals', 'checked in', 'completed consultation', 'ordered labs'];
      if (Math.random() > 0.7) {
        setActivityLogs(prev => [{
          id: `log-${Date.now()}`,
          user: teamMembers[rand(0, teamMembers.length - 1)].name,
          action: actions[rand(0, actions.length - 1)],
          target: patients[rand(0, patients.length - 1)].name,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [customAlerts, patients, teamMembers]);
  */

  // Live search suggestions
  useEffect(() => {
    if (search.length > 0) {
      const suggestions = patients
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.condition.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
        .map(p => p.name);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [search, patients]);

  // Derived data
  const sortedPatients = useMemo(() => {
    let filtered = patients.filter(p =>
      (filterPriority === 'All' || p.priority === filterPriority) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'risk': return b.riskScore - a.riskScore;
        case 'name': return a.name.localeCompare(b.name);
        case 'appointment': return new Date(a.nextAppointment).getTime() - new Date(b.nextAppointment).getTime();
        case 'deterioration': return b.predictedDeterioration - a.predictedDeterioration;
        default: return 0;
      }
    });
  }, [patients, filterPriority, search, sortBy]);

  const paginatedPatients = sortedPatients.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sortedPatients.length / perPage);

  const criticalPatients = useMemo(() =>
    patients.filter(p => p.priority === 'Critical' || p.predictedDeterioration > 70).slice(0, 3),
    [patients]);

  const analyticsData = useMemo(() => {
    const appointmentHours = Array.from({ length: 10 }).map((_, i) => ({
      hour: `${8 + i}:00`,
      appointments: 0,
      completed: 0
    }));

    appointments.forEach((appt) => {
      if (!appt.time) return;
      const hour = parseInt(appt.time.split(':')[0], 10);
      if (Number.isNaN(hour)) return;
      const index = hour - 8;
      if (index >= 0 && index < appointmentHours.length) {
        appointmentHours[index].appointments += 1;
        if (appt.status === 'Completed') appointmentHours[index].completed += 1;
      }
    });

    const riskDistribution = [
      { name: 'Critical', value: patients.filter(p => p.priority === 'Critical').length, color: '#dc2626' },
      { name: 'High', value: patients.filter(p => p.priority === 'High').length, color: '#f59e0b' },
      { name: 'Medium', value: patients.filter(p => p.priority === 'Medium').length, color: '#3b82f6' },
      { name: 'Low', value: patients.filter(p => p.priority === 'Low').length, color: '#22c55e' },
    ];

    const weeklyMap = new Map([
      ['Mon', { day: 'Mon', patients: 0, consultations: 0, emergencies: 0 }],
      ['Tue', { day: 'Tue', patients: 0, consultations: 0, emergencies: 0 }],
      ['Wed', { day: 'Wed', patients: 0, consultations: 0, emergencies: 0 }],
      ['Thu', { day: 'Thu', patients: 0, consultations: 0, emergencies: 0 }],
      ['Fri', { day: 'Fri', patients: 0, consultations: 0, emergencies: 0 }],
      ['Sat', { day: 'Sat', patients: 0, consultations: 0, emergencies: 0 }],
      ['Sun', { day: 'Sun', patients: 0, consultations: 0, emergencies: 0 }]
    ]);

    appointments.forEach((appt) => {
      const date = appt.date ? new Date(appt.date) : null;
      if (!date || Number.isNaN(date.getTime())) return;
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const entry = weeklyMap.get(day);
      if (!entry) return;
      entry.consultations += 1;
      if (appt.reason?.toLowerCase().includes('emergency')) entry.emergencies += 1;
      entry.patients += 1;
    });

    const conditionCounts = patients.reduce((acc, p) => {
      const key = p.condition || 'General';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const conditionBreakdown = Object.entries(conditionCounts).map(([condition, count]) => ({
      condition,
      count,
      risk: Math.min(100, count * 10)
    }));

    return {
      appointmentsByHour: appointmentHours,
      riskDistribution,
      weeklyTrend: Array.from(weeklyMap.values()),
      conditionBreakdown
    };
  }, [patients, appointments]);

  // Forecast data (simulated AI prediction)
  const forecastData = useMemo(() => {
    if (!forecastMode) return [];
    return [];
  }, [forecastMode]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handlers
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgets(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleWidgetCollapse = (id) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w));
  };

  const resizeWidget = (id, size) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  const acknowledgeNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const snoozeNotification = (id, minutes) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, snoozed: true, snoozeUntil: new Date(Date.now() + minutes * 60000) } : n
    ));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const startVideoCall = (patient) => {
    alert(`Starting video call with ${patient.name}...`);
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: 'You',
      action: 'started video call with',
      target: patient.name,
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: status.toLowerCase() })
      });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const toggleBulkSelection = (id) => {
    setBulkSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkMessage = () => {
    if (bulkSelection.length > 0) {
      alert(`Sending message to ${bulkSelection.length} patients...`);
      setBulkSelection([]);
    }
  };

  const exportData = () => {
    const data = {
      patients: sortedPatients,
      appointments,
      analytics: analyticsData,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Command palette commands
  const commands = [
    { id: 'search', label: 'Search patients...', action: () => searchInputRef.current?.focus() },
    { id: 'dark', label: 'Toggle dark mode', action: () => setDark(d => !d) },
    { id: 'export', label: 'Export dashboard data', action: exportData },
    { id: 'refresh', label: 'Refresh all data', action: () => window.location.reload() },
    { id: 'critical', label: 'View critical patients only', action: () => setFilterPriority('Critical') },
    { id: 'all', label: 'Show all patients', action: () => setFilterPriority('All') },
    { id: 'forecast', label: 'Toggle vitals forecast', action: () => setForecastMode(f => !f) },
  ];

  const filteredCommands = commands.filter(c =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.read && !n.snoozed);

  // Render widget content
  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'vitals':
        return (
          <div className="space-y-4">
            {/* Critical Alerts Bar */}
            {criticalPatients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="animate-pulse" />
                  <span className="font-semibold">{criticalPatients.length} Critical Patients Require Attention</span>
                </div>
                <div className="flex gap-2">
                  {criticalPatients.slice(0, 2).map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className="px-2 py-1 bg-white/20 rounded text-sm hover:bg-white/30"
                    >
                      {p.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {vitalsLive.slice(0, 8).map(v => {
                const patientMatch = patients.find(p => p.name === v.patient);
                const p = patientMatch || {
                  id: v.id,
                  name: v.patient,
                  priority: 'Low',
                  onlineStatus: 'offline',
                  vitalsHistory: []
                };
                const latest = {
                  bp: v.bp,
                  hr: v.hr,
                  o2: v.o2 || v.oxygenSaturation,
                  temp: v.temp
                };
                const systolic = parseInt(latest?.bp?.split('/')[0] || '0');
                const isAbnormal = systolic > 150 || (latest?.hr || 0) > 110 || (latest?.o2 || 100) < 94;

                return (
                  <motion.div
                    key={p.id}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${isAbnormal
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-pulse'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    onClick={() => setSelectedPatient(p)}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredPatient(p.id)}
                    onMouseLeave={() => setHoveredPatient(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.onlineStatus === 'online' ? 'bg-green-500' : p.onlineStatus === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        <span className="font-medium text-sm truncate">{p.name}</span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full text-white`}
                        style={{ backgroundColor: PRIORITY_COLORS[p.priority] }}>
                        {p.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={`flex items-center gap-1 ${systolic > 150 ? 'text-red-600 font-bold' : ''}`}>
                        <FaHeartbeat /> {latest?.bp || 'N/A'}
                      </div>
                      <div className={`flex items-center gap-1 ${(latest?.hr || 0) > 110 ? 'text-red-600 font-bold' : ''}`}>
                        <FaTint /> {latest?.hr || 'N/A'} bpm
                      </div>
                      <div className={`flex items-center gap-1 ${(latest?.o2 || 100) < 94 ? 'text-red-600 font-bold' : ''}`}>
                        <FaLungs /> {latest?.o2 || 'N/A'}%
                      </div>
                      <div className="flex items-center gap-1">
                        <FaThermometerHalf /> {latest?.temp || 'N/A'}°
                      </div>
                    </div>

                    {/* Inline Sparkline */}
                    <AnimatePresence>
                      {hoveredPatient === p.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 40, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2"
                        >
                          <Sparkline
                            data={[{ bp: latest?.bp }]}
                            dataKey={(d) => parseInt(d.bp?.split('/')[0] || '0')}
                            color={isAbnormal ? '#ef4444' : '#3b82f6'}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); startVideoCall(p); }}
                        className="flex-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200"
                      >
                        <FaVideo className="inline mr-1" /> Call
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomAlerts(prev => ({ ...prev, [p.id]: !prev[p.id] }));
                        }}
                        className={`text-xs px-2 py-1 rounded ${customAlerts[p.id]
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
                          }`}
                      >
                        <FaBell className="inline" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Forecast Toggle & Chart */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <FaChartLine /> Vitals Trend {forecastMode && <span className="text-xs text-blue-500">(+ 48h Forecast)</span>}
                </h4>
                <button
                  onClick={() => setForecastMode(f => !f)}
                  className={`text-black px-3 py-1 text-sm rounded-full flex items-center gap-1 ${forecastMode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                >
                  <FaBrain /> AI Forecast
                </button>
              </div>
              <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    ...vitalsLive.slice(0, 7).reverse().map(v => ({
                      date: new Date(v.timestamp || Date.now()).toLocaleTimeString(),
                      systolic: parseInt(v.bp?.split('/')[0] || '0'),
                      hr: v.hr,
                      predicted: false
                    })),
                    ...(forecastMode ? forecastData.map((f, i) => ({
                      date: `+${i}h`,
                      systolic: f.bp,
                      hr: f.hr,
                      predicted: true
                    })) : [])
                  ]}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label="High BP" />
                    <Area type="monotone" dataKey="systolic" fill="#3b82f620" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="hr" stroke="#22c55e" strokeWidth={2} dot={false} />
                    {forecastMode && <Brush dataKey="date" height={20} stroke="#8884d8" />}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  placeholder="Search patients... (Ctrl+/)"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-lg mt-1 shadow-lg z-10">
                    {searchSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setSearch(s); setSearchSuggestions([]); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-black px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="All">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-black px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="risk">Sort by Risk</option>
                <option value="name">Sort by Name</option>
                <option value="appointment">Sort by Appointment</option>
                <option value="deterioration">Sort by Deterioration</option>
              </select>
            </div>

            {/* Patient List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {paginatedPatients.map(p => {
                const hasMissingData = p.missingData.length > 0;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-l-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow ${p.priority === 'Critical' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                      p.priority === 'High' ? 'border-l-orange-500' :
                        p.priority === 'Medium' ? 'border-l-blue-500' : 'border-l-green-500'
                      } bg-white dark:bg-gray-800`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <input
                      type="checkbox"
                      checked={bulkSelection.includes(p.id)}
                      onChange={(e) => { e.stopPropagation(); toggleBulkSelection(p.id); }}
                      className="w-4 h-4"
                    />
                    <img src={p.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{p.name}</span>
                        <div className={`w-2 h-2 rounded-full ${p.onlineStatus === 'online' ? 'bg-green-500' : p.onlineStatus === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        {hasMissingData && (
                          <span className="text-xs text-orange-500 flex items-center gap-1">
                            <FaExclamationCircle /> Missing: {p.missingData.join(', ')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{p.condition}</span>
                        <span>•</span>
                        <span>{p.age}y</span>
                        <span>•</span>
                        <span>Risk: {p.riskScore}%</span>
                        {p.predictedDeterioration > 60 && (
                          <>
                            <span>•</span>
                            <span className="text-red-500 flex items-center gap-1">
                              <FaArrowUp /> Deterioration: {p.predictedDeterioration}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {p.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>Next: {p.nextAppointment}</div>
                      <div className="text-xs">Adherence: {p.adherenceScore}%</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); startVideoCall(p); }}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded hover:bg-blue-200"
                      >
                        <FaVideo size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-1.5 bg-green-100 dark:bg-green-900 text-green-600 rounded hover:bg-green-200"
                      >
                        <FaPhoneAlt size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination & Bulk Actions */}
            <div className="flex items-center justify-between pt-2 border-t dark:border-gray-600">
              <div className="flex items-center gap-2">
                {bulkSelection.length > 0 && (
                  <>
                    <span className="text-sm">{bulkSelection.length} selected</span>
                    <button
                      onClick={bulkMessage}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Message All
                    </button>
                    <button
                      onClick={() => setBulkSelection([])}
                      className="px-3 py-1 border text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">{page + 1} / {totalPages}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-3">
            {/* Average Wait Time */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Average Wait Time</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(appointments.filter(a => a.status === 'Pending').reduce((s, a) => s + a.waitTime, 0) /
                    (appointments.filter(a => a.status === 'Pending').length || 1))} min
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-xl font-semibold">
                  {appointments.filter(a => a.status === 'Pending').length}
                </div>
              </div>
            </div>

            {/* Appointment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
              {appointments.slice(0, 8).map(apt => (
                <motion.div
                  key={apt.id}
                  layout
                  className={`p-3 rounded-lg border ${apt.status === 'In Progress' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                    apt.status === 'Completed' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                      apt.status === 'Cancelled' ? 'border-gray-300 bg-gray-50 dark:bg-gray-700 opacity-60' :
                        'border-gray-200 dark:border-gray-600'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{apt.patient}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                      }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                    <FaClock /> {apt.time}
                    <span>•</span>
                    {apt.type === 'Telemedicine' ? <FaVideo /> : <FaHospital />}
                    {apt.type}
                    {apt.status === 'Pending' && (
                      <>
                        <span>•</span>
                        <span className="text-orange-500">Wait: {apt.waitTime}min</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{apt.reason}</div>
                  <div className="flex gap-1">
                    {apt.status === 'Pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'In Progress')}
                        className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Start
                      </button>
                    )}
                    {apt.status === 'In Progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                        className="flex-1 text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                        className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Suggested Slots */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                <FaRobot /> AI Suggested Optimal Slots
              </div>
              <div className="text-black flex gap-2 flex-wrap">
                {['10:30 AM', '2:00 PM', '4:15 PM'].map(slot => (
                  <button
                    key={slot}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-600 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-800"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-4">
            {/* Scenario Simulation */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <FaCog /> Scenario Simulation
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Patient Load: {scenarioSliders.patientLoad}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scenarioSliders.patientLoad}
                    onChange={(e) => setScenarioSliders(s => ({ ...s, patientLoad: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Risk Threshold: {scenarioSliders.riskThreshold}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scenarioSliders.riskThreshold}
                    onChange={(e) => setScenarioSliders(s => ({ ...s, riskThreshold: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Appointments by Hour */}
              <div className="p-3 border rounded-lg dark:border-gray-600">
                <h4 className="text-sm font-medium mb-2">Appointments by Hour</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.appointmentsByHour}>
                      <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#3b82f6" />
                      <Bar dataKey="completed" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="p-3 border rounded-lg dark:border-gray-600">
                <h4 className="text-sm font-medium mb-2">Risk Distribution</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.riskDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={50}
                      >
                        {analyticsData.riskDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Trend */}
              <div className="p-3 border rounded-lg dark:border-gray-600">
                <h4 className="text-sm font-medium mb-2">Weekly Trend</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.weeklyTrend}>
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="patients" stackId="1" fill="#3b82f6" stroke="#3b82f6" />
                      <Area type="monotone" dataKey="consultations" stackId="2" fill="#22c55e" stroke="#22c55e" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Condition Heatmap */}
            <div className="p-3 border rounded-lg dark:border-gray-600">
              <h4 className="text-sm font-medium mb-2">Condition Risk Heatmap</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analyticsData.conditionBreakdown}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="condition" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} />
                    <Radar name="Risk" dataKey="risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Radar name="Count" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            {/* AI Predictions */}
            <div className="p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300 mb-3">
                <FaBrain /> Predictive Analytics
              </div>
              <div className="space-y-2">
                {patients.filter(p => p.predictedDeterioration > 60).slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-violet-200 dark:border-violet-700">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className={p.predictedDeterioration > 80 ? 'text-red-500' : 'text-orange-500'} />
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Deterioration Risk:</span>
                      <span className={`ml-1 font-bold ${p.predictedDeterioration > 80 ? 'text-red-600' : 'text-orange-600'}`}>
                        {p.predictedDeterioration}%
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="px-2 py-1 text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="p-3 border rounded-lg dark:border-gray-600">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FaRobot /> Smart Suggestions
              </h4>
              <div className="text-black space-y-2">
                <div className="text-black flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <FaCheckCircle className="text-blue-500" />
                  <span>Schedule follow-up for 3 post-op patients this week</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                  <FaExclamationCircle className="text-yellow-500" />
                  <span>5 patients have overdue lab work</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                  <FaInfoCircle className="text-green-500" />
                  <span>Consider medication review for chronic patients</span>
                </div>
              </div>
            </div>

            {/* Missing Data Alerts */}
            <div className="p-3 border rounded-lg dark:border-gray-600">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" /> Missing Data Alerts
              </h4>
              <div className="space-y-1">
                {patients.filter(p => p.missingData.length > 0).slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm p-1">
                    <span>{p.name}</span>
                    <span className="text-orange-500">{p.missingData.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-3">
            {/* Team Status */}
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-2 p-2 border rounded-lg dark:border-gray-600">
                  <img src={member.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${member.status === 'available' ? 'bg-green-500' :
                    member.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  {member.currentPatient && (
                    <span className="text-xs text-gray-500">{member.currentPatient}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Activity Log */}
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {activityLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="text-xs text-gray-500 p-1 border-l-2 border-blue-300 pl-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{log.user}</span> {log.action}{' '}
                    <span className="text-blue-600">{log.target}</span>
                    <span className="ml-2">{log.timestamp.toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <FaTrophy className="text-yellow-500" /> Today's Leaderboard
              </h4>
              {leaderboard.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm p-1">
                  <span className={`font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                    #{i + 1}
                  </span>
                  <span className="flex-1">{doc.name}</span>
                  <span className="text-gray-500">{doc.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 text-white transition-colors`}>
      {/* Header */}
      <header className="bg-charcoal-950/95 backdrop-blur-xl border-b border-primary-900/30 shadow-2xl shadow-charcoal-950/50 sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-900 via-luxury-gold to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50">
                  <FaStethoscope className="text-luxury-gold text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider">
                    MEDICORE PRO
                  </h1>
                  <p className="text-xs text-muted-400 font-medium tracking-widest">Doctor Dashboard</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 ml-8">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    {criticalPatients.length} Critical
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{patients.length}</span> Patients
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length}
                  </span> Appointments
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FaKeyboard /> <span className="text-xs">⌘K</span>
              </button>

              {/* Theme Toggles */}
              <button
                onClick={() => setDark(d => !d)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {dark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>

              <button
                onClick={() => setHighContrast(h => !h)}
                className={`p-2 rounded-lg ${highContrast ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FaEye />
              </button>

              {/* Notifications */}
              <div className="text-black relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative"
                >
                  <FaBell />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 z-50 max-h-[500px] overflow-hidden"
                    >
                      <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">No notifications</div>
                        ) : (
                          notifications.slice(0, 10).map(n => (
                            <motion.div
                              key={n.id}
                              layout
                              className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                            >
                              <div className="flex items-start gap-2">
                                {n.type === 'critical' && <FaExclamationTriangle className="text-red-500 mt-0.5" />}
                                {n.type === 'warning' && <FaExclamationCircle className="text-yellow-500 mt-0.5" />}
                                {n.type === 'info' && <FaInfoCircle className="text-blue-500 mt-0.5" />}
                                {n.type === 'success' && <FaCheckCircle className="text-green-500 mt-0.5" />}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{n.title}</div>
                                  <div className="text-xs text-gray-500">{n.message}</div>
                                  <div className="text-xs text-gray-400 mt-1">{n.timestamp.toLocaleTimeString()}</div>
                                  {n.actions && (
                                    <div className="flex gap-1 mt-2">
                                      {n.actions.map((action, i) => (
                                        <button
                                          key={i}
                                          onClick={() => {
                                            if (action.action === 'ack') acknowledgeNotification(n.id);
                                            if (action.action === 'view' && n.patientId) {
                                              setSelectedPatient(patients.find(p => p.id === n.patientId) || null);
                                              setShowNotifications(false);
                                            }
                                          }}
                                          className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200"
                                        >
                                          {action.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => snoozeNotification(n.id, 30)}
                                    className="text-xs text-gray-400 hover:text-gray-600"
                                  >
                                    <FaClock />
                                  </button>
                                  <button
                                    onClick={() => dismissNotification(n.id)}
                                    className="text-xs text-gray-400 hover:text-red-600"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Export Button */}
              <button
                onClick={exportData}
                className="text-black hidden md:flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <FaDownload /> Export
              </button>

              {/* Refresh */}
              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaSync />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets.map(widget => (
                <SortableWidget
                  key={widget.id}
                  widget={widget}
                  onToggleCollapse={toggleWidgetCollapse}
                  onResize={resizeWidget}
                >
                  {renderWidgetContent(widget)}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Quick Actions Toolbar */}
        <div className="text-black fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-2xl border dark:border-gray-700 px-6 py-3 flex items-center gap-4 z-40">
          <button
            onClick={() => navigate('/doctor/lab-results')}
            className="text-black flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaFlask className="text-lg" />
            <span className="text-xs">Labs</span>
          </button>
          <button
            onClick={() => navigate('/pharmacy')}
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaPills className="text-lg" />
            <span className="text-xs">Rx</span>
          </button>
          <button
            onClick={() => navigate('/doctor/schedule')}
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaCalendarAlt className="text-lg" />
            <span className="text-xs">Schedule</span>
          </button>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaUserInjured className="text-lg" />
            <span className="text-xs">Patients</span>
          </button>
          <button
            onClick={() => navigate('/doctor/billing')}
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaCreditCard className="text-lg" />
            <span className="text-xs">Billing</span>
          </button>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaKeyboard className="text-lg" />
            <span className="text-xs">⌘K</span>
          </button>
        </div>
      </main>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-700">
                <FaSearch className="text-gray-400" />
                <input
                  ref={commandInputRef}
                  type="text"
                  value={commandSearch}
                  onChange={e => setCommandSearch(e.target.value)}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent outline-none text-lg"
                />
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredCommands.map(cmd => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setShowCommandPalette(false);
                      setCommandSearch('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <FaChevronDown className="text-gray-400" />
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Patient Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img src={selectedPatient.photo} alt="" className="w-20 h-20 rounded-full border-4 border-white/30" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                          {selectedPatient.age}y • {selectedPatient.gender}
                        </span>
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                          {selectedPatient.condition}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-sm ${selectedPatient.priority === 'Critical' ? 'bg-red-500' :
                          selectedPatient.priority === 'High' ? 'bg-orange-500' :
                            selectedPatient.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}>
                          {selectedPatient.priority} Risk
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {selectedPatient.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{selectedPatient.riskScore}%</div>
                    <div className="text-xs opacity-75">Risk Score</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{selectedPatient.adherenceScore}%</div>
                    <div className="text-xs opacity-75">Adherence</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{selectedPatient.predictedDeterioration}%</div>
                    <div className="text-xs opacity-75">Deterioration Risk</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium">{selectedPatient.nextAppointment}</div>
                    <div className="text-xs opacity-75">Next Visit</div>
                  </div>
                </div>
              </div>

              {/* Patient Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vitals History */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FaChartLine /> Vitals History
                  </h3>
                  <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={selectedPatient.vitalsHistory.slice(0, 14).reverse()}>
                        <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey={(d) => parseInt(d.bp?.split('/')[0] || '0')} name="Systolic" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="hr" name="Heart Rate" stroke="#3b82f6" strokeWidth={2} />
                        <Area type="monotone" dataKey="o2" name="O2" fill="#22c55e20" stroke="#22c55e" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Latest Vitals */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {selectedPatient.vitalsHistory.slice(0, 4).map((v, i) => (
                      <div key={i} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <div className="text-xs text-gray-500 mb-1">{v.date}</div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <span>BP: {v.bp}</span>
                          <span>HR: {v.hr}</span>
                          <span>O₂: {v.o2}%</span>
                          <span>Temp: {v.temp}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions & Notes */}
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-semibold mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => startVideoCall(selectedPatient)}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200"
                      >
                        <FaVideo /> Start Video Call
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200">
                        <FaPhoneAlt /> Phone Call
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg hover:bg-purple-200">
                        <FaPills /> Prescribe
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-lg hover:bg-orange-200">
                        <FaFlask /> Order Labs
                      </button>
                    </div>
                  </div>

                  {/* Clinical Notes */}
                  <div>
                    <h3 className="font-semibold mb-2">Clinical Notes</h3>
                    <textarea
                      placeholder="Add clinical notes..."
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <FaSave className="inline mr-2" /> Save Note
                      </button>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaMicrophone />
                      </button>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300 mb-2">
                      <FaBrain /> AI Suggestions
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>Consider adjusting BP medication based on trends</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaExclamationCircle className="text-yellow-500" />
                        <span>Schedule HbA1c test (last: 3 months ago)</span>
                      </div>
                    </div>
                  </div>

                  {/* Missing Data */}
                  {selectedPatient.missingData.length > 0 && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                        <FaExclamationTriangle /> Missing Data
                      </div>
                      <div className="flex gap-2">
                        {selectedPatient.missingData.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-100 dark:bg-orange-800 rounded text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-[1920px] mx-auto px-4 py-6 mt-8 text-center text-sm text-gray-500">
        <p>© 2024 MediCore Pro — Advanced Doctor Dashboard</p>
        <p className="text-xs mt-1">Real-time vitals • AI-powered insights • Predictive analytics</p>
      </footer>
    </div>
  );
}

export default App;
