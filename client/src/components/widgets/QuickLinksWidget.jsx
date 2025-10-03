import React from 'react';
import { FaPlus, FaUserCog, FaFileMedical, FaUsers } from 'react-icons/fa';

const QuickLinksWidget = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 hover:bg-blue-200 transition">
          <FaPlus className="text-blue-600" /> Add New Patient
        </button>
        <button className="flex items-center gap-2 p-3 rounded-lg bg-green-100 hover:bg-green-200 transition">
          <FaUserCog className="text-green-600" /> Manage Staff
        </button>
        <button className="flex items-center gap-2 p-3 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition">
          <FaFileMedical className="text-yellow-600" /> Generate Reports
        </button>
        <button className="flex items-center gap-2 p-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition">
          <FaUsers className="text-indigo-600" /> View All Users
        </button>
      </div>
    </div>
  );
};

export default QuickLinksWidget;
