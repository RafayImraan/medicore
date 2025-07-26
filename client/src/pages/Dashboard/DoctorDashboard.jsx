import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';


const generateFakePatients = () =>
  Array.from({ length: 5 }, () => ({
    name: faker.person.fullName(),
    age: faker.number.int({ min: 20, max: 80 }),
    gender: faker.person.sex(),
    photo: faker.image.avatar(),
    tags: [faker.lorem.word(), faker.lorem.word()],
    nextAppointment: faker.date.future().toLocaleDateString(),
  }));

const generateFakeAppointments = () =>
  Array.from({ length: 5 }, () => ({
    date: faker.date.soon().toLocaleDateString(),
    patient: faker.person.fullName(),
    status: faker.helpers.arrayElement(['Confirmed', 'Pending', 'Cancelled']),
  }));

const generateVitals = () =>
  Array.from({ length: 4 }, () => ({
    patient: faker.person.fullName(),
    bp: `${faker.number.int({ min: 100, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
    sugar: faker.number.int({ min: 70, max: 180 }),
    temp: `${faker.number.float({ min: 97, max: 100 }).toFixed(1)}°F`,
    weight: `${faker.number.int({ min: 50, max: 100 })}kg`,
  }));

const generateFeedback = () =>
  Array.from({ length: 4 }, () => ({
    patient: faker.person.fullName(),
    rating: faker.number.int({ min: 3, max: 5 }),
    comment: faker.lorem.sentence(),
  }));

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPatients(generateFakePatients());
    setAppointments(generateFakeAppointments());
    setVitals(generateVitals());
    setFeedback(generateFeedback());
  }, []);

  const handleSendChat = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'You', text: chatInput }]);
      setChatInput('');
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-600 text-white p-3 rounded mb-4 animate-pulse font-bold text-center">
        🚨 Emergency: Critical patient admitted to ER!
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Patients..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filteredPatients.map((patient, i) => (
          <div key={i} className="border rounded shadow p-4 bg-white dark:bg-gray-800">
            <img src={patient.photo} className="w-12 h-12 rounded-full" alt="avatar" />
            <h3 className="text-xl font-semibold mt-2">{patient.name}</h3>
            <p>{patient.gender}, Age: {patient.age}</p>
            <p>Next: {patient.nextAppointment}</p>
            <div className="flex gap-2 mt-2">
              {patient.tags.map((tag, j) => (
                <span key={j} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts (Fake Static Display) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">📈 Bar Chart: 24 Patients/week</div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded">🧪 Pie Chart: 65% Blood, 35% Urine Tests</div>
        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded">⏱️ Line Chart: Working hours up 10%</div>
      </div>

      {/* Appointment Calendar */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">📅 Appointments</h2>
        <ul className="grid md:grid-cols-3 gap-3">
          {appointments.map((appt, i) => (
            <li key={i} className="p-3 border rounded bg-white dark:bg-gray-800">
              <p><strong>{appt.date}</strong></p>
              <p>{appt.patient}</p>
              <span className={`text-sm font-semibold ${appt.status === 'Confirmed' ? 'text-green-600' : appt.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                {appt.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Vitals Monitoring */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Vitals Monitoring</h2>
        <table className="w-full border rounded bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2">Patient</th>
              <th>BP</th>
              <th>Sugar</th>
              <th>Temp</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {vitals.map((v, i) => (
              <tr key={i} className="text-center border-t">
                <td>{v.patient}</td>
                <td>{v.bp}</td>
                <td>{v.sugar}</td>
                <td>{v.temp}</td>
                <td>{v.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Prescription Writer */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Quick Prescription</h2>
        <form className="grid md:grid-cols-4 gap-4">
          <input type="text" placeholder="Patient" className="p-2 border rounded" />
          <input type="text" placeholder="Medicine" className="p-2 border rounded" />
          <input type="text" placeholder="Dose" className="p-2 border rounded" />
          <input type="text" placeholder="Duration" className="p-2 border rounded" />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded col-span-full md:col-span-1 hover:bg-indigo-700 transition">Save & Send</button>
        </form>
      </div>

      {/* Feedback */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Patient Feedback</h2>
        {feedback.map((f, i) => (
          <div key={i} className="p-3 border rounded mb-2 bg-white dark:bg-gray-800">
            <p><strong>{f.patient}</strong>: ⭐ {f.rating}</p>
            <p>{f.comment}</p>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Live Chat</h2>
        <div className="h-40 border rounded overflow-y-auto bg-white dark:bg-gray-800 p-2 mb-2">
          {chatMessages.map((msg, i) => (
            <div key={i}><strong>{msg.sender}:</strong> {msg.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendChat}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 text-center">
        <Link
          to="/doctor/patients"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          All Patients
        </Link>
        <Link
          to="/doctor/schedule"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          Schedule
        </Link>
        <Link
          to="/doctor/lab-results"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          Lab Results
        </Link>
        <Link
          to="/doctor/prescriptions"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          Prescriptions
        </Link>
        <Link
          to="/doctor/chat"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          Staff Chat
        </Link>
        <Link
          to="/doctor/billing"
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition block"
        >
          Billing
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;
