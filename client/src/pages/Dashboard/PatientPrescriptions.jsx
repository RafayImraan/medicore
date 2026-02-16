import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FileText, Calendar, User, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const downloadPrescription = (prescription) => {
  const content = [
    `Prescription: ${prescription.medicine || 'N/A'}`,
    `Dosage: ${prescription.dosage || 'N/A'}`,
    `Frequency: ${prescription.frequency || 'N/A'}`,
    `Duration: ${prescription.duration || 'N/A'}`,
    prescription.instructions ? `Instructions: ${prescription.instructions}` : ''
  ].filter(Boolean).join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prescription-${prescription._id || prescription.id || 'item'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-primary-900/20 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-gold via-primary-300 to-luxury-silver bg-clip-text text-transparent flex items-center gap-3 tracking-wider">
            <FileText className="w-8 h-8 text-luxury-gold" />
            PRESCRIPTIONS
          </h1>
          <p className="mt-2 text-muted-400 font-medium tracking-wide">View and manage your medication prescriptions</p>
        </div>

        {/* Prescriptions List */}
        {prescriptions.length === 0 ? (
          <div className="bg-charcoal-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-charcoal-950/20 p-8 text-center border border-primary-900/30">
            <FileText className="w-16 h-16 text-muted-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Prescriptions Found</h3>
            <p className="text-muted-400">You don't have any prescriptions available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-charcoal-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-charcoal-950/20 p-6 border border-primary-900/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(prescription.status)}
                      <h3 className="text-xl font-semibold text-white">{prescription.medicationName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">
                          Dr. {prescription.prescribedBy?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-400">
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

                    <div className="bg-charcoal-900/50 rounded-lg p-4 border border-primary-800/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-luxury-gold mb-1">Dosage</h4>
                          <p className="text-white">{prescription.dosage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-luxury-gold mb-1">Frequency</h4>
                          <p className="text-white">{prescription.frequency}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-luxury-gold mb-1">Duration</h4>
                          <p className="text-white">{prescription.duration}</p>
                        </div>
                      </div>
                      {prescription.instructions && (
                        <div className="mt-4">
                          <h4 className="font-medium text-luxury-gold mb-1">Instructions</h4>
                          <p className="text-white">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-900 to-primary-800 text-luxury-gold rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-900/25 border border-primary-700/50"
                      onClick={() => downloadPrescription(prescription)}
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
