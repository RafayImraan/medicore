import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';

const statusTone = {
  Pending: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  Ready: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  Reviewed: 'border-sky-500/30 bg-sky-500/15 text-sky-200',
};

const severityTone = {
  High: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
  Moderate: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  Low: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
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
  return new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const LabResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    test: 'All',
    status: 'All',
    doctor: 'All',
    severity: 'All',
    language: 'All',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiRequest('/api/lab-results?limit=500');
        setResults(response.items || []);
      } catch (err) {
        console.error('Failed to load lab results:', err);
        setError('Failed to load lab results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const testTypes = useMemo(
    () => [...new Set(results.map((result) => result.testName).filter(Boolean))],
    [results]
  );

  const uniqueDoctors = useMemo(
    () => [...new Set(results.map((result) => result.doctorName).filter(Boolean))],
    [results]
  );

  const uniqueSeverities = useMemo(
    () => [...new Set(results.map((result) => result.severity).filter(Boolean))],
    [results]
  );

  const uniqueLanguages = useMemo(
    () => [...new Set(results.map((result) => result.language).filter(Boolean))],
    [results]
  );

  const filtered = useMemo(() => {
    return results.filter((result) => {
      const {
        test,
        status,
        doctor,
        severity,
        dateFrom,
        dateTo,
        language,
      } = filters;
      const resultDate = result.date ? new Date(result.date) : new Date(result.createdAt);

      return (
        (test === 'All' || result.testName === test) &&
        (status === 'All' || result.status === status) &&
        (doctor === 'All' || result.doctorName === doctor) &&
        (severity === 'All' || result.severity === severity) &&
        (language === 'All' || result.language === language) &&
        (!dateFrom || resultDate >= new Date(dateFrom)) &&
        (!dateTo || resultDate <= new Date(dateTo))
      );
    });
  }, [filters, results]);

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      const leftDate = left.date ? new Date(left.date) : new Date(left.createdAt);
      const rightDate = right.date ? new Date(right.date) : new Date(right.createdAt);
      return rightDate - leftDate;
    });
  }, [filtered]);

  const reviewedRate = results.length
    ? Math.round((results.filter((result) => result.status === 'Reviewed').length / results.length) * 100)
    : 0;

  const topTest = useMemo(() => {
    if (!results.length) return 'N/A';
    const tally = results.reduce((accumulator, result) => {
      const key = result.testName || 'Unknown';
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  }, [results]);

  const abnormalCount = results.filter((result) => result.severity === 'High').length;

  const handleStatusEdit = async (id, newStatus) => {
    const previous = results;
    setResults((current) => current.map((result) => (result._id === id ? { ...result, status: newStatus } : result)));

    try {
      await apiRequest(`/api/lab-results/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      setResults(previous);
    }
  };

  const filterControlClass =
    'w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#071424_48%,#030712_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Panel className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_32%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Diagnostics Command
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Lab Results Console</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Review incoming diagnostics, identify high-risk reports quickly, and keep clinicians aligned on final
                  verification without dropping context between departments.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Results</p>
                <p className="mt-2 text-3xl font-semibold text-white">{results.length}</p>
                <p className="mt-2 text-sm text-slate-400">Across live lab, imaging, and pathology queues.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Reviewed Rate</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{reviewedRate}%</p>
                <p className="mt-2 text-sm text-slate-400">Reports signed off by clinical reviewers.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top Test</p>
                <p className="mt-2 text-lg font-semibold text-white">{topTest}</p>
                <p className="mt-2 text-sm text-slate-400">{abnormalCount} high-severity results flagged.</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Filters</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Clinical Slices</h2>
              <p className="mt-2 text-sm text-slate-400">Refine the diagnostic feed by test, reviewer, severity, and date window.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Test</label>
                <select
                  value={filters.test}
                  onChange={(event) => setFilters({ ...filters, test: event.target.value })}
                  className={filterControlClass}
                >
                  <option>All</option>
                  {testTypes.map((test) => (
                    <option key={test}>{test}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</label>
                <select
                  value={filters.status}
                  onChange={(event) => setFilters({ ...filters, status: event.target.value })}
                  className={filterControlClass}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Ready</option>
                  <option>Reviewed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Doctor</label>
                <select
                  value={filters.doctor}
                  onChange={(event) => setFilters({ ...filters, doctor: event.target.value })}
                  className={filterControlClass}
                >
                  <option>All</option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(event) => setFilters({ ...filters, severity: event.target.value })}
                  className={filterControlClass}
                >
                  <option>All</option>
                  {uniqueSeverities.length ? (
                    uniqueSeverities.map((severity) => <option key={severity}>{severity}</option>)
                  ) : (
                    <>
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Language</label>
                <select
                  value={filters.language}
                  onChange={(event) => setFilters({ ...filters, language: event.target.value })}
                  className={filterControlClass}
                >
                  <option>All</option>
                  {uniqueLanguages.length ? (
                    uniqueLanguages.map((language) => <option key={language}>{language}</option>)
                  ) : (
                    <>
                      <option>English</option>
                      <option>Urdu</option>
                      <option>Arabic</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(event) => setFilters({ ...filters, dateFrom: event.target.value })}
                    className={filterControlClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(event) => setFilters({ ...filters, dateTo: event.target.value })}
                    className={filterControlClass}
                  />
                </div>
              </div>
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel className="overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Results Stream</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Review Queue</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
                  {sorted.length} matching results
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-400">Loading lab results...</div>
              ) : error ? (
                <div className="flex min-h-[280px] items-center justify-center text-sm text-rose-300">{error}</div>
              ) : sorted.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl text-slate-300">
                    !
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">No lab results match the current filter set.</p>
                    <p className="mt-2 text-sm text-slate-400">Adjust the clinical filters or widen the date window.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Patient</th>
                        <th className="px-4 py-3 font-medium">Test</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Severity</th>
                        <th className="px-4 py-3 font-medium">Owner</th>
                        <th className="px-4 py-3 font-medium">Result</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((result) => (
                        <tr key={result._id} className="border-t border-white/8 align-top text-slate-200">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-white">{result.patientName || 'N/A'}</p>
                            <p className="mt-1 text-xs text-slate-400">{result.department || 'General'} department</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">{result.testName || 'N/A'}</p>
                            <p className="mt-1 text-xs text-slate-400">{result.referenceRange || 'No reference range'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                statusTone[result.status] || 'border-white/10 bg-white/5 text-slate-300'
                              }`}
                            >
                              {result.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                severityTone[result.severity] || 'border-white/10 bg-white/5 text-slate-300'
                              }`}
                            >
                              {result.severity || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">{result.doctorName || 'N/A'}</p>
                            <p className="mt-1 text-xs text-slate-400">{result.technicianName || 'Technician unassigned'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="max-w-[220px] truncate font-medium text-white" title={result.result || ''}>
                              {result.result || 'N/A'}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                              <span>{result.language || 'N/A'}</span>
                              {result.recurring && <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">Recurring</span>}
                              {result.flaggedForFollowUp && (
                                <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-2 py-1 text-rose-200">
                                  Follow-up
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-300">{formatDate(result.date || result.createdAt)}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {['Pending', 'Ready', 'Reviewed'].map((status) => {
                                const isActive = result.status === status;
                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusEdit(result._id, status)}
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResults;
