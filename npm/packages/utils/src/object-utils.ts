/**
 * Slår sammen to objekter rekursivt.
 *
 * @param defaults Objekt med verdier som vil brukes som fallback
 * @param overrides Objekt med verdier som vil overstyre defaults
 * @returns
 */
export const merge = <D extends object, O extends object>(defaults: D, overrides: O): D & O => {
  const merged: D & O = { ...defaults, ...overrides };

  for (const key in merged) {
    if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key]) && defaults[key] !== null && key in overrides) {
      merged[key] = merge(defaults[key], overrides[key]);
    } else {
      if ((!overrides || !overrides[key]) && !!defaults[key]) {
        merged[key] = defaults[key];
      }
    }
  }

  return merged;
};
