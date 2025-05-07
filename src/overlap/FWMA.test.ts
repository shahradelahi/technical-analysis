import * as assert from 'node:assert';

import { SampleBars } from '@/samples';

import { FWMA, FWMAInput } from './FWMA';

const input: FWMAInput = {
  values: SampleBars.close.slice(0, 30),
  period: 10,
  decimal: 6,
};

const expectedResult = [
  143.472906, 150.814336, 161.697376, 176.646854, 194.161712, 213.122029, 225.03916, 248.849121,
  261.222023, 267.764684, 268.585312, 266.810839, 247.117656, 234.815731, 238.622374, 238.252968,
  246.281645, 255.009962, 256.307689, 260.277097, 262.537935,
];

describe("Fibonacci's Weighted Moving Average (FWMA)", function () {
  it('should calculate FWMA using the calculate method', function () {
    const result = FWMA.calculate(input);
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get FWMA for the next bar using nextValue', function () {
    const wilderSmoothing = new FWMA({ ...input, values: [] });
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
