import React, { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { commonAPI } from '@/services/api';

const fakePatients = [
  {
    _id: '1',
    userId: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Dr, Healthcare City',
    medicalHistory: [{ condition: 'Hypertension' }],
    emergencyContact: 'John Johnson - Brother',
    insurance: 'Blue Cross Blue Shield',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'Stable',
  },
  {
    _id: '2',
    userId: { name: 'Michael Chen', email: 'm.chen@example.com' },
    dateOfBirth: '1992-07-22',
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    address: '456 Wellness Ave, Healthy Town',
    medicalHistory: [{ condition: 'Type 2 Diabetes' }],
    emergencyContact: 'Lisa Chen - Wife',
    insurance: 'United Healthcare',
    createdAt: '2024-02-20T14:15:00Z',
    status: 'Recovering',
  },
  {
    _id: '3',
    userId: { name: 'Emily Rodriguez', email: 'emily.r@example.com' },
    dateOfBirth: '1978-11-08',
    gender: 'Female',
    phone: '+1 (555) 345-6789',
    address: '789 Care Street, Medical District',
    medicalHistory: [{ condition: 'Asthma' }],
    emergencyContact: 'Carlos Rodriguez - Husband',
    insurance: 'Aetna',
    createdAt: '2024-03-10T09:45:00Z',
    status: 'Stable',
  },
];

const statusTone = {
  Stable: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  Critical: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
  Recovering: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  Discharged: 'border-slate-500/30 bg-slate-500/15 text-slate-200',
  Active: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-200',
};

const Panel = ({ children, className = '' }) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(4,10,28,0.45)] backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const getAge = (value) => {
  if (!value) return 'N/A';
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return 'N/A';
  return Math.max(0, new Date().getFullYear() - birthDate.getFullYear());
};

const formatInsurance = (insurance) => {
  if (!insurance) return 'Insurance unavailable';
  if (typeof insurance === 'string') return insurance;
  if (typeof insurance === 'object') {
    return [insurance.provider, insurance.policyNumber].filter(Boolean).join(' • ') || 'Insurance unavailable';
  }
  return 'Insurance unavailable';
};

