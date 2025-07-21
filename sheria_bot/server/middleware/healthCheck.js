import mongoose from 'mongoose';

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    // Check uptime
    const uptime = process.uptime();
    const uptimeFormatted = {
      seconds: Math.floor(uptime),
      minutes: Math.floor(uptime / 60),
      hours: Math.floor(uptime / 3600),
      days: Math.floor(uptime / 86400)
    };

    // Overall health status
    const isHealthy = dbStatus === 'connected' && memoryUsageMB.heapUsed < 500; // Less than 500MB

    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      },
      server: {
        uptime: uptimeFormatted,
        memory: memoryUsageMB,
        nodeVersion: process.version,
        platform: process.platform
      },
      services: {
        api: 'operational',
        chatbot: 'operational',
        database: dbStatus === 'connected' ? 'operational' : 'degraded'
      }
    };

    res.status(isHealthy ? 200 : 503).json(healthData);

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

// Readiness check (for Kubernetes/container orchestration)
export const readinessCheck = async (req, res) => {
  try {
    // Check if the application is ready to serve requests
    const dbReady = mongoose.connection.readyState === 1;
    
    if (dbReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'Database not connected'
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};

// Liveness check (for Kubernetes/container orchestration)
export const livenessCheck = (req, res) => {
  // Simple check to see if the process is alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
};