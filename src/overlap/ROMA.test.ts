import * as assert from 'assert';

import { ROMA, ROMAInput } from '@/overlap/ROMA';
import { SampleValues } from '@/samples';

const input: ROMAInput = {
  values: SampleValues,
  period: 5,
  decimal: 3,
};

const expectedResult = [
  136.78, 138.734, 142.406, 143.666, 142.032, 142.096, 147.082, 153.396, 165.656, 182.59, 201.376,
  217.59, 239.084, 255.068,
];

describe('ROMA (Rolling Moving Average)', function () {
  it('should calculate ROMA using the calculate method', function () {
    const result = new ROMA(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get ROMA for the next bar using nextValue', function () {
    const ma = new ROMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((price) => {
      const result = ma.nextValue(price);
      if (result) results.push(result);
    });

    assert.deepEqual(results, expectedResult, 'Wrong Results while getting results');
  });
});
