// Diagnostics.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { BellIcon, FileDownIcon, SunIcon, MoonIcon, Search, ChevronDown, X, DownloadCloud, Check, Loader2, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FileSaver from "file-saver";

const { saveAs } = FileSaver;

// Optional libraries — install them for export/pdf/socket features:
// import io from 'socket.io-client';
// import XLSX from 'xlsx';
// import jsPDF from 'jspdf';

//
// ========================
// Utilities & Fake Data
// ========================
const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusColors = {
  [STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const sampleTestsInitial = [
  { id: 'T001', name: 'Blood Test', category: 'Pathology', status: STATUS.PENDING, patient: 'Ali Raza', date: '2025-07-21', priority: 'High', assignedTo: 'Ali', progress: 10 },
  { id: 'T002', name: 'X-Ray Chest', category: 'Radiology', status: STATUS.COMPLETED, patient: 'Sana Khan', date: '2025-07-20', priority: 'Low', assignedTo: 'Sana', progress: 100 },
  { id: 'T003', name: 'MRI Brain', category: 'Radiology', status: STATUS.IN_PROGRESS, patient: 'Ahmed Ali', date: '2025-07-22', priority: 'High', assignedTo: 'Bilal', progress: 60 },
  { id: 'T004', name: 'Urine Test', category: 'Pathology', status: STATUS.COMPLETED, patient: 'Fatima Noor', date: '2025-07-22', priority: 'Low', assignedTo: 'Zara', progress: 100 },
  { id: 'T005', name: 'CT Abdomen', category: 'Radiology', status: STATUS.PENDING, patient: 'Hassan Shah', date: '2025-07-23', priority: 'Medium', assignedTo: 'Ali', progress: 0 },
  // more...
];

// helper: format date string -> human friendly (no external lib)
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function generateId(prefix = 'T') {
  return `${prefix}${Math.floor(Math.random() * 900000 + 100000)}`;
}

function downloadCSV(filename, rows) {
  // rows: array of objects
  if (!rows || !rows.length) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    return;
  }
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(','),
    ...rows.map(r => header.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

async function downloadXLSX(filename, rows) {
  // requires sheetjs (XLSX)
  try {
    // eslint-disable-next-line global-require
    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  } catch (err) {
    console.warn('XLSX export failed — install xlsx (sheetjs) to enable', err);
    downloadCSV(filename.replace('.xlsx', '.csv'), rows);
  }
}

function downloadPDF(filename, rows) {
  // requires jsPDF
  try {
    // eslint-disable-next-line global-require
    const jsPDF = require('jspdf');
    const doc = new jsPDF();
    const header = Object.keys(rows[0] || {});
    doc.setFontSize(12);
    doc.text('Diagnostics Report', 14, 20);
    const startY = 30;
    doc.setFontSize(10);
    let y = startY;
    doc.text(header.join(' | '), 14, y);
    y += 6;
    rows.forEach((r) => {
      const line = header.map(h => (r[h] ?? '').toString()).join(' | ');
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line.slice(0, 110), 14, y);
      y += 6;
    });
    doc.save(filename);
  } catch (err) {
    console.warn('PDF export failed — install jspdf to enable', err);
    downloadCSV(filename.replace('.pdf', '.csv'), rows);
  }
}

//
// ========================
// Subcomponents (inside same file)
// ========================
const Badge = ({ children, className = '' }) => (
  <span className={clsx('inline-block px-2 py-1 rounded-full text-xs font-medium', className)}>{children}</span>
);

const SkeletonCard = () => (
  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded animate-pulse h-40">
    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3" />
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-1" />
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4" />
  </div>
);

const KPI = ({ title, value, delta, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4">
    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {delta !== undefined && <div className={`text-sm ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>{delta >= 0 ? `+${delta}%` : `${delta}%`} vs last week</div>}
    </div>
  </div>
);

//
// ========================
// Main Component
// ========================
const Diagnostics = ({ role = 'admin' /* 'doctor', 'technician', 'admin' */ }) => {
  // DATA & STATE
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortBy, setSortBy] = useState('dateDesc'); // options: dateDesc, dateAsc, patientAsc, patientDesc, priority
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [kpiRefreshKey, setKpiRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [compactMode, setCompactMode] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const searchRef = useRef();

  // datepicker destructuring
  const [startDate, endDate] = dateRange;

  // Simulated socket reference (optional)
  const socketRef = useRef(null);

  // load initial data (simulate fetch)
  useEffect(() => {
    setLoading(true);
    // simulate network
    const t = setTimeout(() => {
      // expand sample data: clone with some variations
      const expanded = [...sampleTestsInitial];
      for (let i = 0; i < 12; i++) {
        expanded.push({
          id: generateId('T'),
          name: i % 2 === 0 ? 'Blood Test' : (i % 3 === 0 ? 'X-Ray' : 'Urine Test'),
          category: i % 2 === 0 ? 'Pathology' : 'Radiology',
          status: [STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.COMPLETED][i % 3],
          patient: `Patient ${i + 1}`,
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
          priority: ['Low', 'Medium', 'High'][i % 3],
          assignedTo: ['Ali', 'Sana', 'Bilal', 'Zara'][i % 4],
          progress: Math.min(100, Math.floor(Math.random() * 100))
        });
      }
      setTests(expanded);
      setNotifications([
        { id: 1, message: 'New MRI test requested for Ahmed Ali', time: '2m', action: { type: 'view', id: 'T003' }, priority: 'high', read: false },
        { id: 2, message: 'Blood test report uploaded for Fatima Noor', time: '5m', action: { type: 'view', id: 'T004' }, priority: 'normal', read: false },
      ]);
      setLoading(false);
    }, 600);

    return () => clearTimeout(t);
  }, []);

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/') {
        if (searchRef.current) {
          e.preventDefault();
          searchRef.current.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Socket.io mock or real connection
  useEffect(() => {
    // If you have socket server, uncomment the real connection:
    // try {
    //   socketRef.current = io('https://your-server.com');
    //   socketRef.current.on('connect', () => setSocketConnected(true));
    //   socketRef.current.on('test:update', handleSocketUpdate);
    // } catch (e) { console.warn('Socket not connected'); }

    // Mock: generate live updates every 8s
    let interval = null;
    try {
      interval = setInterval(() => {
        // pick random test and update
        setTests(prev => {
          if (!prev.length) return prev;
          const idx = Math.floor(Math.random() * prev.length);
          const item = prev[idx];
          // randomly progress an in-progress test
          const clone = [...prev];
          if (item.status === STATUS.IN_PROGRESS) {
            const newProg = Math.min(100, item.progress + Math.floor(Math.random() * 30));
            clone[idx] = { ...item, progress: newProg, status: newProg >= 100 ? STATUS.COMPLETED : STATUS.IN_PROGRESS };
            // push notification
            if (newProg >= 100) {
              setNotifications(n => [{ id: Date.now(), message: `${item.name} completed for ${item.patient}`, time: 'now', action: { type: 'view', id: item.id }, priority: 'normal', read: false }, ...n].slice(0, 50));
            }
          } else if (item.status === STATUS.PENDING) {
            // in some cases move to in-progress
            if (Math.random() > 0.7) {
              clone[idx] = { ...item, status: STATUS.IN_PROGRESS, progress: 5 };
              setNotifications(n => [{ id: Date.now(), message: `${item.name} started for ${item.patient}`, time: 'now', action: { type: 'view', id: item.id }, priority: 'normal' }, ...n].slice(0, 50));
            }
          }
          return clone;
        });
      }, 8000);
    } catch (err) {
      console.warn('Socket mock failed', err);
    }
    return () => clearInterval(interval);
  }, []);

  // Derived lists
  const categories = useMemo(() => {
    const set = new Set(tests.map(t => t.category));
    return ['All', ...Array.from(set)];
  }, [tests]);

  // Filtering & sorting pipeline
  const filteredTests = useMemo(() => {
    let list = [...tests];

    // role-based filtering
    if (role === 'doctor') {
      // show only tests with patients assigned to this doctor — placeholder
      // replace logic with real user context
      list = list.filter(t => t.assignedTo === 'Ali');
    } else if (role === 'technician') {
      list = list.filter(t => t.assignedTo === 'Sana');
    }

    // category filter
    if (selectedCategory && selectedCategory !== 'All') list = list.filter(t => t.category === selectedCategory);

    // status filter
    if (filterStatus !== 'All') list = list.filter(t => t.status === filterStatus);

    // search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.patient || '').toLowerCase().includes(q) ||
        (t.id || '').toLowerCase().includes(q)
      );
    }

    // date range filter
    if (startDate || endDate) {
      list = list.filter(t => {
        const d = new Date(t.date);
        if (startDate && d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
      });
    }

    // sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'dateAsc': return new Date(a.date) - new Date(b.date);
        case 'dateDesc': return new Date(b.date) - new Date(a.date);
        case 'patientAsc': return (a.patient || '').localeCompare(b.patient || '');
        case 'patientDesc': return (b.patient || '').localeCompare(a.patient || '');
        case 'priority': return (['High', 'Medium', 'Low'].indexOf(a.priority) - ['High', 'Medium', 'Low'].indexOf(b.priority));
        default: return 0;
      }
    });

    return list;
  }, [tests, searchTerm, filterStatus, startDate, endDate, sortBy, role, selectedCategory]);

  // KPIs computed
  const kpis = useMemo(() => {
    const totalToday = tests.filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;
    const pending = tests.filter(t => t.status === STATUS.PENDING).length;
    const completed = tests.filter(t => t.status === STATUS.COMPLETED).length;
    const activeTechs = new Set(tests.map(t => t.assignedTo)).size;
    // simplistic delta calc mock
    return {
      totalToday, pending, completedRate: tests.length ? Math.round((completed / tests.length) * 100) : 0, activeTechs
    };
  }, [tests, kpiRefreshKey]);

  // small helper to update status/progress
  const updateTest = useCallback((id, patch) => {
    setTests(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  // notification actions
  const handleNotificationAction = (notif) => {
    if (notif.action?.type === 'view') {
      setExpandedId(notif.action.id);
      // also focus on that card by scrolling
      setTimeout(() => {
        const el = document.getElementById(`card-${notif.action.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  };

  // Export handlers
  const handleExportAllCSV = () => {
    downloadCSV(`diagnostics_${new Date().toISOString().slice(0, 10)}.csv`, tests);
  };
  const handleExportFilteredCSV = () => {
    downloadCSV(`diagnostics_filtered_${new Date().toISOString().slice(0, 10)}.csv`, filteredTests);
  };
  const handleExportXLSX = () => {
    downloadXLSX(`diagnostics_${new Date().toISOString().slice(0, 10)}.xlsx`, filteredTests);
  };
  const handleExportPDF = () => {
    downloadPDF(`diagnostics_${new Date().toISOString().slice(0, 10)}.pdf`, filteredTests);
  };

  // Download a single test report (mocked)
  const downloadSingleReport = (test) => {
    // simple CSV for single test
    const row = [{ id: test.id, name: test.name, patient: test.patient, category: test.category, status: test.status, date: test.date }];
    downloadCSV(`${test.id}_report.csv`, row);
  };

  // toggle theme effect on body
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    if (highContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  }, [darkMode, highContrast]);

  // small UX helpers
  const clearFilters = () => {
    setFilterStatus('All');
    setSearchTerm('');
    setDateRange([null, null]);
    setSelectedCategory('All');
    setSortBy('dateDesc');
  };

  // Render
  return (
    <div className={clsx('min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 p-6 transition duration-300 text-white')}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnostics Dashboard</h1>
          <div className="text-sm text-gray-500 dark:text-gray-300">Real-time lab monitoring · role: <strong>{role}</strong></div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow">
            <button onClick={() => { setDarkMode(dm => !dm); }} title="Toggle theme" className="p-2 rounded">
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <label className="text-black flex items-center gap-2 text-sm">
              <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
              High Contrast
            </label>
          </div>

          <div className="relative">
            <button
              title="Notifications"
              className="text-black p-3 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 animate-pulse"
            >
              <BellIcon className="w-5 h-5 text-white" />
              <span className="ml-1 text-xs bg-red-600 text-white rounded-full px-2 py-1 font-bold shadow-md">{notifications.filter(n => !n.read).length}</span>
            </button>
            {/* Enhanced Dropdown */}
            <div className="absolute right-0 mt-3 w-96 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white font-bold text-lg flex items-center gap-2">
                    <BellIcon className="w-6 h-6" />
                    Notifications
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotifications(n => n.map(notif => ({ ...notif, read: true })))}
                      className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                      title="Mark all as read"
                    >
                      <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      Mark Read
                    </button>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                      title="Clear all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No notifications</div>
                  </div>
                )}
                {notifications.map((n, index) => (
                  <div
                    key={n.id}
                    className={clsx(
                      'group relative p-4 mb-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
                      n.read ? 'bg-white/50 dark:bg-gray-700/50 opacity-75' : 'bg-white dark:bg-gray-700 shadow-md',
                      n.priority === 'high' && !n.read && 'animate-pulse border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-700',
                      'transform translate-y-0 hover:-translate-y-1'
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {n.priority === 'high' ? (
                          <AlertTriangleIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <BellIcon className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={clsx('text-sm font-medium', n.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100')}>
                          {n.message}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <span>{n.time}</span>
                          {n.read && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              handleNotificationAction(n);
                              setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                            }}
                            className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            View
                          </button>
                          {!n.read && (
                            <button
                              onClick={() => setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif))}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <button onClick={() => setKpiRefreshKey(k => k + 1)} className="flex items-center gap-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700">
              <Loader2 className="w-4 h-4 animate-spin" /> Refresh KPIs
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tests, patients, IDs... (press / to focus)"
              className="w-full p-2 rounded border dark:bg-gray-800"
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-black p-2 border rounded">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-black p-2 border rounded">
            <option value="All">All</option>
            <option value={STATUS.PENDING}>Pending</option>
            <option value={STATUS.IN_PROGRESS}>In Progress</option>
            <option value={STATUS.COMPLETED}>Completed</option>
            <option value={STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center gap-2 justify-end">
          <div className="flex items-center gap-2">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(range) => setDateRange(range)}
              isClearable
              placeholderText="Select date range"
              className="p-2 border rounded"
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
              <option value="dateDesc">Date (newest)</option>
              <option value="dateAsc">Date (oldest)</option>
              <option value="patientAsc">Patient A→Z</option>
              <option value="patientDesc">Patient Z→A</option>
              <option value="priority">Priority</option>
            </select>
            <button onClick={clearFilters} className="text-black p-2 bg-gray-100 dark:bg-gray-700 rounded">Reset</button>
            <button onClick={() => setCompactMode(m => !m)} className="text-black p-2 bg-gray-100 dark:bg-gray-700 rounded">{compactMode ? 'Normal' : 'Compact'}</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="text-black grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPI title="Total Tests Today" value={kpis.totalToday} delta={5} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L3 7v6c0 5 3.7 9.7 9 11 5.3-1.3 9-6 9-11V7l-9-5z" /></svg>} />
        <KPI title="Pending Tests" value={kpis.pending} delta={-2} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11H7V9h6v4z" /></svg>} />
        <KPI title="Completion Rate" value={`${kpis.completedRate}%`} delta={3} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>} />
        <KPI title="Active Technicians" value={kpis.activeTechs} delta={0} icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" /></svg>} />
      </div>

      {/* Charts + Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-black font-bold">Test Distribution</h3>
            <div className="text-sm text-gray-400">by category</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={[
                  ...Object.entries(tests.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {})).map(([k, v]) => ({ name: k, value: v })),
                  // ensure there is data
                ]} cx="50%" cy="50%" outerRadius={70} innerRadius={30} label>
                  {(Object.keys(tests.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {}))).map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-black font-bold">Test Completion Trend</h3>
            <div className="text-sm text-gray-400">last 14 days</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={
                // create trend data: last 7 days counts of completed
                Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dateStr = date.toLocaleDateString();
                  const completed = tests.filter(t => {
                    const d = new Date(t.date);
                    return d.toLocaleDateString() === dateStr && t.status === STATUS.COMPLETED;
                  }).length;
                  return { date: dateStr, completed };
                })
              }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-black font-bold">Lab Technician Activity</h3>
            <div className="text-sm text-gray-400">reports/day</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={
                (() => {
                  const map = {};
                  tests.forEach(t => { map[t.assignedTo] = (map[t.assignedTo] || 0) + (t.status === STATUS.COMPLETED ? 1 : 0); });
                  return Object.entries(map).map(([k, v]) => ({ name: k, reports: v }));
                })()
              }>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards / Test list */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tests ({filteredTests.length})</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleExportAllCSV} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded">
              <DownloadCloud className="w-4 h-4" /> Export All
            </button>
            <div className="relative">
              <button className="text-white px-3 py-2 bg-blue-600 dark:bg-gray-700 rounded">More</button>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded shadow p-2">
                <button onClick={handleExportFilteredCSV} className="w-full text-left p-2 rounded hover:bg-gray-50">Export Filtered CSV</button>
                <button onClick={handleExportXLSX} className="w-full text-left p-2 rounded hover:bg-gray-50">Export XLSX</button>
                <button onClick={handleExportPDF} className="text-black w-full text-left p-2 rounded hover:bg-blue-50">Export PDF</button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className={clsx('grid gap-6', compactMode ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
            {filteredTests.map(test => (
              <div id={`card-${test.id}`} key={test.id} className={clsx('p-4 bg-white dark:bg-gray-800 shadow rounded-lg transition hover:shadow-lg relative', expandedId === test.id && 'ring-2 ring-indigo-400')}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-black text-lg font-semibold">{test.name}</h3>
                      <Badge className={statusColors[test.status]}>{test.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Patient: <strong>{test.patient}</strong></div>
                    <div className="text-xs text-gray-400">{formatDate(test.date)} · {test.category} · Priority: <strong>{test.priority}</strong></div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-400">{test.assignedTo}</div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadSingleReport(test)} title="Download report" className="text-black p-2 bg-gray-600 dark:bg-gray-700 rounded">
                        <FileDownIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setExpandedId(id => id === test.id ? null : test.id); }} title="Expand" className="text-black p-2 bg-gray-600 dark:bg-gray-700 rounded">
                        <ChevronDown className={clsx('w-4 h-4 transition-transform', expandedId === test.id && 'rotate-180')} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* progress / small chart */}
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div style={{ width: `${test.progress}%` }} className={clsx('h-full rounded-full', test.progress >= 100 ? 'bg-green-500' : 'bg-indigo-500')}></div>
                    </div>
                    <div className="text-xs w-10 text-right">{test.progress}%</div>
                  </div>
                </div>

                {expandedId === test.id && (
                  <div className="mt-4 border-t pt-4 text-sm text-gray-600 dark:text-gray-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Test Details</div>
                        <div className="text-xs text-gray-400">Category: {test.category} · Assigned to: {test.assignedTo}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => updateTest(test.id, { status: STATUS.IN_PROGRESS, progress: Math.max(5, test.progress) })} className="px-2 py-1 bg-yellow-100 rounded">Start</button>
                        <button onClick={() => updateTest(test.id, { status: STATUS.COMPLETED, progress: 100 })} className="px-2 py-1 bg-green-100 rounded">Mark Complete</button>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">Timeline</div>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-gray-400 mt-1" />
                          <div>
                            <div className="text-xs text-gray-500">Test requested</div>
                            <div className="text-sm font-medium">{formatDate(test.date)}</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-1" />
                          <div>
                            <div className="text-xs text-gray-500">In progress</div>
                            <div className="text-sm">{test.progress}%</div>
                          </div>
                        </li>
                        {test.progress >= 100 && (
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-400 mt-1" />
                            <div>
                              <div className="text-xs text-gray-500">Completed</div>
                              <div className="text-sm">Report available</div>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => downloadSingleReport(test)} className="px-3 py-2 bg-blue-600 text-white rounded">Download Report</button>
                      <button onClick={() => setNotifications(n => [{ id: Date.now(), message: `Reminder: Verify ${test.name} for ${test.patient}`, time: 'now', priority: 'normal', action: { type: 'view', id: test.id } }, ...n].slice(0, 50))} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">Set Reminder</button>
                      <div className="ml-auto text-xs text-gray-500">Report link</div>
                      <div>
                        <QRCodeCanvas value={`https://hospital.com/reports/${test.id}`} size={80} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleExportFilteredCSV} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"><FileDownIcon className="w-4 h-4" /> Export Filtered CSV</button>
          <button onClick={handleExportXLSX} className="px-4 py-2 bg-indigo-600 text-white rounded">Export XLSX</button>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-gray-500 dark:bg-gray-700 rounded">Export PDF</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Socket:</div>
          <div className={clsx('px-2 py-1 rounded text-sm', socketConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
            {socketConnected ? 'Connected' : 'Mock'}
          </div>
          <div className="text-sm text-gray-400">Total tests: <strong>{tests.length}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
