import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';

const StatsWidgets = ({ stats }) => {
  // Default stats if none provided
  const defaultStats = {
    totalAppointments: 24,
    completedAppointments: 18,
    pendingAppointments: 4,
    cancelledAppointments: 2,
    upcomingAppointments: 6,
    averageWaitTime: 15,
    successRate: 85
  };

  const currentStats = stats || defaultStats;

  const widgets = [
    {
      title: "Total Appointments",
      value: currentStats.totalAppointments,
      icon: Calendar,
      color: "from-blue-900 to-blue-800",
      textColor: "text-blue-300",
      bgColor: "bg-blue-900/20"
    },
    {
      title: "Completed",
      value: currentStats.completedAppointments,
      icon: CheckCircle,
      color: "from-green-900 to-green-800",
      textColor: "text-green-300",
      bgColor: "bg-green-900/20"
    },
    {
      title: "Pending",
      value: currentStats.pendingAppointments,
      icon: Clock,
      color: "from-yellow-900 to-yellow-800",
      textColor: "text-yellow-300",
      bgColor: "bg-yellow-900/20"
    },
    {
      title: "Cancelled",
      value: currentStats.cancelledAppointments,
      icon: XCircle,
      color: "from-red-900 to-red-800",
      textColor: "text-red-300",
      bgColor: "bg-red-900/20"
    },
    {
      title: "Upcoming",
      value: currentStats.upcomingAppointments,
      icon: Users,
      color: "from-purple-900 to-purple-800",
      textColor: "text-purple-300",
      bgColor: "bg-purple-900/20"
    },
    {
      title: "Success Rate",
      value: `${currentStats.successRate}%`,
      icon: TrendingUp,
      color: "from-primary-900 to-primary-800",
      textColor: "text-luxury-gold",
      bgColor: "bg-primary-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {widgets.map((widget, index) => (
        <motion.div
          key={widget.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 border border-primary-800/30 rounded-xl bg-charcoal-800/50 backdrop-blur-sm shadow-lg shadow-charcoal-950/20 hover:shadow-xl hover:shadow-charcoal-950/30 transition-all duration-300 ${widget.bgColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-400 font-medium">{widget.title}</p>
              <p className="text-3xl font-bold text-white mt-2">{widget.value}</p>
            </div>
            <div className={`p-3 bg-gradient-to-br ${widget.color} rounded-lg`}>
              <widget.icon className={`w-6 h-6 ${widget.textColor}`} />
            </div>
          </div>

          {/* Progress bar for success rate */}
          {widget.title === "Success Rate" && (
            <div className="mt-4">
              <div className="w-full bg-charcoal-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStats.successRate}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="bg-gradient-to-r from-luxury-gold to-yellow-500 h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-muted-400 mt-1">Target: 90%</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatsWidgets;
