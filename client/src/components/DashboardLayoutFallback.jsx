import React, { useState } from 'react';
import { FaSave, FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';

import StatsOverviewWidget from './widgets/StatsOverviewWidget';
import RevenueAnalyticsWidget from './widgets/RevenueAnalyticsWidget';
import AppointmentsChartWidget from './widgets/AppointmentsChartWidget';
import NotificationsWidget from './widgets/NotificationsWidget';
import QuickLinksWidget from './widgets/QuickLinksWidget';

const DashboardLayoutFallback = ({
  stats,
  revenueData,
  chartData,
  notifications,
  statsLoading,
  revenueLoading,
  revenueError,
  isRealData,
  lastUpdated,
  refreshStats
}) => {
  const [widgetVisibility, setWidgetVisibility] = useState({
    stats: true,
    revenue: true,
    chart: true,
    notifications: true,
    quicklinks: true
  });

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  // Render widget content
  const renderWidget = (widgetId) => {
    switch (widgetId) {
      case 'stats':
        return (
          <StatsOverviewWidget
            stats={stats}
            loading={statsLoading}
          />
        );
      case 'revenue':
        return (
          <RevenueAnalyticsWidget
            revenueData={revenueData}
            loading={revenueLoading}
            error={revenueError}
          />
        );
      case 'chart':
        return (
          <AppointmentsChartWidget
            chartData={chartData}
          />
        );
      case 'notifications':
        return (
          <NotificationsWidget
            notifications={notifications}
          />
        );
      case 'quicklinks':
        return <QuickLinksWidget />;
      default:
        return <div>Unknown Widget</div>;
    }
  };

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Control Panel */}
        <div className="flex items-center gap-4">
          {/* Widget Visibility Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            {Object.entries(widgetVisibility).map(([widgetId, isVisible]) => (
              <button
                key={widgetId}
                onClick={() => toggleWidgetVisibility(widgetId)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition text-sm ${
                  isVisible
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
                title={isVisible ? 'Hide widget' : 'Show widget'}
              >
                {isVisible ? <FaEye /> : <FaEyeSlash />}
                {widgetId.charAt(0).toUpperCase() + widgetId.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Status Indicator */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        {isRealData ? (
          <span className="text-green-600 flex items-center gap-1">
            <FaSave className="animate-pulse" /> Live Data
          </span>
        ) : (
          <span className="text-yellow-600 flex items-center gap-1">
            <FaCog /> Demo Data
          </span>
        )}
        <span className="text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <button
          onClick={refreshStats}
          className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center gap-1"
        >
          <FaSave /> Refresh
        </button>
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Layout Editor Unavailable
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>The advanced layout editor is currently unavailable. You can still view and hide widgets using the controls above.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout Fallback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {widgetVisibility.stats && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden col-span-1 lg:col-span-2 xl:col-span-3">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Statistics Overview</h3>
              {renderWidget('stats')}
            </div>
          </div>
        )}

        {widgetVisibility.revenue && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
              {renderWidget('revenue')}
            </div>
          </div>
        )}

        {widgetVisibility.chart && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Appointments Chart</h3>
              {renderWidget('chart')}
            </div>
          </div>
        )}

        {widgetVisibility.notifications && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              {renderWidget('notifications')}
            </div>
          </div>
        )}

        {widgetVisibility.quicklinks && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              {renderWidget('quicklinks')}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {Object.values(widgetVisibility).every(visible => !visible) && (
        <div className="text-center py-12">
          <FaEyeSlash className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No widgets visible</h3>
          <p className="text-gray-400">Enable widgets using the controls above to see your dashboard content.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardLayoutFallback;
