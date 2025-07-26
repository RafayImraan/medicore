import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-10 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p>Medicore</p>
          <p>Stadium Road, Karachi, Pakistan</p>
          <p className="mt-2">Phone: +92 21 01 98 11 10</p>
          <p>Email: info@medicore.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/book-appointment" className="hover:underline">Book Appointment</Link></li>
            <li><Link to="/doctors" className="hover:underline">Find a Doctor</Link></li>
            <li><Link to="/doctor/billing" className="hover:underline">Pay Bill</Link></li>
            <li><Link to="doctor/patients" className="hover:underline">Patient Portal</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services</h3>
          <ul className="space-y-2">
            <li><Link to="/home-healthcare" className="hover:underline">Home Healthcare</Link></li>
            <li><Link to="/diagnostic" className="hover:underline">Diagnostics</Link></li>
            <li><Link to="/pharmacy" className="hover:underline">Pharmacy</Link></li>
            <li><Link to="/emergency" className="hover:underline">Emergency</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
            <li><a href="#" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-300 mt-8">
        © {new Date().getFullYear()} Medicore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
