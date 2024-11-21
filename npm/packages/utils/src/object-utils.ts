/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Slår sammen to objekter rekursivt.
 *
 * @param defaults Objekt med verdier som vil brukes som fallback
 * @param overrides Objekt med verdier som vil overstyre defaults
 * @returns
 */
export const merge = <D extends object, O extends object>(defaults: D, overrides: O): D & O => {
  const merged = { ...defaults, ...overrides };

  for (const key in merged) {
    if (
      typeof defaults[key as keyof D] === 'object' &&
      !Array.isArray(defaults[key as keyof D]) &&
      defaults[key as keyof D] !== null &&
      key in overrides
    ) {
      merged[key as keyof (D & O)] = merge(defaults[key as keyof D] as object, overrides[key as keyof O] as object) as any;
    } else {
      if ((!overrides || !overrides[key as keyof O]) && !!defaults[key as keyof D]) {
        merged[key as keyof (D & O)] = defaults[key as keyof D] as any;
      }
    }
  }

  return merged;
};
