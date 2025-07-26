import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();
  const { userRole, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-green-900 text-white shadow z-50 sticky top-0">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          Medicore
        </Link>

        {/* Center Links */}
        <div className="space-x-6 hidden md:flex">
          <Link to="/" className="hover:text-green-300">Home</Link>
          <Link to="/services" className="hover:text-green-300">Services</Link>
          <Link to="/departments" className="hover:text-green-300">Departments</Link>
          <Link to="/doctors" className="hover:text-green-300">Doctors</Link>
          <Link to="/contact" className="hover:text-green-300">Contact</Link>
          <Link to="/book-appointment" className="hover:text-green-300">Book Appointment</Link>
          
          {userRole === "patient" && (
            <Link to="/appointment-history" className="hover:text-green-300">
              My Appointments
            </Link>
          )}

          {userRole === "doctor" && (
            <Link to="/doctor-dashboard" className="hover:text-green-300">
              Doctor Dashboard
            </Link>
          )}

          {userRole === "admin" && (
            <Link to="/admin-dashboard" className="hover:text-green-300">
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {userRole ? (
            <button
              onClick={logout}
              className="text-sm px-3 py-1 bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-sm px-4 py-2 bg-green-800 rounded hover:bg-green-700"
              >
                Login / Register
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg z-50">
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
