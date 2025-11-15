/**
 * Logger Utility
 * Structured logging for API operations
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

class Logger {
  private minLevel: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    const configLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    this.minLevel =
      configLevel && this.levels[configLevel] !== undefined
        ? configLevel
        : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatLog(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data }),
    };
  }

  private output(entry: LogEntry): void {
    const output = JSON.stringify(entry);

    switch (entry.level) {
      case 'debug':
      case 'info':
        console.log(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      this.output(this.formatLog('debug', message, data));
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.output(this.formatLog('info', message, data));
    }
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.output(this.formatLog('warn', message, data));
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      this.output(this.formatLog('error', message, data));
    }
  }

  // API-specific logging helpers
  apiRequest(
    method: string,
    path: string,
    data?: Record<string, unknown>
  ): void {
    this.info(`API Request: ${method} ${path}`, data);
  }

  apiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ): void {
    this.info(`API Response: ${method} ${path}`, { statusCode, duration });
  }

  apiError(method: string, path: string, error: Error): void {
    this.error(`API Error: ${method} ${path}`, {
      error: error.message,
      stack: error.stack,
    });
  }
}

export const logger = new Logger();
export default logger;
