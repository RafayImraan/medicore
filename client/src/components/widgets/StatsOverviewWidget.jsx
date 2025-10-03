import React from 'react';
import { FaCalendarAlt, FaUserMd, FaUsers, FaClipboardList } from 'react-icons/fa';

const StatsOverviewWidget = ({ stats, loading = false }) => {
  const renderSection = (title, icon, value, bgColor = "bg-blue-100", loading = false) => (
    <div
      className={`rounded-2xl shadow-md p-6 flex items-center gap-4 ${bgColor} ${loading ? 'opacity-70' : ''}`}
    >
      <div className="text-blue-700 text-3xl">{icon}</div>
      <div>
        <h4 className="text-gray-700 text-lg font-semibold">{title}</h4>
        {loading ? (
          <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Overview Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderSection("Appointments Today", <FaCalendarAlt />, stats.appointmentsToday, "bg-green-100", loading)}
        {renderSection("Doctors Available", <FaUserMd />, stats.doctorsAvailable, "bg-yellow-100", loading)}
        {renderSection("New Patients", <FaUsers />, stats.newPatients, "bg-indigo-100", loading)}
        {renderSection("Reports Generated", <FaClipboardList />, stats.reportsGenerated, "bg-red-100", loading)}
      </div>
    </div>
  );
};

export default StatsOverviewWidget;
