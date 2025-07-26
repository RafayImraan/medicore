import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

const testTypes = ['Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Urine Test'];

const generateLabResults = () =>
  Array.from({ length: 60 }, (_, id) => ({
    id,
    patient: faker.person.fullName(),
    doctor: faker.person.fullName(),
    technician: faker.person.fullName(),
    test: faker.helpers.arrayElement(testTypes),
    result: faker.lorem.words(3),
    status: faker.helpers.arrayElement(['Normal', 'Abnormal', 'Pending']),
    severity: faker.helpers.arrayElement(['Low', 'Moderate', 'High']),
    recurring: faker.datatype.boolean(),
    flaggedForFollowUp: faker.datatype.boolean(),
    referenceRange: '70 - 120 mg/dL',
    createdAt: faker.date.recent({ days: 10 }),
    anatomyRegion: faker.helpers.arrayElement(['Chest', 'Abdomen', 'Brain', 'Limbs']),
    notes: faker.lorem.sentence(),
    version: faker.string.alphanumeric({ length: 6 }),
    department: faker.helpers.arrayElement(['Hematology', 'Radiology', 'Pathology']),
    language: faker.helpers.arrayElement(['English', 'Urdu', 'Arabic']),
  }));

const LabResults = () => {
  const [results, setResults] = useState([]);
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
    setResults(generateLabResults());
  }, []);

  const uniqueDoctors = [...new Set(results.map(r => r.doctor))];

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
    return (
      (test === 'All' || res.test === test) &&
      (status === 'All' || res.status === status) &&
      (doctor === 'All' || res.doctor === doctor) &&
      (severity === 'All' || res.severity === severity) &&
      (language === 'All' || res.language === language) &&
      (!dateFrom || new Date(res.createdAt) >= new Date(dateFrom)) &&
      (!dateTo || new Date(res.createdAt) <= new Date(dateTo))
    );
  });

  const sorted = filtered.sort((a, b) => b.createdAt - a.createdAt);

  const abnormalRate = Math.round(
    (results.filter(r => r.status === 'Abnormal').length / results.length) * 100
  );

  const handleStatusEdit = (id, newStatus) => {
    setResults(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧪 Advanced Lab Results Dashboard</h1>

      {/* Filters */}
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
          <option>Normal</option>
          <option>Abnormal</option>
          <option>Pending</option>
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
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>

        <select
          value={filters.language}
          onChange={e => setFilters({ ...filters, language: e.target.value })}
          className="p-2 border rounded"
        >
          <option>All</option>
          <option>English</option>
          <option>Urdu</option>
          <option>Arabic</option>
        </select>
      </div>

      {/* Date Range */}
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

      {/* Table */}
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
              <tr key={r.id} className="border-t hover:bg-gray-50 text-center">
                <td>{r.patient}</td>
                <td>{r.test}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    r.status === 'Normal' ? 'bg-green-100 text-green-800' :
                    r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{r.status}</span>
                </td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    r.severity === 'High' ? 'bg-red-200' :
                    r.severity === 'Moderate' ? 'bg-yellow-200' :
                    'bg-green-200'
                  }`}>{r.severity}</span>
                </td>
                <td>{r.recurring ? '🔁' : '—'}</td>
                <td>{r.flaggedForFollowUp ? '✅' : '—'}</td>
                <td>{r.doctor}</td>
                <td>{r.technician}</td>
                <td>{r.referenceRange}</td>
                <td title={r.notes}>{r.result}</td>
                <td>{r.anatomyRegion}</td>
                <td>{r.department}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.language}</td>
                <td>
                  {['Normal', 'Abnormal', 'Pending'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusEdit(r.id, st)}
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

     {/* 📊 Analytics Panel */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  <div className="p-4 bg-blue-100 rounded text-center">
    📈 <strong>Total Results:</strong> {results.length}
  </div>
  <div className="p-4 bg-red-100 rounded text-center">
    🚨 <strong>Abnormal Rate:</strong> {abnormalRate}%
  </div>
  <div className="p-4 bg-purple-100 rounded text-center">
    ⚙️ <strong>Top Test:</strong> Blood Test
  </div>
</div>


</div> 
);
};

export default LabResults;

