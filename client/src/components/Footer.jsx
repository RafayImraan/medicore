import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-12">
      {/* Glass background */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 shadow-[0_-4px_30px_rgba(0,0,0,0.2)]">
        <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-white">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Contact Us
            </h3>
            <p className="opacity-90">Medicore</p>
            <p className="opacity-90">Stadium Road, Karachi, Pakistan</p>
            <p className="mt-2 opacity-90">Phone: +92 21 01 98 11 10</p>
            <p className="opacity-90">Email: info@medicore.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/book-appointment" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Book Appointment</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Find a Doctor</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/billing" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Pay Bill</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/patients" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Patient Portal</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home-healthcare" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Home Healthcare</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/diagnostic" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Diagnostics</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/pharmacy" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Pharmacy</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Emergency</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Stay Connected
            </h3>
            <ul className="flex gap-4">
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300">
                  F
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300">
                  T
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300">
                  in
                </a>
              </li>
              <li>
                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300">
                  Y
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="text-center text-xs py-4 text-gray-300 border-t border-white/10">
          © {new Date().getFullYear()} Medicore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
