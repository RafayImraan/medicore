import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components + Pages
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
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
import PatientLabResults from "./pages/Dashboard/PatientLabResults";
import PatientPrescriptions from "./pages/Dashboard/PatientPrescriptions";
import PatientBilling from "./pages/Dashboard/PatientBilling";
import AllPatients from "./pages/Dashboard/AllPatients";
import Schedule from "./pages/Dashboard/Schedule";
import LabResults from "./pages/Dashboard/LabResults";
import StaffChat from "./pages/Dashboard/StaffChat";
import Billing from "./pages/Dashboard/Billing";
import Pharmacy from "./pages/Pharmacy";
import Diagnostic from "./pages/Diagnostic";
import HomeHealthcare from "./pages/HomeHealthcare";

import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-animated bg-[length:400%_400%] animate-gradient">
        <Navbar />
        <ErrorBoundary>
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
          <Route path="/home-healthcare" element={<HomeHealthcare />} />

          {/* Protected */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/doctor" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/patient" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/lab-results" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientLabResults />
            </ProtectedRoute>
          } />
          <Route path="/patient/prescriptions" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientPrescriptions />
            </ProtectedRoute>
          } />
          <Route path="/patient/billing" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientBilling />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <AllPatients />
            </ProtectedRoute>
          } />
          <Route path="/doctor/schedule" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="/doctor/lab-results" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <LabResults />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/chat" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <StaffChat />
            </ProtectedRoute>
          } />
          <Route path="/doctor/billing" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Billing />
            </ProtectedRoute>
          } />
          <Route
            path="/appointment-history"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentHistory />
              </ProtectedRoute>
            }
          />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
