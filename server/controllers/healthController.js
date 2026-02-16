const mongoose = require('mongoose');
const { getHealthStatus, memoryMonitor } = require('../middleware/performance');

// Basic health check
exports.healthCheck = async (req, res) => {
  try {
    const health = getHealthStatus();

    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Determine overall health status
    const isHealthy = dbState === 1 && health.memory.usagePercent < 90;

    const response = {
      status: health.status,
      timestamp: health.timestamp,
      uptime: health.uptime,
      memory: {
        rss: health.memory.rss,
        heapTotal: health.memory.heapTotal,
        heapUsed: health.memory.heapUsed,
        usagePercent: health.memory.usagePercent
      },
      version: health.version,
      environment: health.environment,
      database: {
        status: dbStatus[dbState] || 'unknown',
        name: mongoose.connection.name,
        host: mongoose.connection.host
      },
      overall: isHealthy ? 'healthy' : 'unhealthy'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
};

// Detailed system metrics
exports.systemMetrics = async (req, res) => {
  try {
    const health = getHealthStatus();

    // Database metrics
    const dbStats = await mongoose.connection.db.stats();

    // Additional system metrics
    const systemMetrics = {
      ...health,
      database: {
        ...health.database,
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: `${Math.round(dbStats.dataSize / 1024 / 1024)}MB`,
        storageSize: `${Math.round(dbStats.storageSize / 1024 / 1024)}MB`
      },
      process: {
        pid: process.pid,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    };

    res.json(systemMetrics);
  } catch (error) {
    console.error('System metrics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve system metrics',
      timestamp: new Date().toISOString()
    });
  }
};

// Database performance metrics
exports.databaseMetrics = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Get collection stats
    const collections = await db.listCollections().toArray();
    const collectionStats = {};

    for (const collection of collections) {
      const stats = await db.collection(collection.name).stats();
      collectionStats[collection.name] = {
        count: stats.count,
        size: `${Math.round(stats.size / 1024)}KB`,
        avgObjSize: `${Math.round(stats.avgObjSize)}B`,
        storageSize: `${Math.round(stats.storageSize / 1024)}KB`
      };
    }

    // Get server status
    const serverStatus = await db.admin().serverStatus();

    res.json({
      collections: collectionStats,
      server: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections,
        opcounters: serverStatus.opcounters
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database metrics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve database metrics',
      timestamp: new Date().toISOString()
    });
  }
};

// Application performance metrics
exports.appMetrics = async (req, res) => {
  try {
    // This would typically integrate with monitoring tools like PM2, New Relic, etc.
    const metrics = {
      timestamp: new Date().toISOString(),
      endpoints: {
        total: 25, // Approximate number of API endpoints
        active: 'monitoring' // Would be dynamic in real implementation
      },
      features: {
        authentication: 'active',
        dashboards: 'active',
        appointments: 'active',
        billing: 'active',
        telehealth: 'active',
        calendar: 'active',
        feedback: 'active',
        activity_monitoring: 'active'
      },
      performance: {
        response_time_avg: '150ms', // Would be calculated from logs
        error_rate: '0.1%', // Would be calculated from logs
        uptime_percentage: '99.9%' // Would be calculated
      }
    };

    res.json(metrics);
  } catch (error) {
    console.error('App metrics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve application metrics',
      timestamp: new Date().toISOString()
    });
  }
};
