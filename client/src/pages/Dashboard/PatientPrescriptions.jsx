import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FileText, Calendar, User, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientPrescriptions = () => {
  const { user, token } = useAuth(); // get token from context
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Axios instance with token
  const api = useMemo(() => {
    if (!token) return null;
    return axios.create({
      baseURL: '/api',
      headers: { Authorization: `Bearer ${token}` }
    });
  }, [token]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user || !user._id || !api) return;

      try {
        setLoading(true);
        const response = await api.get(`/patients/${user._id}/prescriptions`);
        setPrescriptions(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch prescriptions:', err);
        if (err.response && err.response.status === 401) {
          // Token invalid or expired, redirect to login
          alert('Session expired. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to load prescriptions. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user, api, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Expired': return <Clock className="w-5 h-5 text-red-500" />;
      case 'Completed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            Prescriptions
          </h1>
          <p className="mt-2 text-gray-600">View and manage your medication prescriptions</p>
        </div>

        {/* Prescriptions List */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-600">You don't have any prescriptions available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(prescription.status)}
                      <h3 className="text-xl font-semibold text-gray-900">{prescription.medicationName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">
                          Dr. {prescription.prescribedBy?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(prescription.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Dosage</h4>
                          <p className="text-gray-700">{prescription.dosage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Frequency</h4>
                          <p className="text-gray-700">{prescription.frequency}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Duration</h4>
                          <p className="text-gray-700">{prescription.duration}</p>
                        </div>
                      </div>
                      {prescription.instructions && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-1">Instructions</h4>
                          <p className="text-gray-700">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => alert('Download functionality would be implemented here')}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
