import * as assert from 'node:assert';

import { EMA } from '@/overlap/EMA';
import { RMA } from '@/overlap/RMA';
import { SMAInput } from '@/overlap/SMA';
import { SampleValues } from '@/samples';

const input = {
  values: SampleValues,
  period: 5,
  decimal: 6,
} satisfies SMAInput;

const expectedResult = [
  136.78, 136.928, 139.0184, 139.02472, 138.665776, 140.792621, 145.124097, 151.889277, 161.581422,
  173.645137, 187.56211, 198.753688, 216.28695, 229.08356,
];

describe('Welles Wilder Smoothing (RMA)', function () {
  it('should calculate RMA using the calculate method', function () {
    const result = new RMA(input).getResult();

    const rmaResult = new EMA({ ...input, alpha: 1 / input.period }).getResult();

    assert.deepEqual(result, rmaResult, 'Wrong Results');

    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get RMA for the next bar using nextValue', function () {
    const wilderSmoothing = new RMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((price) => {
      const result = wilderSmoothing.nextValue(price);
      if (result !== undefined) {
        results.push(result);
      }
    });

    assert.deepEqual(results, expectedResult, 'Wrong Results while getting results');
  });
});
