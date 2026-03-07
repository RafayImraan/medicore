import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ErrorBoundary from "../../components/ErrorBoundary";
import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

function Panel({ children, className = "" }) {
  return <div className={`premium-panel rounded-2xl p-6 ${className}`}>{children}</div>;
}

const Schedule = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("Daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError("");
        const dateParam = selectedDate.toISOString().split("T")[0];
        const statusParam = filterStatus !== "All" ? `&status=${filterStatus}` : "";
        const data = await apiRequest(`/api/schedule?date=${dateParam}${statusParam}`);
        setAppointments(data.items || []);
      } catch (err) {
        console.error("Failed to load schedule:", err);
        setError("Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate, filterStatus]);

  const dateMatchesView = (appointmentDate) => {
    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime())) return false;

    if (viewMode === "Daily") return date.toDateString() === selectedDate.toDateString();

    if (viewMode === "Weekly") {
      const start = new Date(selectedDate);
      start.setDate(selectedDate.getDate() - selectedDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return date >= start && date <= end;
    }

    if (viewMode === "Monthly") {
      return date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
    }

    return false;
  };

  const filtered = appointments.filter((appointment) => {
    const statusMatch = filterStatus === "All" || appointment.status === filterStatus;
    return dateMatchesView(appointment.date) && statusMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aPriority = priorityOrder[a.priority || "Medium"] ?? 1;
    const bPriority = priorityOrder[b.priority || "Medium"] ?? 1;
    return aPriority - bPriority;
  });

  const conversionRate = appointments.length
    ? Math.round((appointments.filter((appointment) => appointment.status === "Confirmed").length / appointments.length) * 100)
    : 0;

  const peakHour = useMemo(() => {
    if (!appointments.length) return "N/A";
    const tally = appointments.reduce((accumulator, appointment) => {
      const key = appointment.time || "Unknown";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  }, [appointments]);

  const overlapping = useMemo(
    () =>
      appointments.filter((current, index, source) =>
        source.some(
          (candidate, candidateIndex) =>
            index !== candidateIndex &&
            new Date(current.date).toDateString() === new Date(candidate.date).toDateString() &&
            current.time === candidate.time
        )
      ),
    [appointments]
  );

  const handleStatusUpdate = async (id, newStatus) => {
    const previous = appointments;
    setAppointments((current) => current.map((appointment) => (appointment.id === id ? { ...appointment, status: newStatus } : appointment)));
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      setAppointments(previous);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/15 to-charcoal-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <Panel>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scheduling</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Smart Schedule Dashboard</h1>
                <p className="mt-2 text-sm text-slate-400">Logged in as {user?.role || "Staff"}.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Daily", "Weekly", "Monthly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setViewMode(view)}
                    className={`rounded-xl px-4 py-3 text-sm ${
                      viewMode === view ? "bg-accent-500 text-charcoal-950" : "border border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Panel>
              <p className="text-sm font-medium text-white">Calendar</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white p-3 text-slate-900">
                <Calendar value={selectedDate} onChange={setSelectedDate} />
              </div>
              <p className="mt-4 text-sm text-slate-400">Viewing {selectedDate.toLocaleDateString()}.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-full px-3 py-2 text-xs ${
                      filterStatus === status ? "bg-emerald-500 text-charcoal-950" : "border border-white/10 text-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </Panel>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Panel className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Peak hour</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{peakHour}</p>
                </Panel>
                <Panel className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Conversion rate</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{conversionRate}%</p>
                </Panel>
                <Panel className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Conflicts</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{overlapping.length}</p>
                </Panel>
              </div>

              <Panel>
                {error && <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="min-w-full divide-y divide-white/10 text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Patient</th>
                        <th className="px-4 py-3 text-left">Doctor</th>
                        <th className="px-4 py-3 text-left">Test</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Time</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Priority</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {loading && (
                        <tr>
                          <td colSpan="8" className="px-4 py-10 text-center text-slate-400">
                            Loading schedule...
                          </td>
                        </tr>
                      )}
                      {!loading && sorted.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-4 py-10 text-center text-slate-400">
                            No appointments found.
                          </td>
                        </tr>
                      )}
                      {sorted.map((appointment) => (
                        <tr key={appointment.id} className="bg-charcoal-950/20">
                          <td className="px-4 py-3 text-white">{appointment.patient}</td>
                          <td className="px-4 py-3 text-slate-300">{appointment.doctor}</td>
                          <td className="px-4 py-3 text-slate-300">{appointment.test}</td>
                          <td className="px-4 py-3 text-slate-300">{new Date(appointment.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-slate-300">{appointment.time}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.status === "Confirmed"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : appointment.status === "Pending"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-rose-500/15 text-rose-300"
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              appointment.priority === "High"
                                ? "bg-rose-500/15 text-rose-300"
                                : appointment.priority === "Medium"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-emerald-500/15 text-emerald-300"
                            }`}>
                              {appointment.priority || "Medium"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {["Confirmed", "Pending", "Cancelled"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusUpdate(appointment.id, status)}
                                  className={`rounded-lg px-3 py-2 text-xs ${
                                    appointment.status === status
                                      ? "bg-accent-500 text-charcoal-950"
                                      : "border border-white/10 text-slate-200"
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Schedule;
