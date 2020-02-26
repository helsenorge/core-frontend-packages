/* eslint-disable @typescript-eslint/no-explicit-any */
import { postAuto, getPortal, OperationResponse } from "./hn-service";

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
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

function processQueue(queue: LogEntry[], serverLogLevel: number) {
  const entry = queue.shift();
  if (entry && entry.Level >= serverLogLevel) {
    postAuto("Log", entry).catch();
    processQueue(queue, serverLogLevel);
  }
}

function SetupLogLevel() {
  getPortal("GetEnvironment")
    .then((data: GetEnvironmentOperationResponse) => {
      ServerLogLevel = data.Level;
      processQueue(logQueue, data.Level);
    })
    .catch(() => {
      ServerLogLevel = LogLevel.Off;
    });
}

function unwrapError(potentialError: Error | any[]): string {
  if (potentialError instanceof Error) {
    return potentialError.message + " Stack: " + potentialError.stack;
  } else if (potentialError.length > 0) {
    const innerError = potentialError[0];
    return unwrapError(innerError);
  } else {
    return JSON.stringify(potentialError);
  }
}

function generateEntry(
  level: LogLevel,
  message?: string,
  ...optionalParams: any[]
): LogEntry {
  let fullMessage = message;
  fullMessage = optionalParams.reduce((previous, current) => {
    return previous + " " + unwrapError(current);
  }, fullMessage);
  return {
    Level: level,
    Message: fullMessage,
    Url: window.location.href
  };
}

function logToServer(
  level: LogLevel,
  message?: string,
  ...optionalParams: any[]
) {
  if (ServerLogLevel === undefined) {
    logQueue.push(generateEntry(level, message, optionalParams));
  } else if (level >= ServerLogLevel) {
    postAuto("Log", generateEntry(level, message, optionalParams)).catch();
  }
}

export function captureErrors() {
  window.addEventListener("error", function(e: ErrorEvent) {
    let message = e.message;
    const error = e.error;
    if (error) {
      message = error;
      const stack = error.stack;
      if (stack) {
        message = stack;
      }
    } else {
      message =
        message + ". Access to error information is restricted on this domain!";
      if (e.filename) {
        message = message + " Filename:" + e.filename;
      }
    }
    logToServer(LogLevel.Error, message);
  });
}

export function assert(
  test?: boolean,
  message?: string,
  ...optionalParams: any[]
): void {
  if (process.env.NODE_ENV !== "production") {
    console.assert(test, message, optionalParams);
  }
}
export function clear(): void {
  if (process.env.NODE_ENV !== "production") {
    console.clear();
  }
}
export function count(countTitle?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.count(countTitle);
  }
}
export function debug(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug(message, optionalParams);
  }
  logToServer(LogLevel.Debug, message, optionalParams);
}
export function dir(value?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.dir(value, optionalParams);
  }
}
export function dirxml(value: any): void {
  if (process.env.NODE_ENV !== "production") {
    console.dirxml(value);
  }
}
export function error(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, optionalParams);
  }
  logToServer(LogLevel.Error, message, optionalParams);
}
export function exception(message?: string, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.exception(message, optionalParams);
  }
  logToServer(LogLevel.Error, message, optionalParams);
}
export function group(groupTitle?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.group(groupTitle);
  }
}
export function groupCollapsed(groupTitle?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.groupCollapsed(groupTitle);
  }
}
export function groupEnd(): void {
  if (process.env.NODE_ENV !== "production") {
    console.groupEnd();
  }
}
export function info(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.info(message, optionalParams);
  }
  logToServer(LogLevel.Info, message, optionalParams);
}
export function log(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    if (optionalParams && optionalParams.length > 0) {
      console.log(message, optionalParams);
    } else {
      console.log(message);
    }
  }
}

export function profile(reportName?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.profile(reportName);
  }
}
export function profileEnd(): void {
  if (process.env.NODE_ENV !== "production") {
    console.profileEnd();
  }
}
export function table(...data: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.table(data);
  }
}
export function time(timerName?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.time(timerName);
  }
}
export function timeEnd(timerName?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.timeEnd(timerName);
  }
}
export function trace(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.trace(message, optionalParams);
  }
  logToServer(LogLevel.Trace, message, optionalParams);
}
export function warn(message?: any, ...optionalParams: any[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message, optionalParams);
  }
  logToServer(LogLevel.Warn, message, optionalParams);
}

export default {
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
  warn
};

SetupLogLevel();

/* eslint-enable @typescript-eslint/no-explicit-any */
