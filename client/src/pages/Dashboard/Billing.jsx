import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

const billingStatuses = ['Paid', 'Pending', 'Cancelled', 'Partial'];

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [patientFilter, setPatientFilter] = useState('All');
  const [sortOption, setSortOption] = useState('recent');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (statusFilter !== 'All') query.set('status', statusFilter);
        if (search) query.set('search', search);
        if (dateRange.from) query.set('dateFrom', dateRange.from);
        if (dateRange.to) query.set('dateTo', dateRange.to);
        const res = await apiRequest(`/api/billing${query.toString() ? `?${query.toString()}` : ''}`);
        setBills(res.items || []);
      } catch (err) {
        console.error('Failed to load bills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [statusFilter, search, dateRange.from, dateRange.to]);

  const uniquePatients = [...new Set(bills.map(b => b.patient))];

  const filtered = bills.filter(bill => {
    const matchStatus = statusFilter === 'All' || bill.status === statusFilter;
    const matchPatient = patientFilter === 'All' || bill.patient === patientFilter;
    const matchSearch =
      bill.patient.toLowerCase().includes(search.toLowerCase()) ||
      bill.service.toLowerCase().includes(search.toLowerCase()) ||
      bill.id.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      (!dateRange.from || new Date(bill.createdAt) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(bill.createdAt) <= new Date(dateRange.to));
    return matchStatus && matchPatient && matchSearch && matchDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'amount') return b.amount - a.amount;
    if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // recent
  });

  const totalRevenue = bills.reduce((sum, bill) => bill.status === 'Paid' ? sum + bill.totalAmount : sum, 0);
  const unpaidTotal = bills.reduce((sum, bill) => bill.status === 'Pending' ? sum + bill.totalAmount : sum, 0);
  const topService = bills.reduce((acc, bill) => {
    acc[bill.service] = (acc[bill.service] || 0) + bill.totalAmount;
    return acc;
  }, {});
  const topServiceName = Object.entries(topService).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">💸 Billing Dashboard</h1>

      {/* 🔍 Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {billingStatuses.map(status => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          value={patientFilter}
          onChange={e => setPatientFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniquePatients.map(patient => (
            <option key={patient}>{patient}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="recent">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount">Amount Desc</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            className="p-2 border rounded w-full"
            onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
          />
          <input
            type="date"
            className="p-2 border rounded w-full"
            onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
          />
        </div>
      </div>

      {/* 📊 Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-green-100 rounded text-center font-semibold">
          🧮 Total Revenue: Rs. {totalRevenue}
        </div>
        <div className="p-4 bg-red-100 rounded text-center font-semibold">
          ❌ Pending Amount: Rs. {unpaidTotal}
        </div>
        <div className="p-4 bg-blue-100 rounded text-center font-semibold">
          🩺 Top Service: {topServiceName}
        </div>
      </div>
            {/* 🧾 Billing Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow rounded mt-4 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Bill ID</th>
              <th>Patient</th>
              <th>Service</th>
              <th>Department</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(bill => (
              <tr key={bill.id} className="border-t hover:bg-gray-50 text-center">
                <td className="px-3 py-2 font-medium">{bill.id}</td>
                <td>{bill.patient}</td>
                <td>{bill.service}</td>
                <td>{bill.department}</td>
                <td>Rs. {bill.amount}</td>
                <td>Rs. {bill.tax}</td>
                <td>{bill.discount > 0 ? `- Rs. ${bill.discount}` : '—'}</td>
                <td className="font-semibold text-green-700">
                  Rs. {bill.totalAmount}
                </td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    bill.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : bill.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                <td>{bill.paymentMethod}</td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td className="text-gray-500 text-xs">{bill.notes}</td>
                <td className="flex gap-1 justify-center flex-wrap py-1">
                  {billingStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() =>
                        apiRequest(`/api/billing/${bill.id}/payment-status`, {
                          method: 'PUT',
                          body: JSON.stringify({ paymentStatus: status })
                        }).then(() => {
                          setBills(prev =>
                            prev.map(b =>
                              b.id === bill.id ? { ...b, status } : b
                            )
                          );
                        })
                      }
                      className={`text-xs px-2 py-1 rounded ${
                        bill.status === status ? 'bg-gray-800 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      apiRequest(`/api/billing/${bill.id}`, {
                        method: 'DELETE'
                      }).then(() => setBills(prev => prev.filter(b => b.id !== bill.id)))
                    }
                    className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="text-sm text-gray-500 mt-2">Loading bills...</div>}
      </div>
            {/* 📤 Export & Notifications UI */}
      <div className="mt-6 bg-gray-50 border-l-4 border-gray-300 p-4 text-xs rounded space-y-2">
        📁 <strong>Export:</strong> Billing summary available as CSV/PDF via finance panel.
        <br />
        💬 <strong>Notifications:</strong> SMS/email alerts sent for unpaid bills (mocked).
        <br />
        🧾 <strong>Audit Log:</strong> Last status change by Staff#425 on {new Date().toLocaleDateString()}.
        <br />
        🔐 <strong>Access:</strong> Only finance/admin roles can edit or delete bills (simulation).
        <br />
        🛜 <strong>Sync:</strong> Payment status integrated with EMR & appointments module.
      </div>

      {/* 🚨 Overdue Alert Simulation */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 text-sm rounded">
          ❗ <strong>Overdue Bills:</strong> 21 patients have unpaid dues past 14 days.
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-sm rounded">
          🕒 <strong>Pending Payments:</strong> Scheduled for review this week.
        </div>
      </div>

      {/* 🧩 Final Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded text-sm">
          📊 <strong>Average Bill:</strong> Rs. {bills.length ? Math.floor(bills.reduce((sum, b) => sum + b.totalAmount, 0) / bills.length) : 0}
        </div>
        <div className="bg-green-50 p-3 rounded text-sm">
          🧍 <strong>Most Billed Patient:</strong>{' '}
          {
            Object.entries(
              bills.reduce((acc, bill) => {
                acc[bill.patient] = (acc[bill.patient] || 0) + 1;
                return acc;
              }, {})
            ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
          }
        </div>
      </div>
    </div>
  );
};

export default Billing;


