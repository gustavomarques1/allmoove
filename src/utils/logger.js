/**
 * Sistema de Logger Configurável
 *
 * Em produção: desliga todos os logs
 * Em desenvolvimento: permite logs com níveis
 */

const isDevelopment = import.meta.env.DEV;
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'info';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor() {
    this.level = levels[LOG_LEVEL] || levels.info;
  }

  error(...args) {
    if (isDevelopment && this.level >= levels.error) {
      console.error(...args);
    }
  }

  warn(...args) {
    if (isDevelopment && this.level >= levels.warn) {
      console.warn(...args);
    }
  }

  info(...args) {
    if (isDevelopment && this.level >= levels.info) {
      console.log(...args);
    }
  }

  debug(...args) {
    if (isDevelopment && this.level >= levels.debug) {
      console.log(...args);
    }
  }

  // Método para logs temporários que devem ser removidos
  temp(...args) {
    if (isDevelopment) {
      console.log('🚧 TEMP:', ...args);
    }
  }
}

export default new Logger();