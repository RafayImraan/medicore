import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSync, FaExclamationTriangle, FaStethoscope, FaHeartbeat, FaThermometerHalf, FaWeight, FaTint, FaNotesMedical, FaVideo, FaPhoneAlt, FaCalendarAlt, FaUsers, FaBell, FaFlask, FaUserInjured, FaCalendarCheck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, fetchWithFallback, fallbackData } from '../../services/api';
import { faker } from '@faker-js/faker';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';


// Small helpers
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const patientName = (i) => `${faker.person.firstName()} ${faker.person.lastName()}`;

// Generate mock appointments
const genAppointments = (count = 6) => Array.from({ length: count }).map((_, i) => ({
  id: `apt-${i + 1}`,
  date: new Date(Date.now() + i * 3600 * 24 * 1000).toLocaleDateString(),
  time: `${rand(8,16)}:${["00","15","30","45"][Math.floor(Math.random()*4)]}`,
  patient: patientName(i),
  reason: faker.lorem.words(3),
  status: faker.helpers.arrayElement(['Confirmed','Pending','Completed','Cancelled']),
}));

// Generate mock patients list
const genPatients = (n = 20) => Array.from({ length: n }).map((_, i) => ({
  id: `p-${i+1}`,
  name: patientName(i),
  age: rand(18,85),
  gender: faker.helpers.arrayElement(['Male','Female','Other']),
  nextAppointment: new Date(Date.now() + rand(1,20) * 86400000).toLocaleDateString(),
  priority: faker.helpers.arrayElement(['High','Medium','Low']),
  tags: faker.helpers.arrayElement(['Follow-up','New','Chronic','Post-op']),
  condition: faker.helpers.arrayElement(['Hypertension','Diabetes','Asthma','COPD','Fracture']),
  vitalsHistory: Array.from({ length: 7 }).map((__, j) => ({
    date: new Date(Date.now() - j*86400000).toLocaleDateString(),
    bp: `${rand(100,150)}/${rand(60,95)}`,
    hr: rand(60,110),
    sugar: rand(80,180),
    temp: +(36 + Math.random()*2).toFixed(1),
  })),
  photo: `https://i.pravatar.cc/150?img=${rand(1,70)}`
}));

// Colors for charts
const COLORS = ['#4ade80','#60a5fa','#f59e0b','#f87171','#a78bfa','#06b6d4'];

