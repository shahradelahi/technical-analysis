import * as assert from 'assert';
import { SMA, SMAInput } from 'src/overlap/SMA';

import { SampleValues } from '@/samples';

const input: SMAInput = {
  values: SampleValues,
  period: 5,
  decimal: 3,
};

const expectResult = [
  136.78, 138.734, 142.406, 143.666, 142.032, 142.096, 147.082, 153.396, 165.656, 182.59, 201.376,
  217.59, 239.084, 255.068,
];

describe('Simple Moving Average (SMA)', function () {
  it('should calculate SMA using the calculate method', function () {
    const result = SMA.calculate(input);
    assert.deepEqual(result, expectResult, 'Wrong Results');
  });

  it('should be able to calculate EMA by using getResult', function () {
    const sma = new SMA(input);
    const result = sma.getResult();
    assert.deepEqual(result, expectResult, 'Wrong Results while calculating next bar');
  });

  it('should be able to get EMA for the next bar using nextValue', function () {
    const smaProducer = new SMA({ ...input, values: [] });
    const results: number[] = [];

    for (const value of input.values) {
      const nextValue = smaProducer.nextValue(value)!;
      if (nextValue) {
        results.push(nextValue);
      }
    }

    assert.deepEqual(results, expectResult, 'Wrong Results while getting results');
  });

  it('should be able to get SMA for low values(issue 1)', function () {
    const expectedResult = [0.002, 0.00275, 0.0025, 0.003, 0.003, 0.0025];

    const result = new SMA({
      period: 4,
      decimal: 5,
      values: [0.001, 0.003, 0.001, 0.003, 0.004, 0.002, 0.003, 0.003, 0.002],
    }).getResult();

    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('Passing format function should format the results appropriately', function () {
    const expectedResult = [0.002, 0.003, 0.003, 0.003, 0.003, 0.003];

    const result = new SMA({
      period: 4,
      decimal: 5,
      values: [0.001, 0.003, 0.001, 0.003, 0.004, 0.002, 0.003, 0.003, 0.002],
      formatter: (val) => {
        return parseFloat(val.toPrecision(1));
      },
    }).getResult();

    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });
});
