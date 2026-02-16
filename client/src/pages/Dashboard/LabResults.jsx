import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/api';

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
    () => [...new Set(results.map(r => r.testName).filter(Boolean))],
    [results]
  );

  const uniqueDoctors = useMemo(
    () => [...new Set(results.map(r => r.doctorName).filter(Boolean))],
    [results]
  );

  const uniqueSeverities = useMemo(
    () => [...new Set(results.map(r => r.severity).filter(Boolean))],
    [results]
  );

  const uniqueLanguages = useMemo(
    () => [...new Set(results.map(r => r.language).filter(Boolean))],
    [results]
  );

  const filtered = results.filter(res => {
    const {
      test,
      status,
      doctor,
      severity,
      dateFrom,
      dateTo,
      language,
    } = filters;
    const resDate = res.date ? new Date(res.date) : new Date(res.createdAt);
    return (
      (test === 'All' || res.testName === test) &&
      (status === 'All' || res.status === status) &&
      (doctor === 'All' || res.doctorName === doctor) &&
      (severity === 'All' || res.severity === severity) &&
      (language === 'All' || res.language === language) &&
      (!dateFrom || resDate >= new Date(dateFrom)) &&
      (!dateTo || resDate <= new Date(dateTo))
    );
  });

  const sorted = filtered.sort((a, b) => {
    const aDate = a.date ? new Date(a.date) : new Date(a.createdAt);
    const bDate = b.date ? new Date(b.date) : new Date(b.createdAt);
    return bDate - aDate;
  });

  const reviewedRate = results.length
    ? Math.round((results.filter(r => r.status === 'Reviewed').length / results.length) * 100)
    : 0;

  const topTest = useMemo(() => {
    if (!results.length) return 'N/A';
    const tally = results.reduce((acc, r) => {
      const key = r.testName || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  }, [results]);

  const handleStatusEdit = async (id, newStatus) => {
    const previous = results;
    setResults(prev => prev.map(r => (r._id === id ? { ...r, status: newStatus } : r)));
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-white text-3xl font-bold">Advanced Lab Results Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <select
          value={filters.test}
          onChange={e => setFilters({ ...filters, test: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          {testTypes.map(t => <option key={t}>{t}</option>)}
        </select>

        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Ready</option>
          <option>Reviewed</option>
        </select>

        <select
          value={filters.doctor}
          onChange={e => setFilters({ ...filters, doctor: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniqueDoctors.map(d => <option key={d}>{d}</option>)}
        </select>

        <select
          value={filters.severity}
          onChange={e => setFilters({ ...filters, severity: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniqueSeverities.length ? uniqueSeverities.map(s => <option key={s}>{s}</option>) : (
            <>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </>
          )}
        </select>

        <select
          value={filters.language}
          onChange={e => setFilters({ ...filters, language: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          {uniqueLanguages.length ? uniqueLanguages.map(l => <option key={l}>{l}</option>) : (
            <>
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </>
          )}
        </select>
      </div>

      <div className="flex gap-4 mt-4">
        <input
          type="date"
          onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-white">Loading lab results...</div>
      ) : error ? (
        <div className="text-red-300">{error}</div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border bg-white rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Rec</th>
                <th>Follow-Up</th>
                <th>Doctor</th>
                <th>Technician</th>
                <th>Ref Range</th>
                <th>Result</th>
                <th>Anatomy</th>
                <th>Dept</th>
                <th>Date</th>
                <th>Lang</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => (
                <tr key={r._id} className="border-t hover:bg-gray-50 text-center">
                  <td>{r.patientName || 'N/A'}</td>
                  <td>{r.testName || 'N/A'}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${
                      r.status === 'Ready' ? 'bg-green-100 text-green-800' :
                      r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{r.status || 'N/A'}</span>
                  </td>
                  <td>
                    {r.severity ? (
                      <span className={`px-2 py-1 text-xs rounded ${
                        r.severity === 'High' ? 'bg-red-200' :
                        r.severity === 'Moderate' ? 'bg-yellow-200' :
                        'bg-green-200'
                      }`}>{r.severity}</span>
                    ) : 'N/A'}
                  </td>
                  <td>{r.recurring ? 'Yes' : '-'}</td>
                  <td>{r.flaggedForFollowUp ? 'Yes' : '-'}</td>
                  <td>{r.doctorName || 'N/A'}</td>
                  <td>{r.technicianName || 'N/A'}</td>
                  <td>{r.referenceRange || 'N/A'}</td>
                  <td title={r.notes || ''}>{r.result || 'N/A'}</td>
                  <td>{r.anatomyRegion || 'N/A'}</td>
                  <td>{r.department || 'N/A'}</td>
                  <td>{new Date(r.date || r.createdAt).toLocaleDateString()}</td>
                  <td>{r.language || 'N/A'}</td>
                  <td>
                    {['Pending', 'Ready', 'Reviewed'].map(st => (
                      <button
                        key={st}
                        onClick={() => handleStatusEdit(r._id, st)}
                        className={`text-xs px-2 py-1 rounded mx-1 ${
                          r.status === st ? 'bg-gray-800 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-100 rounded text-center">
          <strong>Total Results:</strong> {results.length}
        </div>
        <div className="p-4 bg-red-100 rounded text-center">
          <strong>Reviewed Rate:</strong> {reviewedRate}%
        </div>
        <div className="p-4 bg-purple-100 rounded text-center">
          <strong>Top Test:</strong> {topTest}
        </div>
      </div>
    </div>
  );
};

export default LabResults;
