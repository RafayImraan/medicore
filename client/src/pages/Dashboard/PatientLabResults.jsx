import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FlaskConical, Calendar, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

const PatientLabResults = () => {
  const { user } = useAuth();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabResults = async () => {
      if (!user || !user._id) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/patients/${user._id}/lab-results`);
        setLabResults(response.data);
      } catch (err) {
        console.error('Failed to fetch lab results:', err);
        setError('Failed to load lab results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabResults();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Reviewed':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lab results...</p>
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
            <FlaskConical className="w-8 h-8 text-green-600" />
            Lab Results
          </h1>
          <p className="mt-2 text-gray-600">View and download your laboratory test results</p>
        </div>

        {/* Lab Results List */}
        {labResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Results Found</h3>
            <p className="text-gray-600">You don't have any lab results available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {labResults.map((result) => (
              <div key={result._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(result.status)}
                      <h3 className="text-xl font-semibold text-gray-900">{result.testName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(result.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Result</h4>
                      <p className="text-gray-700">{result.result}</p>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => {
                        // Mock download functionality
                        alert('Download functionality would be implemented here');
                      }}
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

export default PatientLabResults;
