// src/libs/logger.ts

import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

// Create logs directory in development only
const createLogsDirectory = () => {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
    } catch (error) {
      console.warn('Could not create logs directory:', error);
    }
  }
};

// Configure transports based on environment
const getTransports = () => {
  const logTransports = [];

  // Always add console transport
  logTransports.push(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      ),
    })
  );

  // Only add file transports in development or when writable filesystem is available
  if (process.env.NODE_ENV !== 'production') {
    try {
      createLogsDirectory();
      logTransports.push(
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
      );
    } catch (error) {
      console.warn('File logging not available:', error);
    }
  }

  return logTransports;
};

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'auth-service' },
  transports: getTransports(),
});

export default logger;
