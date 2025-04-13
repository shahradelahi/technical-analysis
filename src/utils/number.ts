export function toPrecision(v: number, precision?: number): number {
  return parseFloat(v.toPrecision(precision));
}

export function toFixed(v: number, precision?: number): number {
  return parseFloat(v.toFixed(precision));
}

/**
 * Returns 0 if the value is close to zero, otherwise returns the value.
 *
 * @param value - The value to check.
 * @returns 0 if the value is close to zero, otherwise returns the value.
 *
 * @example
 * ```typescript
 * zero(0.0000000000000001) // 0
 * zero(1.5) // 1.5
 * zero(-0.0000000000000001) // 0
 * ```
 */
export function zero(value: number): number {
  if (!Number.isFinite(value)) {
    return Number.NaN;
  }
  return Math.abs(value) < Number.EPSILON ? 0 : value;
}

export function isNumber(value: number): boolean {
  return typeof (value as unknown) === 'number' && Number.isFinite(value);
}
