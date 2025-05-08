import * as assert from 'node:assert';

import { FIBONACCI_LEVELS, fibonacciRetracement } from '@/math/fibonacci';

describe('Fibonacci Retracement', () => {
  it('should calculate Fibonacci retracement levels for an uptrend', () => {
    const start = 100;
    const end = 200;
    const result = fibonacciRetracement(start, end);

    assert.ok(result); // Check if result is defined

    FIBONACCI_LEVELS.forEach((level) => {
      assert.ok(Object.prototype.hasOwnProperty.call(result, level.toString())); // Check if property exists
      assert.strictEqual(typeof result[level as keyof typeof result], 'number'); // Check if value is a number
    });

    assert.strictEqual(result[0], 200);
    assert.ok(Math.abs(result[23.6] - 176.4) < 1);
    assert.ok(Math.abs(result[38.2] - 161.8) < 1);
    assert.ok(Math.abs(result[50] - 150) < 1);
    assert.ok(Math.abs(result[61.8] - 138.2) < 1);
    assert.ok(Math.abs(result[78.6] - 121.4) < 1);
    assert.strictEqual(result[100], 100);
    assert.ok(Math.abs(result[127.2] - 72.8) < 1);
    assert.ok(Math.abs(result[161.8] - 38.2) < 1);
    assert.ok(Math.abs(result[261.8] - 0) < 1);
    assert.ok(Math.abs(result[423.6] - 0) < 1);
  });

  it('should calculate Fibonacci retracement levels for a downtrend', () => {
    const start = 200;
    const end = 100;
    const result = fibonacciRetracement(start, end);

    assert.ok(result);

    FIBONACCI_LEVELS.forEach((level) => {
      assert.ok(Object.prototype.hasOwnProperty.call(result, level.toString()));
      assert.strictEqual(typeof result[level as keyof typeof result], 'number');
    });

    assert.strictEqual(result[0], 100);
    assert.ok(Math.abs(result[23.6] - 123.6) < 1);
    assert.ok(Math.abs(result[38.2] - 138.2) < 1);
    assert.ok(Math.abs(result[50] - 150) < 1);
    assert.ok(Math.abs(result[61.8] - 161.8) < 1);
    assert.ok(Math.abs(result[78.6] - 178.6) < 1);
    assert.strictEqual(result[100], 200);
    assert.ok(Math.abs(result[127.2] - 227.2) < 1);
    assert.ok(Math.abs(result[161.8] - 261.8) < 1);
    assert.ok(Math.abs(result[261.8] - 361.8) < 1);
    assert.ok(Math.abs(result[423.6] - 523.6) < 1);
  });

  it('should handle start and end being the same', () => {
    const start = 100;
    const end = 100;
    const result = fibonacciRetracement(start, end);

    assert.ok(result);

    FIBONACCI_LEVELS.forEach((level) => {
      assert.ok(Object.prototype.hasOwnProperty.call(result, level.toString()));
      assert.strictEqual(typeof result[level as keyof typeof result], 'number');
      assert.ok(Math.abs(result[level as keyof typeof result] - 100) < 1);
    });
  });

  it('should ensure calculated values are not negative', () => {
    const start = 10;
    const end = 5;
    const result = fibonacciRetracement(start, end);

    FIBONACCI_LEVELS.forEach((level) => {
      assert.ok(result[level as keyof typeof result] >= 0);
    });
  });
});
