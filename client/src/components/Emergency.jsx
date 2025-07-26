import React from "react";
import carousel3 from "./carousel3.jpg";

const Emergency = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[80vh]"
        style={{ backgroundImage: `url(${carousel3})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
        <div className="relative z-10 text-black text-center max-w-screen-xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-semibold mb-2">Emergency Services</h1>
          <p className="text-lg">
            Immediate care available 24/7 for critical medical conditions, trauma, and urgent cases.
          </p>
        </div>
      </section>

      {/* Emergency Numbers */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center text-sm">
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-700 mb-2">🚑 Ambulance Hotline</h3>
            <p className="text-xl font-bold text-gray-900">+92 21 111 786 786</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-700 mb-2">🧯 Trauma & Burns Unit</h3>
            <p className="text-xl font-bold text-gray-900">+92 21 3493 0051</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-700 mb-2">🩺 Pediatric Emergency</h3>
            <p className="text-xl font-bold text-gray-900">+92 21 3486 0001</p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50 text-center text-gray-800 px-4">
        <div className="max-w-screen-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">How We Respond</h2>
          <p className="mb-6 text-sm">
            Our emergency services are led by senior consultants, emergency physicians, trauma nurses, and life-support trained specialists. We provide rapid triage, stabilization, and specialist coordination during emergencies.
          </p>

          <ul className="text-sm list-disc list-inside text-left">
            <li>Critical cases admitted immediately with fast-track protocols</li>
            <li>Patients may be asked for ID and basic medical history on arrival</li>
            <li>Ambulance equipped with cardiac, oxygen, and pediatric support</li>
            <li>24/7 radiology and surgical assessment available</li>
          </ul>
        </div>
      </section>

      {/* Emergency Footer */}
      <section className="py-8 bg-green-700 text-white text-center">
        <p className="text-sm">In case of life-threatening emergencies, do not wait. Call our hotline immediately.</p>
        <p className="text-sm mt-2">© Medicore Emergency Response System</p>
      </section>
    </div>
  );
};

export default Emergency;
