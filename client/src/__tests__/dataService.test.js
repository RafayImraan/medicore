import { adminAPI, doctorAPI, patientAPI, commonAPI, mode } from '../services/dataService';

// Mock the api module
jest.mock('../services/api', () => ({
  apiRequest: jest.fn(),
  fallbackData: {
    generateAdminStats: jest.fn(() => ({ mockStats: true })),
    generateAppointments: jest.fn(() => [{ mockAppointment: true }]),
    generatePatients: jest.fn(() => [{ mockPatient: true }]),
    generateRevenueAnalytics: jest.fn(() => ({ mockRevenue: true })),
    generateNotifications: jest.fn(() => [{ mockNotification: true }]),
    generateSystemHealth: jest.fn(() => ({ mockHealth: true })),
    generateActivityLogs: jest.fn(() => [{ mockLog: true }]),
    generateSecurityAlerts: jest.fn(() => [{ mockAlert: true }]),
    generateVitals: jest.fn(() => [{ mockVital: true }]),
    generatePrescriptionTemplates: jest.fn(() => [{ mockTemplate: true }]),
    generateAnalytics: jest.fn(() => ({ mockAnalytics: true })),
    generatePrescriptions: jest.fn(() => [{ mockPrescription: true }]),
  },
  fetchWithFallback: jest.fn(),
}));

const { apiRequest, fallbackData, fetchWithFallback } = require('../services/api');

describe('Data Service Modes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fake Mode', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'fake';
      // Re-import to get new mode
      jest.resetModules();
    });

    it('should return fallback data for admin stats', async () => {
      const { adminAPI } = await import('../services/dataService');
      const result = await adminAPI.getDashboardStats();
      expect(fallbackData.generateAdminStats).toHaveBeenCalled();
      expect(result).toEqual({ mockStats: true });
    });

    it('should return fallback data for appointments', async () => {
      const { adminAPI } = await import('../services/dataService');
      const result = await adminAPI.getRecentAppointments();
      expect(fallbackData.generateAppointments).toHaveBeenCalledWith(10);
      expect(result).toEqual([{ mockAppointment: true }]);
    });
  });

  describe('Real Mode', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'real';
      jest.resetModules();
    });

    it('should call apiRequest for admin stats', async () => {
      apiRequest.mockResolvedValue({ realStats: true });
      const { adminAPI } = await import('../services/dataService');
      const result = await adminAPI.getDashboardStats();
      expect(apiRequest).toHaveBeenCalledWith('/api/admin/stats');
      expect(result).toEqual({ realStats: true });
    });
  });

  describe('Hybrid Mode', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'hybrid';
      jest.resetModules();
    });

    it('should use fetchWithFallback for admin stats', async () => {
      fetchWithFallback.mockResolvedValue({ hybridStats: true });
      const { adminAPI } = await import('../services/dataService');
      const result = await adminAPI.getDashboardStats();
      expect(fetchWithFallback).toHaveBeenCalled();
      expect(result).toEqual({ hybridStats: true });
    });
  });

  describe('Doctor API', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'fake';
      jest.resetModules();
    });

    it('should return fallback data for doctor appointments', async () => {
      const { doctorAPI } = await import('../services/dataService');
      const result = await doctorAPI.getMyAppointments('doc1');
      expect(fallbackData.generateAppointments).toHaveBeenCalledWith(5);
      expect(result).toEqual([{ mockAppointment: true }]);
    });
  });

  describe('Patient API', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'fake';
      jest.resetModules();
    });

    it('should return fallback data for patient appointments', async () => {
      const { patientAPI } = await import('../services/dataService');
      const result = await patientAPI.getMyAppointments('pat1');
      expect(fallbackData.generateAppointments).toHaveBeenCalledWith(3);
      expect(result).toEqual([{ mockAppointment: true }]);
    });
  });

  describe('Common API', () => {
    beforeAll(() => {
      process.env.VITE_DATA_MODE = 'fake';
      jest.resetModules();
    });

    it('should return fallback data for doctors', async () => {
      const { commonAPI } = await import('../services/dataService');
      const result = await commonAPI.getAllDoctors();
      expect(fallbackData.generatePatients).toHaveBeenCalledWith(12);
      expect(result).toEqual([{ mockPatient: true }]);
    });
  });
});
