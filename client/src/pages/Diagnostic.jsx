import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BellIcon, FileDownIcon, SunIcon, MoonIcon } from 'lucide-react';

const sampleTests = [
  { id: 'T001', name: 'Blood Test', category: 'Pathology', status: 'Pending', patient: 'Ali Raza', date: '2025-07-21' },
  { id: 'T002', name: 'X-Ray Chest', category: 'Radiology', status: 'Completed', patient: 'Sana Khan', date: '2025-07-20' },
  { id: 'T003', name: 'MRI Brain', category: 'Radiology', status: 'In Progress', patient: 'Ahmed Ali', date: '2025-07-22' },
  // ... more test data
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Diagnostics = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New MRI test requested', time: '2m ago' },
    { id: 2, message: 'Blood test report uploaded', time: '5m ago' }
  ]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const filteredTests = sampleTests.filter(test =>
    (filter === 'All' || test.status === filter) &&
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <div className={`p-6 transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Diagnostics Dashboard</h1>
        <div className="flex gap-4 items-center">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <div className="relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search tests..."
          className="p-2 border rounded w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h2 className="text-xl font-semibold">{test.name}</h2>
            <p className="text-sm">Patient: <strong>{test.patient}</strong></p>
            <p className="text-sm">Category: {test.category}</p>
            <p className="text-sm">Date: {test.date}</p>
            <span className={`inline-block px-2 py-1 mt-2 rounded-full text-xs ${statusColors[test.status]}`}>{test.status}</span>
            <div className="mt-4">
              <QRCodeCanvas value={`https://hospital.com/reports/${test.id}`} size={96} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-bold mb-2">Test Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie dataKey="value" data={[
                { name: 'Pathology', value: 400 },
                { name: 'Radiology', value: 300 },
                { name: 'Others', value: 200 }
              ]} cx="50%" cy="50%" outerRadius={60}>
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-bold mb-2">Test Completion Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { date: 'Jul 18', completed: 3 },
              { date: 'Jul 19', completed: 7 },
              { date: 'Jul 20', completed: 4 },
              { date: 'Jul 21', completed: 6 }
            ]}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-bold mb-2">Lab Technician Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'Ali', reports: 5 },
              { name: 'Sana', reports: 8 },
              { name: 'Zara', reports: 4 },
              { name: 'Bilal', reports: 6 }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reports" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Download Reports</h2>
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FileDownIcon className="w-4 h-4" /> Download All
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Export PDF</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Email Reports</button>
        </div>
      </div>
    </div>
  );
};

export default Diagnostics;
