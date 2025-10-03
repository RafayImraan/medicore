import React, { useEffect, useState } from "react";
import { Download, FileText, Printer, RefreshCw, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Mock data
  const mockAppointments = [
    { id: 1, doctor: "Dr. Sarah Khan", type: "Consultation", date: "2025-08-01", time: "10:00 AM", status: "Completed" },
    { id: 2, doctor: "Dr. Ahmed Ali", type: "Checkup", date: "2025-08-05", time: "2:30 PM", status: "Cancelled" },
    { id: 3, doctor: "Dr. John Smith", type: "Surgery", date: "2025-08-10", time: "8:00 AM", status: "Confirmed" },
    { id: 4, doctor: "Dr. Fatima Noor", type: "Consultation", date: "2025-08-15", time: "4:00 PM", status: "Pending" },
  ];

  // Fetch (mock + placeholder for API)
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAppointments(mockAppointments);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60000); // Auto-refresh every 1 min
    return () => clearInterval(interval);
  }, []);

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

  // Analytics data for chart
  const chartData = [
    { month: "Jan", count: 3 },
    { month: "Feb", count: 2 },
    { month: "Mar", count: 5 },
    { month: "Apr", count: 4 },
    { month: "May", count: 6 },
    { month: "Jun", count: 3 },
  ];

  return (
    <div className="p-6 space-y-6">
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
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-100">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-100">
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
            className="border rounded-lg px-3 py-2"
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
            className="border rounded-lg px-3 py-2"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && <div className="animate-pulse text-gray-500">Loading appointments...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Appointment List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{appt.doctor}</h2>
                  <p className="text-sm text-gray-600">{appt.type}</p>
                  <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      appt.status === "Completed" ? "bg-green-100 text-green-700" :
                      appt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      appt.status === "Cancelled" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-2 py-1 text-sm border rounded hover:bg-gray-50">
                      <FileText size={14} /> Prescription
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-sm border rounded hover:bg-gray-50">
                      Re-book
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAppointments.length === 0 && (
            <p className="text-gray-500">No appointments found.</p>
          )}
        </div>
      )}

      {/* Analytics Section */}
      <div className="p-6 border rounded-xl bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Appointment Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}