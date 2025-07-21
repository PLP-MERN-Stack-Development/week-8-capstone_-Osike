import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom logging format
const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Production logging middleware
export const loggingMiddleware = (app) => {
  if (process.env.NODE_ENV === 'production') {
    // Create write streams for different log levels
    const accessLogStream = fs.createWriteStream(
      path.join(logsDir, 'access.log'),
      { flags: 'a' }
    );

    const errorLogStream = fs.createWriteStream(
      path.join(logsDir, 'error.log'),
      { flags: 'a' }
    );

    // Log all requests
    app.use(morgan(customFormat, { stream: accessLogStream }));

    // Log only errors
    app.use(morgan(customFormat, {
      stream: errorLogStream,
      skip: (req, res) => res.statusCode < 400
    }));

    // Console logging for monitoring
    app.use(morgan('combined'));
  } else {
    // Development logging
    app.use(morgan('dev'));
  }
};

// Custom logger utility
export const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...meta
    };
    
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[INFO] ${message}`, meta);
    }
  },

  error: (message, error = null, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null,
      ...meta
    };

    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify(logEntry));
    } else {
      console.error(`[ERROR] ${message}`, error, meta);
    }
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...meta
    };

    if (process.env.NODE_ENV === 'production') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.warn(`[WARN] ${message}`, meta);
    }
  }
};