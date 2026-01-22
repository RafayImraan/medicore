import { useState, useEffect, useCallback } from 'react';
import { adminAPI, doctorAPI, patientAPI, commonAPI, fetchWithFallback, fallbackData } from '../services/api';

// Generic API hook with fallback support
export const useApi = (apiCall, fallbackGenerator, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRealData, setIsRealData] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWithFallback(apiCall, fallbackGenerator);
      setData(result.data);
      setIsRealData(result.isRealData);
    } catch (err) {
      console.error('API hook error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall, fallbackGenerator, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isRealData, refetch: fetchData };
};

// Admin Dashboard Hooks
export const useAdminStats = () => {
  return useApi(adminAPI.getDashboardStats, fallbackData.generateAdminStats);
};

export const useRecentAppointments = () => {
  return useApi(adminAPI.getRecentAppointments, fallbackData.generateAppointments);
};

export const useAllUsers = () => {
  return useApi(adminAPI.getAllUsers, () => []);
};

export const useRevenueAnalytics = (startDate, endDate) => {
  return useApi(
    () => adminAPI.getRevenueAnalytics(startDate, endDate),
    fallbackData.generateRevenueAnalytics,
    [startDate, endDate]
  );
};

export const useSystemHealth = () => {
  return useApi(adminAPI.getSystemHealth, fallbackData.generateSystemHealth);
};

export const useActivityLogs = (page = 1, limit = 20) => {
  return useApi(
    () => adminAPI.getActivityLogs(page, limit),
    () => fallbackData.generateActivityLogs(limit),
    [page, limit]
  );
};

export const useSecurityAlerts = () => {
  return useApi(adminAPI.getSecurityAlerts, fallbackData.generateSecurityAlerts);
};

export const useSystemNotifications = () => {
  return useApi(adminAPI.getNotifications, fallbackData.generateNotifications);
};

export const useIncidents = (params = {}) => {
  return useApi(
    () => adminAPI.getIncidents(params),
    () => fallbackData.generateIncidents(5),
    [params]
  );
};

export const useTasks = (params = {}) => {
  return useApi(
    () => adminAPI.getTasks(params),
    () => fallbackData.generateTasks(5),
    [params]
  );
};

export const useReports = (params = {}) => {
  return useApi(
    () => adminAPI.getReports(params),
    () => [],
    [params]
  );
};

// Doctor Dashboard Hooks
export const useDoctorAppointments = (doctorId) => {
  return useApi(
    () => doctorAPI.getMyAppointments(doctorId),
    fallbackData.generateAppointments,
    [doctorId]
  );
};

export const usePatientQueue = (doctorId) => {
  return useApi(
    () => doctorAPI.getPatientQueue(doctorId),
    () => [],
    [doctorId]
  );
};

export const usePatientRecords = (patientId) => {
  return useApi(
    () => doctorAPI.getPatientRecords(patientId),
    () => [],
    [patientId]
  );
};

export const usePatientVitals = (patientId) => {
  return useApi(
    () => doctorAPI.getPatientVitals(patientId),
    () => fallbackData.generateVitals(8),
    [patientId]
  );
};

export const usePatientTimeline = (patientId) => {
  return useApi(
    () => doctorAPI.getPatientTimeline(patientId),
    () => fallbackData.generatePatientTimeline(patientId, 10),
    [patientId]
  );
};

export const useDoctorNotifications = () => {
  return useApi(doctorAPI.getNotifications, fallbackData.generateNotifications);
};

export const useAnalytics = (type, params = {}) => {
  return useApi(
    () => doctorAPI.getAnalytics(type, params),
    () => fallbackData.generateAnalytics(type),
    [type, params]
  );
};

// Patient Dashboard Hooks
export const usePatientAppointments = (patientId) => {
  return useApi(
    () => patientAPI.getMyAppointments(patientId),
    fallbackData.generateAppointments,
    [patientId]
  );
};

export const usePatientMedicalRecords = (patientId) => {
  return useApi(
    () => patientAPI.getMyRecords(patientId),
    () => [],
    [patientId]
  );
};

export const usePatientBills = (patientId) => {
  return useApi(
    () => patientAPI.getMyBills(patientId),
    () => [],
    [patientId]
  );
};

export const usePatientLabReports = (patientId) => {
  return useApi(
    () => patientAPI.getMyLabReports(patientId),
    () => [],
    [patientId]
  );
};

export const usePatientPrescriptions = (patientId) => {
  return useApi(
    () => patientAPI.getMyPrescriptions(patientId),
    () => [],
    [patientId]
  );
};

// Common Hooks
export const useAllDoctors = () => {
  return useApi(commonAPI.getAllDoctors, () => []);
};

export const useDoctorsBySpecialization = (specialization) => {
  return useApi(
    () => commonAPI.getDoctorsBySpecialization(specialization),
    () => [],
    [specialization]
  );
};

export const useAvailableSlots = (doctorId, date) => {
  return useApi(
    () => commonAPI.getAvailableSlots(doctorId, date),
    () => [],
    [doctorId, date]
  );
};

export const useAllPatients = () => {
  return useApi(commonAPI.getAllPatients, fallbackData.generatePatients);
};

export const useFeaturedDoctor = () => {
  return useApi(commonAPI.getFeaturedDoctor, () => null);
};

export const useBranches = () => {
  return useApi(commonAPI.getBranches, () => []);
};

export const useAccreditations = () => {
  return useApi(commonAPI.getAccreditations, () => []);
};

// Utility hook for creating incidents
export const useCreateIncident = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createIncident = useCallback(async (incidentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminAPI.createIncident(incidentData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create incident');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createIncident, loading, error };
};

// Utility hook for creating tasks
export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminAPI.createTask(taskData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTask, loading, error };
};

// Utility hook for updating tasks
export const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminAPI.updateTask(taskId, updateData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTask, loading, error };
};

// Utility hook for scheduling appointments
export const useScheduleAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scheduleAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await patientAPI.scheduleAppointment(appointmentData);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to schedule appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { scheduleAppointment, loading, error };
};
