import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const patientName = "John Doe"; // replace with real logged-in name later

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/patient/${patientName}`);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Appointment History</h2>
      <div className="space-y-4">
        {appointments.map((a) => (
          <div key={a._id} className="p-4 border rounded shadow-sm">
            <p><strong>Doctor:</strong> {a.doctorName}</p>
            <p><strong>Date:</strong> {a.date}</p>
            <p><strong>Time:</strong> {a.time}</p>
            <p><strong>Status:</strong> {a.status}</p>
          </div>
        ))}
        {appointments.length === 0 && <p>No appointments found.</p>}
      </div>
    </div>
  );
};

export default AppointmentHistory;
