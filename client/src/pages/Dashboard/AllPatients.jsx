import React, { useEffect, useState } from 'react';

const diseases = [
  "Diabetes", "Hypertension", "Asthma", "Bronchitis", "Pneumonia",
  "Arthritis", "Cancer", "Migraine", "Anxiety", "Depression",
  "COVID-19", "Tuberculosis", "Ulcer", "Heart Disease", "Allergies"
];

const statuses = ["Stable", "Critical", "Recovering", "Discharged"];

function getRandomPatient(id) {
  const gender = ["Male", "Female", "Other"][Math.floor(Math.random() * 3)];
  const name = gender === "Male"
    ? `Mr. ${["Ali", "John", "Usman", "Zaid", "Ahmad"][Math.floor(Math.random() * 5)]}`
    : `Ms. ${["Ayesha", "Emma", "Zara", "Hira", "Maria"][Math.floor(Math.random() * 5)]}`;
  return {
    id: id,
    name: name,
    age: Math.floor(Math.random() * 60) + 18,
    gender,
    disease: diseases[Math.floor(Math.random() * diseases.length)],
    admissionDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
  };
}

export default function AllPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }, (_, idx) => getRandomPatient(1000 + idx));
    setPatients(generated);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={patient.image} alt={patient.name} className="w-full h-40 object-cover"/>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
              <p><strong>ID:</strong> {patient.id}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Disease:</strong> {patient.disease}</p>
              <p><strong>Status:</strong> <span className={`font-medium ${patient.status === 'Critical' ? 'text-red-600' : 'text-green-600'}`}>{patient.status}</span></p>
              <p><strong>Admitted:</strong> {patient.admissionDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
