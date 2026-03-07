import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 mt-12">
      <div className="relative premium-panel backdrop-blur-xl border-t shadow-2xl shadow-charcoal-950/50 shadow-inner">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse" />

        <div className="max-w-screen-xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 text-sm premium-copy">
          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Contact Us
            </h3>
            <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />
            <p className="opacity-90">Medicore</p>
            <p className="opacity-90">Stadium Road, Karachi, Pakistan</p>
            <p className="mt-2 opacity-90">Phone: +92 21 01 98 11 10</p>
            <p className="opacity-90">Email: info@medicore.com</p>
          </div>

          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Quick Links
            </h3>
            <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />
            <ul className="space-y-2">
              <li>
                <Link to="/book-appointment" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Book Appointment</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Find a Doctor</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Pay Bill</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="relative inline-block group">
                  <span className="group-hover:text-emerald-300 transition">Patient Portal</span>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Services
            </h3>
            <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />
            <ul className="space-y-2">
              <li><Link to="/home-healthcare" className="hover:text-emerald-300 transition">Home Healthcare</Link></li>
              <li><Link to="/diagnostic" className="hover:text-emerald-300 transition">Diagnostics</Link></li>
              <li><Link to="/pharmacy" className="hover:text-emerald-300 transition">Pharmacy</Link></li>
              <li><Link to="/emergency" className="hover:text-emerald-300 transition">Emergency</Link></li>
            </ul>
          </div>

          <div className="relative">
            <h3 className="text-lg font-semibold mb-3 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500">
              Stay Connected
            </h3>
            <div className="flex gap-4">
              {["F", "T", "in", "Y"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-300/20 border border-white/20 hover:border-emerald-300 transition-all duration-300 hover:scale-110"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 rounded-t-3xl shadow-2xl shadow-charcoal-950/50 bg-gradient-to-t from-charcoal-950 via-emerald-950/55 to-charcoal-950 backdrop-blur-xl">
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
                <span className="text-white hover:text-emerald-300 transition cursor-pointer">Privacy Policy</span>
                <span className="text-white hover:text-emerald-300 transition cursor-pointer">Terms of Service</span>
                <span className="text-white hover:text-emerald-300 transition cursor-pointer">Accessibility</span>
              </div>
            </div>
          </div>

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
