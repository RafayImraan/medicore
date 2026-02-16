import { apiRequest, fallbackData, fetchWithFallback } from './api';

const mode = import.meta.env.VITE_DATA_MODE || 'real'; // fake, hybrid, real

// Helper to decide mode behavior
const isFake = mode === 'fake';
const isReal = mode === 'real';
const isHybrid = mode === 'hybrid';

// Admin Dashboard APIs
export const adminAPI = {
  getDashboardStats: () => {
    if (isFake) return Promise.resolve(fallbackData.generateAdminStats());
    if (isReal) return apiRequest('/api/admin/stats');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/admin/stats'), fallbackData.generateAdminStats);
  },

  getRecentAppointments: () => {
    if (isFake) return Promise.resolve(fallbackData.generateAppointments(10));
    if (isReal) return apiRequest('/api/appointments?limit=10');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/appointments?limit=10'), () => fallbackData.generateAppointments(10));
  },

  getAllUsers: () => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(20)); // Mock users as patients
    if (isReal) return apiRequest('/api/admin/users');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/admin/users'), () => fallbackData.generatePatients(20));
  },

  getRevenueAnalytics: (startDate, endDate) => {
    if (isFake) return Promise.resolve(fallbackData.generateRevenueAnalytics());
    if (isReal) return apiRequest(`/api/admin/analytics/revenue?startDate=${startDate}&endDate=${endDate}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/admin/analytics/revenue?startDate=${startDate}&endDate=${endDate}`), fallbackData.generateRevenueAnalytics);
  },

  getNotifications: () => {
    if (isFake) return Promise.resolve(fallbackData.generateNotifications(8));
    if (isReal) return apiRequest('/api/admin/notifications');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/admin/notifications'), () => fallbackData.generateNotifications(8));
  },

  getSystemHealth: () => {
    if (isFake) return Promise.resolve(fallbackData.generateSystemHealth());
    if (isReal) return apiRequest('/api/health');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/health'), fallbackData.generateSystemHealth);
  },

  getActivityLogs: (page = 1, limit = 20) => {
    if (isFake) return Promise.resolve(fallbackData.generateActivityLogs(limit));
    if (isReal) return apiRequest(`/api/activity?page=${page}&limit=${limit}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/activity?page=${page}&limit=${limit}`), () => fallbackData.generateActivityLogs(limit));
  },

  getSecurityAlerts: () => {
    if (isFake) return Promise.resolve(fallbackData.generateSecurityAlerts(5));
    if (isReal) return apiRequest('/api/activity/security-alerts');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/activity/security-alerts'), () => fallbackData.generateSecurityAlerts(5));
  },
};

// Doctor Dashboard APIs
export const doctorAPI = {
  getMyAppointments: (doctorId) => {
    if (isFake) return Promise.resolve(fallbackData.generateAppointments(5));
    if (isReal) return apiRequest(`/api/appointments/doctor/${doctorId}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/appointments/doctor/${doctorId}`), () => fallbackData.generateAppointments(5));
  },

  getPatientRecords: (patientId) => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(1)[0]); // Mock record
    if (isReal) return apiRequest(`/api/patients/${patientId}/records`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/patients/${patientId}/records`), () => fallbackData.generatePatients(1)[0]);
  },

  getMyPrescriptions: (doctorId) => {
    if (isFake) return Promise.resolve(fallbackData.generatePrescriptions(3));
    if (isReal) return apiRequest(`/api/prescriptions/doctor/${doctorId}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/prescriptions/doctor/${doctorId}`), () => fallbackData.generatePrescriptions(3));
  },

  updateAppointmentStatus: (appointmentId, status) => {
    if (isFake) return Promise.resolve({ success: true });
    if (isReal) return apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }), () => ({ success: true }));
  },

  createPrescription: (data) => {
    if (isFake) return Promise.resolve({ id: 'fake-prescription', ...data });
    if (isReal) return apiRequest('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }), () => ({ id: 'fake-prescription', ...data }));
  },

  getVitalsLive: () => {
    if (isFake) return Promise.resolve(fallbackData.generateVitals(8));
    if (isReal) return apiRequest('/api/vitals/live');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/vitals/live'), () => fallbackData.generateVitals(8));
  },

  getPrescriptionTemplates: () => {
    if (isFake) return Promise.resolve(fallbackData.generatePrescriptionTemplates(4));
    if (isReal) return apiRequest('/api/prescriptions/templates');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/prescriptions/templates'), () => fallbackData.generatePrescriptionTemplates(4));
  },

  getNotifications: () => {
    if (isFake) return Promise.resolve(fallbackData.generateNotifications(5));
    if (isReal) return apiRequest('/api/notifications');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/notifications'), () => fallbackData.generateNotifications(5));
  },

  getAnalytics: (type, params = {}) => {
    if (isFake) return Promise.resolve(fallbackData.generateAnalytics(type));
    if (isReal) {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/api/analytics/${type}?${queryString}`);
    }
    if (isHybrid) {
      const queryString = new URLSearchParams(params).toString();
      return fetchWithFallback(() => apiRequest(`/api/analytics/${type}?${queryString}`), () => fallbackData.generateAnalytics(type));
    }
  },
};

