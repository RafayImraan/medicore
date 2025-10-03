import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Info } from 'lucide-react';

// Reusable Doctor Panel Component
const DoctorPanel = ({
  doctor,
  points,
  bedOccupancyData = [60, 62, 65, 63, 67, 70, 68],
  onBook,
  onViewProfile,
  className = '',
  showRating = true,
  rating = 4.8,
  reviews = 127,
  isLoading = false,
  error = null
}) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBook = () => {
    if (onBook) {
      onBook(doctor);
    } else {
      navigate('/book-appointment', { state: { doctor } });
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(doctor);
    } else {
      // Default modal or navigation
      navigate(`/doctor/${doctor.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow animate-pulse ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-16 mt-1"></div>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl shadow ${className}`}>
        <div className="text-red-600 dark:text-red-400 text-sm">
          Error loading doctor information: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex items-center gap-3">
        <img
          src={doctor.avatar}
          alt={`Dr. ${doctor.name}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">{doctor.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{doctor.specialty}</div>
          {showRating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300">{rating} ({reviews} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm">
        <div className="text-gray-700 dark:text-gray-300">
          Next available: <strong className="text-green-600">{doctor.nextAvailable}</strong>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleBook}
            className="bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`Book appointment with Dr. ${doctor.name}`}
          >
            Book
          </button>
          <button
            onClick={handleViewProfile}
            className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 border border-green-600 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`View profile of Dr. ${doctor.name}`}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="mt-4 border-t pt-3 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            Wellness Points
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              aria-label="More info about wellness points"
            >
              <Info className="w-3 h-3" />
            </button>
            {showTooltip && (
              <div className="absolute z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 mt-1 -ml-16">
                Earn points by booking appointments and completing health goals
              </div>
            )}
          </div>
          <div className="font-semibold text-green-600">{points}</div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
