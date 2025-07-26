import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faker } from "@faker-js/faker";
import { Particles } from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import {
  CalendarDays, FlaskConical, CreditCard,
  User2, FileText, HeartPulse
} from "lucide-react";

const generateAppointments = () => {
  return Array.from({ length: 3 }).map(() => ({
    date: faker.date.soon(30).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    time: faker.date.soon(1).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    doctor: `Dr. ${faker.name.firstName()} ${faker.name.lastName()}`,
    dept: faker.helpers.arrayElement(["Cardiology", "Radiology", "Nutrition", "Neurology"]),
    status: faker.helpers.arrayElement(["Confirmed", "Pending", "Cancelled"]),
  }));
};

const generateLabReports = () => {
  return Array.from({ length: 3 }).map(() => ({
    title: faker.helpers.arrayElement(["CBC Test", "Chest X-Ray", "MRI Scan", "Blood Sugar"]),
    date: faker.date.past(1).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    status: faker.helpers.arrayElement(["Ready", "Reviewed", "Pending"]),
  }));
};

const generatePrescriptions = () => {
  return Array.from({ length: 3 }).map(() => ({
    name: `${faker.helpers.arrayElement(["Amlodipine", "Atorvastatin", "Metformin", "Lisinopril"])} ${faker.number.int({ min: 5, max: 20 })}mg`,
    status: faker.helpers.arrayElement(["Active", "Expired", "Pending"]),
  }));
};

const generateBilling = () => {
  return Array.from({ length: 3 }).map(() => ({
    id: `#INV-${faker.datatype.number({ min: 3000, max: 3999 })}`,
    service: faker.helpers.arrayElement(["Cardiology Checkup", "X-Ray Chest", "MRI Scan", "Blood Test"]),
    amount: `Rs. ${faker.datatype.number({ min: 1000, max: 5000 })}`,
    status: faker.helpers.arrayElement(["Paid", "Unpaid"]),
    date: faker.date.past(1).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
  }));
};

const PatientDashboard = () => {
  const [username] = useState("Abdul Shafiq");
  const [appointment] = useState("Mon, 22 July @ 10:00 AM");
  const [healthFlag] = useState("Chronic Condition: Hypertension");

  const [appointments, setAppointments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billing, setBilling] = useState([]);

  useEffect(() => {
    setAppointments(generateAppointments());
    setLabReports(generateLabReports());
    setPrescriptions(generatePrescriptions());
    setBilling(generateBilling());
  }, []);

  return (
    <section className="relative min-h-screen text-white" aria-label="Patient Portal Dashboard">
      {/* 🌌 Particle Background */}
      <Particles
        options={{
          background: { color: "#0f172a" },
          particles: {
            number: { value: 60 },
            size: { value: 2 },
            color: { value: "#38bdf8" },
            move: { enable: true, speed: 1 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* 🧑‍⚕️ Header */}
      <div className="relative z-20 max-w-screen-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold mb-2">Welcome, {username}</h1>
        <p className="text-lg text-gray-300 mb-1">
          Next Appointment: <strong>{appointment}</strong>
        </p>
        <p className="text-sm text-red-400 italic">⚠️ {healthFlag}</p>
      </div>

      {/* 🔷 Core Modules */}
      <div className="relative z-20 max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">

        {/* 🗓️ Appointments */}
        <div className="bg-white/90 rounded-lg p-4 text-gray-800 shadow backdrop-blur" aria-label="Appointments">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="text-green-700" />
            <h3 className="font-semibold">Appointments</h3>
          </div>
          <ul className="text-sm space-y-2">
            {appointments.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span>{a.date} • {a.time}</span>
                <span className="text-gray-500">{a.doctor}</span>
              </li>
            ))}
          </ul>
          <Link to="/appointments" className="text-blue-700 hover:underline mt-2 inline-block">View All Appointments →</Link>
        </div>

        {/* 🧪 Lab Reports */}
        <div className="bg-white/90 rounded-lg p-4 text-gray-800 shadow backdrop-blur" aria-label="Lab Reports">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="text-green-700" />
            <h3 className="font-semibold">Lab Reports</h3>
          </div>
          <ul className="text-sm space-y-2">
            {labReports.map((r, i) => (
              <li key={i} className="flex justify-between">
                <span>{r.title}</span>
                <span className="text-gray-500">{r.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/lab-reports" className="text-blue-700 hover:underline mt-2 inline-block">View All Lab Reports →</Link>
        </div>

        {/* 💊 Prescriptions */}
        <div className="bg-white/90 rounded-lg p-4 text-gray-800 shadow backdrop-blur" aria-label="Prescriptions">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-green-700" />
            <h3 className="font-semibold">Prescriptions</h3>
          </div>
          <ul className="text-sm space-y-2">
            {prescriptions.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-gray-500">{p.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/prescriptions" className="text-blue-700 hover:underline mt-2 inline-block">View All Prescriptions →</Link>
        </div>

        {/* 💳 Billing */}
        <div className="bg-white/90 rounded-lg p-4 text-gray-800 shadow backdrop-blur" aria-label="Billing">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-green-700" />
            <h3 className="font-semibold">Billing</h3>
          </div>
          <ul className="text-sm space-y-2">
            {billing.map((b, i) => (
              <li key={i} className="flex justify-between">
                <span>{b.service}</span>
                <span className={`font-medium ${b.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/billing" className="text-blue-700 hover:underline mt-2 inline-block">View All Billing →</Link>
        </div>

        {/* 👤 Profile */}
        <div className="bg-white/90 rounded-lg p-4 text-gray-800 shadow backdrop-blur" aria-label="Patient Profile">
          <div className="flex items-center gap-2 mb-2">
            <User2 className="text-green-700" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <ul className="text-sm space-y-1">
            <li>Name: {username}</li>
            <li>Patient ID: PKH-009812</li>
            <li>Gender: Male</li>
            <li>Blood Group: B+</li>
            <li>Mobile: 0300-XXX-XXXX</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default PatientDashboard;