// Patient Dashboard APIs
export const patientAPI = {
  getMyAppointments: (patientId) => {
    if (isFake) return Promise.resolve(fallbackData.generateAppointments(3));
    if (isReal) return apiRequest(`/api/appointments/patient/${patientId}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/appointments/patient/${patientId}`), () => fallbackData.generateAppointments(3));
  },

  getMyRecords: (patientId) => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(1)[0]);
    if (isReal) return apiRequest(`/api/patients/${patientId}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/patients/${patientId}`), () => fallbackData.generatePatients(1)[0]);
  },

  getMyPrescriptions: (patientId) => {
    if (isFake) return Promise.resolve(fallbackData.generatePrescriptions(2));
    if (isReal) return apiRequest(`/api/prescriptions/patient/${patientId}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/prescriptions/patient/${patientId}`), () => fallbackData.generatePrescriptions(2));
  },

  scheduleAppointment: (data) => {
    if (isFake) return Promise.resolve({ id: 'fake-appointment', ...data });
    if (isReal) return apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }), () => ({ id: 'fake-appointment', ...data }));
  },
};

// Common APIs
export const commonAPI = {
  getAllDoctors: () => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(12)); // Mock doctors as patients
    if (isReal) return apiRequest('/api/doctors');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/doctors'), () => fallbackData.generatePatients(12));
  },

  getAvailableSlots: (doctorId, date) => {
    if (isFake) return Promise.resolve(Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, available: Math.random() > 0.4 })));
    if (isReal) return apiRequest(`/api/doctors/${doctorId}/availability?date=${date}`);
    if (isHybrid) return fetchWithFallback(() => apiRequest(`/api/doctors/${doctorId}/availability?date=${date}`), () => Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, available: Math.random() > 0.4 })));
  },

  getAllPatients: () => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(10));
    if (isReal) return apiRequest('/api/patients');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/patients'), () => fallbackData.generatePatients(10));
  },

  submitContactForm: (formData) => {
    if (isFake) return Promise.resolve({ success: true, message: 'Form submitted (fake)' });
    if (isReal) return apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    }), () => ({ success: true, message: 'Form submitted (fake)' }));
  },

  // Get predictive insights
  getInsights: () => {
    if (isFake) return Promise.resolve(fallbackData.generateInsights());
    if (isReal) return apiRequest('/api/insights');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/insights'), fallbackData.generateInsights);
  },

  // Get featured doctor
  getFeaturedDoctor: () => {
    if (isFake) return Promise.resolve(fallbackData.generatePatients(1)[0]); // Mock as first patient
    if (isReal) return apiRequest('/api/doctors/featured');
    if (isHybrid) return fetchWithFallback(() => apiRequest('/api/doctors/featured'), () => fallbackData.generatePatients(1)[0]);
  },
};

// Export mode for debugging
export { mode };
