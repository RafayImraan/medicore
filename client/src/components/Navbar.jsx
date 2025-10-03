import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();
  const location = useLocation();
  const { userRole, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-green-900 text-white shadow z-50 sticky top-0">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide">
            Medicore
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden lg:flex space-x-6">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-green-300 transition-colors">Services</Link>
            <Link to="/departments" className="hover:text-green-300 transition-colors">Departments</Link>
            <Link to="/doctors" className="hover:text-green-300 transition-colors">Doctors</Link>
            <Link to="/contact" className="hover:text-green-300 transition-colors">Contact</Link>
            <Link to="/book-appointment" className="hover:text-green-300 transition-colors">Book Appointment</Link>

            {userRole === "patient" && (
              <Link to="/appointment-history" className="hover:text-green-300 transition-colors">
                My Appointments
              </Link>
            )}

            {userRole === "doctor" && (
              <Link to="/dashboard/doctor" className="hover:text-green-300 transition-colors">
                Doctor Dashboard
              </Link>
            )}

            {userRole === "admin" && (
              <Link to="/dashboard/admin" className="hover:text-green-300 transition-colors">
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-green-800 rounded transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {userRole ? (
                <button
                  onClick={logout}
                  className="text-sm px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-sm px-4 py-2 bg-green-800 rounded hover:bg-green-700 transition-colors"
                  >
                    Login / Register
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50 border">
                      <Link
                        to="/login"
                        className="block px-4 py-3 hover:bg-gray-100 rounded-t-lg transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 hover:bg-gray-100 rounded-b-lg transition-colors"
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden mt-4 pb-4 border-t border-green-800 pt-4"
          >
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link
                to="/departments"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Departments
              </Link>
              <Link
                to="/doctors"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Doctors
              </Link>
              <Link
                to="/contact"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                to="/book-appointment"
                className="hover:text-green-300 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Book Appointment
              </Link>

              {userRole === "patient" && (
                <Link
                  to="/appointment-history"
                  className="hover:text-green-300 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  My Appointments
                </Link>
              )}

              {userRole === "doctor" && (
                <Link
                  to="/dashboard/doctor"
                  className="hover:text-green-300 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Doctor Dashboard
                </Link>
              )}

              {userRole === "admin" && (
                <Link
                  to="/dashboard/admin"
                  className="hover:text-green-300 transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-green-800">
                {userRole ? (
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left text-sm px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block text-center text-sm px-4 py-2 bg-green-800 rounded hover:bg-green-700 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center text-sm px-4 py-2 bg-green-700 rounded hover:bg-green-600 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
