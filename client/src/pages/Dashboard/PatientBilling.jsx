import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CreditCard, Calendar, DollarSign, Download, AlertCircle, CheckCircle, Clock, CreditCardIcon } from 'lucide-react';

const PatientBilling = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingBill, setSubmittingBill] = useState(null);

  useEffect(() => {
    const fetchBilling = async () => {
      if (!user || !user._id) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/patients/${user._id}/billing`);
        setBilling(response.data);
      } catch (err) {
        console.error('Failed to fetch billing:', err);
        setError('Failed to load billing information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [user]);

  const handleSubmitBill = async (billingId) => {
    try {
      setSubmittingBill(billingId);
      await axios.post(`/api/patients/${user._id}/billing/${billingId}/submit`, {
        paymentMethod: 'Credit Card' // Default payment method
      });

      // Update the billing status locally
      setBilling(billing.map(bill =>
        bill._id === billingId
          ? { ...bill, paymentStatus: 'Paid' }
          : bill
      ));

      alert('Bill submitted successfully!');
    } catch (err) {
      console.error('Failed to submit bill:', err);
      alert('Failed to submit bill. Please try again.');
    } finally {
      setSubmittingBill(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Unpaid':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
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
            <CreditCard className="w-8 h-8 text-green-600" />
            Billing & Payments
          </h1>
          <p className="mt-2 text-gray-600">View and manage your medical bills and payments</p>
        </div>

        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {billing.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  Rs. {billing.filter(b => b.paymentStatus === 'Unpaid').reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-blue-600">{billing.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing List */}
        {billing.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Bills Found</h3>
            <p className="text-gray-600">You don't have any bills available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {billing.map((bill) => (
              <div key={bill._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(bill.paymentStatus)}
                      <h3 className="text-xl font-semibold text-gray-900">{bill.invoiceNumber || bill._id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.paymentStatus)}`}>
                        {bill.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(bill.createdAt || bill.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Rs. {(bill.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {bill.description && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700">{bill.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        // Mock download functionality
                        alert('Download functionality would be implemented here');
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    {bill.paymentStatus === 'Unpaid' && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        onClick={() => handleSubmitBill(bill._id)}
                        disabled={submittingBill === bill._id}
                      >
                        {submittingBill === bill._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        {submittingBill === bill._id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
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

export default PatientBilling;
