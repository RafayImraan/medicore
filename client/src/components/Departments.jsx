import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const departmentData = [
  {
    name: "Cardiology",
    icon: "❤️",
    head: "Dr. Ahsan Malik",
    description: "Specialized care for heart conditions including ECG, angiography, and cardiac surgery.",
    timings: "Mon–Sat: 9am–5pm",
  },
  {
    name: "Neurology",
    icon: "🧠",
    head: "Dr. Sara Khan",
    description: "Diagnosis and treatment of brain, spine, and nerve disorders including stroke and epilepsy.",
    timings: "Mon–Fri: 10am–4pm",
  },
  {
    name: "Pediatrics",
    icon: "🧒",
    head: "Dr. Imran Siddiqui",
    description: "Comprehensive child care including immunizations, growth monitoring, and pediatric emergencies.",
    timings: "Daily: 8am–6pm",
  },
  {
    name: "Radiology",
    icon: "🩻",
    head: "Dr. Nida Ahmed",
    description: "Advanced imaging services including X-ray, MRI, CT scan, and ultrasound.",
    timings: "Mon–Sat: 8am–8pm",
  },
  {
    name: "Oncology",
    icon: "🎗️",
    head: "Dr. Faisal Raza",
    description: "Cancer diagnosis, chemotherapy, radiation therapy, and palliative care.",
    timings: "Mon–Fri: 9am–3pm",
  },
  {
    name: "Orthopedics",
    icon: "🦴",
    head: "Dr. Rabia Shah",
    description: "Bone and joint care including fractures, arthritis, and joint replacement surgeries.",
    timings: "Mon–Sat: 10am–6pm",
  },
];

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState(departmentData);

  useEffect(() => {
    const filtered = departmentData.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(filtered);
    if (searchTerm.length > 0) {
      toast.success(`${filtered.length} department(s) found`);
    }
  }, [searchTerm]);

  return (
    <div className="w-full text-gray-900 dark:text-white transition-colors duration-500">
      {/* Hero Banner */}
      <section className="relative min-h-[60vh] animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:400%_400%]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-24 text-white text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow">Hospital Departments</h1>
          <p className="text-lg max-w-2xl mx-auto drop-shadow">
            Explore our specialized medical departments offering compassionate and expert care.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4">
          <input
            type="text"
            aria-label="Search Departments"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-5 py-3 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-blue-500 shadow-lg transition"
          />
        </div>
      </section>

      {/* Department Grid */}
      <section className="pb-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-300 group"
                role="region"
                aria-labelledby={`dept-${index}`}
              >
                <div className="text-5xl mb-4">{dept.icon}</div>
                <h2 id={`dept-${index}`} className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {dept.name}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{dept.description}</p>
                <p className="text-sm"><strong>Head:</strong> {dept.head}</p>
                <p className="text-sm"><strong>Timings:</strong> {dept.timings}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-12 bg-green-700 dark:bg-green-800 text-white text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Emergency Services Available 24/7</h2>
          <p className="text-md mb-6">For urgent care, trauma, and critical cases, our emergency department is always ready.</p>
          <a
            href="#"
            className="inline-block bg-white text-green-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition shadow"
          >
            View Emergency Info
          </a>
        </div>
      </section>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg z-50"
        aria-label="Scroll to top"
      >
        ⬆️
      </button>
    </div>
  );
};

export default Departments;
