import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_DEPARTMENTS = ['Radiology', 'Emergency', 'ICU', 'Admin', 'Pharmacy', 'Cardiology', 'Pediatrics'];
const DEFAULT_ROLES = ['Doctor', 'Nurse', 'Lab Tech', 'Receptionist', 'Admin', 'Pharmacist'];

const toTitle = (value = '') => value
  .toString()
  .replace(/[_-]+/g, ' ')
  .trim()
  .split(' ')
  .filter(Boolean)
  .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');

const getInitials = (value = '') => {
  const parts = value.split(' ').filter(Boolean);
  if (!parts.length) return 'ST';
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
};

const StaffChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiRequest('/api/staff-chat?limit=200');
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load staff chat:', err);
        setError('Failed to load staff chat messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(messages.map((msg) => msg.role).filter(Boolean))];
    return roles.length ? roles : DEFAULT_ROLES;
  }, [messages]);

  const uniqueDepartments = useMemo(() => {
    const depts = [...new Set(messages.map((msg) => msg.department).filter(Boolean))];
    return depts.length ? depts : DEFAULT_DEPARTMENTS;
  }, [messages]);

  const filtered = messages.filter(msg => {
    const matchRole = filterRole === 'All' || msg.role === filterRole;
    const matchDept = filterDept === 'All' || msg.department === filterDept;
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      msg.senderName?.toLowerCase().includes(searchLower) ||
      msg.message?.toLowerCase().includes(searchLower);
    return matchRole && matchDept && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.updatedAt || 0);
    const bTime = new Date(b.createdAt || b.updatedAt || 0);
    return sortOrder === 'recent' ? bTime - aTime : aTime - bTime;
  });

  const urgentCount = messages.filter((msg) =>
    (msg.message || '').toLowerCase().includes('urgent') ||
    (msg.message || '').toLowerCase().includes('code red')
  ).length;

  const handleSendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;

    try {
      setSending(true);
      const payload = {
        senderName: user?.name || 'Staff Member',
        role: toTitle(user?.role || 'Staff'),
        department: user?.department || 'General',
        message: trimmed,
      };
      const created = await apiRequest('/api/staff-chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMessages((prev) => [created, ...prev]);
      setDraft('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Staff Chat</h1>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search messages"
          className="p-2 border rounded w-full"
        />
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniqueRoles.map(role => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniqueDepartments.map(dept => (
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

      <div className="bg-white shadow rounded p-4 max-h-[550px] overflow-y-auto space-y-6">
        {loading && <div className="text-sm text-gray-500">Loading messages...</div>}
        {!loading && sorted.length === 0 && (
          <div className="text-sm text-gray-500">No messages found.</div>
        )}
        {sorted.map(msg => (
          <div
            key={msg._id || msg.id}
            className="flex items-start space-x-4 bg-gray-50 p-3 rounded hover:bg-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              {getInitials(msg.senderName || 'Staff')}
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-md">
                  {msg.senderName || 'Staff'}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {msg.role || 'Staff'} - {msg.department || 'General'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {(msg.createdAt ? new Date(msg.createdAt) : new Date()).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-gray-700 text-sm">{msg.message}</div>
              <div className="flex gap-2 text-xs text-gray-400 pt-1">
                <span>Status: {msg.status || 'Sent'}</span>
                <span className="hidden sm:inline">ID: {(msg._id || msg.id || '').toString().slice(-6)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Send Message</h2>
        <div className="bg-gray-100 p-4 rounded flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {getInitials(user?.name || 'Me')}
          </div>
          <div className="w-full space-y-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full border rounded p-2 text-sm"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="text-xs text-gray-400">
              Press Enter to send - Role: {toTitle(user?.role || 'Staff')} - Dept: {user?.department || 'General'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm">
        <span>Total Messages: {messages.length}</span>
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          onClick={() =>
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
          }
        >
          Scroll to Latest
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-100 border-l-4 border-red-400 p-2 rounded text-xs">
          Urgent Messages: {urgentCount}
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded text-xs">
          Active Departments: {uniqueDepartments.length}
        </div>
        <div className="bg-green-100 border-l-4 border-green-400 p-2 rounded text-xs">
          Latest Update: {messages[0]?.createdAt ? new Date(messages[0].createdAt).toLocaleTimeString() : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default StaffChat;
