import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  FaCalendarAlt,
  FaUserMd,
  FaUsers,
  FaClipboardList,
  FaBell,
  FaPlus,
  FaUserCog,
  FaFileMedical,
} from "react-icons/fa";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const generateFakeStats = () => ({
  appointmentsToday: faker.number.int({ min: 10, max: 50 }),
  doctorsAvailable: faker.number.int({ min: 5, max: 20 }),
  newPatients: faker.number.int({ min: 15, max: 60 }),
  reportsGenerated: faker.number.int({ min: 20, max: 80 }),
});

const generateFakeUsers = (count = 5) =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(["Doctor", "Nurse", "Admin"]),
    lastLogin: faker.date.recent().toLocaleString(),
  }));

const generateAppointmentsChartData = () =>
  Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    appointments: faker.number.int({ min: 10, max: 40 }),
  }));

const generateFakeNotifications = () =>
  Array.from({ length: 4 }, () => ({
    id: faker.string.uuid(),
    message: faker.hacker.phrase(),
    time: faker.date.recent().toLocaleTimeString(),
  }));

const AdminDashboard = () => {
  const [stats, setStats] = useState(generateFakeStats());
  const [users, setUsers] = useState(generateFakeUsers());
  const [chartData, setChartData] = useState(generateAppointmentsChartData());
  const [notifications, setNotifications] = useState(generateFakeNotifications());

  const renderSection = (title, icon, value, bgColor = "bg-blue-100") => (
    <div
      className={`rounded-2xl shadow-md p-6 flex items-center gap-4 ${bgColor}`}
    >
      <div className="text-blue-700 text-3xl">{icon}</div>
      <div>
        <h4 className="text-gray-700 text-lg font-semibold">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {renderSection("Appointments Today", <FaCalendarAlt />, stats.appointmentsToday, "bg-green-100")}
        {renderSection("Doctors Available", <FaUserMd />, stats.doctorsAvailable, "bg-yellow-100")}
        {renderSection("New Patients", <FaUsers />, stats.newPatients, "bg-indigo-100")}
        {renderSection("Reports Generated", <FaClipboardList />, stats.reportsGenerated, "bg-red-100")}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Appointments</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Notifications + Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <FaBell /> Notifications
          </h2>
          <ul className="space-y-3">
            {notifications.map((note) => (
              <li key={note.id} className="text-gray-700 border-b pb-2">
                <span className="font-medium">{note.message}</span>
                <div className="text-xs text-gray-400">{note.time}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 hover:bg-blue-200 transition">
              <FaPlus className="text-blue-600" /> Add New Patient
            </button>
            <button className="flex items-center gap-2 p-3 rounded-lg bg-green-100 hover:bg-green-200 transition">
              <FaUserCog className="text-green-600" /> Manage Staff
            </button>
            <button className="flex items-center gap-2 p-3 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition">
              <FaFileMedical className="text-yellow-600" /> Generate Reports
            </button>
            <button className="flex items-center gap-2 p-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition">
              <FaUsers className="text-indigo-600" /> View All Users
            </button>
          </div>
        </div>
      </div>

      {/* Recent Logins */}
      <h2 className="text-xl font-semibold mb-4">Recent Logins</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-xl p-4 shadow bg-white">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-xs text-gray-400 mt-1">Last login: {user.lastLogin}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
