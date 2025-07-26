import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('recent');
  const clinicalNotesTemplates = [
  'Patient reports mild headache; advised hydration.',
  'Continue current dose; monitor for nausea.',
  'Refill recommended based on last visit.',
  'Prescribed for 7 days due to bacterial infection.',
  'Medication may cause drowsiness; avoid driving.',
  'Dosage adjusted for renal function concerns.',
  'Watch for dizziness during first 3 days.',
  'Treatment aligns with prior diagnosis — stable condition.',
  'Evaluate liver enzyme levels before next refill.',
  'Patient advised to avoid alcohol while on medication.',
  'Discussed alternative therapy if no improvement in 5 days.',
  'Follow-up needed if symptoms persist after 3 doses.',
  'Patient experiencing mild allergic reaction; antihistamine prescribed.',
  'Dosage reduced due to elevated creatinine levels.',
  'Start probiotic to reduce gastrointestinal side effects.',
  'Discontinue use if rash or irritation occurs.',
  'Blood pressure should be monitored daily while on medication.',
  'Advised to take medication after meals to reduce stomach discomfort.',
  'Swelling noted in lower limbs; reviewed diuretic dosage.',
  'Patient skipped dose yesterday; reminded on adherence.',
  'Symptoms suggest viral origin; prescription is precautionary.',
  'Patient currently on multiple medications; avoid duplication.',
  'Recommended rest and fluid intake alongside prescription.',
  'Side effects discussed: dry mouth, drowsiness, and blurred vision.',
  'Continue therapy until next appointment; no changes required.',
  'Prescribed dose based on patient’s weight and age.',
  'Patient traveling; advised to carry full prescription course.',
  'Reviewed family history before finalizing medication.',
  'Medication contraindicated with grapefruit; caution advised.',
  'Possible insomnia reported; dose adjusted to morning schedule.',
  'Dietary restrictions discussed to support medication efficacy.',
  'Patient responded well to initial dose; continue same strength.',
  'Clinical findings consistent with previous prescription rationale.',
  'Patient self-administering inhaler incorrectly; retraining provided.',
  'Advised to monitor blood glucose twice daily.',
  'Headache improved; taper dose over next three days.',
  'Cold symptoms persistent; extended course by 5 days.',
  'Reported dizziness with previous medication; switched to alternative.',
  'No signs of adverse reaction; continue as prescribed.',
  'Blood tests required before next dosage increase.',
  'Medication should not be shared with others.',
  'Report chest pain or shortness of breath immediately.',
  'Medication refill synchronized with insurance coverage.',
  'Patient showing mild improvement; continue observation.',
  'Antibiotic selected based on culture sensitivity results.',
  'Sleep disturbance observed; advised to take dose earlier in day.',
  'Dose altered to accommodate once-daily intake schedule.',
  'Instructions provided for proper eye drop administration.',
  'Medication stored at recommended temperature and light exposure.',
  'Minor swelling reported; pharmacist consultation suggested.',
  'Treatment aligns with updated clinical guidelines.',
  'Patient missed last follow-up; appointment rescheduled.',
  'Topical application recommended alongside oral medication.',
  'Cough suppressants discontinued due to lack of benefit.',
  'No refill needed unless symptoms return.',
  'Start physical therapy concurrently with medication cycle.',
  'Symptom diary advised for tracking response to treatment.',
  'Patient requested brand switch; generic prescribed instead.',
  'Long-term use may require liver function monitoring.',
  'Advised against abrupt discontinuation of medication.',
  'Patient feels fatigued; dose timing optimized.',
  'Dosage aligns with national formulary recommendations.',
  'Treatment course completed; patient cleared from medication protocol.',
  'Patient stable on current dose; continue unchanged.',
  'Mild cough persists; duration of treatment extended.',
  'Blood glucose under control; reduce insulin gradually.',
  'Monitor kidney function before next dose escalation.',
  'Advised food intake prior to medication for better absorption.',
  'Patient tolerated initial dose well — no complaints.',
  'Injection site mild swelling observed; no intervention needed.',
  'Discussed side effect profile — patient informed of risks.',
  'Medication added to existing therapy; no interactions found.',
  'Patient confirmed adherence to prescription schedule.',
  'Refill approved for 30 days with pharmacist consultation.',
  'New complaint of fatigue; dose timing shifted to morning.',
  'Therapeutic response evaluated via lab results — satisfactory.',
  'Antibiotic course shortened due to rapid symptom relief.',
  'Breathing improved; inhaler dosage maintained.',
  'Blood pressure elevated; medication adjusted accordingly.',
  'Dosing frequency changed to twice daily upon request.',
  'Patient asked about alternative formulation — not recommended.',
  'Course continued under observation until next follow-up.',
  'Patient exhibits mild tremor; advised dosage split.',
  'Avoid OTC drugs unless approved during this cycle.',
  'Patient reassured about common side effects — no alarm.',
  'Symptoms consistent with seasonal allergies — antihistamine prescribed.',
  'Pain localized; topical treatment initiated.',
  'No GI complaints reported; oral therapy well tolerated.',
  'Patient requested liquid form due to swallowing difficulty.',
  'Clinical judgment supports ongoing therapy; no modification.',
  'Full dose required due to severity of symptoms.',
  'Patient scheduled for follow-up blood work next week.',
  'MRI results pending; medication precautionary.',
  'Discussed medication risks during pregnancy — alternate prescribed.',
  'Lifestyle advice given alongside prescription renewal.',
  'Medication reviewed — fits formulary guidelines.',
  'Patient is improving — continue regimen and monitor.',
  'Suspected medication intolerance; alternative initiated.',
  'No contraindications found after comprehensive review.',
  'Treatment modified based on allergy panel results.',
  'Dose doubled for 48 hours for symptomatic relief.',
  'Patient asked about herbal alternatives — discouraged.',
  'Medication time moved to evening due to drowsiness.',
  'Cold symptoms present — symptomatic treatment advised.',
  'Weight-based dosing applied for pediatric patient.',
  'Pain under control — continue medication as prescribed.',
  'Discussion held regarding long-term therapy risks.',
  'Prescription shared with pharmacy for delivery.',
  'No refill given — patient completed entire course.',
  'Medication stopped post negative diagnostic findings.',
  'Side effects minimal — course completed without issues.',
  'Medication documented per clinical workflow.',
  'Patient advised to log response in diary daily.',
];


  useEffect(() => {
    const generatePrescriptions = () => {
      return Array.from({ length: 100 }, () => {
        const createdAt = faker.date.recent({ days: 10 });
        return {
          id: faker.string.uuid().slice(0, 8),
          patient: faker.person.fullName(),
          doctor: faker.person.fullName(),
          medicine: faker.commerce.productName(),
          category: faker.helpers.arrayElement(['Antibiotic', 'Analgesic', 'Antiviral', 'Antiseptic']),
          dosage: `${faker.number.int({ min: 1, max: 3 })} tab(s) ${faker.helpers.arrayElement(['morning', 'night', 'every 8 hours'])}`,
          duration: `${faker.number.int({ min: 3, max: 10 })} days`,
          status: faker.helpers.arrayElement(['Active', 'Completed', 'Cancelled']),
          refillNeeded: faker.datatype.boolean(),
          notes: faker.helpers.arrayElement(clinicalNotesTemplates),

          createdAt,
          updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
          auditTrail: [
            {
              changedBy: faker.internet.userName(),
              field: 'status',
              from: 'Active',
              to: 'Completed',
              timestamp: faker.date.past(),
            },
          ],
        };
      });
    };

    setPrescriptions(generatePrescriptions());
  }, []);

  const uniqueDoctors = [...new Set(prescriptions.map(p => p.doctor))];

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchDoctor = doctorFilter === 'All' || p.doctor === doctorFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSearch =
      p.patient.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase());
    return matchDoctor && matchStatus && matchSearch;
  });

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    return sortOption === 'recent'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const activeCount = prescriptions.filter(p => p.status === 'Active').length;
  const completedCount = prescriptions.filter(p => p.status === 'Completed').length;
  const medicineCounts = prescriptions.reduce((acc, p) => {
    acc[p.medicine] = (acc[p.medicine] || 0) + 1;
    return acc;
  }, {});
  const topMedicine = Object.entries(medicineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">💊 Prescriptions</h1>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search patient/doctor"
          className="p-2 border rounded w-full"
        />
        <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)} className="p-2 border rounded">
          <option>All</option>
          {uniqueDoctors.map(doc => (
            <option key={doc}>{doc}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded">
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="p-2 border rounded">
          <option value="recent">Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-100 rounded text-center">📄 Active: {activeCount}</div>
        <div className="p-4 bg-green-100 rounded text-center">✅ Completed: {completedCount}</div>
        <div className="p-4 bg-purple-100 rounded text-center">🥇 Top Medicine: {topMedicine}</div>
      </div>
            {/* Table View */}
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white shadow rounded mt-4 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Medicine</th>
              <th>Category</th>
              <th>Dosage</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Refill</th>
              <th>Notes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrescriptions.map((pres, i) => (
              <tr key={pres.id} className="border-t hover:bg-gray-50 text-center">
                <td className="px-2 py-1 font-medium">{pres.id}</td>
                <td>{pres.patient}</td>
                <td>{pres.doctor}</td>
                <td>{pres.medicine}</td>
                <td>{pres.category}</td>
                <td>{pres.dosage}</td>
                <td>{pres.duration}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded ${
                    pres.status === 'Active'
                      ? 'bg-blue-200 text-blue-900'
                      : pres.status === 'Completed'
                      ? 'bg-green-200 text-green-900'
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {pres.status}
                  </span>
                </td>
                <td>{pres.refillNeeded ? '🔁' : '—'}</td>
                <td title={pres.notes}>
                  <span className="line-clamp-1">{pres.notes}</span>
                </td>
                <td>{new Date(pres.createdAt).toLocaleDateString()}</td>
                <td className="flex justify-center gap-1 flex-wrap py-1">
                  {['Active', 'Completed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() =>
                        setPrescriptions(prev =>
                          prev.map(item =>
                            item.id === pres.id ? { ...item, status } : item
                          )
                        )
                      }
                      className={`text-xs px-2 py-1 rounded ${
                        pres.status === status ? 'bg-gray-800 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPrescriptions(prev =>
                        prev.filter(item => item.id !== pres.id)
                      )
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
      </div>
            {/* Export & Integration UI */}
      <div className="mt-6 bg-gray-50 border-l-4 border-gray-300 p-4 text-xs rounded space-y-2">
        📥 <span className="font-semibold">Export:</span> CSV/PDF download available in integration tier.
        <br />
        🖨️ <span className="font-semibold">Auto-print:</span> layout adapts for physical records.
        <br />
        📧 <span className="font-semibold">Notification triggers:</span> on refill flag or status change.
        <br />
        🧾 <span className="font-semibold">Audit Trail:</span> view who edited what with timestamps.
        <br />
        🔐 <span className="font-semibold">Role access:</span> visible only to assigned doctor/admin. (simulated)
      </div>

      {/* Audit Trail Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">📜 Edit History Snapshot</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white shadow rounded text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">Prescription ID</th>
                <th>Changed By</th>
                <th>Field</th>
                <th>From → To</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.slice(0, 10).map(pres =>
                pres.auditTrail.map((entry, i) => (
                  <tr key={`${pres.id}-${i}`} className="border-t hover:bg-gray-50 text-center">
                    <td className="px-2 py-1">{pres.id}</td>
                    <td>{entry.changedBy}</td>
                    <td>{entry.field}</td>
                    <td>{entry.from} → {entry.to}</td>
                    <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-based Access Simulation */}
      <div className="mt-6 text-xs text-gray-600 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        🧑‍⚕️ <span className="font-semibold">Simulated User Role:</span> Doctor
        <br />
        🔐 Only prescriptions assigned to this doctor will appear editable. (Advanced access control pending integration)
      </div>
            {/* Pagination Controls */}
      <div className="mt-8 flex justify-between items-center text-sm">
        <span>🔢 Showing {sortedPrescriptions.length} of {prescriptions.length}</span>
        <button
          onClick={() => setPrescriptions(prev => prev.sort(() => 0.5 - Math.random()))}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🔄 Shuffle Prescriptions
        </button>
      </div>

      {/* Quick Insight Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded text-sm">
          📌 <span className="font-semibold">Multiple prescriptions:</span>{' '}
          {prescriptions.filter((p, i, arr) => arr.filter(x => x.patient === p.patient).length > 1).length} entries
        </div>
        <div className="p-4 bg-gray-100 rounded text-sm">
          🧑‍⚕️ <span className="font-semibold">Top Doctor:</span>{' '}
          {
            Object.entries(
              prescriptions.reduce((acc, p) => {
                acc[p.doctor] = (acc[p.doctor] || 0) + 1;
                return acc;
              }, {})
            ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
          }
        </div>
      </div>

      {/* Toast-style Action Feedback (visual simulation) */}
      <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-900 px-4 py-2 rounded shadow-md text-sm">
        ✅ Action completed successfully
      </div>
    </div>
  );
};

export default Prescriptions;



