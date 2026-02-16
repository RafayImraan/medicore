import React, { useState, useEffect, Suspense } from 'react';
import { FaSave, FaUndo, FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';

import StatsOverviewWidget from './widgets/StatsOverviewWidget';
import RevenueAnalyticsWidget from './widgets/RevenueAnalyticsWidget';
import AppointmentsChartWidget from './widgets/AppointmentsChartWidget';
import NotificationsWidget from './widgets/NotificationsWidget';
import QuickLinksWidget from './widgets/QuickLinksWidget';
import DashboardLayoutFallback from './DashboardLayoutFallback';

// Lazy load react-grid-layout to handle loading errors gracefully
const ReactGridLayout = React.lazy(() =>
  import('react-grid-layout').then(module => {
    const RGL = module.default;
    const WidthProvider = module.WidthProvider;

    // Also import CSS
    import('react-grid-layout/css/styles.css');
    import('react-resizable/css/styles.css');

    return { default: WidthProvider(RGL) };
  }).catch(error => {
    console.warn('Failed to load react-grid-layout, using fallback:', error);
    // Return a component that renders nothing, we'll use the fallback
    return { default: () => null };
  })
);

const DashboardLayout = ({
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
  const [layout, setLayout] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useState({
    stats: true,
    revenue: true,
    chart: true,
    notifications: true,
    quicklinks: true
  });

  // Default layout configuration
  const defaultLayout = [
    { i: 'stats', x: 0, y: 0, w: 12, h: 6, minW: 6, minH: 4 },
    { i: 'revenue', x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'chart', x: 6, y: 6, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'notifications', x: 0, y: 10, w: 6, h: 6, minW: 3, minH: 4 },
    { i: 'quicklinks', x: 6, y: 14, w: 6, h: 6, minW: 3, minH: 4 }
  ];

  // Load layout from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedVisibility = localStorage.getItem('widgetVisibility');

    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(defaultLayout);
    }

    if (savedVisibility) {
      setWidgetVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    localStorage.setItem('widgetVisibility', JSON.stringify(widgetVisibility));
    alert('Dashboard layout saved successfully!');
  };

  // Reset layout to default
  const resetLayout = () => {
    setLayout(defaultLayout);
    setWidgetVisibility({
      stats: true,
      revenue: true,
      chart: true,
      notifications: true,
      quicklinks: true
    });
    localStorage.removeItem('dashboardLayout');
    localStorage.removeItem('widgetVisibility');
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  // Update widget size
  const updateWidgetSize = (widgetId, width, height) => {
    setLayout(prevLayout =>
      prevLayout.map(item =>
        item.i === widgetId
          ? { ...item, w: Math.max(item.minW || 1, width), h: Math.max(item.minH || 1, height) }
          : item
      )
    );
  };

  // Layout templates
  const layoutTemplates = {
    compact: [
      { i: 'stats', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
      { i: 'revenue', x: 0, y: 4, w: 6, h: 3, minW: 4, minH: 3 },
      { i: 'chart', x: 6, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
      { i: 'notifications', x: 0, y: 7, w: 6, h: 4, minW: 3, minH: 3 },
      { i: 'quicklinks', x: 6, y: 10, w: 6, h: 4, minW: 3, minH: 3 }
    ],
    detailed: [
      { i: 'stats', x: 0, y: 0, w: 12, h: 8, minW: 6, minH: 6 },
      { i: 'revenue', x: 0, y: 8, w: 6, h: 6, minW: 4, minH: 4 },
      { i: 'chart', x: 6, y: 8, w: 6, h: 10, minW: 4, minH: 6 },
      { i: 'notifications', x: 0, y: 14, w: 6, h: 8, minW: 3, minH: 4 },
      { i: 'quicklinks', x: 6, y: 18, w: 6, h: 8, minW: 3, minH: 4 }
    ],
    analytics: [
      { i: 'stats', x: 0, y: 0, w: 8, h: 6, minW: 6, minH: 4 },
      { i: 'revenue', x: 8, y: 0, w: 4, h: 6, minW: 4, minH: 4 },
      { i: 'chart', x: 0, y: 6, w: 12, h: 12, minW: 6, minH: 8 },
      { i: 'notifications', x: 0, y: 18, w: 6, h: 6, minW: 3, minH: 4 },
      { i: 'quicklinks', x: 6, y: 18, w: 6, h: 6, minW: 3, minH: 4 }
    ]
  };

  // Apply layout template
  const applyLayoutTemplate = (templateName) => {
    const template = layoutTemplates[templateName];
    if (template) {
      setLayout(template);
      setWidgetVisibility({
        stats: true,
        revenue: true,
        chart: true,
        notifications: true,
        quicklinks: true
      });
    }
  };

  // Export layout
  const exportLayout = () => {
    const layoutData = {
      layout,
      widgetVisibility,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(layoutData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-layout-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import layout
  const importLayout = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const layoutData = JSON.parse(e.target.result);
          if (layoutData.layout && layoutData.widgetVisibility) {
            setLayout(layoutData.layout);
            setWidgetVisibility(layoutData.widgetVisibility);
            alert('Layout imported successfully!');
          } else {
            alert('Invalid layout file format.');
          }
        } catch (error) {
          alert('Error importing layout: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle layout change
  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
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

  // Filter visible widgets
  const visibleWidgets = layout.filter(item => widgetVisibility[item.i]);

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Control Panel */}
        <div className="flex items-center gap-4">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isEditMode
                ? 'bg-blue-600 text-white'
                : 'lux-surface-muted lux-text hover:bg-gray-200'
            }`}
          >
            <FaCog /> {isEditMode ? 'Exit Edit' : 'Edit Layout'}
          </button>

          {/* Save Layout */}
          {isEditMode && (
            <button
              onClick={saveLayout}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaSave /> Save Layout
            </button>
          )}

          {/* Reset Layout */}
          <button
            onClick={resetLayout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="space-y-6 mb-6">
          {/* Widget Visibility Controls */}
          <div className="lux-surface p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Widget Visibility</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(widgetVisibility).map(([widgetId, isVisible]) => (
                <button
                  key={widgetId}
                  onClick={() => toggleWidgetVisibility(widgetId)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isVisible
                      ? 'bg-blue-100 text-blue-700'
                      : 'lux-surface-muted lux-muted'
                  }`}
                >
                  {isVisible ? <FaEye /> : <FaEyeSlash />}
                  {widgetId.charAt(0).toUpperCase() + widgetId.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Widget Size Controls */}
          <div className="lux-surface p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Widget Size Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layout.map((item) => (
                <div key={item.i} className="border rounded-lg p-3">
                  <h4 className="font-medium lux-text mb-2">
                    {item.i.charAt(0).toUpperCase() + item.i.slice(1)}
                  </h4>
                  <div className="flex gap-2 items-center">
                    <label className="text-sm lux-muted">Width:</label>
                    <input
                      type="number"
                      min={item.minW || 1}
                      max={12}
                      value={item.w}
                      onChange={(e) => updateWidgetSize(item.i, parseInt(e.target.value), item.h)}
                      className="w-16 px-2 py-1 border rounded text-sm"
                    />
                    <label className="text-sm lux-muted">Height:</label>
                    <input
                      type="number"
                      min={item.minH || 1}
                      max={20}
                      value={item.h}
                      onChange={(e) => updateWidgetSize(item.i, item.w, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Templates */}
          <div className="lux-surface p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Layout Templates</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => applyLayoutTemplate('compact')}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                Compact View
              </button>
              <button
                onClick={() => applyLayoutTemplate('detailed')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Detailed View
              </button>
              <button
                onClick={() => applyLayoutTemplate('analytics')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                Analytics Focus
              </button>
            </div>
          </div>

          {/* Export/Import Controls */}
          <div className="lux-surface p-4 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Layout Management</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportLayout}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
              >
                <FaSave /> Export Layout
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition cursor-pointer">
                <FaUndo /> Import Layout
                <input
                  type="file"
                  accept=".json"
                  onChange={importLayout}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

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
        <span className="lux-muted">Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <button
          onClick={refreshStats}
          className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center gap-1"
        >
          <FaSave /> Refresh
        </button>
      </div>

      {/* Grid Layout */}
      <ReactGridLayout
        className="layout"
        layout={visibleWidgets}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={30}
        width={1200}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        draggableHandle=".drag-handle"
        resizeHandles={['se']}
      >
        {visibleWidgets.map((item) => (
          <div key={item.i} className="lux-surface-muted rounded-2xl overflow-hidden">
            {isEditMode && (
              <div className="drag-handle bg-gray-200 p-2 cursor-move flex items-center justify-between">
                <span className="text-sm font-medium lux-text">
                  {item.i.charAt(0).toUpperCase() + item.i.slice(1)} Widget
                </span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
            <div className="p-4">
              {renderWidget(item.i)}
            </div>
          </div>
        ))}
      </ReactGridLayout>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <div className="text-center py-12">
          <FaEyeSlash className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold lux-muted mb-2">No widgets visible</h3>
          <p className="lux-muted">Enable widgets in edit mode to see your dashboard content.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
