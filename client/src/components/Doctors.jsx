import React, { useState, useEffect } from 'react';

const specializations = ['All', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician'];
const generateFakeDoctors = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Dr. ${['John', 'Emma', 'Olivia', 'Noah', 'Liam', 'Ava'][i % 6]} ${['Smith', 'Brown', 'Lee', 'Patel', 'Khan'][i % 5]}`,
    specialization: specializations[(i % 4) + 1],
    experience: Math.floor(Math.random() * 15) + 5,
    rating: (Math.random() * 2 + 3).toFixed(1),
    available: Math.random() > 0.3,
  }));

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    setDoctors(generateFakeDoctors());
  }, []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      (filter === 'All' || doc.specialization === filter) &&
      doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative z-0 bg-gradient-to-tr from-blue-50 via-white to-indigo-100 text-gray-800">
      {/* ✨ Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse left-10 top-10" />
        <div className="absolute w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-ping right-10 top-20" />
        <div className="absolute w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-bounce left-1/2 bottom-10" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Doctors</h1>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search doctor by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 w-full md:w-1/2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          >
            {specializations.map((spec) => (
              <option key={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* 🧑‍⚕️ Doctor Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 relative overflow-hidden border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold group-hover:text-indigo-600 transition">
                  {doc.name}
                </h2>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    doc.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {doc.available ? 'Available' : 'Offline'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Specialist: {doc.specialization}</p>
              <p className="text-sm text-gray-600">Experience: {doc.experience} yrs</p>
              <p className="text-sm text-yellow-600 mt-1">⭐ {doc.rating}/5</p>

              <button
                className="mt-4 w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition"
                onClick={() => setSelectedDoctor(doc)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* 📅 Booking Modal */}
        {selectedDoctor && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={() => setSelectedDoctor(null)}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2">Booking: {selectedDoctor.name}</h3>
              <p className="text-gray-600 mb-4">{selectedDoctor.specialization}</p>
              <p className="text-sm mb-2">Select your preferred time slot (simulation)</p>
              <input
                type="datetime-local"
                className="w-full mb-4 px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

