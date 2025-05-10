import * as assert from 'node:assert';

import { SampleValues } from '@/samples';

import { ALMA, ALMAInput } from './ALMA';

const input: ALMAInput = {
  values: SampleValues,
  period: 5,
  decimal: 6,
};

const expectedResult = [
  140.712612, 146.07542, 143.38231, 142.283198, 142.249524, 139.703808, 146.373847, 159.584155,
  175.40325, 194.852494, 216.142293, 235.0661,
];

describe('Double Exponential Moving Average (ALMA)', function () {
  it('should calculate ALMA using the calculate method', function () {
    const result = ALMA.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get ALMA for the next bar using nextValue', function () {
    const alma = new ALMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((price) => {
      const result = alma.nextValue(price);
      if (result !== undefined) {
        results.push(result);
      }
    });

    assert.deepEqual(results, expectedResult, 'Wrong Results while getting results');
  });
});
