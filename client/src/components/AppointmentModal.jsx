import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, MapPin, FileText, Phone, Mail, Star } from 'lucide-react';

const AppointmentModal = ({ appointment, isOpen, onClose }) => {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-charcoal-900 to-primary-900/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary-800/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-playfair mb-2">Appointment Details</h2>
                <div className="flex items-center gap-2 text-muted-300">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{appointment.time}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary-900/30 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-muted-400" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
                appointment.status === "Completed" ? "bg-primary-900/50 text-luxury-gold border border-primary-700/50" :
                appointment.status === "Pending" ? "bg-accent-900/50 text-accent-300 border border-accent-700/50" :
                appointment.status === "Cancelled" ? "bg-red-900/50 text-red-300 border border-red-700/50" :
                "bg-blue-900/50 text-blue-300 border border-blue-700/50"
              }`}>
                <Star className="w-4 h-4 mr-2" />
                {appointment.status}
              </span>
            </div>

            {/* Doctor Information */}
            <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-primary-700/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-luxury-gold" />
                Healthcare Provider
              </h3>
              <div className="space-y-2">
                <p className="text-white font-medium text-lg">{appointment.doctor}</p>
                <p className="text-muted-300">{appointment.specialty || 'General Practitioner'}</p>
                <div className="flex items-center gap-4 text-sm text-muted-400">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>doctor@medicare.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-6 p-4 bg-charcoal-800/50 rounded-xl border border-primary-700/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-luxury-gold" />
                Appointment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-400 text-sm">Type</p>
                  <p className="text-white font-medium">{appointment.type}</p>
                </div>
                <div>
                  <p className="text-muted-400 text-sm">Duration</p>
                  <p className="text-white font-medium">30 minutes</p>
                </div>
                <div>
                  <p className="text-muted-400 text-sm">Location</p>
                  <p className="text-white font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Medicare Clinic - Room 204
                  </p>
                </div>
                <div>
                  <p className="text-muted-400 text-sm">Booking Reference</p>
                  <p className="text-white font-medium font-mono">APT-{appointment.id}</p>
                </div>
              </div>
            </div>

            {/* Notes/Instructions */}
            <div className="mb-6 p-4 bg-primary-900/20 rounded-xl border border-primary-700/30">
              <h3 className="text-lg font-semibold text-white mb-3">Preparation Instructions</h3>
              <ul className="text-muted-300 space-y-2 text-sm">
                <li>• Please arrive 15 minutes before your appointment time</li>
                <li>• Bring any relevant medical records or test results</li>
                <li>• Wear comfortable clothing for examination</li>
                <li>• Have your insurance card ready</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold px-6 py-3 rounded-lg font-semibold hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50">
                Reschedule Appointment
              </button>
              <button className="flex-1 bg-gradient-to-r from-accent-900 to-accent-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-accent-800 hover:to-accent-700 transition-all duration-300 shadow-lg shadow-accent-900/25 border border-accent-700/50">
                Cancel Appointment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
