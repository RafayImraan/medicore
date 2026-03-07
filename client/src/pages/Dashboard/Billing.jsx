import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';

const billingStatuses = ['Paid', 'Pending', 'Cancelled', 'Partial'];

const Panel = ({ children, className = '' }) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(4,10,28,0.45)] backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

const statusTone = {
  Paid: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  Pending: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  Cancelled: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
  Partial: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-200',
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

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
        const response = await apiRequest(`/api/billing${query.toString() ? `?${query.toString()}` : ''}`);
        setBills(response.items || []);
      } catch (err) {
        console.error('Failed to load bills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [dateRange.from, dateRange.to, search, statusFilter]);

  const uniquePatients = useMemo(() => [...new Set(bills.map((bill) => bill.patient).filter(Boolean))], [bills]);

  const filtered = useMemo(() => {
    return bills.filter((bill) => {
      const matchStatus = statusFilter === 'All' || bill.status === statusFilter;
      const matchPatient = patientFilter === 'All' || bill.patient === patientFilter;
      const matchSearch =
        (bill.patient || '').toLowerCase().includes(search.toLowerCase()) ||
        (bill.service || '').toLowerCase().includes(search.toLowerCase()) ||
        (bill.id || '').toLowerCase().includes(search.toLowerCase());
      const matchDate =
        (!dateRange.from || new Date(bill.createdAt) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(bill.createdAt) <= new Date(dateRange.to));
      return matchStatus && matchPatient && matchSearch && matchDate;
    });
  }, [bills, dateRange.from, dateRange.to, patientFilter, search, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      if (sortOption === 'amount') return (right.totalAmount || right.amount || 0) - (left.totalAmount || left.amount || 0);
      if (sortOption === 'oldest') return new Date(left.createdAt) - new Date(right.createdAt);
      return new Date(right.createdAt) - new Date(left.createdAt);
    });
  }, [filtered, sortOption]);

  const totalRevenue = bills.reduce((sum, bill) => (bill.status === 'Paid' ? sum + (bill.totalAmount || 0) : sum), 0);
  const unpaidTotal = bills.reduce((sum, bill) => (bill.status === 'Pending' ? sum + (bill.totalAmount || 0) : sum), 0);
  const topService = bills.reduce((accumulator, bill) => {
    accumulator[bill.service] = (accumulator[bill.service] || 0) + (bill.totalAmount || 0);
    return accumulator;
  }, {});
  const topServiceName = Object.entries(topService).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const averageBill = bills.length
    ? Math.floor(bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0) / bills.length)
    : 0;

  const updateBillStatus = async (billId, status) => {
    await apiRequest(`/api/billing/${billId}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus: status }),
    });
    setBills((current) => current.map((bill) => (bill.id === billId ? { ...bill, status } : bill)));
  };

  const deleteBill = async (billId) => {
    await apiRequest(`/api/billing/${billId}`, { method: 'DELETE' });
    setBills((current) => current.filter((bill) => bill.id !== billId));
  };

  const controlClass =
    'w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Panel className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Finance Control
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Billing Command</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor collections, isolate payment friction, and update invoice status from a cleaner finance workspace.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Collected</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{formatCurrency(totalRevenue)}</p>
                <p className="mt-2 text-sm text-slate-400">Revenue cleared across paid invoices.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pending</p>
                <p className="mt-2 text-3xl font-semibold text-amber-300">{formatCurrency(unpaidTotal)}</p>
                <p className="mt-2 text-sm text-slate-400">Awaiting payment confirmation.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top Service</p>
                <p className="mt-2 text-lg font-semibold text-white">{topServiceName}</p>
                <p className="mt-2 text-sm text-slate-400">Average bill {formatCurrency(averageBill)}.</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Filters</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Revenue Slices</h2>
              <p className="mt-2 text-sm text-slate-400">Search by patient or invoice, then narrow by status and billing window.</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search patient, service, or bill ID"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={controlClass}
              />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={controlClass}>
                <option>All</option>
                {billingStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select value={patientFilter} onChange={(event) => setPatientFilter(event.target.value)} className={controlClass}>
                <option>All</option>
                {uniquePatients.map((patient) => (
                  <option key={patient}>{patient}</option>
                ))}
              </select>
              <select value={sortOption} onChange={(event) => setSortOption(event.target.value)} className={controlClass}>
                <option value="recent">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount">Largest amount</option>
              </select>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, from: event.target.value }))}
                  className={controlClass}
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(event) => setDateRange((prev) => ({ ...prev, to: event.target.value }))}
                  className={controlClass}
                />
              </div>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Invoices</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Collections Queue</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                {sorted.length} matching bills
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((bill) => (
                    <tr key={bill.id} className="border-t border-white/8 align-top text-slate-200">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{bill.id}</p>
                        <p className="mt-1 text-xs text-slate-400">{bill.department || 'General'} department</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{bill.patient}</p>
                        <p className="mt-1 text-xs text-slate-400">{bill.notes || 'No finance note'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{bill.service}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Amount {formatCurrency(bill.amount)} / Tax {formatCurrency(bill.tax)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-emerald-300">{formatCurrency(bill.totalAmount)}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {bill.discount > 0 ? `Discount ${formatCurrency(bill.discount)}` : 'No discount'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusTone[bill.status] || 'border-white/10 bg-white/5 text-slate-300'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{bill.paymentMethod || 'N/A'}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {billingStatuses.map((status) => {
                            const isActive = bill.status === status;
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateBillStatus(bill.id, status)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                  isActive
                                    ? 'border-cyan-400/35 bg-cyan-400/15 text-cyan-100'
                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => deleteBill(bill.id)}
                            className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/15"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && <div className="mt-4 text-sm text-slate-400">Loading bills...</div>}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Billing;
