import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import production middleware
import { securityMiddleware } from './middleware/security.js';
import { loggingMiddleware, logger } from './middleware/logging.js';
import { healthCheck, readinessCheck, livenessCheck } from './middleware/healthCheck.js';

// Import routes
import chatRoutes from './routes/chatRoutes.js';
import constitutionRoutes from './routes/constitutionRoutes.js';
import legalAidRoutes from './routes/legalAidRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import partnerLawFirmRoutes from './routes/partnerLawFirmRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply security middleware
securityMiddleware(app);

// Apply logging middleware
loggingMiddleware(app);

// CORS configuration
// 🔧 CHANGE NEEDED: Update CLIENT_URL to match your frontend domain in production
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Health check endpoints
app.get('/health', healthCheck);
app.get('/ready', readinessCheck);
app.get('/live', livenessCheck);

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/constitution', constitutionRoutes);
app.use('/api/legal-aid', legalAidRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/lawfirms', partnerLawFirmRoutes);

// 🔧 CHANGE NEEDED: Update this path to match your React build output directory
// Common paths: '../dist', '../build', '../client/dist', '../frontend/dist'
const distPath = path.resolve(__dirname, '../dist');

// Serve static files from the React app build directory
app.use(express.static(distPath));

// API Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to SheriaBot API',
    description: 'Legal Chatbot for Enhanced Access to Justice in Kenya',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      constitution: '/api/constitution',
      legalAid: '/api/legal-aid',
      faqs: '/api/faqs',
      analytics: '/api/analytics',
      lawFirms: '/api/lawfirms'
    }
  });
});

// All other GET requests not handled before will return the React app
// This enables React Router to work properly in production
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Import in-memory database for development/testing
// 🔧 CHANGE NEEDED: Create this file if it doesn't exist
// Create: ./config/testDb.js with MongoDB Memory Server setup
import { connectTestDB } from './config/testDb.js';

// Database connection
const connectDB = async () => {
  try {
    // Use in-memory database if MONGODB_URI is not provided or in development mode
    if (!process.env.MONGODB_URI || process.env.NODE_ENV === 'development') {
      const uri = await connectTestDB();
      logger.info(`Using in-memory MongoDB for testing: ${uri}`);
      return;
    }
    
    // Connect to real MongoDB instance
    // 🔧 ENVIRONMENT VARIABLE NEEDED: Set MONGODB_URI in your .env file
    // Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sheriabot
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    logger.info(`🚀 SheriaBot API Server running on port ${PORT}`);
    logger.info(`📚 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    logger.info(`⚖️  SheriaBot API: http://localhost:${PORT}/api`);
    // 🔧 CHANGE NEEDED: Update this URL to match your deployment domain
    logger.info(`🌐 Frontend available at: https://week-8-capstone-osike-seven.vercel.app/chat`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();