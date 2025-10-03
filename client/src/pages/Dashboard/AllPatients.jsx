import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { commonAPI } from "@/services/api";


const statuses = [
  { label: "Stable", color: "green", icon: "✔️" },
  { label: "Critical", color: "red", icon: "⚠️" },
  { label: "Recovering", color: "yellow", icon: "🔄" },
  { label: "Discharged", color: "gray", icon: "🏠" },
];

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function exportToCSV(patients) {
  const headers = [
    "ID",
    "Name",
    "Age",
    "Gender",
    "Disease",
    "Admission Date",
    "Status",
  ];
  const rows = patients.map((p) => {
    const age = p?.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : 'N/A';
    const disease = p?.medicalHistory?.[0]?.condition || 'N/A';
    const admissionDate = p?.createdAt;
    const status = 'Active';
    return [
      p?._id || '',
      p?.userId?.name || '',
      age,
      p?.gender || '',
      disease,
      formatDate(admissionDate),
      status,
    ];
  });
  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "patients.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [diseaseFilter, setDiseaseFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedPatients, setSelectedPatients] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    userEmail: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
    emergencyContact: "",
    medicalHistory: [],
    allergies: [],
    insurance: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await commonAPI.getAllPatients();
        setPatients(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients");
        // Use fallback data if API fails
        setPatients([
          {
            id: "1",
            name: "John Doe",
            age: 45,
            gender: "Male",
            disease: "Hypertension",
            admissionDate: "2024-01-15",
            status: "Stable",
          },
          {
            id: "2",
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            disease: "Diabetes",
            admissionDate: "2024-02-20",
            status: "Recovering",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    let filtered = patients;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((p) => {
        if (!p || typeof p !== 'object') return false;
        const name = p.userId?.name ? p.userId.name.toLowerCase() : '';
        const disease = p.medicalHistory?.[0]?.condition ? p.medicalHistory[0].condition.toLowerCase() : '';
        const status = 'Active'; // Default status since not in model
        const gender = p.gender ? p.gender.toLowerCase() : '';
        return name.includes(lowerSearch) || disease.includes(lowerSearch) || status.includes(lowerSearch) || gender.includes(lowerSearch);
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((p) => 'Active' === statusFilter); // Default status
    }

    if (genderFilter !== "All") {
      filtered = filtered.filter((p) => p && p.gender === genderFilter);
    }

    if (diseaseFilter !== "All") {
      filtered = filtered.filter((p) => p && p.medicalHistory?.[0]?.condition === diseaseFilter);
    }

    if (dateRange.from) {
      filtered = filtered.filter(
        (p) => p && p.createdAt && new Date(p.createdAt) >= new Date(dateRange.from)
      );
    }

    if (dateRange.to) {
      filtered = filtered.filter(
        (p) => p && p.createdAt && new Date(p.createdAt) <= new Date(dateRange.to)
      );
    }

    if (sortConfig) {
      filtered = filtered.slice().sort((a, b) => {
        if (!a || !b) return 0;
        let aKey, bKey;
        if (sortConfig.key === "name") {
          aKey = a.userId?.name || '';
          bKey = b.userId?.name || '';
        } else if (sortConfig.key === "age") {
          aKey = a.dateOfBirth ? new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear() : 0;
          bKey = b.dateOfBirth ? new Date().getFullYear() - new Date(b.dateOfBirth).getFullYear() : 0;
        } else if (sortConfig.key === "admissionDate") {
          aKey = a.createdAt ? new Date(a.createdAt) : new Date(0);
          bKey = b.createdAt ? new Date(b.createdAt) : new Date(0);
        } else if (sortConfig.key === "status") {
          aKey = 'Active';
          bKey = 'Active';
        } else {
          aKey = a[sortConfig.key] || '';
          bKey = b[sortConfig.key] || '';
        }
        if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [patients, search, statusFilter, genderFilter, diseaseFilter, dateRange, sortConfig]);

  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSelectPatient(id) {
    const newSet = new Set(selectedPatients);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedPatients(newSet);
  }

  function toggleSelectAll() {
    if (selectedPatients.size === paginatedPatients.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(paginatedPatients.map((p) => p?._id).filter(Boolean)));
    }
  }

  function changeSort(key) {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  }

  if (loading) return <LoadingSpinner message="Loading patients..." />;
  if (error) return <div className="text-red-600">Error loading patients.</div>;

  const handleAddPatient = async () => {
    if (!newPatient.userEmail || !newPatient.dateOfBirth || !newPatient.gender || !newPatient.phone) {
      alert("Please fill in required fields: User Email, Date of Birth, Gender, and Phone");
      return;
    }

    try {
      setSubmitting(true);
      await commonAPI.createPatient(newPatient);
      setShowAddModal(false);
      setNewPatient({
        userEmail: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        address: "",
        emergencyContact: "",
        medicalHistory: [],
        allergies: [],
        insurance: ""
      });
      // Refresh patients list
      const data = await commonAPI.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Patients</h1>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          + Add Patient
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
              aria-label="Global search"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered"
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="select select-bordered"
              aria-label="Filter by gender"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Disease"
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="input input-bordered w-full"
              aria-label="Filter by disease"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="dateFrom" className="block font-medium">
                Admission Date From
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
                className="input input-bordered w-full"
                aria-label="Admission date from"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block font-medium">
                Admission Date To
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
                className="input input-bordered w-full"
                aria-label="Admission date to"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all patients"
                  checked={
                    selectedPatients.size === paginatedPatients.length &&
                    paginatedPatients.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th
                className="cursor-pointer"
                onClick={() => changeSort("name")}
                aria-sort={
                  sortConfig.key === "name"
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Name
              </th>
              <th
                className="cursor-pointer"
                onClick={() => changeSort("age")}
                aria-sort={
                  sortConfig.key === "age"
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Age
              </th>
              <th>Gender</th>
              <th>Disease</th>
              <th
                className="cursor-pointer"
                onClick={() => changeSort("admissionDate")}
                aria-sort={
                  sortConfig.key === "admissionDate"
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Admission Date
              </th>
              <th
                className="cursor-pointer"
                onClick={() => changeSort("status")}
                aria-sort={
                  sortConfig.key === "status"
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Status
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.length === 0 ? (
              <tr key="no-patients-found">
                <td colSpan={8} className="text-center py-4">
                  No patients found.
                </td>
              </tr>
            ) : (
              paginatedPatients.map((patient, index) => {
                const age = patient?.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A';
                const disease = patient?.medicalHistory?.[0]?.condition || 'N/A';
                const admissionDate = patient?.createdAt;
                const status = 'Active';
                return (
                  <tr key={patient?._id || `patient-${index}`} className="hover:bg-gray-50">
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select patient ${patient?.userId?.name || 'Unknown'}`}
                        checked={selectedPatients.has(patient?._id)}
                        onChange={() => toggleSelectPatient(patient?._id)}
                      />
                    </td>
                    <td>{patient?.userId?.name || 'N/A'}</td>
                    <td>{age}</td>
                    <td>{patient?.gender || 'N/A'}</td>
                    <td>{disease}</td>
                    <td>{formatDate(admissionDate)}</td>
                    <td>
                      <span
                        className={`font-semibold text-${statuses.find(
                          (s) => s.label === status
                        )?.color || 'gray'}-600`}
                        aria-label={`Status: ${status}`}
                      >
                        {statuses.find((s) => s.label === status)?.icon || ''}{" "}
                        {status}
                      </span>
                    </td>
                    <td>
                      <Button variant="outline" size="sm" title="Edit Patient">
                        ✏️
                      </Button>{" "}
                      <Button variant="destructive" size="sm" title="Delete Patient">
                        🗑️
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="select select-bordered"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button onClick={() => exportToCSV(filteredPatients)} variant="secondary">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Patient</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleAddPatient} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newPatient.userEmail}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, userEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter user email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        value={newPatient.bloodGroup}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, bloodGroup: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        type="text"
                        value={newPatient.emergencyContact}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={newPatient.address}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Medical Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                    <textarea
                      value={newPatient.medicalHistory.join(', ')}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        medicalHistory: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter medical history (comma separated)"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple conditions with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <textarea
                      value={newPatient.allergies.join(', ')}
                      onChange={(e) => setNewPatient(prev => ({
                        ...prev,
                        allergies: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter allergies (comma separated)"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple allergies with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                    <input
                      type="text"
                      value={newPatient.insurance}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, insurance: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter insurance information"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    "Add Patient"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
