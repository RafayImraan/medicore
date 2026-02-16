import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ErrorBoundary from '../../components/ErrorBoundary';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

const Schedule = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('Daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError('');
        const dateParam = selectedDate.toISOString().split('T')[0];
        const statusParam = filterStatus !== 'All' ? `&status=${filterStatus}` : '';
        const data = await apiRequest(`/api/schedule?date=${dateParam}${statusParam}`);
        setAppointments(data.items || []);
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load schedule.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate, filterStatus]);

  const dateMatchesView = (apptDate) => {
    const date = new Date(apptDate);
    if (Number.isNaN(date.getTime())) return false;

    if (viewMode === 'Daily') {
      return date.toDateString() === selectedDate.toDateString();
    }

    if (viewMode === 'Weekly') {
      const start = new Date(selectedDate);
      start.setDate(selectedDate.getDate() - selectedDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return date >= start && date <= end;
    }

    if (viewMode === 'Monthly') {
      return date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
    }

    return false;
  };

  const filtered = appointments.filter(appt => {
    const statusMatch = filterStatus === 'All' || appt.status === filterStatus;
    return dateMatchesView(appt.date) && statusMatch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aPriority = priorityOrder[a.priority || 'Medium'] ?? 1;
    const bPriority = priorityOrder[b.priority || 'Medium'] ?? 1;
    return aPriority - bPriority;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    const previous = appointments;
    setAppointments(prev =>
      prev.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt)
    );
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      setAppointments(previous);
    }
  };

  const overlapping = useMemo(() => (
    appointments.filter((a, i, arr) =>
      arr.some((b, j) => i != j &&
        new Date(a.date).toDateString() === new Date(b.date).toDateString() &&
        a.time === b.time)
    )
  ), [appointments]);

  const conversionRate = appointments.length
    ? Math.round((appointments.filter(a => a.status === 'Confirmed').length / appointments.length) * 100)
    : 0;

  const peakHour = useMemo(() => {
    if (!appointments.length) return 'N/A';
    const tally = appointments.reduce((acc, appt) => {
      const key = appt.time || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  }, [appointments]);

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-bold">Smart Schedule Dashboard</h2>

        <div className="text-sm text-gray-600">Logged in as: <strong>{user?.role ? user.role : 'Staff'}</strong></div>

        <div className="flex gap-2 mt-2">
          {['Daily', 'Weekly', 'Monthly'].map(view => (
            <button key={view} onClick={() => setViewMode(view)} className={`px-3 py-2 rounded ${viewMode === view ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              {view}
            </button>
          ))}
        </div>

        <div className="my-6">
          <Calendar value={selectedDate} onChange={setSelectedDate} />
          <p className="mt-2 text-sm">Viewing appointments for: <strong>{selectedDate.toLocaleDateString()}</strong></p>
        </div>

        <div className="flex gap-2 mt-2">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded ${filterStatus === status ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              {status}
            </button>
          ))}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <table className="min-w-full mt-6 bg-white rounded shadow text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Test</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Urgency</th>
              <th>Recurring</th>
              <th>Video Call</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-500">Loading schedule...</td>
              </tr>
            )}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-500">No appointments found.</td>
              </tr>
            )}
            {sorted.map(appt => (
              <tr key={appt.id} className="border-t hover:bg-gray-50 text-center">
                <td>{appt.patient}</td>
                <td>{appt.doctor}</td>
                <td>{appt.test}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td>{appt.time}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {appt.status}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${appt.priority === 'High' ? 'bg-red-300' : appt.priority === 'Medium' ? 'bg-yellow-300' : 'bg-green-300'}`}>
                    {appt.priority || 'Medium'}
                  </span>
                </td>
                <td>{appt.recurring ? 'Yes' : '-'} </td>
                <td>
                  {appt.videoLink ? (
                    <a href={appt.videoLink} target="_blank" rel="noreferrer" className="text-indigo-600 underline text-xs">Join</a>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="space-x-1">
                  {['Confirmed', 'Pending', 'Cancelled'].map(status => (
                    <button key={status} onClick={() => handleStatusUpdate(appt.id, status)} className={`text-xs px-2 py-1 rounded ${appt.status === status ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-blue-50 rounded text-center">Peak Hour: {peakHour}</div>
          <div className="p-4 bg-purple-50 rounded text-center">Load Balanced Across Doctors</div>
          <div className="p-4 bg-green-50 rounded text-center">Conversion Rate: {conversionRate}%</div>
        </div>

        {overlapping.length > 0 && (
          <div className="mt-6 bg-red-100 border-l-4 border-red-600 p-4">
            Conflict Alert: {overlapping.length} overlapping appointment(s) detected.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Schedule;
