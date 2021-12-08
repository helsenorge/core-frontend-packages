/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { getServerLogLevel, getTjenesterUrl } from './hn-proxy-service';
import { createBaseHeaders } from './hn-service';

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6,
}

interface LogEntry {
  Level: LogLevel;
  Url: string;
  Message?: string;
}

const unwrapError = (potentialError: Error | Array<Error | string> | string): string => {
  if (potentialError instanceof Error) {
    return potentialError.message + ' Stack: ' + potentialError.stack;
  } else if (typeof potentialError === 'string' || potentialError instanceof String) {
    return potentialError as unknown as string;
  } else if (potentialError.length > 0) {
    const innerError = potentialError[0];
    return unwrapError(innerError);
  } else {
    return JSON.stringify(potentialError);
  }
};

const generateEntry = (level: LogLevel, message?: string, ...optionalParams: Array<unknown>): LogEntry => {
  let fullMessage = message;
  fullMessage = (optionalParams as Array<string>).reduce((previous: string, current: Error | Array<Error | string> | string) => {
    return previous + ' ' + unwrapError(current);
  }, fullMessage);
  return {
    Level: level,
    Message: fullMessage,
    Url: window.location.href,
  };
};

const postLogEntry = (logEntry: LogEntry): void => {
  fetch(getTjenesterUrl() + '/api/v1/Frontend/Log', {
    method: 'post',
    headers: createBaseHeaders(),
    credentials: 'include',
    body: JSON.stringify(logEntry),
  }).catch();
};

/**
 * Logger error til serveren
 */
export const logToServer = (level: LogLevel, message?: string, ...optionalParams: Array<unknown>): void => {
  const logLevel = getServerLogLevel();
  if (logLevel !== null && level >= logLevel) {
    postLogEntry(generateEntry(level, message, optionalParams));
  }
};

/**
 * Lager en event listener på errors og logger error til serveren
 */
export const captureErrors = (): void => {
  window.addEventListener('error', function (e: ErrorEvent) {
    let message = e.message;
    const error = e.error;
    if (error) {
      message = error;
      const stack = error.stack;
      if (stack) {
        message = stack;
      }
    } else {
      message = message + '. Access to error information is restricted on this domain!';
      if (e.filename) {
        message = message + ' Filename:' + e.filename;
      }
    }
    exportFunctions.logToServer(LogLevel.Error, message);
  });
};

/**
 * Lager en console.assert
 * @param test - test som sendes til console assert
 * @param message - message som sendes til console assert
 * @param optionalParams params som sendes til console assert
 */
export const assert = (test?: boolean, message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.assert(test, message, optionalParams);
  }
};

/**
 * Lager en console.clear
 */
export const clear = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.clear();
  }
};

/**
 * Lager en console.count
 * @param countTitle - string som sendes i console.count
 */
export const count = (countTitle?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.count(countTitle);
  }
};

/**
 * Lager en console.debug og logger til serveren
 * @param message - string som sendes i console.debug og logges til serveren
 * @param optionalParams params som sendes til console.debug og logges til serveren
 */
export const debug = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Debug, message, optionalParams);
};

/**
 * Lager en console.dir
 * @param value - string som sendes i console.dir og logges til serveren
 * @param optionalParams params som sendes til console.dir og logges til serveren
 */
export const dir = (value?: unknown, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.dir(value, optionalParams);
  }
};

/**
 * Lager en console.dirxml
 * @param value - string som sendes i console.dirxml og logges til serveren
 */
export const dirxml = (value: unknown): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.dirxml(value);
  }
};

/**
 * Lager en console.error og logger til serveren
 * @param message - string som sendes i console.error og logges til serveren
 * @param optionalParams params som sendes til console.error og logges til serveren
 */
export const error = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Error, message, optionalParams);
};

/**
 * Lager en console.group
 * @param groupTitle - string som sendes i console.group
 */
export const group = (groupTitle?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.group(groupTitle);
  }
};

/**
 * Lager en console.groupCollapsed
 * @param groupTitle - string som sendes i console.groupCollapsed
 */
export const groupCollapsed = (groupTitle?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed(groupTitle);
  }
};

/**
 * Lager en console.groupEnd
 */
export const groupEnd = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.groupEnd();
  }
};

/**
 * Lager en console.info og logger til serveren
 * @param message - string som sendes i console.info og logges til serveren
 * @param optionalParams params som sendes til console.info og logges til serveren
 */
export const info = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.info(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Info, message, optionalParams);
};

/**
 * Lager en console.log
 * @param message - string som sendes i console.log
 * @param optionalParams params som sendes til console.log
 */
export const log = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    if (optionalParams && optionalParams.length > 0) {
      console.log(message, optionalParams);
    } else {
      console.log(message);
    }
  }
};

/**
 * Lager en console.profile
 * @param reportName - string som sendes i console.groupCollapsed
 */
export const profile = (reportName?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.profile(reportName);
  }
};

/**
 * Lager en console.profileEnd
 */
export const profileEnd = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.profileEnd();
  }
};

/**
 * Lager en console.table
 * @param data - array av ukjent data som sendes videre til console.table
 */
export const table = (...data: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.table(data);
  }
};

/**
 * Lager en console.time
 * @param timerName - string som sendes videre til console.time
 */
export const time = (timerName?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.time(timerName);
  }
};

/**
 * Lager en console.timeEnd
 * @param timerName - string som sendes videre til console.timeEnd
 */
export const timeEnd = (timerName?: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(timerName);
  }
};

/**
 * Lager en console.trace og logger til serveren
 * @param message - string som sendes i console.trace og til serveren
 * @param optionalParams params som sendes til console.trace og til serveren
 */
export const trace = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.trace(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Trace, message, optionalParams);
};

/**
 * Lager en console.warn og logger til serveren
 * @param message - string som sendes i console.warn og til serveren
 * @param optionalParams params som sendes til console.warn og til serveren
 */
export const warn = (message?: string, ...optionalParams: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Warn, message, optionalParams);
};

// This wrapping is necessary for being able to Mock function in jest-tests
const exportFunctions = {
  logToServer,
  assert,
  clear,
  count,
  debug,
  dir,
  dirxml,
  error,
  group,
  groupCollapsed,
  groupEnd,
  info,
  log,
  profile,
  profileEnd,
  table,
  time,
  timeEnd,
  trace,
  warn,
};

export default exportFunctions;
