import React from 'react';
import {
  FaCalendarAlt,
  FaUserMd,
  FaUsers,
  FaClipboardList
} from "react-icons/fa";

const StatsWidget = ({ title, icon, value, bgColor = "bg-blue-100", loading = false, onEdit, onRemove }) => {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return <FaCalendarAlt className="text-blue-700 text-3xl" />;
      case 'doctor':
        return <FaUserMd className="text-yellow-700 text-3xl" />;
      case 'users':
        return <FaUsers className="text-indigo-700 text-3xl" />;
      case 'clipboard':
        return <FaClipboardList className="text-red-700 text-3xl" />;
      default:
        return <FaCalendarAlt className="text-blue-700 text-3xl" />;
    }
  };

  const getBgColorClass = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'yellow':
        return 'bg-yellow-100';
      case 'indigo':
        return 'bg-indigo-100';
      case 'red':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className={`rounded-2xl shadow-md p-6 flex items-center gap-4 ${getBgColorClass(bgColor)} relative group`}>
      {/* Widget Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={onEdit}
          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          title="Edit Widget"
        >
          ✏️
        </button>
        <button
          onClick={onRemove}
          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
          title="Remove Widget"
        >
          ❌
        </button>
      </div>

      <div className="text-blue-700 text-3xl">
        {getIconComponent(icon)}
      </div>
      <div className="flex-1">
        <h4 className="text-gray-700 text-lg font-semibold">{title}</h4>
        {loading ? (
          <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

export default StatsWidget;