const exportToCSV = (patients) => {
  const headers = ['ID', 'Name', 'Age', 'Gender', 'Disease', 'Admission Date', 'Status'];
  const rows = patients.map((patient) => [
    patient?._id || '',
    patient?.userId?.name || '',
    getAge(patient?.dateOfBirth),
    patient?.gender || '',
    patient?.medicalHistory?.[0]?.condition || 'N/A',
    formatDate(patient?.createdAt),
    patient?.status || 'Active',
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'patients.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [diseaseFilter, setDiseaseFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedPatients, setSelectedPatients] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    userEmail: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalHistory: [],
    allergies: [],
    insurance: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await commonAPI.getAllPatients();
        setPatients(data.length > 0 ? data : fakePatients);
        setError(null);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
        setPatients(fakePatients);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    let filtered = patients;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((patient) => {
        const name = patient?.userId?.name?.toLowerCase() || '';
        const disease = patient?.medicalHistory?.[0]?.condition?.toLowerCase() || '';
        const email = patient?.userId?.email?.toLowerCase() || '';
        return name.includes(term) || disease.includes(term) || email.includes(term);
      });
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((patient) => (patient?.status || 'Active') === statusFilter);
    }

    if (genderFilter !== 'All') {
      filtered = filtered.filter((patient) => patient?.gender === genderFilter);
    }

    if (diseaseFilter) {
      filtered = filtered.filter((patient) =>
        patient?.medicalHistory?.[0]?.condition?.toLowerCase().includes(diseaseFilter.toLowerCase())
      );
    }

    if (dateRange.from) {
      filtered = filtered.filter((patient) => patient?.createdAt && new Date(patient.createdAt) >= new Date(dateRange.from));
    }

    if (dateRange.to) {
      filtered = filtered.filter((patient) => patient?.createdAt && new Date(patient.createdAt) <= new Date(dateRange.to));
    }

    return [...filtered].sort((left, right) => {
      let leftValue = '';
      let rightValue = '';

      if (sortConfig.key === 'name') {
        leftValue = left?.userId?.name || '';
        rightValue = right?.userId?.name || '';
      } else if (sortConfig.key === 'age') {
        leftValue = getAge(left?.dateOfBirth);
        rightValue = getAge(right?.dateOfBirth);
      } else if (sortConfig.key === 'admissionDate') {
        leftValue = new Date(left?.createdAt || 0).getTime();
        rightValue = new Date(right?.createdAt || 0).getTime();
      } else if (sortConfig.key === 'status') {
        leftValue = left?.status || 'Active';
        rightValue = right?.status || 'Active';
      }

      if (leftValue < rightValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (leftValue > rightValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [patients, search, statusFilter, genderFilter, diseaseFilter, dateRange, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activePatients = patients.filter((patient) => (patient?.status || 'Active') !== 'Discharged').length;
  const criticalPatients = patients.filter((patient) => (patient?.status || '').toLowerCase() === 'critical').length;

  const uniqueStatuses = useMemo(() => {
    const items = [...new Set(patients.map((patient) => patient?.status || 'Active'))];
    return items.length ? items : ['Stable', 'Recovering', 'Critical', 'Discharged'];
  }, [patients]);

  const toggleSelectPatient = (id) => {
    const next = new Set(selectedPatients);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPatients(next);
  };

  const toggleSelectAll = () => {
    if (selectedPatients.size === paginatedPatients.length) {
      setSelectedPatients(new Set());
      return;
    }
    setSelectedPatients(new Set(paginatedPatients.map((patient) => patient?._id).filter(Boolean)));
  };

  const changeSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
      return;
    }
    setSortConfig({ key, direction: 'asc' });
  };

  const handleAddPatient = async (event) => {
    event.preventDefault();
    if (!newPatient.userEmail || !newPatient.dateOfBirth || !newPatient.gender || !newPatient.phone) return;

    try {
      setSubmitting(true);
      await commonAPI.createPatient(newPatient);
      const refreshed = await commonAPI.getAllPatients();
      setPatients(refreshed);
      setShowAddModal(false);
      setNewPatient({
        userEmail: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        address: '',
        emergencyContact: '',
        medicalHistory: [],
        allergies: [],
        insurance: '',
      });
    } catch (submitError) {
      console.error('Error adding patient:', submitError);
      alert('Failed to add patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading patients..." />;

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
                Patient Registry
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Population Overview</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Track admissions, filter the active census, and manage new patient intake from a single operational console.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Patients</p>
                <p className="mt-2 text-3xl font-semibold text-white">{patients.length}</p>
                <p className="mt-2 text-sm text-slate-400">Profiles available in the current dataset.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Active Census</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{activePatients}</p>
                <p className="mt-2 text-sm text-slate-400">Patients not yet discharged.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Critical</p>
                <p className="mt-2 text-3xl font-semibold text-rose-300">{criticalPatients}</p>
                <p className="mt-2 text-sm text-slate-400">{selectedPatients.size} selected for bulk actions.</p>
              </div>
            </div>
          </div>
        </Panel>

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Filters</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Registry Controls</h2>
              <p className="mt-2 text-sm text-slate-400">Search the roster, narrow by status, and export the current slice.</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search name, email, or disease"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={controlClass}
              />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={controlClass}>
                <option value="All">All statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)} className={controlClass}>
                <option value="All">All genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Condition"
                value={diseaseFilter}
                onChange={(event) => setDiseaseFilter(event.target.value)}
                className={controlClass}
              />
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

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Add Patient
              </button>
              <button
                type="button"
                onClick={() => exportToCSV(filteredPatients)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                Export CSV
              </button>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Roster</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Patient Directory</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                  {filteredPatients.length} matching profiles
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                  Page {currentPage} / {totalPages}
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPatients.size === paginatedPatients.length && paginatedPatients.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-white/20 bg-slate-950/50"
                      />
                    </th>
                    <th className="cursor-pointer px-4 py-3 font-medium" onClick={() => changeSort('name')}>Patient</th>
                    <th className="cursor-pointer px-4 py-3 font-medium" onClick={() => changeSort('age')}>Age</th>
                    <th className="px-4 py-3 font-medium">Gender</th>
                    <th className="px-4 py-3 font-medium">Condition</th>
                    <th className="cursor-pointer px-4 py-3 font-medium" onClick={() => changeSort('admissionDate')}>Admitted</th>
                    <th className="cursor-pointer px-4 py-3 font-medium" onClick={() => changeSort('status')}>Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                        No patients matched the current filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedPatients.map((patient) => {
                      const status = patient?.status || 'Active';
                      return (
                        <tr key={patient?._id} className="border-t border-white/8 text-slate-200">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPatients.has(patient?._id)}
                              onChange={() => toggleSelectPatient(patient?._id)}
                              className="h-4 w-4 rounded border-white/20 bg-slate-950/50"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-white">{patient?.userId?.name || 'N/A'}</p>
                            <p className="mt-1 text-xs text-slate-400">{patient?.userId?.email || patient?.phone || 'No contact info'}</p>
                          </td>
                          <td className="px-4 py-4">{getAge(patient?.dateOfBirth)}</td>
                          <td className="px-4 py-4">{patient?.gender || 'N/A'}</td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">{patient?.medicalHistory?.[0]?.condition || 'General care'}</p>
                            <p className="mt-1 text-xs text-slate-400">{formatInsurance(patient?.insurance)}</p>
                          </td>
                          <td className="px-4 py-4 text-slate-300">{formatDate(patient?.createdAt)}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                statusTone[status] || 'border-white/10 bg-white/5 text-slate-300'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10">
                                View
                              </button>
                              <button className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/15">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">{selectedPatients.size} selected</div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200 outline-none"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} rows
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#071424] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">New Intake</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Add Patient</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                type="email"
                placeholder="User email"
                value={newPatient.userEmail}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, userEmail: event.target.value }))}
                className={controlClass}
                required
              />
              <input
                type="date"
                value={newPatient.dateOfBirth}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                className={controlClass}
                required
              />
              <select
                value={newPatient.gender}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, gender: event.target.value }))}
                className={controlClass}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Blood group"
                value={newPatient.bloodGroup}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, bloodGroup: event.target.value }))}
                className={controlClass}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newPatient.phone}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, phone: event.target.value }))}
                className={controlClass}
                required
              />
              <input
                type="text"
                placeholder="Emergency contact"
                value={newPatient.emergencyContact}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, emergencyContact: event.target.value }))}
                className={controlClass}
              />
              <textarea
                rows={3}
                placeholder="Address"
                value={newPatient.address}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, address: event.target.value }))}
                className={`${controlClass} md:col-span-2`}
              />
              <textarea
                rows={2}
                placeholder="Medical history, comma separated"
                value={newPatient.medicalHistory.join(', ')}
                onChange={(event) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    medicalHistory: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  }))
                }
                className={`${controlClass} md:col-span-2`}
              />
              <textarea
                rows={2}
                placeholder="Allergies, comma separated"
                value={newPatient.allergies.join(', ')}
                onChange={(event) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    allergies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                  }))
                }
                className={`${controlClass} md:col-span-2`}
              />
              <input
                type="text"
                placeholder="Insurance"
                value={newPatient.insurance}
                onChange={(event) => setNewPatient((prev) => ({ ...prev, insurance: event.target.value }))}
                className={`${controlClass} md:col-span-2`}
              />

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Create Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
