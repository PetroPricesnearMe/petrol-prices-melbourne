/* eslint-disable no-console */

const isProduction = process.env.NODE_ENV === 'production';

const logWhenAllowed = (method: 'log' | 'info' | 'warn' | 'error' | 'debug') => {
  return (...args: unknown[]) => {
    if (!isProduction) {
      console[method](...args);
    }
  };
};

export const logger = {
  log: logWhenAllowed('log'),
  info: logWhenAllowed('info'),
  warn: logWhenAllowed('warn'),
  error: logWhenAllowed('error'),
  debug: logWhenAllowed('debug'),
};

export type Logger = typeof logger;

export default logger;

