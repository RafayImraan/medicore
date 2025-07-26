import React from "react";
import doctorImage from "./doctor-patient.jpg";

const Contact = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[50vh]"
        style={{ backgroundImage: `url(${doctorImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="relative z-10 text-white text-center max-w-screen-xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-semibold mb-2">Get in Touch</h1>
          <p className="text-lg">We're here to help — reach out with any questions, feedback, or medical concerns.</p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📍 Location</h3>
            <p>Stadium Road, Karachi</p>
            <p>Pakistan 74800</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📞 Call Us</h3>
            <p>+92 21 111 911 911</p>
            <p>Emergency: +92 21 111 786 786</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">📧 Email</h3>
            <p>info@medicore.org</p>
            <p>appointments@medicore.org</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-md mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-6">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-green-300"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-green-300"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-green-300"
            ></textarea>
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-green-700 text-white text-center py-8">
        <p className="text-sm">Accredited by Joint Commission International (JCI)</p>
        <p className="mt-2">© Medicore Health Services – All Rights Reserved</p>
      </section>
    </div>
  );
};

export default Contact;
