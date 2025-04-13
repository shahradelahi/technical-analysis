import * as assert from 'assert';
import { EMA } from 'src/overlap/EMA';

import { SMAInput } from '@/overlap/SMA';
import { SampleValues } from '@/samples';

const input = {
  values: SampleValues,
  period: 5,
  decimal: 6,
} satisfies SMAInput;

const expectedOutput = [
  136.78, 137.026667, 140.477778, 140.001852, 139.077901, 142.485267, 149.140178, 159.076786,
  172.834524, 189.189682, 207.203122, 219.308748, 241.679165, 254.542777,
];

describe('EMA (Exponential Moving Average)', function () {
  it('should be able to get EMA from the get results', function () {
    const ema = new EMA(input);
    const result = ema.getResult();
    assert.deepEqual(result, expectedOutput, 'Wrong Results while getting results');
  });

  it('should be able to get EMA for the next bar using nextValue', function () {
    const emaProducer = new EMA({ ...input, values: [] });
    const results: number[] = [];

    input.values.forEach((price) => {
      const result = emaProducer.nextValue(price);
      if (result) results.push(result);
    });

    assert.deepEqual(results, expectedOutput, 'Wrong Results while getting results');
  });
});
