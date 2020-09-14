import { postAuto, getPortal, OperationResponse } from './hn-service';

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6,
}

interface GetEnvironmentOperationResponse extends OperationResponse {
  Level: LogLevel;
}

let ServerLogLevel: LogLevel | undefined = undefined;

interface LogEntry {
  Level: LogLevel;
  Url: string;
  Message?: string;
}

const logQueue: LogEntry[] = [];

const processQueue = (queue: LogEntry[], serverLogLevel: number): void => {
  const entry = queue.shift();
  if (entry && entry.Level >= serverLogLevel) {
    postAuto('Log', entry).catch();
    processQueue(queue, serverLogLevel);
  }
};

const SetupLogLevel = (): void => {
  getPortal('GetEnvironment')
    .then((data: GetEnvironmentOperationResponse) => {
      ServerLogLevel = data.Level;
      processQueue(logQueue, data.Level);
    })
    .catch(() => {
      ServerLogLevel = LogLevel.Off;
    });
};

const unwrapError = (potentialError: Error | Array<Error | string> | string): string => {
  if (potentialError instanceof Error) {
    return potentialError.message + ' Stack: ' + potentialError.stack;
  } else if (typeof potentialError === 'string' || potentialError instanceof String) {
    return (potentialError as unknown) as string;
  } else if (potentialError.length > 0) {
    const innerError = potentialError[0];
    return unwrapError(innerError);
  } else {
    return JSON.stringify(potentialError);
  }
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const generateEntry = (level: LogLevel, message?: string, ...optionalParams: Array<any>): LogEntry => {
  let fullMessage = message;
  fullMessage = optionalParams.reduce((previous: string, current: Error | Array<Error | string> | string) => {
    return previous + ' ' + unwrapError(current);
  }, fullMessage);
  return {
    Level: level,
    Message: fullMessage,
    Url: window.location.href,
  };
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const logToServer = (level: LogLevel, message?: string, ...optionalParams: any[]): void => {
  if (ServerLogLevel === undefined) {
    SetupLogLevel();
    logQueue.push(generateEntry(level, message, optionalParams));
  } else if (level >= ServerLogLevel) {
    postAuto('Log', generateEntry(level, message, optionalParams)).catch();
  }
};

/**
 * Logger error til serveren
 */
export const captureErrors = (): void => {
  window.addEventListener('error', function(e: ErrorEvent) {
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
export const assert = (test?: boolean, message?: string, ...optionalParams: string[]): void => {
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
export const debug = (message?: string, ...optionalParams: string[]): void => {
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
export const dir = (value?: unknown, ...optionalParams: string[]): void => {
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
export const error = (message?: string, ...optionalParams: string[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, optionalParams);
  }
  exportFunctions.logToServer(LogLevel.Error, message, optionalParams);
};

/**
 * Lager en console.exception og logger til serveren
 * @param message - string som sendes i console.exception og logges til serveren
 * @param optionalParams params som sendes til console.exception og logges til serveren
 */
export const exception = (message?: string, ...optionalParams: string[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.exception(message, optionalParams);
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
export const info = (message?: string, ...optionalParams: string[]): void => {
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
export const log = (message?: string, ...optionalParams: string[]): void => {
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
export const trace = (message?: string, ...optionalParams: string[]): void => {
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
export const warn = (message?: string, ...optionalParams: string[]): void => {
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
  exception,
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
