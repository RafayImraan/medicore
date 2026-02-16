import React, { useEffect, useState } from "react";
import { Download, FileText, Printer, RefreshCw, Search, Filter, Calendar, Eye, Settings, Moon, Sun, Bell, TrendingUp, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import toast, { Toaster } from "react-hot-toast";

import CalendarView from "../components/CalendarView";
import AppointmentModal from "../components/AppointmentModal";
import StatsWidgets from "../components/StatsWidgets";
import { getAppointmentHistory, getAppointmentStats, getAppointmentTrends } from "../services/api";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [lastUpdated, setLastUpdated] = useState(null);

  // New state variables for premium features
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const patientEmail = parsedUser?.email;

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: search || undefined,
        patientEmail
      };

      const history = await getAppointmentHistory(params);
      const items = history?.items || history || [];
      setAppointments(items);

      const statsData = await getAppointmentStats({ patientEmail });
      setStats(statsData);

      const trendsData = await getAppointmentTrends({ patientEmail });
      setTrends(trendsData);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60000); // Auto-refresh every 1 min
    return () => clearInterval(interval);
  }, [filterStatus, search]); // Re-fetch when filters change

  // Filtering & sorting
  const filteredAppointments = appointments
    .filter((a) =>
      filterStatus === "all" ? true : a.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .filter((a) =>
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950 p-6 space-y-6 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <h1 className="text-2xl font-bold">Appointment History</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded-lg shadow-lg shadow-primary-900/25 hover:from-primary-800 hover:to-primary-700 border border-primary-700/50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="flex items-center gap-1 px-3 py-1 border border-primary-800/30 rounded-lg hover:bg-primary-900/30 text-muted-400">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-1 px-3 py-1 border border-primary-800/30 rounded-lg hover:bg-primary-900/30 text-muted-400">
            <Printer size={16} /> Print
          </button>
        </div>
      </motion.div>

      {lastUpdated && (
        <p className="text-sm text-gray-500">Last updated at {lastUpdated}</p>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by doctor, type or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-black border rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-black border rounded-lg px-3 py-2"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && <div className="animate-pulse text-gray-500">Loading appointments...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <CalendarView
              appointments={filteredAppointments}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />

            {/* Appointments for selected date */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-primary-800/30 rounded-xl bg-charcoal-800/50 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-4 font-playfair">
                  Appointments on {selectedDate.toDateString()}
                </h3>
                <div className="space-y-3">
                  {filteredAppointments
                    .filter(appt => appt.date === selectedDate.toISOString().split('T')[0])
                    .map((appt) => (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border border-primary-700/30 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700/70 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowModal(true);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white">{appt.doctor}</h4>
                            <p className="text-sm text-muted-300">{appt.type} at {appt.time}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              appt.status === "Completed" ? "bg-primary-900/50 text-luxury-gold" :
                              appt.status === "Pending" ? "bg-accent-900/50 text-accent-300" :
                              appt.status === "Cancelled" ? "bg-red-900/50 text-red-300" :
                              "bg-blue-900/50 text-blue-300"
                            }`}>
                              {appt.status}
                            </span>
                            <Eye className="w-4 h-4 text-muted-400 hover:text-luxury-gold transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  {filteredAppointments.filter(appt => appt.date === selectedDate.toISOString().split('T')[0]).length === 0 && (
                    <p className="text-muted-400 text-center py-4">No appointments on this date</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Stats Widgets */}
            {stats && <StatsWidgets stats={stats} />}

            {/* Appointment List */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appt, index) => (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AppointmentCard
                          appointment={appt}
                          onViewDetails={() => {
                            setSelectedAppointment(appt);
                            setShowModal(true);
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-900/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-muted-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No appointments found</h3>
                    <p className="text-muted-400">Try adjusting your search or filter criteria</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Series Chart */}
        <div className="p-6 border border-primary-800/30 rounded-xl bg-charcoal-800/50 backdrop-blur-sm shadow-lg shadow-charcoal-950/20">
          <h2 className="text-lg font-semibold mb-4 text-white font-playfair">Appointment Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFC'
                }}
              />
              <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="p-6 border border-primary-800/30 rounded-xl bg-charcoal-800/50 backdrop-blur-sm shadow-lg shadow-charcoal-950/20">
          <h2 className="text-lg font-semibold mb-4 text-white font-playfair">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, color: '#D4AF37' },
                  { name: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, color: '#f59e0b' },
                  { name: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: '#3b82f6' },
                  { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[
                  { name: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, color: '#D4AF37' },
                  { name: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, color: '#f59e0b' },
                  { name: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: '#3b82f6' },
                  { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: '#ef4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFC'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFC',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  );
}

// Appointment Card Component
const AppointmentCard = ({ appointment, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border border-primary-800/30 rounded-xl shadow-lg shadow-charcoal-950/20 hover:shadow-xl hover:shadow-charcoal-950/30 transition-all duration-300 bg-charcoal-800/50 backdrop-blur-sm group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-900 to-primary-800 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-inter group-hover:text-luxury-gold transition-colors">
                {appointment.doctor}
              </h3>
              <p className="text-sm text-muted-300">{appointment.specialty || 'Healthcare Provider'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-400" />
              <span className="text-sm text-muted-300">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-400" />
              <span className="text-sm text-muted-300">{appointment.time}</span>
            </div>
          </div>

          <p className="text-sm text-muted-400 mt-2">{appointment.type}</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className={`px-3 py-1 text-sm rounded-full font-medium border ${
            appointment.status === "Completed" ? "bg-primary-900/50 text-luxury-gold border-primary-700/50" :
            appointment.status === "Pending" ? "bg-accent-900/50 text-accent-300 border-accent-700/50" :
            appointment.status === "Cancelled" ? "bg-red-900/50 text-red-300 border-red-700/50" :
            "bg-blue-900/50 text-blue-300 border-blue-700/50"
          }`}>
            {appointment.status === "Completed" && <CheckCircle className="w-4 h-4 inline mr-1" />}
            {appointment.status === "Pending" && <AlertCircle className="w-4 h-4 inline mr-1" />}
            {appointment.status === "Cancelled" && <XCircle className="w-4 h-4 inline mr-1" />}
            {appointment.status}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all duration-300 border border-primary-700/50"
            >
              <Eye className="w-4 h-4" />
              Details
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-primary-800/30 rounded-lg hover:bg-primary-900/30 text-muted-400 transition-colors">
              <FileText className="w-4 h-4" />
              Records
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
