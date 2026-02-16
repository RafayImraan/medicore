import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 mt-12">
      {/* Premium Glass Background with Shimmer */}
      <div className="relative backdrop-blur-xl bg-gradient-to-t from-charcoal-900/95 via-emerald-900/70 to-charcoal-950/95 border-t border-primary-800/30 shadow-2xl shadow-charcoal-950/50 shadow-inner">
        {/* Shimmer Highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse"></div>
        <div className="max-w-screen-xl mx-auto px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-white font-inter">
          {/* Contact Info */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 font-poppins">
              Contact Us
            </h3>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"></div>
            <p className="opacity-90">Medicore</p>
            <p className="opacity-90">Stadium Road, Karachi, Pakistan</p>
            <p className="mt-2 opacity-90">Phone: +92 21 01 98 11 10</p>
            <p className="opacity-90">Email: info@medicore.com</p>
          </div>

          {/* Quick Links */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 font-poppins">
              Quick Links
            </h3>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"></div>
            <ul className="space-y-2">
              <li>
                <Link to="/book-appointment" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Book Appointment</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Find a Doctor</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/billing" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Pay Bill</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/patients" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Patient Portal</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 font-poppins">
              Services
            </h3>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"></div>
            <ul className="space-y-2">
              <li>
                <Link to="/home-healthcare" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Home Healthcare</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Diagnostics</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/pharmacy" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Pharmacy</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Emergency</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full group-hover:shadow-[0_0_8px_#10b981] transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 font-poppins">
              Stay Connected
            </h3>
            <ul className="flex gap-4">
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  F
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  T
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  in
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  Y
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Premium Bottom Bar */}
        <div className="relative border-t border-primary-800/30 rounded-t-3xl shadow-2xl shadow-charcoal-950/50 bg-gradient-to-t from-charcoal-900/95 via-emerald-900/70 to-charcoal-950/95 backdrop-blur-xl">
          <div className="max-w-screen-xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-white text-sm text-emerald-100">
                  © {new Date().getFullYear()} Medicore Hospital. All rights reserved.
                </p>
                <p className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500 mt-1 font-semibold">
                  Premium Healthcare Excellence
                </p>
              </div>
              <div className="flex items-center gap-6 text-xs text-emerald-100">
                <span className="text-white hover:text-emerald-300 transition cursor-pointer relative group">
                  Privacy Policy
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </span>
                <span className="text-white hover:text-emerald-300 transition cursor-pointer relative group">
                  Terms of Service
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </span>
                <span className="text-white hover:text-emerald-300 transition cursor-pointer relative group">
                  Accessibility
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </span>
              </div>
            </div>
          </div>
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/30 hover:border-emerald-400 rounded-full flex items-center justify-center text-emerald-300 hover:text-emerald-100 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-110"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
