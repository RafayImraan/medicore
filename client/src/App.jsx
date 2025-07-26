import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components + Pages
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/services";
import Departments from "./components/Departments";
import Emergency from "./components/Emergency";
import Doctors from "./components/Doctors";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./pages/BookAppointment";
import AppointmentHistory from "./pages/AppointmentHistory";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import AllPatients from "./pages/Dashboard/AllPatients";
import Schedule from "./pages/Dashboard/Schedule";
import LabResults from "./pages/Dashboard/LabResults";
import Prescriptions from "./pages/Dashboard/Prescriptions";
import StaffChat from "./pages/Dashboard/StaffChat";
import Billing from "./pages/Dashboard/Billing";
import Pharmacy from "./pages/Pharmacy";
import Diagnostic from "./pages/Diagnostic";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-animated bg-[length:400%_400%] animate-gradient">
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<Services />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/diagnostic" element={<Diagnostic />} />

          {/* Protected */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          <Route path="/dashboard/patientdashboard" element={<PatientDashboard />} />
          <Route path="/doctor/patients" element={<AllPatients />} />
          <Route path="/doctor/schedule" element={<Schedule />} />
          <Route path="/doctor/lab-results" element={<LabResults />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
          <Route path="/doctor/chat" element={<StaffChat />} />
          <Route path="/doctor/billing" element={<Billing />} />
          <Route
            path="/appointment-history"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
