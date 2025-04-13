import * as assert from 'assert';
import { WMA, WMAInput } from 'src/overlap/WMA';

import { SampleValues } from '@/samples';

const input: WMAInput = {
  values: SampleValues,
  period: 10,
  decimal: 6,
};

const expectedResult = [
  141.959818, 146.143818, 152.696909, 162.233091, 174.458364, 189.170909, 202.222545, 221.146909,
  236.425091,
];

describe('WMA (Weighted Moving Average)', function () {
  it('should calculate WMA using the calculate method', function () {
    const result = new WMA(input).getResult();
    assert.deepEqual(result, expectedResult, 'Wrong Results');
  });

  it('should be able to get WMA for the next bar', function () {
    const wma = new WMA(input);
    assert.deepEqual(wma.getResult(), expectedResult, 'Wrong Results while getting results');
  });

  it('should be able to get WMA for the next bar using nextValue', function () {
    const wma = new WMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((v) => {
      const result = wma.nextValue(v);
      if (result) results.push(result);
    });

    assert.deepEqual(results, expectedResult, 'Wrong Results while getting results');
  });
});
