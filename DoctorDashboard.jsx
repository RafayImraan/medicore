import React from "react";
import {
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  StethoscopeIcon,
} from "@heroicons/react/24/outline";

const appointments = [
  {
    id: 1,
    patient: "John Doe",
    time: "10:00 AM",
    reason: "Routine Checkup",
  },
  {
    id: 2,
    patient: "Jane Smith",
    time: "11:30 AM",
    reason: "Follow-up",
  },
];

const activityLogs = [
  {
    id: 1,
    activity: "Reviewed John Doe's test results",
    time: "9:30 AM",
  },
  {
    id: 2,
    activity: "Consultation with Jane Smith",
    time: "11:45 AM",
  },
];

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Heading */}
      <h1 className="text-3xl font-semibold mb-6">Welcome, Doctor!</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <div className="flex items-center space-x-4">
            <UserIcon className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">135</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <div className="flex items-center space-x-4">
            <CalendarDaysIcon className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Appointments Today</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">9</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <div className="flex items-center space-x-4">
            <ClockIcon className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Follow-ups</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments and Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <StethoscopeIcon className="h-5 w-5 mr-2 text-indigo-500" />
            <h2 className="text-lg font-semibold">Today's Appointments</h2>
          </div>
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li key={appt.id} className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium">{appt.patient}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{appt.reason}</p>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{appt.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Log */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-pink-500" />
            <h2 className="text-lg font-semibold">Activity Log</h2>
          </div>
          <ul className="space-y-3">
            {activityLogs.map((log) => (
              <li key={log.id} className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-700">
                <p>{log.activity}</p>
                <span className="text-sm text-gray-600 dark:text-gray-300">{log.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
