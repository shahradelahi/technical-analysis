import * as assert from 'node:assert';

import { SampleValues } from '@/samples';

import { DEMA, DEMAInput } from './DEMA';

const input: DEMAInput = {
  values: SampleValues,
  period: 5,
  decimal: 6,
};

const expectedResult = [
  139.482963, 145.026886, 155.271198, 169.788537, 189.147517, 210.96845, 233.73126, 245.064591,
  273.763339, 284.507967,
];

describe('Double Exponential Moving Average (DEMA)', function () {
  it('should calculate DEMA using the calculate method', function () {
    const result = DEMA.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get DEMA for the next bar using nextValue', function () {
    const dema = new DEMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((price) => {
      const result = dema.nextValue(price);
      if (result !== undefined) {
        results.push(result);
      }
    });

    assert.deepEqual(results, expectedResult, 'Wrong Results while getting results');
  });
});
