import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const generateAppointments = () => {
  const statuses = ['Confirmed', 'Pending', 'Cancelled'];
  const allAppointments = [];

  statuses.forEach(status => {
    for (let i = 0; i < 10; i++) {
      allAppointments.push({
        id: faker.string.uuid().slice(0, 8),
        patient: faker.person.fullName(),
        doctor: faker.person.fullName(),
        test: faker.helpers.arrayElement(['Blood Test', 'X-Ray', 'MRI', 'CT Scan']),
        status,
        priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        recurring: faker.datatype.boolean(),
        time: faker.helpers.arrayElement(['9:00 AM', '11:30 AM', '2:00 PM', '4:15 PM']),
        date: faker.date.soon({ days: 14 }),
        createdBy: faker.internet.userName(),
        lastModified: faker.date.recent().toLocaleTimeString(),
        videoLink: faker.internet.url(),
      });
    }
  });

  return allAppointments;
};

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('Daily');
  const [role, setRole] = useState('Doctor');

  useEffect(() => {
    setAppointments(generateAppointments());
  }, []);

  const filtered = appointments.filter(appt => {
    const sameDay = new Date(appt.date).toDateString() === selectedDate.toDateString();
    const statusMatch = filterStatus === 'All' || appt.status === filterStatus;
    return sameDay && statusMatch;
  });

  const sorted = filtered.sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleStatusUpdate = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt)
    );
  };

  const overlapping = appointments.filter((a, i, arr) =>
    arr.some((b, j) => i !== j && new Date(a.date).toDateString() === new Date(b.date).toDateString() && a.time === b.time)
  );

  const conversionRate = Math.round((appointments.filter(a => a.status === 'Confirmed').length / appointments.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">🗓️ Smart Schedule Dashboard</h2>

      {/* Role Switch */}
      <div className="text-sm text-gray-600">🔒 Logged in as: <strong>{role}</strong></div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mt-2">
        {['Daily', 'Weekly', 'Monthly'].map(view => (
          <button key={view} onClick={() => setViewMode(view)} className={`px-3 py-2 rounded ${viewMode === view ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
            {view}
          </button>
        ))}
      </div>

      {/* Calendar Picker */}
      <div className="my-6">
        <Calendar value={selectedDate} onChange={setSelectedDate} />
        <p className="mt-2 text-sm">Viewing appointments for: <strong>{selectedDate.toLocaleDateString()}</strong></p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mt-2">
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map(status => (
          <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded ${filterStatus === status ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
            {status}
          </button>
        ))}
      </div>

      {/* Appointment Table */}
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
                  {appt.priority}
                </span>
              </td>
              <td>{appt.recurring ? '✅' : '—'}</td>
              <td>
                <a href={appt.videoLink} target="_blank" rel="noreferrer" className="text-indigo-600 underline text-xs">Join</a>
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

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 bg-blue-50 rounded text-center">📈 Peak Hour: 9:00 AM</div>
        <div className="p-4 bg-purple-50 rounded text-center">🧠 Load Balanced Across Doctors</div>
        <div className="p-4 bg-green-50 rounded text-center">✅ Conversion Rate: {conversionRate}%</div>
      </div>

      {/* Overlap Alerts */}
      {overlapping.length > 0 && (
        <div className="mt-6 bg-red-100 border-l-4 border-red-600 p-4">
          ⚠️ <strong>Conflict Alert:</strong> {overlapping.length} overlapping appointment(s) detected.
        </div>
      )}

      {/* Audit & Integration UI */}
      <div className="mt-6 bg-gray-100 p-4 text-xs rounded shadow">
        🧾 Last modified by: <strong>{appointments[0]?.createdBy}</strong> at {appointments[0]?.lastModified}
        <br />
        📤 Export CSV & calendar sync available in Pro module
        <br />
        🔔 Reminders, SMS, and telehealth integration UI mocked
        <br />
        🔍 Audit logs tracked in secure backend (UI placeholder only)
      </div>
    </div>
  );
};

export default Schedule;
