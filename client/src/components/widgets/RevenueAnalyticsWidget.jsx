import React from 'react';

const RevenueAnalyticsWidget = ({ revenueData, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-24 mx-auto rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-20 mx-auto rounded"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-16 mx-auto rounded"></div>
          </div>
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-20 mx-auto rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-24 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
        <div className="text-center text-red-600">
          <p>Failed to load revenue data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">₹{revenueData?.totalRevenue?.toLocaleString() || 0}</p>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{revenueData?.totalBills || 0}</p>
          <p className="text-gray-600">Total Bills</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">₹{revenueData?.averageBillAmount?.toFixed(2) || 0}</p>
          <p className="text-gray-600">Avg Bill Amount</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsWidget;
