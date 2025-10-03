import { useState, useEffect, useCallback } from 'react';
import { 
  fetchWithFallback, 
  adminAPI, 
  doctorAPI, 
  patientAPI, 
  commonAPI, 
  fallbackData 
} from '../services/api';

export const useApi = (apiCall, fallbackGenerator, dependencies = []) => {
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
      setError(err.message);
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, fallbackGenerator]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isRealData, refresh };
};

// Specific hooks for common use cases
export const useAdminStats = () => {
  const { getDashboardStats } = adminAPI;
  const { generateAdminStats } = fallbackData;
  
  return useApi(getDashboardStats, generateAdminStats);
};

export const useDoctorAppointments = (doctorId) => {
  const { getMyAppointments } = doctorAPI;
  const { generateAppointments } = fallbackData;
  
  return useApi(() => getMyAppointments(doctorId), () => generateAppointments(8), [doctorId]);
};

export const usePatientRecords = (patientId) => {
  const { getMyRecords } = patientAPI;
  
  return useApi(() => getMyRecords(patientId), () => ({}), [patientId]);
};

export const usePatientAppointments = (patientId) => {
  const { getMyAppointments } = patientAPI;
  const { generateAppointments } = fallbackData;
  
  return useApi(() => getMyAppointments(patientId), () => generateAppointments(5), [patientId]);
};

export const useAllDoctors = () => {
  const { getAllDoctors } = commonAPI;
  
  return useApi(getAllDoctors, () => []);
};

export const useRevenueAnalytics = (startDate, endDate) => {
  const { getRevenueAnalytics } = adminAPI;
  const { generateRevenueAnalytics } = fallbackData;
  
  return useApi(
    () => getRevenueAnalytics(startDate, endDate),
    generateRevenueAnalytics,
    [startDate, endDate]
  );
};

export const usePatientPrescriptions = (patientId) => {
  const { getMyPrescriptions } = patientAPI;
  const { generatePrescriptions } = fallbackData;
  
  return useApi(() => getMyPrescriptions(patientId), () => generatePrescriptions(3), [patientId]);
};
