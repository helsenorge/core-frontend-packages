/* eslint-disable no-console */

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

// This wrapping is necessary for being able to Mock function in jest-tests
const exportFunctions = {
  assert,
  clear,
  count,
  dir,
  dirxml,
  group,
  groupCollapsed,
  groupEnd,
  log,
  profile,
  profileEnd,
  table,
  time,
  timeEnd,
};

export default exportFunctions;
