import React from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationsWidget = ({ notifications }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <FaBell /> Notifications
      </h2>
      <ul className="space-y-3">
        {notifications.map((note) => (
          <li key={note.id || note._id} className="text-gray-700 border-b pb-2">
            <div className="font-medium">{note.title || note.message}</div>
            {note.message && note.title && (
              <div className="text-sm text-gray-600 mt-1">{note.message}</div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {note.createdAt ? new Date(note.createdAt).toLocaleString() : note.time}
            </div>
          </li>
        ))}
      </ul>
      {notifications.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No notifications available
        </div>
      )}
    </div>
  );
};

export default NotificationsWidget;
