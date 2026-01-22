import { faker } from '@faker-js/faker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Generic API request function
export const apiRequest = async (endpoint, options = {}, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Try to get token from localStorage if not provided
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Admin Dashboard APIs
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => apiRequest('/api/admin/stats'),

  // Get recent appointments
  getRecentAppointments: () => apiRequest('/api/appointments?limit=10'),

  // Get all users
  getAllUsers: () => apiRequest('/api/admin/users'),

  // Get revenue analytics
  getRevenueAnalytics: (startDate, endDate) => {
    return apiRequest(`/api/admin/analytics/revenue?startDate=${startDate}&endDate=${endDate}`);
  },

  // Get system notifications
  getNotifications: () => apiRequest('/api/admin/notifications'),

  // Get system health status
  getSystemHealth: () => apiRequest('/api/health'),

  // Get detailed system metrics
  getSystemMetrics: () => apiRequest('/api/health/metrics'),

  // Get activity logs
  getActivityLogs: (page = 1, limit = 20) => apiRequest(`/api/activity?page=${page}&limit=${limit}`),

  // Get activity statistics
  getActivityStats: () => apiRequest('/api/activity/stats'),

  // Get security alerts
  getSecurityAlerts: () => apiRequest('/api/activity/security-alerts'),

  // Get user by ID
  getUserById: (userId) => apiRequest(`/api/admin/users/${userId}`),

  // Update user
  updateUser: (userId, userData) => apiRequest(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Delete user
  deleteUser: (userId) => apiRequest(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  }),

  // ==================== INCIDENT MANAGEMENT ====================

  // Get all incidents
  getIncidents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/incidents?${queryString}`);
  },

  // Get incident by ID
  getIncidentById: (incidentId) => apiRequest(`/api/admin/incidents/${incidentId}`),

  // Create incident
  createIncident: (incidentData) => apiRequest('/api/admin/incidents', {
    method: 'POST',
    body: JSON.stringify(incidentData),
  }),

  // Update incident
  updateIncident: (incidentId, updateData) => apiRequest(`/api/admin/incidents/${incidentId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),

  // Delete incident
  deleteIncident: (incidentId) => apiRequest(`/api/admin/incidents/${incidentId}`, {
    method: 'DELETE',
  }),

  // ==================== TASK MANAGEMENT ====================

  // Get all tasks
  getTasks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/tasks?${queryString}`);
  },

  // Get task by ID
  getTaskById: (taskId) => apiRequest(`/api/admin/tasks/${taskId}`),

  // Create task
  createTask: (taskData) => apiRequest('/api/admin/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),

  // Update task
  updateTask: (taskId, updateData) => apiRequest(`/api/admin/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),

  // Delete task
  deleteTask: (taskId) => apiRequest(`/api/admin/tasks/${taskId}`, {
    method: 'DELETE',
  }),

  // Add task comment
  addTaskComment: (taskId, comment) => apiRequest(`/api/admin/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text: comment }),
  }),

  // ==================== REPORT MANAGEMENT ====================

  // Get all reports
  getReports: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/reports?${queryString}`);
  },

  // Generate report
  generateReport: (reportData) => apiRequest('/api/admin/reports/generate', {
    method: 'POST',
    body: JSON.stringify(reportData),
  }),

  // Download report
  downloadReport: (reportId) => {
    // This will trigger a file download
    const url = `${API_BASE_URL}/api/admin/reports/download/${reportId}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// Doctor Dashboard APIs
export const doctorAPI = {
  // Get doctor's appointments
  getMyAppointments: (doctorId) => apiRequest(`/api/appointments/doctor/${doctorId}`),

  // Get patient queue
  getPatientQueue: (doctorId) => apiRequest(`/api/doctors/${doctorId}/queue`),

  // Get patient medical records
  getPatientRecords: (patientId) => apiRequest(`/api/patients/${patientId}/records`),

  // Update appointment status
  updateAppointmentStatus: (appointmentId, status) =>
    apiRequest(`/api/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Get live vitals data
  getVitalsLive: () => apiRequest('/api/vitals/live'),

  // Get patient vitals
  getPatientVitals: (patientId) => apiRequest(`/api/patients/${patientId}/vitals`),

  // Get notifications
  getNotifications: () => apiRequest('/api/notifications'),

  // Acknowledge notification
  acknowledgeNotification: (notificationId) =>
    apiRequest(`/api/notifications/${notificationId}/acknowledge`, {
      method: 'POST',
    }),

  // Get analytics data
  getAnalytics: (type, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/analytics/${type}?${queryString}`);
  },

  // Start telemedicine call
  startTelemedicineCall: (data) =>
    apiRequest('/api/calls/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get patient timeline
  getPatientTimeline: (patientId) => apiRequest(`/api/patients/${patientId}/timeline`),

  // Sync with EHR
  syncWithEHR: (data) =>
    apiRequest('/api/ehr/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Add patient notes
  addPatientNotes: (patientId, notes) =>
    apiRequest(`/api/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  // Start consultation
  startConsultation: (data) =>
    apiRequest('/api/consultations/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Export patient data
  exportPatientData: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/api/patients/export?${queryString}`);
  },

  // Bulk message patients
  bulkMessagePatients: (data) =>
    apiRequest('/api/patients/message', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ECG test
  performECGTest: (patientId) =>
    apiRequest('/api/tests/ecg', {
      method: 'POST',
      body: JSON.stringify({ patientId }),
    }),

  // Order labs
  orderLabs: (data) =>
    apiRequest('/api/labs/order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Refer patient
  referPatient: (data) =>
    apiRequest('/api/referrals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Patient Dashboard APIs
export const patientAPI = {
  // Get patient appointments
  getMyAppointments: (patientId) => apiRequest(`/api/appointments/patient/${patientId}`),
  
  // Get patient medical records
  getMyRecords: (patientId) => apiRequest(`/api/patients/${patientId}`),

  // Get patient bills
  getMyBills: (patientId) => apiRequest(`/api/billing/patient/${patientId}`),
  
  // Get lab reports
  getMyLabReports: (patientId) => apiRequest(`/reports/patient/${patientId}`),
  
  // Schedule appointment
  scheduleAppointment: (data) => 
    apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Common APIs
export const commonAPI = {
  // Get all doctors
  getAllDoctors: () => apiRequest('/api/doctors'),

  // Get featured doctor
  getFeaturedDoctor: () => apiRequest('/api/doctors/featured'),

  // Get doctor by specialization
  getDoctorsBySpecialization: (specialization) =>
    apiRequest(`/api/doctors/specialization/${specialization}`),

  // Get available time slots
  getAvailableSlots: (doctorId, date) =>
    apiRequest(`/api/doctors/${doctorId}/availability?date=${date}`),

  // Get all patients
  getAllPatients: () => apiRequest('/api/patients'),

  // Create new patient
  createPatient: (patientData) =>
    apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    }),

  // Contact form submission
  submitContactForm: (formData) =>
    apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  // Get support statistics
  getSupportStats: () => apiRequest('/api/support-stats'),

  // Get support agents
  getAgents: () => apiRequest('/api/agents'),

  // Send chatbot message
  sendChatMessage: (messageData) =>
    apiRequest('/api/chatbot', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  // Get branches/locations
  getBranches: () => apiRequest('/api/branches'),

  // Get accreditations/settings
  getAccreditations: () => apiRequest('/api/settings'),
};

// Helper function for random number generation
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fallback data generators (for offline/error scenarios)
export const fallbackData = {
  generateAdminStats: () => ({
    appointmentsToday: Math.floor(Math.random() * 50) + 10,
    doctorsAvailable: Math.floor(Math.random() * 15) + 5,
    newPatients: Math.floor(Math.random() * 45) + 15,
    reportsGenerated: Math.floor(Math.random() * 60) + 20,
    totalUsers: Math.floor(Math.random() * 500) + 100,
    totalAppointments: Math.floor(Math.random() * 1000) + 200,
  }),

  // System health fallback
  generateSystemHealth: () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(Math.random() * 86400), // seconds
    memory: {
      usagePercent: Math.floor(Math.random() * 30) + 40, // 40-70%
      used: Math.floor(Math.random() * 500) + 200, // MB
      total: 1024, // MB
    },
    cpu: {
      usagePercent: Math.floor(Math.random() * 40) + 20, // 20-60%
      loadAverage: [Math.random() * 2, Math.random() * 1.5, Math.random()],
    },
    database: {
      status: 'connected',
      connections: Math.floor(Math.random() * 20) + 5,
      queryTime: Math.floor(Math.random() * 50) + 10, // ms
    },
    apiLatency: Math.floor(Math.random() * 100) + 50, // ms
  }),

  // Activity logs fallback
  generateActivityLogs: (count = 10) =>
    Array.from({ length: count }, (_, i) => ({
      _id: `activity-${i}`,
      action: ['LOGIN', 'LOGOUT', 'CREATE_PATIENT', 'UPDATE_APPOINTMENT', 'VIEW_REPORT', 'DELETE_RECORD'][Math.floor(Math.random() * 6)],
      resource: ['User', 'Patient', 'Appointment', 'Report', 'Billing'][Math.floor(Math.random() * 5)],
      userId: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['admin', 'doctor', 'patient'][Math.floor(Math.random() * 3)],
      },
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      details: `Activity ${i + 1} details`,
    })),

  // Security alerts fallback
  generateSecurityAlerts: (count = 5) =>
    Array.from({ length: count }, (_, i) => ({
      _id: `alert-${i}`,
      type: ['Failed Login', 'Suspicious Activity', 'Data Access', 'System Alert'][Math.floor(Math.random() * 4)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      message: `Security alert ${i + 1}: ${['Multiple failed login attempts', 'Unusual data access pattern', 'System vulnerability detected', 'Unauthorized access attempt'][Math.floor(Math.random() * 4)]}`,
      userId: {
        name: `User ${Math.floor(Math.random() * 20) + 1}`,
        email: `user${Math.floor(Math.random() * 20) + 1}@example.com`,
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Last hour
      status: ['active', 'resolved', 'investigating'][Math.floor(Math.random() * 3)],
    })),

  // System notifications fallback
  generateNotifications: (count = 8) =>
    Array.from({ length: count }, (_, i) => ({
      id: `notification-${i}`,
      type: ['system', 'security', 'maintenance', 'update'][Math.floor(Math.random() * 4)],
      title: `Notification ${i + 1}`,
      message: [
        'System maintenance scheduled for tonight',
        'New security patch available',
        'Database backup completed successfully',
        'User account created',
        'Appointment reminder sent',
        'Report generated successfully',
        'System health check passed',
        'New patient registration pending approval'
      ][Math.floor(Math.random() * 8)],
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      read: Math.random() > 0.5,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    })),
  
  // Enhanced revenue analytics with more realistic and varied data
  generateRevenueAnalytics: () => {
    const baseRevenue = Math.floor(Math.random() * 100000) + 50000;
    const totalBills = Math.floor(Math.random() * 200) + 50;
    const averageBillAmount = baseRevenue / totalBills;
    
    return {
      totalRevenue: baseRevenue,
      totalBills: totalBills,
      averageBillAmount: parseFloat(averageBillAmount.toFixed(2))
    };
  },
  
  generateAppointments: (count = 5) => 
    Array.from({ length: count }, (_, i) => ({
      id: `appt-${i}`,
      patientName: `Patient ${i + 1}`,
      doctorName: `Dr. Doctor ${i + 1}`,
      date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
      time: `${9 + i}:00`,
      status: ['pending', 'confirmed', 'completed'][i % 3],
    })),
  
  generatePatients: (count = 5) => 
    Array.from({ length: count }, (_, i) => ({
      id: `patient-${i}`,
      name: `Patient ${i + 1}`,
      age: Math.floor(Math.random() * 50) + 20,
      condition: ['Hypertension', 'Diabetes', 'Asthma', 'Arthritis'][i % 4],
      nextAppointment: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
    })),
  
  // Generate dynamic chart data
  generateChartData: () =>
    Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      appointments: Math.floor(Math.random() * 40) + 10,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    })),

  // Generate vitals data
  generateVitals: (count = 8) =>
    Array.from({ length: count }, (_, i) => ({
      id: `vital-${i}`,
      patient: `Patient ${i + 1}`,
      bp: `${rand(100,150)}/${rand(60,95)}`,
      sugar: rand(80,180),
      temp: +(36 + Math.random()*2).toFixed(1),
      hr: rand(60,110),
      ts: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
    })),

  // Generate analytics data
  generateAnalytics: (type) => {
    switch (type) {
      case 'appointments':
        return Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          count: rand(5, 25),
          completed: rand(3, 20),
          cancelled: rand(0, 3),
        }));
      case 'patient-risk':
        return {
          high: rand(5, 15),
          medium: rand(10, 25),
          low: rand(20, 40),
        };
      default:
        return {};
    }
  },

  // Generate patient timeline
  generatePatientTimeline: (patientId, count = 10) =>
    Array.from({ length: count }, (_, i) => ({
      id: `timeline-${i}`,
      type: ['appointment', 'treatment', 'test', 'note'][i % 4],
      title: [
        'Regular Checkup',
        'Treatment Updated',
        'Blood Test Results',
        'Doctor Note Added'
      ][i % 4],
      description: `Timeline event ${i + 1} for patient ${patientId}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      doctor: `Dr. ${faker.person.lastName()}`,
    })),

  // Generate insights data with current and forecasted trends
  generateInsights: () => {
    const currentERWait = Math.floor(Math.random() * 20) + 5; // 5-25 mins
    const forecastedERWait = currentERWait + 10; // +10% as per task
    const currentICUOccupancy = Math.floor(Math.random() * 30) + 60; // 60-90%
    const forecastedICUOccupancy = currentICUOccupancy; // stable as per task

    return {
      current: {
        erWait: currentERWait,
        icuOccupancy: currentICUOccupancy,
        bedOccupancy: Math.floor(Math.random() * 20) + 70, // 70-90%
        surgeries: Math.floor(Math.random() * 5) + 1,
      },
      forecasted: {
        erWait: forecastedERWait,
        icuOccupancy: forecastedICUOccupancy,
        bedOccupancy: Math.floor(Math.random() * 10) + 75, // slight variation
        surgeries: Math.floor(Math.random() * 3) + 2,
      },
      trends: {
        erWait: Array.from({ length: 7 }, (_, i) => currentERWait + Math.floor(Math.random() * 10) - 5),
        icuOccupancy: Array.from({ length: 7 }, (_, i) => currentICUOccupancy + Math.floor(Math.random() * 5) - 2),
      },
    };
  },
};

// Utility function for API calls with fallback
export const fetchWithFallback = async (apiCall, fallbackGenerator, ...args) => {
  try {
    const data = await apiCall(...args);
    return { data, isRealData: true };
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const fallbackData = fallbackGenerator();
    return { data: fallbackData, isRealData: false };
  }
};
