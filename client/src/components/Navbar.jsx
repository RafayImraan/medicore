import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaCrown, FaGem } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState('dark'); // Add theme state for dark/light mode
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();
  const location = useLocation();
  const { userRole, logout } = useAuth();
  let lastScrollY = window.scrollY;

  // Scroll effects: slide down/up on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setHidden(window.scrollY > lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside dropdown/mobile menu
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

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/services", label: "Services", icon: "⚕️" },
    { to: "/departments", label: "Departments", icon: "🏥" },
    { to: "/doctors", label: "Doctors", icon: "👨‍⚕️" },
    { to: "/contact", label: "Contact", icon: "📞" },
    { to: "/book-appointment", label: "Book Appointment", icon: "📅" },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal-950/95 backdrop-blur-xl border-b border-primary-900/30 shadow-2xl shadow-charcoal-950/50"
          : "bg-gradient-to-r from-charcoal-950/90 via-primary-900/80 to-charcoal-950/90 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-900 via-luxury-gold to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:shadow-primary-900/70 transition-all duration-300">
              <FaGem className="w-5 h-5 text-luxury-gold animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse shadow-lg shadow-accent-500/50"></div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent tracking-wider">
              MEDICORE
            </span>
            <div className="text-xs text-muted-400 font-medium tracking-widest">
              PREMIUM HEALTHCARE
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? "text-white"
                    : "text-muted-200 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "w-full bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-[length:300%_300%] animate-[gradientShiftNavbar_3s_infinite]"
                      : "w-0 bg-gradient-to-r from-luxury-gold to-primary-400 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}

          {userRole === "patient" && (
            <Link
              to="/appointment-history"
              className="relative px-4 py-2 text-sm font-medium text-muted-200 hover:text-white transition-all duration-300 group"
            >
              My Appointments
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-luxury-gold to-primary-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          {userRole === "doctor" && (
            <Link
              to="/dashboard/doctor"
              className="relative px-4 py-2 text-sm font-medium text-muted-200 hover:text-white transition-all duration-300 group"
            >
              <FaCrown className="inline w-3 h-3 mr-1 text-luxury-gold" />
              Doctor Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-luxury-gold to-primary-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          {userRole === "admin" && (
            <Link
              to="/dashboard/admin"
              className="relative px-4 py-2 text-sm font-medium text-muted-200 hover:text-white transition-all duration-300 group"
            >
              <FaCrown className="inline w-3 h-3 mr-1 text-accent-400" />
              Admin Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-luxury-gold to-primary-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-3">
          {/* Mobile Toggle */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-3 rounded-xl bg-charcoal-800/50 hover:bg-charcoal-700/50 backdrop-blur-sm border border-primary-800/30 hover:border-primary-700/50 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-5 h-5 text-muted-300" />
            ) : (
              <FaBars className="w-5 h-5 text-muted-300" />
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {userRole ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-charcoal-800/50 rounded-xl border border-primary-800/30">
                  <FaUser className="w-4 h-4 text-muted-400" />
                  <span className="text-sm font-medium text-muted-200 capitalize">{userRole}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-accent-600/25 hover:shadow-accent-600/50 hover:shadow-glow transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                  aria-controls="auth-dropdown"
                  className="px-4 py-2 bg-gradient-to-r from-primary-900 to-primary-800 hover:from-primary-800 hover:to-primary-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-900/25 hover:shadow-primary-900/40 transition-all duration-300"
                >
                  <FaUser className="inline w-4 h-4 mr-2" />
                  Login / Register
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      id="auth-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 mt-3 w-56 bg-charcoal-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-800/30 overflow-hidden"
                      role="menu"
                    >
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/30 transition-all duration-300 border-b border-primary-800/20"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-900/50 rounded-lg flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-primary-400" />
                          </div>
                          <span className="font-medium">Login</span>
                        </div>
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/30 transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-luxury-gold/20 rounded-lg flex items-center justify-center">
                            <FaCrown className="w-4 h-4 text-luxury-gold" />
                          </div>
                          <span className="font-medium">Register</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 pb-4 border-t border-primary-800/30 pt-4 space-y-1 backdrop-blur-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-3 px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/20 rounded-xl transition-all duration-300"
                onClick={closeMobileMenu}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}

            {userRole === "patient" && (
              <Link
                to="/appointment-history"
                className="flex items-center space-x-3 px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/20 rounded-xl transition-all duration-300"
                onClick={closeMobileMenu}
              >
                <span className="text-lg">📋</span>
                <span className="font-medium">My Appointments</span>
              </Link>
            )}

            {userRole === "doctor" && (
              <Link
                to="/dashboard/doctor"
                className="flex items-center space-x-3 px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/20 rounded-xl transition-all duration-300"
                onClick={closeMobileMenu}
              >
                <span className="text-lg">👑</span>
                <span className="font-medium">Doctor Dashboard</span>
              </Link>
            )}

            {userRole === "admin" && (
              <Link
                to="/dashboard/admin"
                className="flex items-center space-x-3 px-4 py-3 text-muted-200 hover:text-white hover:bg-primary-900/20 rounded-xl transition-all duration-300"
                onClick={closeMobileMenu}
              >
                <span className="text-lg">⚡</span>
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            )}

            {/* Auth Buttons */}
            <div className="pt-4 border-t border-primary-800/30 mt-4 space-y-3 px-4">
              {userRole ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-charcoal-800/50 rounded-xl border border-primary-800/30">
                    <FaUser className="w-5 h-5 text-muted-400" />
                    <span className="text-sm font-medium text-muted-200 capitalize">{userRole}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white font-medium rounded-xl shadow-lg shadow-accent-600/25 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 bg-primary-900/50 hover:bg-primary-800/50 text-muted-200 hover:text-white rounded-xl border border-primary-800/30 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <FaUser className="w-5 h-5 text-primary-400" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-4 py-3 bg-luxury-gold/20 hover:bg-luxury-gold/30 text-muted-200 hover:text-charcoal-900 rounded-xl border border-luxury-gold/30 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <FaCrown className="w-5 h-5 text-luxury-gold" />
                    <span className="font-medium">Register</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
