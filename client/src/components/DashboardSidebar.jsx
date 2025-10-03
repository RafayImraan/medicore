import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardSidebar = () => {
  const location = useLocation();
  const { userRole, logout } = useAuth();

const commonLinks = [
    { label: "Dashboard Home", path: "/dashboard/doctor" },
  ];

  const adminLinks = [
    { label: "Manage Users", path: "/admin/users" },
    { label: "Reports", path: "/admin/reports" },
  ];

  const doctorLinks = [
    { label: "All Patients", path: "/doctor/patients" },
    { label: "Schedule", path: "/doctor/schedule" },
    { label: "Lab Results", path: "/doctor/lab-results" },
    { label: "Prescriptions", path: "/doctor/prescriptions" },
    { label: "Staff Chat", path: "/doctor/chat" },
    { label: "Billing", path: "/doctor/billing" },
  ];

  const patientLinks = [
    { label: "My Records", path: "/patient/records" },
    { label: "Prescriptions", path: "/patient/prescriptions" },
  ];

  const extraLinks =
    userRole === "admin"
      ? adminLinks
      : userRole === "doctor"
      ? doctorLinks
      : patientLinks;

  const allLinks = [...commonLinks, ...extraLinks];

  return (
    <aside className="bg-green-800 text-white w-full md:w-64 min-h-screen px-4 py-6 space-y-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        {allLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-3 py-2 rounded hover:bg-green-700 ${
              location.pathname === link.path ? "bg-green-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
      >
        Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
