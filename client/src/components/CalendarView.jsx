import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CalendarView = ({ appointments, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(clickedDate);
  };

  const getAppointmentsForDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appt => appt.date === dateString);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 weeks * 7 days

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 w-12"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day);
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(day)}
          className={`
            h-12 w-12 rounded-lg cursor-pointer flex flex-col items-center justify-center text-sm font-medium
            transition-all duration-200 relative
            ${isSelected
              ? 'bg-primary-600 text-white shadow-lg'
              : isToday
                ? 'bg-accent-500/20 text-accent-300 border border-accent-500/50'
                : 'hover:bg-primary-900/50 text-white'
            }
          `}
        >
          {day}
          {dayAppointments.length > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-luxury-gold rounded-full"></div>
          )}
        </motion.div>
      );
    }

    // Fill remaining cells to complete the grid
    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div key={`empty-end-${i}`} className="h-12 w-12"></div>
      );
    }

    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border border-primary-800/30 rounded-xl bg-charcoal-800/50 backdrop-blur-sm shadow-lg"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevMonth}
          className="p-2 rounded-lg bg-primary-900/50 hover:bg-primary-800/50 text-luxury-gold transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-xl font-semibold text-white font-playfair">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextMonth}
          className="p-2 rounded-lg bg-primary-900/50 hover:bg-primary-800/50 text-luxury-gold transition-colors"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-luxury-gold rounded-full"></div>
          <span>Has Appointments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span>Selected Date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent-500/20 border border-accent-500/50 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
