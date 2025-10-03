import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

const departments = ['Radiology', 'Emergency', 'ICU', 'Admin', 'Pharmacy'];
const roles = ['Doctor', 'Nurse', 'Lab Tech', 'Receptionist', 'Admin'];

const messageTemplates = [
  'Please check the patient in room 302.',
  'Shift handover at 8 PM sharp.',
  'Medication delivery delayed 15 minutes.',
  'Urgent lab result needs review.',
  'Can someone confirm tomorrow’s rota?',
  'Patient needs wheelchair assistance.',
  'Emergency code red — all available staff to ER.',
  'MRI room maintenance scheduled at 3 PM.',
  'Prescriptions ready for pickup.',
  'Audit trail update complete. Review logs.',
  'Lunch break delayed. Cafeteria closed until 2.',
  'Has anyone seen the portable ECG unit?',
  'Patient requested a discharge summary.',
  'Lab samples must reach before 1 PM.',
  'Can you update the records in EMR?',
];

const generateMessages = () => {
  return Array.from({ length: 20 }, () => {
    const name = faker.person.fullName();
    const role = faker.helpers.arrayElement(roles);
    const department = faker.helpers.arrayElement(departments);
    const message = faker.helpers.arrayElement(messageTemplates);
    return {
      id: faker.string.uuid().slice(0, 8),
      sender: name,
      role,
      department,
      message,
      time: faker.date.recent({ days: 2 }).toLocaleTimeString(),
      avatar: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
      status: faker.helpers.arrayElement(['Sent', 'Delivered', 'Seen']),
    };
  });
};

const StaffChat = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    setMessages(generateMessages());
  }, []);

  const filtered = messages.filter(msg => {
    const matchRole = filterRole === 'All' || msg.role === filterRole;
    const matchDept = filterDept === 'All' || msg.department === filterDept;
    const matchSearch =
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchDept && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === 'recent'
      ? new Date(b.time) - new Date(a.time)
      : new Date(a.time) - new Date(b.time)
  );
    return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">💬 Staff Chat</h1>

      {/* 🔍 Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search messages"
          className="p-2 border rounded w-full"
        />
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {roles.map(role => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {departments.map(dept => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="recent">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* 💬 Chat Messages */}
      <div className="bg-white shadow rounded p-4 max-h-[550px] overflow-y-auto space-y-6">
        {sorted.map(msg => (
          <div
            key={msg.id}
            className="flex items-start space-x-4 bg-gray-50 p-3 rounded hover:bg-gray-100"
          >
            <img
              src={msg.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-md">
                  {msg.sender}{' '}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {msg.role} — {msg.department}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{msg.time}</div>
              </div>
              <div className="text-gray-700 text-sm">{msg.message}</div>
              <div className="flex gap-2 text-xs text-gray-400 pt-1">
                <span>📶 {msg.status}</span>
                <span className="hidden sm:inline">🆔 {msg.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
            {/* ✍️ Message Input + Sender Simulation */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Send Message</h2>
        <div className="bg-gray-100 p-4 rounded flex items-start gap-3">
          <img
            src="https://i.pravatar.cc/150?u=DrAdmin" // Fake logged-in user avatar
            alt="Me"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="w-full space-y-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full border rounded p-2 text-sm"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const newMsg = {
                    id: faker.string.uuid().slice(0, 8),
                    sender: 'Dr. Admin',
                    role: 'Doctor',
                    department: 'Admin',
                    message: e.target.value,
                    time: new Date().toLocaleTimeString(),
                    avatar: 'https://i.pravatar.cc/150?u=DrAdmin',
                    status: 'Sent',
                  };
                  setMessages(prev => [newMsg, ...prev]);
                  e.target.value = '';
                }
              }}
            />
            <div className="text-xs text-gray-400">
              ✅ Press Enter to send • Role: Doctor • Dept: Admin
            </div>
          </div>
        </div>
      </div>

      {/* 🔁 Typing Indicator */}
      <div className="text-sm text-black-500 mt-2 italic">💬 Nurse Fatima is typing…</div>

      {/* ⭐ Reaction Mock */}
      <div className="mt-4 flex gap-4 text-xl">
        <span className="hover:scale-110 transition cursor-pointer">👍</span>
        <span className="hover:scale-110 transition cursor-pointer">🚑</span>
        <span className="hover:scale-110 transition cursor-pointer">❗</span>
        <span className="hover:scale-110 transition cursor-pointer">✅</span>
      </div>
            {/* ⏩ Scroll to Latest */}
      <div className="mt-6 flex justify-between items-center text-sm">
        <span>📨 Total Messages: {messages.length}</span>
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          onClick={() =>
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
          }
        >
          ⬇️ Scroll to Latest
        </button>
      </div>

      {/* 🧾 Urgent Flags & Pin Mock */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-100 border-l-4 border-red-400 p-2 rounded text-xs">
          🚨 <strong>URGENT:</strong> Dr. Farooq requested emergency review in ICU.
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded text-xs">
          📌 <strong>Pinned:</strong> Reminder about equipment inventory on Friday.
        </div>
        <div className="bg-green-100 border-l-4 border-green-400 p-2 rounded text-xs">
          📅 <strong>Shift:</strong> New rotation starts Monday.
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-400 p-2 rounded text-xs">
          📝 <strong>Audit:</strong> Chat logs stored for monthly review.
        </div>
      </div>

      
    </div>
  );
};

export default StaffChat;



