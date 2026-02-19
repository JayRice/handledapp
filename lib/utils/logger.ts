type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    }

    if (level === 'error') {
      console.error(JSON.stringify(logData))
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logData))
    } else {
      console.log(JSON.stringify(logData))
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context)
    }
  }
}

export const logger = new Logger()
