import React from "react";
import doctorImage from "./doctor-patient.jpg";
import { Particles } from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { Link } from "react-router-dom";


const Home = () => {
  const testimonials = [
    { name: "Mrs. Adeel", quote: "The staff treated me like family — highly professional and empathetic." },
    { name: "Ali Raza", quote: "The doctors diagnosed me quickly and treatment started same day. Thank you!" },
    { name: "Sana J.", quote: "Clean facilities and seamless appointment experience — 10/10!" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] animated-gradient overflow-hidden">


  {/* 💫 Particle Background */}
 


      {/* Overlay & Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Particle animation background */}
        <Particles
          options={{
            background: { color: "#00000000" },
            particles: {
              number: { value: 50, density: { enable: true, area: 800 } },
              color: { value: "#38bdf8" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: false },
              size: { value: 3, random: true },
              move: { enable: true, speed: 1, direction: "none", outMode: "bounce" },
              line_linked: { enable: true, distance: 150, color: "#38bdf8", opacity: 0.4, width: 1 },
            },
            interactivity: {
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
              },
            },
            retina_detect: true,
          }}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-20 max-w-screen-xl mx-auto px-4 py-20 text-gray-800 text-center">
        {/* Your existing heading, subtext, and buttons */}
      </div>

      <section
        className="relative min-h-[80vh]"
      >
         {/* 💫 Particle Layer */}
  <Particles
    options={{
      background: { color: "#00000000" }, // transparent, so image shows through
      particles: {
        color: { value: "#38bdf8" },
        move: { enable: true, speed: 1 },
        number: { value: 60 },
        size: { value: 2 },
      },
    }}
    className="absolute inset-0 z-0"
  />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 pointer-events-none"></div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-20 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Compassionate Care. Trusted Excellence.
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Serving Pakistan with 24/7 emergency care and world-class treatment.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <Link to="book-appointment" className="bg-green-700 hover:bg-blue-800 text-blue px-6 py-3 rounded-md shadow-sm transition cursor-pointer">
              Book Appointment
            </Link>
            <Link to="services" className="border border-green-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-md transition cursor-pointer">
              Explore Services
            </Link>
          </div>

          <div className="flex justify-center flex-wrap gap-4 text-xs mt-2">
            <span className="bg-white/20 px-3 py-1 rounded-full border">🛡️ ISO 9001:2015 Certified</span>
            <span className="bg-white/20 px-3 py-1 rounded-full border">🏥 Partnered with SehatCard & Takaful</span>
            <span className="bg-white/20 px-3 py-1 rounded-full border">🩺 NABH Compliant</span>
          </div>

          <p className="text-sm text-gray-200 mt-2">Accredited by Joint Commission International (JCI)</p>
        </div>
</section>
        {/* Stats Bar */}
        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm py-6 shadow-lg">
          <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 text-center text-blue-900 text-sm font-medium gap-4">
            <div>
              <p className="text-2xl font-bold">120+</p>
              <p>Experienced Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-bold">15,000+</p>
              <p>Patients Treated Monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p>Appointment Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white text-center text-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Core Services We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">🩻 Radiology</h3>
              <p>Advanced imaging including MRI, CT, and digital X-rays.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">🫀 Cardiology</h3>
              <p>Heart checkups, angioplasty, and cardiac rehab facilities.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">🧪 Diagnostics</h3>
              <p>Accurate lab reports, pathology, and urgent testing services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel (mocked static) */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm italic text-gray-600">“{t.quote}”</p>
                <p className="mt-4 font-semibold text-blue-700">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital History */}
      <section className="py-16 bg-white text-center text-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Our Journey</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Founded in 1992, our hospital has grown from a 20-bed clinic to one of Karachi’s leading healthcare institutions, with over 25 specialties and thousands of successful treatments every month.
          </p>
        </div>
      </section>
            {/* Doctor Spotlight */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Meet Our Specialists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {['Dr. Sara Iqbal – Cardiologist', 'Dr. Hamza Qureshi – Radiologist', 'Dr. Mahnoor Khan – Pediatrician'].map((doc, i) => (
              <div key={i} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition">
                <h3 className="font-semibold text-blue-700 mb-2">👨‍⚕️ {doc}</h3>
                <p className="text-sm text-gray-600">Trusted leader in their field with 10+ years of clinical experience.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Teaser */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Plan Your Visit</h2>
          <p className="mb-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Our appointment slots update in real-time. Choose your doctor, select a service, and confirm instantly.
          </p>
          <Link to="/doctor/schedule" className="inline-block bg-green-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition cursor-pointer">View Schedule →</Link>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white text-center text-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Visit Us</h2>
          <p className="mb-6 text-lg max-w-2xl mx-auto">
            Easily reach us using public transport or car. Parking and accessibility available. Use map below for directions.
          </p>
          <div className="w-full h-[300px] rounded overflow-hidden border shadow">
            <iframe
              title="Hospital Location"
              src="https://www.google.com/maps/embed?pb=!1m18!..." // Replace with your hospital's coordinates
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Facility Intro Video */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Take a Quick Tour</h2>
          <p className="mb-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Watch this short video to explore our services, technology, and welcoming staff.
          </p>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              title="Hospital Intro Video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your hospital video
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow"
            ></iframe>
          </div>
        </div>
      </section>
            {/* Real-Time Status Panel (mocked) */}
      <section className="py-16 bg-white text-center text-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Live Hospital Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-bold text-lg text-green-800">🏥 Beds Available</h3>
              <p className="text-2xl font-bold mt-2">42</p>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-bold text-lg text-blue-800">🧑‍⚕️ Doctors Online</h3>
              <p className="text-2xl font-bold mt-2">18</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h3 className="font-bold text-lg text-yellow-800">🚨 ER Wait Time</h3>
              <p className="text-2xl font-bold mt-2">15 mins</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <h3 className="font-bold text-lg text-red-800">📢 Alerts Active</h3>
              <p className="text-2xl font-bold mt-2">2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility & Theme Controls */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6">Customize Your Experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🌗 Dark/Light Mode</h3>
              <p className="text-sm text-gray-600 mb-3">Toggle visual theme to reduce eye strain.</p>
              <button className="text-blue-700 font-medium text-sm">Toggle Theme →</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🌐 Language Preference</h3>
              <p className="text-sm text-gray-600 mb-3">Switch between English and Urdu for comfort.</p>
              <button className="text-blue-700 font-medium text-sm">Switch Language →</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">♿ Accessibility</h3>
              <p className="text-sm text-gray-600 mb-3">Enhanced features for screen readers and tab navigation.</p>
              <button className="text-blue-700 font-medium text-sm">Enable Assistive Mode →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Preview (Login Simulation) */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-lg text-gray-600 mb-6">Logged in as <span className="font-bold text-blue-700">Dr. Abdul – Admin</span></p>
          <div className="inline-block bg-green-700 text-white px-6 py-3 rounded-md shadow hover:bg-blue-800 transition">
            Go to Dashboard →
          </div>
        </div>
      </section>
            {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/Schedule"
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition text-sm cursor-pointer"
        >
          🩺 Book Appointment
        </Link>
      </div>

      {/* Newsletter Form */}
      <section className="py-16 bg-white text-center border-t">
        <div className="max-w-screen-md mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Stay Informed</h2>
          <p className="text-gray-600 mb-4">Receive health tips, updates, and hospital news directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Your Email"
              className="border px-4 py-2 rounded w-full"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* WhatsApp Contact */}
      <div className="fixed bottom-20 right-6 z-40">
        <a
          href="https://wa.me/922112345678"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-3 rounded-full shadow hover:bg-green-600 transition flex items-center gap-2 text-sm"
        >
          🟢 Chat on WhatsApp
        </a>
      </div>

      

      {/* Scroll Animation (optional via tailwind-scrollbar or aos.js) */}
      {/* Chatbot Placeholder */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-purple-700 transition text-sm">
          💬 Ask the Hospital Bot
        </button>
      </div>
    </div>
  );
};

export default Home;