export default function DoctorDashboardPro() {
  const { user } = useAuth();
  const doctorId = user?._id;

  // Debug logging
  console.log('DoctorDashboard - user:', user);
  console.log('DoctorDashboard - doctorId:', doctorId);

  // Core state
  const [dark, setDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Real data state
  const [realPatients, setRealPatients] = useState([]);
  const [realAppointments, setRealAppointments] = useState([]);
  const [realVitals, setRealVitals] = useState([]);
  const [realNotifications, setRealNotifications] = useState([]);
  const [realAnalytics, setRealAnalytics] = useState({});

  // Fake data state (fallback)
  const [fakePatients, setFakePatients] = useState(() => genPatients(20));
  const [fakeAppointments, setFakeAppointments] = useState(() => genAppointments(9));
  const [fakeVitals, setFakeVitals] = useState(() => fakePatients.slice(0,8).map((p,i)=>({ id:`v-${i}`, patient:p.name, bp:`${rand(100,150)}/${rand(60,95)}`, sugar:rand(80,180), temp:+(36+Math.random()*2).toFixed(1), hr:rand(60,110), ts:new Date().toLocaleTimeString() })));
  const [fakeNotifications, setFakeNotifications] = useState([]);

  // Combined data state
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState([]);

  // Other state
  const [feedback, setFeedback] = useState(() => Array.from({length:4}).map((_,i)=>({ id:`f-${i}`, patient:patientName(i), rating:rand(3,5), comment: faker.lorem.sentence(), date: new Date(Date.now()-i*86400000).toLocaleDateString() })));
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [page, setPage] = useState(0);
  const perPage = 6;
  const [widgets, setWidgets] = useState(['overview','vitals','appointments','analytics']);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState({
    patients: false,
    appointments: false,
    vitals: false,
    notifications: false,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPatients();
    fetchAppointments();
    fetchVitals();
    fetchNotifications();
  }, [doctorId]);

  // Fetch patients with fallback
  const fetchPatients = async () => {
    setLoading(prev => ({ ...prev, patients: true }));
    try {
      const { data, isRealData } = await fetchWithFallback(
        () => doctorAPI.getPatientQueue(doctorId),
        () => fallbackData.generatePatients(20)
      );
      if (isRealData) {
        setRealPatients(data);
        setFakePatients([]);
        // Pad with fake patients to ensure at least 20 total
        const fakeCount = Math.max(0, 20 - data.length);
        const fakeData = fakeCount > 0 ? fallbackData.generatePatients(fakeCount) : [];
        setFakePatients(fakeData);
        setPatients([...data, ...fakeData]);
      } else {
        setRealPatients([]);
        setFakePatients(data);
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      const fallbackPatients = fallbackData.generatePatients(20);
      setPatients(fallbackPatients);
      setFakePatients(fallbackPatients);
      setRealPatients([]);
    }
    setLoading(prev => ({ ...prev, patients: false }));
  };

  // Fetch appointments with fallback
  const fetchAppointments = async () => {
    if (!doctorId) return;
    setLoading(prev => ({ ...prev, appointments: true }));
    try {
      const { data, isRealData } = await fetchWithFallback(
        () => doctorAPI.getMyAppointments(doctorId),
        () => fallbackData.generateAppointments(9)
      );
      if (isRealData) {
        setRealAppointments(Array.isArray(data) ? data : []);
        setFakeAppointments([]);
        // Pad with fake appointments to ensure at least 9 total
        const fakeCount = Math.max(0, 9 - (Array.isArray(data) ? data.length : 0));
        const fakeData = fakeCount > 0 ? fallbackData.generateAppointments(fakeCount) : [];
        setFakeAppointments(fakeData);
        setAppointments([...(Array.isArray(data) ? data : []), ...fakeData]);
      } else {
        setRealAppointments([]);
        setFakeAppointments(data);
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const fallbackAppointments = fallbackData.generateAppointments(9);
      setAppointments(fallbackAppointments);
      setFakeAppointments(fallbackAppointments);
      setRealAppointments([]);
    }
    setLoading(prev => ({ ...prev, appointments: false }));
  };

  // Fetch vitals with fallback
  const fetchVitals = async () => {
    setLoading(prev => ({ ...prev, vitals: true }));
    try {
      const { data, isRealData } = await fetchWithFallback(
        () => doctorAPI.getVitalsLive(),
        () => fallbackData.generateVitals(8)
      );
      if (isRealData) {
        setRealVitals(data);
        setFakeVitals([]);
        // Pad with fake vitals to ensure at least 8 total
        const fakeCount = Math.max(0, 8 - data.length);
        const fakeData = fakeCount > 0 ? fallbackData.generateVitals(fakeCount) : [];
        setFakeVitals(fakeData);
        setVitals([...data, ...fakeData]);
      } else {
        setRealVitals([]);
        setFakeVitals(data);
        setVitals(data);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
      const fallbackVitals = fallbackData.generateVitals(8);
      setVitals(fallbackVitals);
      setFakeVitals(fallbackVitals);
      setRealVitals([]);
    }
    setLoading(prev => ({ ...prev, vitals: false }));
  };

  // Fetch notifications with fallback
  const fetchNotifications = async () => {
    setLoading(prev => ({ ...prev, notifications: true }));
    try {
      const { data, isRealData } = await fetchWithFallback(
        () => doctorAPI.getNotifications(),
        () => fallbackData.generateNotifications(6)
      );
      if (isRealData) {
        setRealNotifications(data);
        setFakeNotifications([]);
        // Pad with fake notifications to ensure at least 6 total
        const fakeCount = Math.max(0, 6 - data.length);
        const fakeData = fakeCount > 0 ? fallbackData.generateNotifications(fakeCount) : [];
        setFakeNotifications(fakeData);
        setNotifications([...data, ...fakeData]);
      } else {
        setRealNotifications([]);
        setFakeNotifications(data);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const fallbackNotifications = fallbackData.generateNotifications(6);
      setNotifications(fallbackNotifications);
      setFakeNotifications(fallbackNotifications);
      setRealNotifications([]);
    }
    setLoading(prev => ({ ...prev, notifications: false }));
  };



  // simulated real-time vitals stream
  useEffect(() => {
    const t = setInterval(() => {
      setVitals(prev => {
        const next = prev.map(v => ({ ...v, bp: `${rand(100,150)}/${rand(60,95)}`, sugar: rand(70,200), temp: +(36 + Math.random()*2).toFixed(1), hr: rand(60,120), ts: new Date().toLocaleTimeString() }));
        // produce alerts for high-risk
        const alerts = next.filter(n => {
          const syst = +n.bp.split('/')[0];
          return syst > 140 || n.sugar > 180 || n.hr > 110;
        });
        if (alerts.length) {
          setNotifications(notifs => [...alerts.slice(0,2).map(a=>({id:`alert-${Date.now()}`, text:`Abnormal vitals: ${a.patient} BP:${a.bp} Sugar:${a.sugar}`})), ...notifs].slice(0,6));
        }
        return next;
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // derived filtered/paginated
  const filteredPatients = useMemo(() => patients.filter(p => (filterPriority==='All' || p.priority===filterPriority) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()))), [patients, search, filterPriority]);
  const paginated = filteredPatients.slice(page*perPage, (page+1)*perPage);
  const totalPages = Math.ceil(filteredPatients.length / perPage);

  // analytics mock
  const appointmentsByDay = useMemo(()=> Array.from({length:7}).map((_,i)=>({ day:`Day ${i+1}`, appointments: rand(5,25) })),[]);
  const patientRiskBreakdown = useMemo(()=> ({ high: patients.filter(p=>p.priority==='High').length, medium: patients.filter(p=>p.priority==='Medium').length, low: patients.filter(p=>p.priority==='Low').length }), [patients]);

  // Patient actions
  const openPatient = (p) => setSelectedPatient(p);
  const closePatient = () => setSelectedPatient(null);



  // Bulk actions
  const toggleBulk = (id) => setBulkSelection(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const bulkMessage = async () => {
    if (bulkSelection.length === 0) return;
    try {
      // For real patients, call API
      const realIds = bulkSelection.filter(id => realPatients.find(p => p.id === id));
      if (realIds.length > 0) {
        const result = await doctorAPI.bulkMessagePatients({ patientIds: realIds, message: 'Bulk message from doctor dashboard' });
        alert(`Bulk message sent successfully to ${result.sentCount} patients`);
      } else {
        alert(`Bulk message sent to ${bulkSelection.length} patients (demo)`);
      }
      setBulkSelection([]);
    } catch (error) {
      console.error('Error sending bulk message:', error);
      alert('Failed to send bulk message');
    }
  };

  // Start telemedicine call
  const startVideoCall = async (patient) => {
    try {
      if (realPatients.find(p => p.id === patient.id)) {
        const result = await doctorAPI.startTelemedicineCall({ patientId: patient.id, doctorId });
        alert(`Video call session started with ${patient.name}. Session ID: ${result.sessionId}`);
      } else {
        alert(`Starting video call with ${patient.name} (demo)`);
      }
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Failed to start video call');
    }
  };

  // Export patient timeline
  const exportPatientTimeline = async (patient) => {
    try {
      if (realPatients.find(p => p.id === patient.id)) {
        const result = await doctorAPI.exportPatientData({ patientId: patient.id });
        alert(`Timeline PDF exported successfully for ${patient.name}. Download link: ${result.downloadUrl}`);
      } else {
        alert(`Exporting timeline PDF for ${patient.name} (demo)`);
      }
    } catch (error) {
      console.error('Error exporting timeline:', error);
      alert('Failed to export timeline');
    }
  };

  // Sync with EHR
  const syncWithEHR = async () => {
    try {
      await doctorAPI.syncWithEHR({ doctorId });
      alert('Syncing with EHR');
    } catch (error) {
      console.error('Error syncing with EHR:', error);
      alert('Failed to sync with EHR');
    }
  };

  // Accessibility & theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('contrast-more', highContrast);
  }, [dark, highContrast]);

  // Update appointment status
  const markAppointmentComplete = async (appointmentId) => {
    try {
      const realAppointment = realAppointments.find(a => a.id === appointmentId);
      if (realAppointment) {
        await doctorAPI.updateAppointmentStatus(appointmentId, 'Completed');
        // Refresh appointments after update
        fetchAppointments();
      } else {
        alert('Marked appointment complete (demo)');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  // Refresh vitals from API
  const refreshVitals = async () => {
    try {
      setLoading(prev => ({ ...prev, vitals: true }));
      const { data, isRealData } = await fetchWithFallback(
        () => doctorAPI.getVitalsLive(),
        () => fallbackData.generateVitals(8)
      );
      if (isRealData) {
        setRealVitals(data);
        setFakeVitals([]);
        const fakeCount = Math.max(0, 8 - data.length);
        const fakeData = fakeCount > 0 ? fallbackData.generateVitals(fakeCount) : [];
        setFakeVitals(fakeData);
        setVitals([...data, ...fakeData]);
      } else {
        setRealVitals([]);
        setFakeVitals(data);
        setVitals(data);
      }
    } catch (error) {
      console.error('Error refreshing vitals:', error);
      alert('Failed to refresh vitals');
    } finally {
      setLoading(prev => ({ ...prev, vitals: false }));
    }
  };

  // Acknowledge notification
  const acknowledgeNotification = async (notificationId) => {
    try {
      const realNotification = realNotifications.find(n => n.id === notificationId);
      if (realNotification) {
        await doctorAPI.acknowledgeNotification(notificationId);
        // Refresh notifications after acknowledge
        fetchNotifications();
      } else {
        alert('Notification acknowledged (demo)');
      }
    } catch (error) {
      console.error('Error acknowledging notification:', error);
      alert('Failed to acknowledge notification');
    }
  };

  // Quick tools functions
  const performECGTest = async () => {
    try {
      await doctorAPI.performECGTest({ doctorId });
      alert('ECG test initiated');
    } catch (error) {
      console.error('Error performing ECG test:', error);
      alert('Failed to perform ECG test');
    }
  };

  const orderLabs = async () => {
    try {
      await doctorAPI.orderLabs({ doctorId });
      alert('Lab order initiated');
    } catch (error) {
      console.error('Error ordering labs:', error);
      alert('Failed to order labs');
    }
  };

  const referPatient = async () => {
    try {
      await doctorAPI.referPatient({ doctorId });
      alert('Patient referral initiated');
    } catch (error) {
      console.error('Error referring patient:', error);
      alert('Failed to refer patient');
    }
  };



  // Patient notes and consultation
  const savePatientNote = async (patient) => {
    try {
      if (realPatients.find(p => p.id === patient.id)) {
        await doctorAPI.addPatientNotes({ patientId: patient.id, note: 'Clinical note from dashboard' });
        alert('Note saved');
      } else {
        alert('Note saved (demo)');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    }
  };

  const startConsultation = async (patient) => {
    try {
      if (realPatients.find(p => p.id === patient.id)) {
        await doctorAPI.startConsultation({ patientId: patient.id, doctorId });
        alert('Consultation started');
      } else {
        alert('Consultation started (demo)');
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      alert('Failed to start consultation');
    }
  };

  return (
    <div className={`min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><FaStethoscope /> Doctor Dashboard</h1>
          <p className="text-sm text-gray-500">Overview, patient management, vitals monitoring and clinical tools</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(d => !d)} aria-pressed={dark} className="px-3 py-2 rounded border">{dark ? 'Light' : 'Dark'}</button>
          <button onClick={() => setHighContrast(h => !h)} className="px-3 py-2 rounded border">High Contrast</button>
          <button onClick={syncWithEHR} className="px-3 py-2 rounded border">Sync EHR</button>
          <button onClick={() => {
            fetchPatients();
            fetchAppointments();
            refreshVitals();
            fetchNotifications();
          }} className="px-3 py-2 rounded border bg-blue-600 text-white hover:bg-blue-700">
            <FaSync className="inline mr-1" /> Refresh All
          </button>
          {(loading.patients || loading.appointments || loading.vitals || loading.notifications) && (
            <div className="text-sm text-gray-500">Loading...</div>
          )}
        </div>
      </header>

      {/* Top row: status, quick analytics */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow">
          <div className="text-sm text-gray-500">Live Data</div>
          <div className="mt-2 text-xl font-semibold flex items-center gap-2">{vitals.length}<span className="text-xs text-gray-400">streams</span></div>
          <div className="mt-3 text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => {
              // Acknowledge all notifications
              realNotifications.forEach(n => acknowledgeNotification(n.id));
              setNotifications([]);
              alert('Acknowledged all alerts');
            }} className="px-2 py-1 bg-emerald-600 text-white rounded">Acknowledge</button>
            <button onClick={() => setNotifications(n => [...n, { id: `n-${Date.now()}`, text: 'Manual check requested' }])} className="px-2 py-1 border rounded">Add Note</button>
          </div>
        </div>

        <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Appointments (7 days)</div>
              <div className="text-lg font-semibold mt-1">{appointments.reduce((s,a)=>s+(a.status==='Confirmed'?1:0),0)} confirmed</div>
            </div>
            <div className="w-48 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsByDay}><XAxis dataKey="day" hide/><YAxis hide/><Tooltip/><Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} dot={false}/></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4 bg-white dark:bg-gray-800 shadow">
          <div className="text-sm text-gray-500">Risk Breakdown</div>
          <div className="mt-2 flex gap-2 items-center">
            <div className="text-lg font-semibold">{patientRiskBreakdown.high}</div>
            <div className="text-xs text-gray-500">High risk patients</div>
          </div>
          <div className="mt-3 text-xs text-gray-500">Quick actions</div>
          <div className="mt-2 flex gap-2">
            <button onClick={()=> alert('Start cohort message (demo)')} className="px-2 py-1 border rounded">Message High-risk</button>
            <button onClick={()=> alert('Export CSV (demo)')} className="px-2 py-1 border rounded">Export</button>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <main className="max-w-7xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Patient Queue + Filters */}
        <section className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Patient Queue</h2>
              <div className="text-xs text-gray-500">
                {loading.patients ? 'Loading...' : `${filteredPatients.length} matches`}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(0); }} placeholder="Search name, condition" className="flex-1 p-2 border rounded" />
              <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} className="p-2 border rounded">
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="grid gap-3">
              {paginated.map(p=> (
                <div key={p.id} className={`p-3 rounded border flex items-center gap-3 ${p.priority==='High'?'ring-2 ring-red-200':''}`}>
                  <img src={p.photo} alt="avatar" className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.condition} • {p.age} yrs</div>
                      </div>
                      <div className="text-xs text-gray-500">Next: {p.nextAppointment}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={()=> openPatient(p)} className="px-2 py-1 border rounded text-sm">Open</button>
                      <button onClick={()=> startVideoCall(p)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm"><FaVideo className='inline mr-1'/> Video</button>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bulkSelection.includes(p.id)} onChange={()=>toggleBulk(p.id)}/> Select</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <button disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))} className="px-2 py-1 border rounded">Prev</button>
                <button disabled={page===totalPages-1} onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} className="px-2 py-1 border rounded ml-2">Next</button>
              </div>
              <div className="text-xs text-gray-500">Page {page+1} / {totalPages}</div>
            </div>

            <div className="mt-3 flex gap-2">
              <button disabled={!bulkSelection.length} onClick={bulkMessage} className="px-2 py-1 bg-emerald-600 text-white rounded">Message {bulkSelection.length}</button>
              <button onClick={()=> setBulkSelection([])} className="px-2 py-1 border rounded">Clear</button>
            </div>
          </div>

          {/* Quick tools */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-2">Quick Tools</h3>
            <div className="grid gap-2">
              <button onClick={() => performECGTest()} className="px-3 py-2 border rounded text-left">ECG / Rapid Tests</button>
              <button onClick={() => orderLabs()} className="px-3 py-2 border rounded text-left">Order Labs</button>
              <button onClick={() => referPatient()} className="px-3 py-2 border rounded text-left">Refer Patient</button>
            </div>
          </div>

        </section>

        {/* Middle column: Vitals & Appointments */}
        <section className="col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent Vitals</h2>
              <div className="flex items-center gap-2">
                <button onClick={refreshVitals} className="px-2 py-1 border rounded">Refresh</button>
                {loading.vitals && <div className="text-sm text-gray-500">Loading...</div>}
                <div className="relative">
                  <FaBell className='text-gray-500' />
                  {notifications.length>0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1">{notifications.length}</span>}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              {vitals.slice(0,4).map(v => (
                <div key={v.id} className={`p-3 rounded border ${+v.bp.split('/')[0] > 140 ? 'border-red-300' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{v.patient}</div>
                    <div className="text-xs text-gray-500">{v.ts}</div>
                  </div>
                  <div className="mt-2 text-sm grid grid-cols-2 gap-1">
                    <div>BP: <strong>{v.bp}</strong></div>
                    <div>HR: <strong>{v.hr}</strong></div>
                    <div>Sugar: <strong>{v.sugar}</strong></div>
                    <div>Temp: <strong>{v.temp}</strong></div>
                  </div>
                </div>
              ))}

            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">BP Trend (selected patient)</h3>
              <div className="h-44 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patients[0]?.vitalsHistory || []}><XAxis dataKey="date"/><YAxis/><Tooltip/><Line type="monotone" dataKey={(d)=> +d.bp.split('/')[0]} stroke="#ef4444" strokeWidth={2} dot={false}/></LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today's Appointments</h3>
              {loading.appointments && <div className="text-sm text-gray-500">Loading...</div>}
            </div>
            <div className="grid md:grid-cols-3 gap-3 mt-3">
              {appointments.map(a=> (
                <div key={a.id} className="p-3 border rounded">
                  <div className="flex items-center justify-between"><div className="font-medium">{a.patient}</div><div className={`text-xs ${a.status==='Confirmed'?'text-green-600':a.status==='Pending'?'text-yellow-600':'text-gray-500'}`}>{a.status}</div></div>
                  <div className="text-xs text-gray-500">{a.date} • {a.time}</div>
                  <div className="mt-2 text-sm">{a.reason}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=> openPatient(patients.find(p=>p.name===a.patient) || patients[0])} className="px-2 py-1 border rounded text-sm">Open</button>
                    <button onClick={() => markAppointmentComplete(a.id)} className="px-2 py-1 bg-emerald-600 text-white rounded text-sm">Complete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* Right column / widgets */}
      <aside className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold">Analytics</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded">
                <div className="text-xs text-gray-500">Appointments by day</div>
                <div className="h-32 mt-2"><ResponsiveContainer width="100%" height="100%"><BarChart data={appointmentsByDay}><XAxis dataKey="day"/><YAxis/><Tooltip/><Bar dataKey="appointments" fill="#60a5fa"/></BarChart></ResponsiveContainer></div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-xs text-gray-500">Patient mix</div>
                <div className="h-32 mt-2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'High', value:patientRiskBreakdown.high},{name:'Medium', value:patientRiskBreakdown.medium},{name:'Low', value:patientRiskBreakdown.low}]} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50}>{[0,1,2].map((i)=>(<Cell key={i} fill={COLORS[i]} />))}</Pie></PieChart></ResponsiveContainer></div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Note: Analytics are mock. Wire to real analytics API for production metrics.</div>
          </div>


        </div>
      </aside>

      {/* Patient detail modal */}
      <div aria-live="polite">
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl p-4 overflow-auto">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                <div className="flex gap-2">
                  <button onClick={()=> exportPatientTimeline(selectedPatient)} className="px-2 py-1 border rounded text-sm">Export</button>
                  <button onClick={closePatient} className="px-2 py-1 border rounded">Close</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <img src={selectedPatient.photo} alt="avatar" className="w-32 h-32 rounded" />
                  <div className="mt-2 text-sm">Age: {selectedPatient.age}</div>
                  <div className="text-sm">Gender: {selectedPatient.gender}</div>
                  <div className="text-sm">Condition: {selectedPatient.condition}</div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold">Timeline</h4>
                  <div className="mt-2 space-y-2">
                    {selectedPatient.vitalsHistory && selectedPatient.vitalsHistory.length > 0 ? (
                      selectedPatient.vitalsHistory.map((h,i)=> (
                        <div key={i} className="p-2 border rounded">
                          <div className="text-xs text-gray-500">{h.date}</div>
                          <div className="text-sm">BP: {h.bp} • HR: {h.hr} • Sugar: {h.sugar}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 border rounded text-gray-500 text-sm">
                        No vitals history available
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-semibold">Notes & Actions</h4>
                    <textarea placeholder="Write a clinical note..." className="w-full p-2 border rounded mt-2" rows={4}></textarea>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => savePatientNote(selectedPatient)} className="px-3 py-1 bg-blue-600 text-white rounded">Save Note</button>
                      <button onClick={() => startConsultation(selectedPatient)} className="px-3 py-1 bg-emerald-600 text-white rounded">Start Consultation</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <footer className="max-w-7xl mx-auto mt-6 text-xs text-gray-500">© Medicore — Doctor Dashboard (demo). To enable production features, wire EHR APIs: /api/patients, /api/vitals, /api/appointments, /api/prescriptions</footer>

      {/* Added buttons row above footer */}
      <div className="max-w-7xl mx-auto mt-6 mb-6 flex justify-center gap-4">
        <Link to="/doctor/lab-results" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <FaFlask /> Lab Results
        </Link>
        {/* <Link to="/doctor/prescription" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          <FaFilePrescription /> Prescriptions
        </Link> */}
        <Link to="/doctor/patients" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
          <FaUserInjured /> Patients
        </Link>
        <Link to="/doctor/schedule" className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
          <FaCalendarCheck /> Schedule
        </Link>
        <Link to="/doctor/billing" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          <FaCreditCard /> Billing
        </Link>
      </div>
    </div>
  );
}
